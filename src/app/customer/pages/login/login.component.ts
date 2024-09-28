import { Component, Renderer2, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Fix the typo to 'styleUrls'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // FormGroup instance
  hidePassword = true; // For toggling password visibility

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Initialize the form with validators
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]], // Email validation
      password: [null, [Validators.required, Validators.minLength(8)]] // Minimum length for password
    });
  }

  // Method to toggle password visibility
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill out the form correctly.', 'Validation Error');
      return;
    }

    // Extract form values
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;

    // Call the login service
    this.authService.login(email, password).subscribe(
      (user) => {
        if (user) {
          const userName = user.name || email;
          this.toastr.success(`Welcome back, ${userName}!`, 'Login Successful');

          // Check the user role and navigate accordingly
          if (UserStorageService.isAdminLoggedIn()) {
            this.router.navigateByUrl('admin/home');
          } else if (UserStorageService.isCustomerLoggedIn()) {
            // Get the return URL from the query params if available, or go to the default customer home page
            const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || 'customer/home';
            this.router.navigateByUrl(returnUrl);
          }
        } else {
          this.toastr.error('Login failed', 'ERROR');
        }
      },
      (error) => {
        // Error handling with specific cases
        let errorMessage = 'An error occurred. Please try again.';
        if (error.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (error.status === 409) {
          errorMessage = 'User already exists.';
        }
        this.toastr.error(errorMessage, 'ERROR');
      }
    );
  }
}
