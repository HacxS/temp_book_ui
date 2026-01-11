import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'book-management',
    pathMatch: 'full'
  },
  {
    path: 'book-management',
    loadComponent: () => import('./features/book-management/book-management.component').then(m => m.BookManagementComponent)
  }
];
