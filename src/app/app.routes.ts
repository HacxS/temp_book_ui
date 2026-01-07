import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'book-entry',
    pathMatch: 'full'
  },
  {
    path: 'book-entry',
    loadComponent: () => import('./features/book-entry/book-entry.component').then(m => m.BookEntryComponent)
  }
];
