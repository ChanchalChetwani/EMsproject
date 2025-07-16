import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Shared UI Components
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';

// Services
import { DashboardService } from '../../services/dashboard.service';
import { EmployeeService } from '../../services/employee.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, Topbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  totalEmployees = 0;
  newEmployees = 0;
  todaysAttendance = 0;
  attendanceChange = 0;
  payroll = 0;
  payrollStatus = '';
  activeLeaves = 0;
  pendingLeaves = 0;

  attendanceData: number[] = [];
  attendanceChart: Chart | null = null;

  recentActivities: { icon: string; message: string }[] = [];

  isSidebarOpen: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    // ✅ Fetch real-time employee count
    this.employeeService.employees$.subscribe(empList => {
      this.totalEmployees = empList.length;
    });

    // Load rest of dashboard data
    this.dashboardService.getDashboardStats().subscribe({
      next: (res) => {
        // NOTE: totalEmployees now comes from EmployeeService (not res.totalEmployees)
        this.newEmployees = res.newEmployees;
        this.todaysAttendance = res.attendanceToday;
        this.attendanceChange = res.attendanceChange;
        this.payroll = res.payroll;
        this.payrollStatus = res.payrollStatus;
        this.activeLeaves = res.activeLeaves;
        this.pendingLeaves = res.pendingLeaves;

        this.attendanceData = Array.isArray(res.attendanceTrend) && res.attendanceTrend.length
          ? res.attendanceTrend
          : [0, 0, 0, 0, 0];

        this.loadRecentActivities();
        this.renderAttendanceChart();
      },
      error: (err) => {
        console.error('Failed to fetch dashboard stats', err);
        this.attendanceData = [0, 0, 0, 0, 0];
        this.renderAttendanceChart();
      }
    });
  }

  hasPositiveAttendance(): boolean {
    return Array.isArray(this.attendanceData) && this.attendanceData.some(val => val > 0);
  }

  renderAttendanceChart(): void {
    const canvas = document.getElementById('attendanceChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }

    this.attendanceChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          {
            label: 'Attendance',
            data: this.attendanceData,
            borderColor: '#00c292',
            backgroundColor: 'rgba(0,194,146,0.1)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#00c292',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  loadRecentActivities(): void {
    this.recentActivities = [
      { icon: 'fas fa-user-plus', message: 'Welcome John Doe to the team!' },
      { icon: 'fas fa-birthday-cake', message: 'Wish Sarah a Happy Birthday!' },
      { icon: 'fas fa-user-check', message: 'Mike marked attendance.' },
      { icon: 'fas fa-thumbs-up', message: 'Sarah approved Mike’s leave.' },
      { icon: 'fas fa-money-check-alt', message: 'Monthly payroll processed.' },
      { icon: 'fas fa-trophy', message: 'Company awarded ‘Best Workplace 2025’.' },
      { icon: 'fas fa-bullhorn', message: 'Townhall meeting on Monday at 10 AM.' }
    ];
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
