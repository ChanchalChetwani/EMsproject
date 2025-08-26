import { Injectable } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { EmployeeService } from './employee.service';
import { PayrollService } from './payroll.service';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(
    private employeeService: EmployeeService,
    private payrollService: PayrollService
  ) {}

  getReports(view: 'daily' | 'monthly' | 'yearly') {
    return combineLatest([
      this.employeeService.getEmployees(), // ✅ now exists
      this.payrollService.getPayroll()
    ]).pipe(
      map(([employees, payroll]) => {
        const totalEmployees = employees.length;
        const totalPayroll = payroll.reduce((sum, p) => sum + (p.salary || 0), 0);
        const performanceScore = Math.floor(Math.random() * 100);

        let chartData: any[] = [];
        if (view === 'daily') {
          chartData = [
            { label: 'Mon', total: 3000 },
            { label: 'Tue', total: 4000 },
            { label: 'Wed', total: 3500 },
            { label: 'Thu', total: 5000 },
            { label: 'Fri', total: 2500 }
          ];
        } else if (view === 'monthly') {
          chartData = [
            { label: 'Jan', total: 12000 },
            { label: 'Feb', total: 15000 },
            { label: 'Mar', total: 10000 }
          ];
        } else {
          chartData = [
            { label: '2023', total: 180000 },
            { label: '2024', total: 220000 },
            { label: '2025', total: 195000 }
          ];
        }

        return { totalEmployees, totalPayroll, performanceScore, chartData };
      })
    );
  }
}
