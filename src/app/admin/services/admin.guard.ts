import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from '../../services/storage/user-storage.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isLoggedIn = !!UserStorageService.getToken(); // Use static method
  const isAdmin = UserStorageService.getUserRole() === 'ADMIN'; // Use static method

  if (!isLoggedIn || !isAdmin) {
    router.navigate(['/login']); // Redirect to login if not an admin
    return false;
  }

  return true;
};
