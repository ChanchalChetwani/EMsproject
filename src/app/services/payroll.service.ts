import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private payroll$ = new BehaviorSubject<any[]>([]);

  constructor() {
    // Mock payroll data initially
    this.payroll$.next([
      { id: 1, employeeId: 'EMP001', salary: 50000 },
      { id: 2, employeeId: 'EMP002', salary: 60000 },
      { id: 3, employeeId: 'EMP003', salary: 45000 },
    ]);
  }

  // ✅ Return observable
  getPayroll() {
    return this.payroll$.asObservable();
  }

  setPayroll(payroll: any[]) {
    this.payroll$.next(payroll);
  }
}
