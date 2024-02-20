import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let checkLoggedIn = sessionStorage.getItem('isUserLoggedIn');
  
  if(checkLoggedIn != null && checkLoggedIn == 'true'){
    return true;
  }
  else
    return router.navigate(['/login']);
};
