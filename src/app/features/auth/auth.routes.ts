import { Routes } from '@angular/router';
import { guestAuthGuard } from '../../core/guards/guest-auth-guard';

export const authRoutes: Routes = [

{
path: 'login',
canActivate: [guestAuthGuard],
        loadComponent: () =>
          import('./pages/login/login')

},
{
path: 'register',
canActivate: [guestAuthGuard],
        loadComponent: () =>
          import('./pages/register/register')

},
{
path: 'forgot-password',
canActivate: [guestAuthGuard],
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password')
},

{
  path: 'reset-password',
  loadComponent: () =>
    import('./pages/reset-password/reset-password')
},


];
