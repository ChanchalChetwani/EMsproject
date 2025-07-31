import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Shared UI Components
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';

// Services
import { DashboardService } from '../../services/dashboard.service';
import { EmployeeService } from '../../services/employee.service';
import { AttendanceService } from '../../services/attendance.service';

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
  todaysAttendance: number = 0; // This will show count
  attendanceChange = 0;
  payroll = 0;
  payrollStatus = '';
  activeLeaves = 0;
  pendingLeaves = 0;

  attendanceData: number[] = [];
  attendanceLabels: string[] = [];
  attendanceChart: Chart | null = null;

  recentActivities: { icon: string; message: string }[] = [];

  isSidebarOpen: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    // ✅ Fetch total employees
    this.employeeService.employees$.subscribe(empList => {
      this.totalEmployees = empList.length;
    });

 this.attendanceService.getTodayApprovedPresentCount().subscribe((count) => {
      this.todaysAttendance = count;
    });


     // ✅ Load the rest of dashboard stats
  this.dashboardService.getDashboardStats().subscribe({
    next: (res) => {
      this.newEmployees = res.newEmployees;
      this.attendanceChange = res.attendanceChange;
      this.payroll = res.payroll;
      this.payrollStatus = res.payrollStatus;
      this.activeLeaves = res.activeLeaves;
      this.pendingLeaves = res.pendingLeaves;

      const currentMonth = new Date().getMonth();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      this.attendanceData = [];
      this.attendanceLabels = [];

      for (let i = 0; i <= currentMonth; i++) {
        const count = res.attendanceTrend?.[i] ?? 0;
        const percent = this.totalEmployees > 0 ? Math.round((count / this.totalEmployees) * 100) : 0;

        this.attendanceData.push(percent);
        this.attendanceLabels.push(monthNames[i]);
      }

      this.loadRecentActivities();
      this.renderAttendanceChart();
    },
    error: (err) => {
      console.error('Failed to fetch dashboard stats', err);
      this.attendanceData = [0];
      this.attendanceLabels = ['N/A'];
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
        labels: this.attendanceLabels,
        datasets: [
          {
            label: 'Attendance (%)',
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
            max: 100,
            ticks: {
              stepSize: 20
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
