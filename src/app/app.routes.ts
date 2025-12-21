import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ProductListComponent } from './products/product-list/product-list';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductListComponent },
    { path: '**', redirectTo: '' }
];