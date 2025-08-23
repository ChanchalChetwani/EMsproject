import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private leaves: Leave[] = [
    {
      id: 1,
      employeeId: 'EMS12345',
      employeeName: 'Sanika Kalaskar',
      leaveType: 'Sick Leave',
      startDate: '2025-01-21',
      endDate: '2025-01-25',
      balance: '15 days',
      status: 'Pending',
      name: 'Sanika Kalaskar'
    },
    {
      id: 2,
      employeeId: 'EMS12345',
      employeeName: 'Sanika Kalaskar',
      leaveType: 'Casual Leave',
      startDate: '2025-02-01',
      endDate: '2025-02-03',
      balance: '10 days',
      status: 'Pending',
      name: 'Sanika Kalaskar'
    }
  ];

  constructor() {}

  // ✅ Get all leaves
  getLeaves(): Observable<Leave[]> {
    return of(this.leaves);
  }

  // ✅ Update leave status (Approve/Reject)
  updateLeaveStatus(id: number, status: 'Approved' | 'Rejected'): void {
    const leave = this.leaves.find(l => l.id === id);
    if (leave) {
      leave.status = status;
    }
  }
}
