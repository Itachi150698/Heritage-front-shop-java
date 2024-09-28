import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  order: any = { amount: 0, totalAmount: 0, discount: 0 };
  couponForm!: FormGroup;
  appliedCouponCode: string | null = null;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.couponForm = this.fb.group({
      code: [null, [Validators.required]],
    });
    this.getCart();
  }

applyCoupon() {
    const couponCode = this.couponForm.get('code')!.value;
    const normalizedCouponCode = couponCode.trim().toLowerCase(); // Normalize input coupon code
    console.log("Input Coupon Code:", couponCode); // Log input code

    // Check if the coupon is already applied
    if (this.appliedCouponCode?.toLowerCase() === normalizedCouponCode) {
        this.toastr.info("This coupon has already been applied.", "Info", { timeOut: 5000 });
        console.log("Already applied coupon code:", this.appliedCouponCode); // Log applied coupon code
        return; // Exit the method if coupon is already applied
    }

    this.customerService.applyCoupon(couponCode).subscribe(
        (res) => {
            console.log("Coupon API response:", res); // Log API response

            // Check if the response contains the discount amount
            if (res && res.discountAmount !== undefined) {
                this.order.discount = res.discountAmount; // Update discount
                this.updateCartTotal(); // Recalculate totals after applying coupon

                this.toastr.success("Coupon Applied Successfully", "Success", { timeOut: 5000 });
                this.appliedCouponCode = normalizedCouponCode; // Store the applied coupon code
                console.log("Applied Coupon Code:", this.appliedCouponCode); // Log applied coupon code after setting
            } else {
                this.toastr.success("Coupon Applied Successfully", "Success", { timeOut: 5000 });
            }
        },
        (error) => {
            console.error('Error applying coupon:', error); // Log error details
            this.toastr.error(error.error || 'Error applying coupon', 'Error', { timeOut: 5000 });
        }
    );
}





  getCart() {
    this.cartItems = [];
    this.customerService.getCartByUserId().subscribe(
      (res) => {
        console.log("Cart API response:", res); // Log API response
        this.order = res;
        if (res.cartItems && Array.isArray(res.cartItems)) {
          res.cartItems.forEach((item) => {
            item.processedImg = 'data:image/jpeg;base64,' + item.returnedImg;
            this.cartItems.push(item);
          });
          this.updateCartTotal(); // Recalculate total when cart is fetched
        } else {
          console.error('cartItems is undefined or not an array');
        }
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  increaseQuantity(productId: any) {
    const item = this.cartItems.find((item) => item.productId === productId);
    if (item) {
      item.quantity += 1; // Update quantity locally
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

removeFromCart(productId: any) {
    this.customerService.removeProductFromCart(productId).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        this.updateCartTotal(); // Update totals when item is removed
      },
      (error) => {
        console.error('Error removing item from cart', error);
      }
    );
}


updateCartTotal() {
    if (this.cartItems.length === 0) {
        this.order.amount = 0;
        this.order.totalAmount = 0;
        this.order.discount = 0; // Reset discount
    } else {
        this.order.amount = this.cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
        this.order.totalAmount = this.order.amount - this.order.discount; // Apply discount to total
    }

    // Log the values for debugging
    console.log('Updated Amount:', this.order.amount);
    console.log('Updated Discount:', this.order.discount);
    console.log('Updated Total Amount:', this.order.totalAmount);

    // Manually trigger change detection if necessary
    this.cdr.detectChanges();
}

  placeOrder(){
    this.dialog.open(PlaceOrderComponent)
  }

}
