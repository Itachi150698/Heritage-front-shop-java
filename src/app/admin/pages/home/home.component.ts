import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { HttpResponse } from '@angular/common/http';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(private adminService: AdminService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    })
  }

  getAllProducts() {
    this.products = [];
    this.adminService.getAllProducts().subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  submitForm(){
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.adminService.getAllProductByName(title).subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

 deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe({
        next: (res: HttpResponse<any>) => {
            if (res.status === 204) {
                // Handle the case for 204 No Content
                this.snackbar.open('Product Deleted Successfully!', 'Close', {
                    duration: 5000
                });
                this.getAllProducts();
            } else {
                // Handle other success responses (if any)
                this.snackbar.open(res.body?.message || 'Product Deleted', 'Close', {
                    duration: 5000
                });
            }
        },
        error: (err) => {
            console.error('API call error:', err);
            this.snackbar.open('An error occurred while deleting the product.', 'Close', {
                duration: 5000,
                panelClass: 'error-snackbar'
            });
        }
    });
}




}
