import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../admin/services/admin.service';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


declare var $ : any;

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, AfterViewInit {
  productId: number;
  userId: number;
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  bestsellers: any[] = [];
  wishlist: Set<number> = new Set();
  currentPage: number = 1;
  pageSize: number = 6; // Products per page
  minPrice: number | null = 0;
  maxPrice: number | null = 1000;
  sortBy: string = 'default';
  isGridView: boolean = true;
  availabilityFilter: boolean | null = null;
  categoryId!: number;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.productId = this.activatedRoute.snapshot.params["productId"];
    this.userId = this.activatedRoute.snapshot.params["userId"];
  }

  ngOnInit() {
    this.getWishlistByUserId();  // Load wishlist first
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      this.categoryId = +params['categoryId'];
      if (this.categoryId) {
        this.loadProductsByCategory(this.categoryId);
      } else {
        this.loadAllProducts();
      }
    });
  }

    ngAfterViewInit() {
    this.initializeSlider();
  }


  initializeSlider() {
    const that = this;
    $('#slider-range').slider({
      range: true,
      min: 100,
      max: 20000,
      values: [this.minPrice, this.maxPrice],
      slide: function(event, ui) {
        $('#minamount').val(ui.values[0]);
        $('#maxamount').val(ui.values[1]);
        that.minPrice = ui.values[0];
        that.maxPrice = ui.values[1];
      }
    });
    $('#minamount').val($('#slider-range').slider('values', 0));
    $('#maxamount').val($('#slider-range').slider('values', 1));
  }

  filterByPrice(minPrice: number, maxPrice: number) {
    this.filteredProducts = this.products.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
  }

    // View product details
  viewProductDetail(productId: number): void {
    this.router.navigate(['/customer/product', productId]);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.has(productId);
  }

  // Load categories
  loadCategories() {
    this.adminService.getAllCategories().subscribe(res => {
      this.categories = res;
    });
  }

  // Load products by category
  loadProductsByCategory(categoryId: number) {
    this.customerService.getProductsByCategory(categoryId).subscribe(res => {
      this.products = res.map(product => {
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
        return product;
      });
      this.applyFilters();
    });
  }

  // Load all products
  loadAllProducts() {
    this.customerService.getAllProducts().subscribe(res => {
      this.products = res.map(product => {
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
        return product;
      });
      this.applyFilters();
    });
  }

  // Apply filters based on price, availability, etc.
  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesAvailability = this.availabilityFilter === null || product.available === this.availabilityFilter;
      const matchesPrice = (this.minPrice === null || product.price >= this.minPrice) &&
                            (this.maxPrice === null || product.price <= this.maxPrice);
      return matchesAvailability && matchesPrice;
    });
    this.updateBestsellers();
    this.sortProducts(); // Apply sorting after filtering
  }

  // Update bestsellers by shuffling products
  updateBestsellers() {
    const shuffledProducts = this.shuffleArray([...this.filteredProducts]);
    this.bestsellers = shuffledProducts.slice(0, 3);
  }

  // Shuffle an array
  shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  // Wishlist handling
  getWishlistByUserId() {
    this.customerService.getWishlistByUserId().subscribe(res => {
      this.wishlist.clear();
      res.forEach(element => {
        this.wishlist.add(element.id);
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
      });
    });
  }

  addToWishlist(productId: number): void {
    const wishlistDto = {
      userId: UserStorageService.getUserId(),
      productId: productId
    };

    this.customerService.addProductToWishlist(wishlistDto).subscribe(res => {
      if (res.id != null) {
        this.toastr.success('Product Added to Wishlist Successfully!');
        this.wishlist.add(productId);
      } else {
        this.toastr.error('Something went wrong!');
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.customerService.removeProductFromWishlist(productId).subscribe({
      next: (res) => {
        this.wishlist.delete(productId);
        this.toastr.success('Product removed from wishlist');
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Failed to remove product from wishlist');
      }
    });
  }

  toggleWishlist(productId: number) {
    if (!UserStorageService.isCustomerLoggedIn()) {
      this.toastr.warning('Please log in to manage your wishlist.');
      this.router.navigate(['/customer/login']);
      return;
    }

    if (this.wishlist.has(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  // Add product to cart
  addToCart(id: number) {
    if (!UserStorageService.isCustomerLoggedIn()) {
      this.toastr.warning('Please log in to add items to your cart.');
      this.router.navigate(['/customer/login']);
      return;
    }

    this.customerService.addProductToCart(id).subscribe({
      next: (response) => {
        if (response.status === 201) {
          this.toastr.success("Product added to cart successfully");
        } else {
          this.toastr.error("Failed to add product to cart");
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.toastr.info("Product already in cart.");
        } else {
          this.toastr.error("Failed to add product to cart");
        }
      }
    });
  }

  // Pagination logic
  get paginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Sorting products
  sortProducts(): void {
    switch (this.sortBy) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        this.filteredProducts = [...this.products]; // Reset to original order if needed
    }
  }

  // Filters by category
  filterByCategory(categoryId: number): void {
    this.categoryId = categoryId;
    this.loadProductsByCategory(categoryId);
  }

  // Filters by availability
filterByAvailability(status: boolean | null) {
  if (status === null) {
    // Show all products
    this.filteredProducts = this.products;
  } else {
    // Filter products based on availability status
    this.filteredProducts = this.products.filter(product => product.inStock === status);
  }
}


  // Filters by price
  // filterByPrice(minPrice: number | null, maxPrice: number | null): void {
  //   this.minPrice = minPrice;
  //   this.maxPrice = maxPrice;
  //   this.applyFilters();
  // }

  // Filter products based on query
  filterProducts(query: string) {
    if (!query) {
      this.applyFilters();
    } else {
      this.filteredProducts = this.products.filter(product =>
        (product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(query.toLowerCase())) &&
        (this.availabilityFilter === null || product.available === this.availabilityFilter) &&
        (this.minPrice === null || product.price >= this.minPrice) &&
        (this.maxPrice === null || product.price <= this.maxPrice)
      );
    }
  }

  // Reset filters
  resetFilters() {
    this.minPrice = 10;
    this.maxPrice = 540;
    $('#slider-range').slider('values', [this.minPrice, this.maxPrice]);
    this.filteredProducts = this.products; // Reset to show all products
  }
}
