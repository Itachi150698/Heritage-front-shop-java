import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../../admin/services/admin.service';
import { CustomerService } from '../../services/customer.service'; // Add this service
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Add this for notifications
import { UserStorageService } from '../../../services/storage/user-storage.service';

declare var $: any; // If you're using jQuery

@Component({
  selector: 'customer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  categories: any[] = [];
  featuredProducts: any[] = [];
  filteredProducts: any[] = [];
  wishlist: Set<number> = new Set(); // Track wishlist items
  selectedCategoryId: number | null = null; // Track selected category

  categoryImages: { [key: string]: string } = {
    'handicrafts': 'https://j3k5s6s3.rocketcdn.me/wp-content/uploads/2022/04/02-yehaindia-aff88775fd3f.jpg',
    'textiles': 'https://i0.wp.com/blog.saffronart.com/wp-content/uploads/2017/03/bagh-with-animal-figures-and-shepherd_crop.jpg?fit=2725%2C1399&ssl=1',
    'jewelry': 'https://www.jdinstitute.edu.in/media/2022/01/Traditional-Indian-Jewellery-History-And-Significance-12.jpg',
    'paintings': 'https://j3k5s6s3.rocketcdn.me/wp-content/uploads/2022/04/Mandana-Painting-Rekha-Agrawal-03.jpeg',
    'sculptures': 'https://static.prinseps.com/media/uploads/indian-sculpture-1.jpg',
    'pottery': 'https://images.indianexpress.com/2019/11/pottery759.jpeg',
    'musical instruments': 'https://m.media-amazon.com/images/I/61lPiQTeZiL._AC_UF1000,1000_QL80_.jpg',
    'furniture': 'https://fabdiz.com/wp-content/uploads/2023/12/Step-into-a-Kerala-home-built-around-a-beautiful-traditional-courtyard-1024x576.webp',
    'masks': 'https://5.imimg.com/data5/SELLER/Default/2022/5/JT/SV/NJ/82812591/new-product-500x500.jpeg',
    'toys': 'https://www.artsofindia.in/pub/media/magefan_blog/a4aec90bfe219bf0dabe1d92d07c2142.jpg'
  };

  constructor(
    private adminService: AdminService,
    private customerService: CustomerService, // Inject the customer service
    private router: Router,
    private toastr: ToastrService, // Inject toastr for notifications
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.getFeaturedProducts(); // Load featured products
    this.getWishlistByUserId(); // Load wishlist
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    // this.reinitializeCarousel();
  }

  getAllCategories(): void {
    this.adminService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.filterByCategory(this.selectedCategoryId); // Filter products by default category
      setTimeout(() => {
        this.reinitializeCarousel();  // Re-initialize carousel after categories are loaded
      }, 0);
    });
  }

  getFeaturedProducts(): void {
    this.customerService.getAllProducts().subscribe(products => {
      // Shuffle products and select a few as featured
      const shuffledProducts = this.shuffleArray(products);
      this.featuredProducts = shuffledProducts.slice(0, 20).map(product => {
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg; // Assign processed image
        return product;
      });
      this.filteredProducts = [...this.featuredProducts]; // Initialize filtered products
    });
  }

  getWishlistByUserId(): void {
    if (!UserStorageService.isCustomerLoggedIn()) return; // Ensure user is logged in
    this.customerService.getWishlistByUserId().subscribe(res => {
      this.wishlist.clear();
      res.forEach(element => {
        this.wishlist.add(element.id);
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
      error: (err) => {
        console.error('Detailed Error Info:', err);
        this.toastr.error('Failed to remove product from wishlist');
      }
    });
  }

  toggleWishlist(productId: number) {
    if (!UserStorageService.isCustomerLoggedIn()) {
      this.toastr.warning('Please log in to manage your wishlist.');
      this.router.navigate(['/login']); // Redirect to login page
      return;
    }

    if (this.wishlist.has(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    if (categoryId === null) {
      this.filteredProducts = [...this.featuredProducts];
    } else {
      this.filteredProducts = this.featuredProducts.filter(product => product.categoryId === categoryId);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.has(productId);
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/customer/product-detail'], { queryParams: { productId } });
  }

  addToCart(productId: number): void {
    // Implement cart logic here
  }

  reinitializeCarousel(): void {
    const owlCarousel = (<any>$('.owl-carousel'));
    if (owlCarousel && owlCarousel.owlCarousel) {
      owlCarousel.owlCarousel('destroy');  // Destroy previous instance
      owlCarousel.owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        autoplay: true,
        responsive: {
          0: { items: 1 },
          600: { items: 3 },
          1000: { items: 5 }
        }
      });
    }
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/customer/products-list'], { queryParams: { categoryId } })
      .then(success => {
        if (success) {
          console.log('Navigation to /products-list successful');
        } else {
          console.log('Navigation to /products-list failed');
        }
      });
  }

  getCategoryImage(categoryName: string): string {
    return this.categoryImages[categoryName.toLowerCase()] || 'assets/images/default-category.jpg';
  }

  shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
}
