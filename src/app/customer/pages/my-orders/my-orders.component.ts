import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  myOrders: any[] = []; // Holds the current order(s)
  previousOrders: any[] = []; // Holds all previous orders
  showAllOrders = false; // Control visibility of all orders
  paymentStatus: 'success' | 'failed' = 'success'; // Stores payment status

  constructor(private customerService: CustomerService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.getCurrentOrder(); // Fetch only current orders
    this.getPreviousOrders(); // Fetch previous orders

    // Mock setting payment status from payment response
    this.paymentStatus = this.getPaymentStatusFromResponse(); // Replace with real logic
  }

  getCurrentOrder(): void {
    this.customerService.getOrdersByUserId().subscribe(
      (res) => {
        this.myOrders = res.filter(order =>
          order.orderStatus.toLowerCase() === 'placed' || order.orderStatus.toLowerCase() === 'in progress'
        );
      },
      (error) => {
        console.error('Error fetching current orders:', error);
      }
    );
  }

  getPreviousOrders(): void {
    this.customerService.getOrdersByUserId().subscribe(
      (res) => {
        this.previousOrders = res.filter(order =>
          order.orderStatus.toLowerCase() !== 'placed' && order.orderStatus.toLowerCase() !== 'in progress'
        );
      },
      (error) => {
        console.error('Error fetching previous orders:', error);
      }
    );
  }

  getPaymentStatusFromResponse(): 'success' | 'failed' {
    // Replace this with the actual logic that checks payment success or failure
    return Math.random() > 0.5 ? 'success' : 'failed'; // Random for demonstration
  }

  navigateToReview(orderId: number): void {
    // Implement navigation logic to the review page
    this.router.navigate(['/review', orderId]); // Adjust the path as per your routing configuration
  }

  navigateToRetry(orderId?: number): void {
    if (orderId) {
      console.log(`Retrying payment for order ID: ${orderId}`);
      this.router.navigate(['/customer/checkout', orderId]); // Adjust the path as per your routing configuration
    } else {
      console.log('No order ID provided for retry.');
      this.router.navigate(['/customer/checkout']); // Adjust the path as per your routing configuration
    }
  }

  retryPayment(): void {
    console.log('Retrying payment...'); // Placeholder for actual retry logic
  }
}
