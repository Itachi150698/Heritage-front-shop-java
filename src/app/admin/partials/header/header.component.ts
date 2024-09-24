import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'admin-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  searchQuery: string = '';
    isLoggedIn: boolean;

constructor(
    private router: Router,
     private toastr: ToastrService,
    private searchService: SearchService) { }

  ngOnInit() {
this.isLoggedIn = UserStorageService.getToken() !== null;
  }

  logout() {
    console.log('Logging out...');
    UserStorageService.signOut();
    this.isLoggedIn = false;
    this.toastr.success('Logged out successfully!', 'Logout');

    // Redirect to the login page
    this.router.navigate(['/login']).then(() => {
      console.log('Navigation to /login completed');
    });
  }

    onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Search initiated with:', this.searchQuery); // Debugging line
      this.searchService.updateSearchQuery(this.searchQuery);
    } else {
      console.warn('Search query is empty'); // Handle empty search case
    }
  }

}
