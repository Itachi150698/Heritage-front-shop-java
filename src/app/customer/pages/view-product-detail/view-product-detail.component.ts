import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../services/customer.service';
import { AdminService } from '../../../admin/services/admin.service';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-product-detail',
  templateUrl: './view-product-detail.component.html',
  styleUrls: ['./view-product-detail.component.scss'],
})
export class ViewProductDetailComponent implements OnInit {
  productId: number = this.activatedRoute.snapshot.params["productId"];
  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];
  categories: any[] = [];
  wishlist: Set<number> = new Set();
  cartItems: any[] = [];
  order: any;

  couponForm!:FormGroup;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService, // Inject ToastrService
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getProductDetailById();
    this.getAllCategories();
    this.getWishlistByUserId();
        this.getCart();
        this.couponForm = this.fb.group({
      code: [null, [Validators.required]]
    })
  }

    applyCoupon(){
    this.customerService.applyCoupon(this.couponForm.get(['code'])!.value).subscribe(res =>{
      this.snackBar.open("Coupon Applied Successfully", "Close", {
        duration:5000
      });
      this.getCart();
    }, error =>{
      this.snackBar.open(error.error, 'Close',{
        duration:5000
      });
    })
  }

 getCart() {
    this.customerService.getCartByUserId().subscribe(
      (res) => {
        console.log('Cart response:', res); // Debugging: Check response
        this.cartItems = res.cartItems || [];
        // Ensure each product in cartItems has a quantity
        this.cartItems.forEach(item => {
          item.quantity = item.quantity || 1; // Set default quantity if not set
        });
        // Check if the current product is in the cart
        if (this.product) {
          const cartItem = this.cartItems.find(item => item.productId === this.product.id);
          if (cartItem) {
            this.product.quantity = cartItem.quantity; // Sync product quantity with cart
          } else {
            this.product.quantity = 0; // Initialize quantity if product is not in the cart
          }
        }
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }


  getAllCategories(): void {
    this.adminService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        // Remove the success toastr here
      },
      error: () => {
        this.toastr.error('Failed to load categories', 'Error');
      }
    });
  }

  // Add product to cart
  addToCart(id: number) {
    if (!UserStorageService.isCustomerLoggedIn()) {
      this.toastr.warning('Please log in to add items to your cart.');
      this.router.navigate(['/customer/login']);
      return;
    }

    this.customerService.addProductToCart(id).subscribe({
      next: () => {
        this.toastr.success('Product added to cart successfully!', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to add product to cart', 'Error');
      }
    });
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/customer/products-list'], { queryParams: { categoryId } })
      .then(success => {
        if (success) {
          this.toastr.success('Navigation to product list successful', 'Success');
        } else {
          this.toastr.error('Navigation failed', 'Error');
        }
      });
  }

getProductDetailById(): void {
  this.customerService.getProductDetailById(this.productId).subscribe({
    next: (res) => {
      console.log('Product response:', res);
      this.product = res.productDto;
      this.product.processedImg = 'data:image/png;base64,' + res.productDto.byteImg;
      this.getCart();
    },
    error: () => {
      this.toastr.error('Failed to load product details', 'Error');
    }
  });
}


  // Wishlist handling
  isInWishlist(productId: number): boolean {
    return this.wishlist.has(productId);
  }

getWishlistByUserId() {
  if (!UserStorageService.isCustomerLoggedIn()) {
    // User is not logged in, skip loading the wishlist
    return;
  }

  this.customerService.getWishlistByUserId().subscribe({
    next: (res) => {
      this.wishlist.clear();
      if (res && res.length > 0) {
        res.forEach((element) => {
          this.wishlist.add(element.id);
          element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
        });
      }
      // No success toastr message on page load
    },
    error: () => {
      // Only show error if user is logged in and there's an issue fetching the wishlist
      this.toastr.error('Failed to load wishlist', 'Error');
    }
  });
}


  addToWishlist(productId: number): void {
    const wishlistDto = {
      userId: UserStorageService.getUserId(),
      productId: productId
    };

    this.customerService.addProductToWishlist(wishlistDto).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.toastr.success('Product added to wishlist successfully!');
          this.wishlist.add(productId);
        } else {
          this.toastr.error('Something went wrong!');
        }
      },
      error: () => {
        this.toastr.error('Failed to add product to wishlist', 'Error');
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.customerService.removeProductFromWishlist(productId).subscribe({
      next: () => {
        this.wishlist.delete(productId);
        this.toastr.success('Product removed from wishlist');
      },
      error: () => {
        this.toastr.error('Failed to remove product from wishlist', 'Error');
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
}
