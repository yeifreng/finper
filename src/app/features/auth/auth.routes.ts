import { Routes } from '@angular/router';

export const authRoutes: Routes = [

{
path: 'login',
        loadComponent: () =>
          import('./pages/login/login')

},
{
path: 'register',
        loadComponent: () =>
          import('./pages/register/register')

},
{
path: 'forgot-password',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password')
}


];
