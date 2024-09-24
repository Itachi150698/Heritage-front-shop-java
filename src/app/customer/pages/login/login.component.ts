import { Component, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm!: FormGroup;

hidePassword = true;

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private router: Router,
   private renderer: Renderer2,
   private toastr: ToastrService
){}

ngOnInit(): void {
  this.loginForm = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]], // Email validation
    password: [null, [Validators.required, Validators.minLength(8)]], // Minimum length for password
  });
}


togglePasswordVisibility(){
  this.hidePassword = !this.hidePassword;
}

onSubmit(): void {
  if (this.loginForm.invalid) {
    this.toastr.error('Please fill out the form correctly.', 'Validation Error');
    return;
  }

  const email = this.loginForm.get('email')!.value;
  const password = this.loginForm.get('password')!.value;

  this.authService.login(email, password).subscribe(
    (user) => {
      if (user) {
        const userName = user.name || email;
        this.toastr.success(`Welcome back, ${userName}!`, 'Login Successful');

        // Navigate based on user role
        if (UserStorageService.isAdminLoggedIn()) {
          this.router.navigateByUrl('admin/home');
        } else if (UserStorageService.isCustomerLoggedIn()) {
          this.router.navigateByUrl('customer/home');
        }
      } else {
        this.toastr.error('Login failed', 'ERROR');
      }
    },
    (error) => {
      // Improved error handling
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
