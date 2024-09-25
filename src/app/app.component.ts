import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserStorageService } from './services/storage/user-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
 // Flags to track user login status and page types
  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = UserStorageService.isAdminLoggedIn();

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Subscribe to router events to track navigation and update state accordingly
    this.router.events.subscribe(event => {

        // Update login status based on user storage service
        this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
        this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();

        console.log('Is Customer Logged In:', this.isCustomerLoggedIn);
        console.log('Is Admin Logged In:', this.isAdminLoggedIn);
      })
    }

}
