import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface AttendanceRecord {
  id: number;
  employeeId: string;
  name: string;
  date: string;
  reason: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor() {}

  // 🟢 Mock attendance data
  private attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      date: '2025-07-30',
      reason: 'Present',
      status: 'Approved',
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      date: '2025-07-30',
      reason: 'Sick leave',
      status: 'Pending',
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Rahul Singh',
      date: '2025-07-29',
      reason: 'Present',
      status: 'Approved',
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Ayesha Khan',
      date: '2025-07-30',
      reason: 'Present',
      status: 'Approved',
    },
  ];

  // 🔹 Get all attendance records
  getAttendance(): Observable<AttendanceRecord[]> {
    return of(this.attendanceRecords);
  }

  getTodayApprovedPresentCount(): Observable<number> {
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  const approvedToday = this.attendanceRecords.filter((record) => {
    const recordDate = new Date(record.date).toLocaleDateString('en-CA');

    return (
      recordDate === today &&
      record.status.toLowerCase().includes('approved') &&
      record.reason.toLowerCase() === 'present'
    );
  });

  return of(approvedToday.length);
}



  // 🔹 Optional: for chart/month filters
  getMonths(): Observable<string[]> {
    const months = ['March', 'April', 'May', 'June', 'July'];
    return of(months);
  }
}