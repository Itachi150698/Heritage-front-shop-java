import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  filteredProducts: any[] = [];
  isExpanded: { [key: number]: boolean } = {};
  categories: any[] = [];
  searchQuery: string = '';
  searchProductForm!: FormGroup;

constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
  private searchService: SearchService,) { }

  ngOnInit() {
         this.searchProductForm = this.fb.group({
      title: ['']
    });

      this.getAllCategories();
       this.getAllProducts();

    // Subscribe to search query changes
    this.searchService.currentSearchQuery.subscribe(query => {
      console.log('Search query received in dashboard:', query); // Debugging line
      this.filterProducts(query);
    });
  }



  getAllCategories() {
    this.adminService.getAllCategories().subscribe(res => {
      this.categories = res;
    });
  }

filterByCategory(categoryId: number | null) {
  if (categoryId !== null) {
    this.adminService.getProductsByCategory(categoryId).subscribe(res => {
      console.log('Products response:', res); // Debug the entire response
      this.products = res.map(product => {
        console.log('Product byteImg:', product.byteImg); // Debug individual product's byteImg
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
        return product;
      });
      this.filteredProducts = this.products;
    });
  } else {
    this.getAllProducts(); // Reset to show all products if "All" is selected
  }
}


  getAllProducts() {
    this.adminService.getAllProducts().subscribe(res => {
      this.products = res.map(product => {
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
        return product;
      });
      this.filteredProducts = this.products;
    });
  }

  filterProducts(query: string) {
    if (!query) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(query.toLowerCase())
      );
    }
    console.log('Filtered products:', this.filteredProducts); // Debugging line
  }

  submitForm() {
    const title = this.searchProductForm.get('title')!.value;
    this.adminService.getAllProductByName(title).subscribe(res => {
      this.products = res.map(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        return element;
      });
      this.filteredProducts = this.products;
      console.log(this.products);
    });
  }

  toggleDescription(productId: number) {
    this.isExpanded[productId] = !this.isExpanded[productId];
  }

  deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 204) {
          this.snackbar.open('Product Deleted Successfully!', 'Close', {
            duration: 5000
          });
          this.getAllProducts();
        } else {
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

