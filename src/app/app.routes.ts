import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Iniciar Sesión | MVP',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
    },
    {
        path: '',
        loadComponent: () => import('./layout/app.layout').then(m => m.AppLayout),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard | MVP',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
            },
            {
                path: 'roles',
                title: 'Roles | MVP',
                loadComponent: () => import('./features/catalogs/roles/roles-page.component').then(m => m.RolesPageComponent),
                canActivate: [permissionGuard]
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];