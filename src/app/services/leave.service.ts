import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface LeaveRecord {
  employeeId: string;
  name: string;
  leaveType: string;
  from: string;
  to: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

@Injectable({ providedIn: 'root' })
export class LeaveService {
  constructor() {}

  private leaves: LeaveRecord[] = [
    {
      employeeId: 'EMP001',
      name: 'John Doe',
      leaveType: 'Sick Leave',
      from: '2025-07-28',
      to: '2025-07-30',
      status: 'Approved',
    },
    {
      employeeId: 'EMP002',
      name: 'Jane Smith',
      leaveType: 'Casual Leave',
      from: '2025-07-29',
      to: '2025-07-31',
      status: 'Pending',
    },
    {
      employeeId: 'EMP003',
      name: 'Rahul Singh',
      leaveType: 'Paid Leave',
      from: '2025-07-25',
      to: '2025-07-27',
      status: 'Rejected',
    },
  ];

  getAllLeaves(): Observable<LeaveRecord[]> {
    return of(this.leaves);
  }
}
