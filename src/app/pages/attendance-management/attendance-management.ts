import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AttendanceService } from '../../services/attendance.service';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-attendance-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Topbar,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  templateUrl: './attendance-management.html',
  styleUrls: ['./attendance-management.scss'],
})
export class AttendanceManagementComponent implements OnInit {
  attendanceList: any[] = [];
  filteredAttendanceList: any[] = [];

  correctionList: any[] = [];
  filteredCorrections: any[] = [];

  months: string[] = [];
  selectedMonth: string = '';
  showMonthDropdown: boolean = false;

  searchAttendance: string = '';
  searchCorrection: string = '';

  selectAllChecked: boolean = false;
  selectAllCorrectionChecked: boolean = false;
  selectAll: boolean = false;

  todaysAttendancePercentage: string = '0%';
  attendanceTrendData: { day: string, count: number }[] = [];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadAttendance();
    this.loadCorrections();

    this.attendanceService.getMonths().subscribe((res) => {
      this.months = res;
    });
  }

  loadAttendance(): void {
    this.attendanceService.getAttendance().subscribe((data) => {
      this.attendanceList = data.map((item) => ({
        ...item,
        selected: false,
      }));
      this.onAttendanceSearch();
      this.getTodaysAttendancePercentage();
      this.getAttendanceTrend();
    });
  }

  loadCorrections(): void {
    this.attendanceService.getAttendance().subscribe((data: any[]) => {
      this.correctionList = data.map((item) => ({
        ...item,
        selected: false,
      }));
      this.onCorrectionSearch();
    });
  }

  toggleMonthDropdown(): void {
    this.showMonthDropdown = !this.showMonthDropdown;
  }

  applyMonthFilter(month: string): void {
    this.selectedMonth = month;
    this.showMonthDropdown = false;

    this.onAttendanceSearch();
    this.onCorrectionSearch();
  }

  getMonthName(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[date.getMonth()];
  }

  onAttendanceSearch(): void {
    const term = this.searchAttendance.toLowerCase().trim();

    this.filteredAttendanceList = this.attendanceList
      .filter(item =>
        item.name?.toLowerCase().includes(term) ||
        item.employeeId?.toLowerCase().includes(term)
      )
      .filter(item =>
        !this.selectedMonth || this.getMonthName(item.date || item.checkIn) === this.selectedMonth
      );
  }

  onCorrectionSearch(): void {
    const term = this.searchCorrection.toLowerCase().trim();

    this.filteredCorrections = this.correctionList
      .filter(req =>
        req.name?.toLowerCase().includes(term) ||
        req.employeeId?.toString().includes(term) ||
        req.date?.toLowerCase().includes(term)
      )
      .filter(req =>
        !this.selectedMonth || this.getMonthName(req.date) === this.selectedMonth
      );
  }

  toggleSelectAll(event: any): void {
    this.selectAllChecked = event.target.checked;
    this.filteredAttendanceList.forEach((record) => {
      record.selected = this.selectAllChecked;
    });
  }

  toggleAll(): void {
    this.selectAll = !this.selectAll;
    this.filteredCorrections.forEach((req) => {
      req.selected = this.selectAll;
    });
  }

  onIndividualCorrectionCheckboxChange(): void {
    this.selectAll = this.filteredCorrections.every((req) => req.selected);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'status-present';
      case 'late':
        return 'status-late';
      case 'absent':
        return 'status-absent';
      default:
        return 'status-unknown';
    }
  }

  downloadReport(): void {
    const selectedRecords = this.filteredAttendanceList.filter((record) => record.selected);

    if (selectedRecords.length === 0) {
      alert('Please select at least one record to download.');
      return;
    }

    const headers = Object.keys(selectedRecords[0]);
    const csvData = [
      headers.join(','),
      ...selectedRecords.map((record) =>
        headers.map((header) => `"${record[header] ?? ''}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'attendance-report.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  approveRequest(req: any): void {
    const approvedStatus =
      req.requested?.toLowerCase() === 'half day'
        ? 'Approved (Half Day)'
        : 'Approved (Full Day)';

    const approvedEntry = {
      employeeId: req.employeeId,
      name: req.name,
      designation: req.designation || 'N/A',
      checkIn: '09:00 AM',
      checkOut: approvedStatus === 'Approved (Half Day)' ? '01:00 PM' : '06:00 PM',
      status: approvedStatus,
      selected: false,
      date: req.date,
    };

    this.attendanceList.push(approvedEntry);
    this.onAttendanceSearch();

    this.correctionList = this.correctionList.filter(item => item !== req);
    this.filteredCorrections = [...this.correctionList];
    this.onCorrectionSearch();

    this.getTodaysAttendancePercentage();
    this.getAttendanceTrend();
  }

  declineRequest(req: any): void {
    const declinedEntry = {
      employeeId: req.employeeId,
      name: req.name,
      designation: req.designation || 'N/A',
      checkIn: '',
      checkOut: '',
      status: 'Declined',
      selected: false,
      date: req.date,
    };

    this.attendanceList.push(declinedEntry);
    this.onAttendanceSearch();

    this.correctionList = this.correctionList.filter(item => item !== req);
    this.filteredCorrections = [...this.correctionList];
    this.onCorrectionSearch();

    this.getTodaysAttendancePercentage();
    this.getAttendanceTrend();
  }

  getTodaysAttendancePercentage(): void {
  const today = new Date().toISOString().split('T')[0];
  const totalEmployees = 0; // Replace this with actual value from backend if needed

  const presentToday = this.attendanceList.filter(
    entry =>
      entry.status?.toLowerCase().includes('approved') &&
      entry.date?.startsWith(today)
  ).length;

  const percentage = totalEmployees === 0 ? 0 : (presentToday / totalEmployees) * 100;
  this.todaysAttendancePercentage = `${percentage.toFixed(0)}%`;
}

  getAttendanceTrend(): void {
    const trendMap: { [day: string]: number } = {};

    this.attendanceList.forEach((entry) => {
      if (entry.status?.toLowerCase().includes('approved')) {
        const date = new Date(entry.date);
        const day = date.toLocaleString('en-US', { weekday: 'short' }); // e.g., Mon, Tue
        trendMap[day] = (trendMap[day] || 0) + 1;
      }
    });

    this.attendanceTrendData = Object.entries(trendMap).map(([day, count]) => ({
      day,
      count,
    }));
  }
}
