import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { BaseChartDirective } from 'ng2-charts';  // ✅ instead of NgChartsModule
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Topbar,
    BaseChartDirective   // ✅ use directive instead of module
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {
  totalEmployees = 1284;  // later from EmployeeService
  totalPayroll = 842589;  // later from PayrollService
  performanceScore = 87;  // later from calculations
  selectedView = 'monthly';

  // ✅ Payroll Chart
  payrollChart: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['Engineering', 'Sales', 'Marketing', 'HR'],
      datasets: [
        { label: 'Base Salary', data: [70000, 85000, 30000, 20000], backgroundColor: '#4CAF50' },
        { label: 'Bonus', data: [80000, 78000, 15000, 25000], backgroundColor: '#3f51b5' },
        { label: 'Allowances', data: [95000, 60000, 10000, 30000], backgroundColor: '#e91e63' }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  };

  // ✅ Attendance Chart
  attendanceChart: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'Present', data: [80, 75, 60, 90, 85, 70], backgroundColor: '#4CAF50' },
        { label: 'Absent', data: [20, 25, 40, 10, 15, 30], backgroundColor: '#f44336' },
        { label: 'Leave', data: [10, 15, 20, 5, 10, 8], backgroundColor: '#FFC107' }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  };
chartConfig: any;

  constructor() {}

  ngOnInit() {}

  onViewChange(view: string) {
    this.selectedView = view;
    // 🔹 later fetch different data depending on view (daily/monthly/yearly)
  }
}