import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-view-wishlist',
  templateUrl: './view-wishlist.component.html',
  styleUrl: './view-wishlist.component.scss',
})
export class ViewWishlistComponent {
  products = [];

  constructor(private customerService: CustomerService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getWishlistByUserId();
  }

  getWishlistByUserId() {
    this.customerService.getWishlistByUserId().subscribe(res => {
      console.log(res);
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
        this.products.push(element);
      });
    })
  }

  removeFromWishlist(productId: any): void {
    this.customerService.removeProductFromWishlist(productId).subscribe({
      next: (res) => {
        console.log('Product removed successfully', res);
        this.products = this.products.filter(product => product.productId !== productId);
        this.snackBar.open('Product removed from wishlist', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Detailed Error Info:', err);
        this.snackBar.open('Failed to remove product from wishlist', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}

