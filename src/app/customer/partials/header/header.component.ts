import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { AdminService } from '../../../admin/services/admin.service';

@Component({
  selector: 'customer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  categories: any[] = [];
  isCategoriesOpen = false;
    isMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private adminService: AdminService,
  ) {}

  ngOnInit() {
    // Check if the user is logged in
    this.isLoggedIn = UserStorageService.getToken() !== null;
    // Fetch all categories
    this.getAllCategories();
  }

    // This method toggles the menu visibility
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

    // Toggle the categories menu
  toggleCategories(): void {
    this.isCategoriesOpen = !this.isCategoriesOpen;
  }

  logout() {
    console.log('Logging out...');
    UserStorageService.signOut();
    this.isLoggedIn = false;
    this.toastr.success('Logged out successfully!', 'Logout');

    // Redirect to the login page
    this.router.navigate(['/customer/login']).then(() => {
      console.log('Navigation to /login completed');
    });
  }

  // Fetch all categories from the AdminService
  getAllCategories(): void {
    this.adminService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Navigate to a specific category
  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/customer/products-list'], { queryParams: { categoryId } }).then((success) => {
      if (success) {
        console.log('Navigation to /products-list successful');
      } else {
        console.log('Navigation to /products-list failed');
      }
    });
  }
}
