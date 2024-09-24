import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStorageService } from '../../services/storage/user-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const isLoggedIn = !!UserStorageService.getToken();

  if (isLoggedIn) {
    // Redirect to home or any other protected route if already logged in
    router.navigate(['/customer/home']);
    // toastr.info('You are already logged in.');
    return false;
  }

  return true;
};
