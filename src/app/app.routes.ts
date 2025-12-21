import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ProductListComponent } from './products/product-list/product-list';
import { ProductDetailsComponent } from './products/product-details/product-details';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'products/:id', component: ProductDetailsComponent },
    { path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent) },
    { path: '**', redirectTo: '' }
];