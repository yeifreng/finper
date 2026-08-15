import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthstateService } from '../services/authstate-service';

export const guestAuthGuard: CanActivateFn = () => {
  const authState = inject(AuthstateService);
  const router = inject(Router);

  if (authState.user()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
