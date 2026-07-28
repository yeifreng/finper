import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(
        (routes) => routes.authRoutes
      ),
  },

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
