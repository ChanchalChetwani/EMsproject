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

  searchTerm: string = '';
  searchCorrection: string = '';
  selectAllChecked: boolean = false;
  selectAllCorrectionChecked: boolean = false;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadAttendance();
    this.loadCorrections();
  }

  loadAttendance() {
    this.attendanceService.getAttendance().subscribe((data) => {
      this.attendanceList = data.map((item) => ({
        ...item,
        selected: false,
      }));
      this.filteredAttendanceList = [...this.attendanceList];
    });
  }

  loadCorrections(): void {
    this.attendanceService.getAttendance().subscribe((data: any[]) => {
      this.correctionList = data.map((item) => ({
        ...item,
        selected: false,
      }));
      this.filteredCorrections = [...this.correctionList];
    });
  }

  onSearch(): void {
    const search = this.searchTerm.toLowerCase().trim();
    this.filteredAttendanceList = this.attendanceList.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.employeeId.toLowerCase().includes(search)
    );
  }

  onCorrectionSearch(): void {
    const term = this.searchCorrection.toLowerCase().trim();
    this.filteredCorrections = this.correctionList.filter(
      (req) =>
        req.name?.toLowerCase().includes(term) ||
        req.id?.toString().includes(term) ||
        req.date?.toLowerCase().includes(term)
    );
  }

  toggleSelectAll(event: any): void {
    this.selectAllChecked = event.target.checked;
    this.filteredAttendanceList.forEach((record) => {
      record.selected = this.selectAllChecked;
    });
  }

  toggleSelectAllCorrections(): void {
    this.filteredCorrections.forEach((req) => {
      req.selected = this.selectAllCorrectionChecked;
    });
  }

  onIndividualCorrectionCheckboxChange(): void {
    const allSelected = this.filteredCorrections.every((req) => req.selected);
    this.selectAllCorrectionChecked = allSelected;
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
    const selectedRecords = this.filteredAttendanceList.filter(record => record.selected);

    if (selectedRecords.length === 0) {
      alert('Please select at least one record to download.');
      return;
    }

    const headers = Object.keys(selectedRecords[0]);
    const csvData = [
      headers.join(','), // Header row
      ...selectedRecords.map(record =>
        headers.map(header => `"${record[header] ?? ''}"`).join(',')
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
}
