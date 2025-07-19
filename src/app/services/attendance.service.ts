import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor() {}

  getAttendance(): Observable<any[]> {
    // 🧪 Replace with real API call later
    return of([
      {
        id: 1,
        employeeId: 'EMP001',
        name: 'John Doe',
        date: '2025-07-19',
        reason: 'Forgot to check in',
        status: 'Pending',
      },
     
    ]);
  }
}
