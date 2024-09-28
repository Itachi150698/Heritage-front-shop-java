import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {
  orderForm!: FormGroup;
  totalAmount: number = 0; // This should be set dynamically based on the cart
  addresses: any[] = []; // Array to hold saved addresses
  selectedAddressIndex: number | null = null; // Holds the index of the selected address
  showRetryPaymentButton: boolean = false; // Flag to display the retry payment button
  lastOrder: any; // Variable to hold the last order details temporarily

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeOrderForm();
    this.fetchTotalAmount();
    this.loadSavedAddresses();
  }

  // Initialize the order form with validators
  initializeOrderForm() {
    this.orderForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      country: [null, [Validators.required]],
      street: [null, [Validators.required]],
      apartment: [null],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  // Fetch total cart amount dynamically from the backend
  fetchTotalAmount() {
    this.customerService.getCartByUserId().subscribe({
      next: (cartData: any) => {
        this.totalAmount = cartData.totalAmount;
      },
      error: (error) => {
        this.toastr.error('Error fetching cart total amount', 'Error', { timeOut: 5000 });
        console.error('Error fetching cart total amount:', error);
      }
    });
  }

  // Load addresses from local storage
  loadSavedAddresses() {
    const storedAddresses = localStorage.getItem('address');
    this.addresses = storedAddresses ? JSON.parse(storedAddresses) : [];
  }

  // Save the address entered in the form to local storage
  saveAddress() {
    if (this.orderForm.invalid) {
      this.toastr.warning('Please fill in all required fields to save the address.', 'Warning', { timeOut: 5000 });
      return;
    }

    // Get the address from the form
    const newAddress = this.orderForm.value;

    // Add the new address to the list of saved addresses
    this.addresses.push(newAddress);

    // Save the updated addresses to local storage
    localStorage.setItem('address', JSON.stringify(this.addresses));

    this.toastr.success('Address saved successfully', 'Success', { timeOut: 5000 });
    this.orderForm.reset(); // Reset the form after saving
  }

  // Select an address from the saved list and populate the form
  selectAddress(index: number) {
    this.selectedAddressIndex = index;
    const selectedAddress = this.addresses[index];

    // Populate the form with the selected address
    this.orderForm.patchValue(selectedAddress);
  }

  // Place an order and initiate Razorpay payment
  placeOrder() {
    if (this.orderForm.invalid) {
      this.toastr.warning('Please fill in all required fields.', 'Warning', { timeOut: 5000 });
      return;
    }

    if (this.totalAmount <= 0) {
      this.toastr.error('Order amount must be greater than zero', 'Error', { timeOut: 5000 });
      return;
    }

    const orderData = this.orderForm.value;
    orderData.amount = this.totalAmount * 100; // Convert to paise
    orderData.userId = UserStorageService.getUserId(); // Get the user ID from storage

    // Call the backend to place the order
    this.customerService.placeOrder(orderData).subscribe({
      next: (response: any) => {
        this.lastOrder = response; // Save the order details for retry
        this.initiatePayment(response); // Call the function to initiate the payment
      },
      error: (error) => {
        this.toastr.error('Error placing order', 'Error', { timeOut: 5000 });
        console.error('Order placement error:', error);
      }
    });
  }

  // Function to initialize Razorpay payment
  initiatePayment(paymentData: any) {
    const options = {
      key: 'rzp_test_7sxZWQXIqUYb4C', // Your Razorpay key
      amount: paymentData.amount, // Amount from the order (already in paise)
      currency: paymentData.currency,
      name: 'Your Company Name',
      description: 'Order Description',
      order_id: paymentData.razorpayOrderId, // Razorpay order ID returned from backend
      handler: (paymentResponse: any) => {
        // Handle success case here
        this.toastr.success('Order placed successfully', 'Success', { timeOut: 5000 });
        this.router.navigateByUrl('/customer/my-orders');
      },
      modal: {
        ondismiss: () => {
          this.toastr.warning('Payment was not completed', 'Warning', { timeOut: 5000 });
          this.showRetryPaymentOption(); // Show retry button when the payment is dismissed
        }
      },
      prefill: {
        name: `${paymentData.firstName} ${paymentData.lastName}`,
        email: paymentData.email,
        contact: paymentData.phone
      },
      theme: {
        color: '#3399cc'
      }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  }

  // Show a retry payment button after failed or canceled payment
  showRetryPaymentOption() {
    this.showRetryPaymentButton = true; // Show retry button in the UI
  }

  // Retry payment by using the last saved order details
  retryPayment() {
    if (this.lastOrder) {
      this.initiatePayment(this.lastOrder); // Retry payment with the saved order
    } else {
      this.toastr.error('No order details available for retrying payment', 'Error', { timeOut: 5000 });
    }
  }
}
