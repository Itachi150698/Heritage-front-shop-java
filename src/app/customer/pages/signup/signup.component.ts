import { Component, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')]],
      confirmPassword: [null, Validators.required]
    }, { validators: this.passwordMatcher });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  passwordMatcher: ValidatorFn = (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  };

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    this.authService.register(this.signupForm.value).subscribe(
      (response) => {
        const userName = this.signupForm.get('name')?.value;
        this.toastr.success(`Sign up successful! Welcome, ${userName}`, 'Success', {
          closeButton: true,
          progressBar: true,
          progressAnimation: 'increasing'
        });
        this.router.navigateByUrl("/customer/login");
      },
      (error) => {
        this.toastr.error('Sign up failed. Please try again.', 'Error', {
          closeButton: true,
          progressBar: true,
          progressAnimation: 'increasing'
        });
      }
    );
  }
}
