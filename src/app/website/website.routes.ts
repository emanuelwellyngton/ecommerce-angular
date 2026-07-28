import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home';
import { ProductDetailsComponent } from '../products/product-details/product-details';
import { ProductListComponent } from '../products/product-list/product-list';

export const websiteRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', loadComponent: () => import('../cart/cart.component').then(m => m.CartComponent) },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.SiteLoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.SiteRegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'account', loadComponent: () => import('./account/account.component').then(m => m.AccountComponent) },
  { path: 'faq', loadComponent: () => import('./faq/faq.component').then(m => m.FaqComponent) },
  { path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
  { path: 'checkout', loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: '**', redirectTo: '' }
];