import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PlaceOrderComponent } from '../place-order/place-order.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  order: any = { amount: 0, totalAmount: 0 };
  couponForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.couponForm = this.fb.group({
      code: [null, [Validators.required]]
    });
    this.getCart();
  }

  // Apply coupon and refresh cart total after success
  applyCoupon() {
    const couponCode = this.couponForm.get('code')!.value;
    this.customerService.applyCoupon(couponCode).subscribe(
      (res) => {
        this.snackBar.open("Coupon Applied Successfully", "Close", { duration: 5000 });
        this.getCart(); // Refresh cart with discount applied
      },
      (error) => {
        this.snackBar.open(error.error, 'Close', { duration: 5000 });
      }
    );
  }

  // Fetch cart data and calculate total
  getCart() {
    this.cartItems = [];
    this.customerService.getCartByUserId().subscribe(
      (res) => {
        this.order = res;
        if (res.cartItems && Array.isArray(res.cartItems)) {
          res.cartItems.forEach((item) => {
            item.processedImg = 'data:image/jpeg;base64,' + item.returnedImg;
            this.cartItems.push(item);
          });
          this.updateCartTotal(); // Recalculate total
        } else {
          console.error('cartItems is undefined or not an array');
        }
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  // Increase product quantity
  increaseQuantity(productId: any) {
    const item = this.cartItems.find((item) => item.productId === productId);
    if (item) {
      item.quantity += 1;  // Update quantity locally
      this.updateCartTotal(); // Update cart total
    }

    this.customerService.increaseProductQuantity(productId).subscribe(
      (res) => {
        console.log('Product quantity increased');
      },
      (error) => {
        console.error('Error increasing quantity', error);
        // Rollback in case of error
        if (item) {
          item.quantity -= 1;
          this.updateCartTotal(); // Recalculate total after rollback
        }
      }
    );
  }

  // Decrease product quantity
  decreaseQuantity(productId: any) {
    const item = this.cartItems.find((item) => item.productId === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1; // Update quantity locally
      this.updateCartTotal(); // Update cart total
    }

    this.customerService.decreaseProductQuantity(productId).subscribe(
      (res) => {
        console.log('Product quantity decreased');
      },
      (error) => {
        console.error('Error decreasing quantity', error);
        // Rollback in case of error
        if (item) {
          item.quantity += 1;
          this.updateCartTotal(); // Recalculate total after rollback
        }
      }
    );
  }

  // Remove product from cart
  removeFromCart(productId: any) {
    this.customerService.removeProductFromCart(productId).subscribe(
      (res) => {
        this.snackBar.open('Product removed from cart', 'Close', { duration: 5000 });
        this.cartItems = this.cartItems.filter(item => item.productId !== productId); // Remove locally
        this.updateCartTotal(); // Recalculate total
      },
      (error) => {
        console.error('Error removing product from cart', error);
        this.snackBar.open('Error removing product from cart', 'Close', { duration: 5000 });
      }
    );
  }

  // Update the cart total based on items in the cart
  updateCartTotal() {
    if (this.cartItems.length === 0) {
      this.order.amount = 0;
      this.order.totalAmount = 0;
    } else {
      this.order.amount = this.cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
      this.order.totalAmount = this.order.amount; // Adjust if there are any additional fees or taxes
    }
  }

  // Open the place order dialog
  placeOrder() {
    this.dialog.open(PlaceOrderComponent);
  }
}
