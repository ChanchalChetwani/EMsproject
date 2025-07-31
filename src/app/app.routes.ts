import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'employee',
    loadComponent: () => import('./pages/employee/employee').then(m => m.EmployeeComponent),
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./pages/attendance-management/attendance.routes').then(
        (m) => m.ATTENDANCE_ROUTES
      ),
  },
  {
  path: 'leaves',
  loadComponent: () => import('./pages/leaves').then(m => m.Leaves)
},
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
