import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchProductForm!: FormGroup;

constructor(
  private adminService: AdminService,
private fb: FormBuilder) { }

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

  ngOnInit() {
      this.searchProductForm = this.fb.group({
      title: ['']
    });
  }


}
