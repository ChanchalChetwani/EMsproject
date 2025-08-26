import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { Error } from './pages/error/error';
import { LogoutComponent } from './pages/logout/logout';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee',
    loadComponent: () =>
      import('./pages/employee/employee').then(m => m.EmployeeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./pages/attendance-management/attendance.routes').then(
        (m) => m.ATTENDANCE_ROUTES
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'leaves',
    loadComponent: () =>
      import('./pages/leaves').then((m) => m.LeaveManagementComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'payroll',
    loadComponent: () =>
      import('./pages/payroll/payroll').then(m => m.PayrollComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports').then(m => m.ReportsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings').then(m => m.SettingsComponent),  // ✅ NEW ROUTE
    canActivate: [AuthGuard]
  },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'error',
    component: Error
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'error'   // ✅ Now error page will show
  }
];
