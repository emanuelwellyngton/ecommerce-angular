import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { authGuard } from '../core/guards/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent) },
      {
        path: 'products',
        loadComponent: () => import('./products/product-list/product-list.component').then(m => m.ProductManageListComponent)
      },
      {
        path: 'products/new',
        loadComponent: () => import('./products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'users/new',
        loadComponent: () => import('./users/user-form/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'users/edit/:id',
        loadComponent: () => import('./users/user-form/user-form.component').then(m => m.UserFormComponent)
      }
    ]
  }
];
