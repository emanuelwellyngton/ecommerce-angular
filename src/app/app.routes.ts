import { Routes } from '@angular/router';
import { Website } from './website/website';

export const routes: Routes = [
    {
        path: 'site',
        component: Website,
        loadChildren: () => import('./website/website.routes').then(m => m.websiteRoutes)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes)
    },
    { path: '**', redirectTo: '' }
];