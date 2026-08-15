import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthstateService } from '../services/authstate-service';

export const authGuard: CanActivateFn = () => {
    const authState = inject(AuthstateService);
    const router = inject(Router);

    if (authState.user()) {
      return true;
    }

    return router.createUrlTree(['/auth/login']);
};
