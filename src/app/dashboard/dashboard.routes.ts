import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
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
