import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from '../../services/storage/user-storage.service'; // Your service path
import { ToastrService } from 'ngx-toastr';

export const customerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Ensure that UserStorageService methods are static if called statically
  const isLoggedIn = !!UserStorageService.getToken();
  const isCustomer = UserStorageService.getUserRole() === 'CUSTOMER';

  console.log('Guard check:', { isLoggedIn, isCustomer });

  if (!isLoggedIn || !isCustomer) {
    // Show warning message
    toastr.warning('Please log in as a customer to access this page.');

    // Redirect to login and preserve the current URL for redirecting after login
    router.navigate(['/customer/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
};
