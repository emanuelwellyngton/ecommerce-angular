import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from '../core/guards/auth.guard';

export const dashboardRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
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
            }
        ]
    }
];
