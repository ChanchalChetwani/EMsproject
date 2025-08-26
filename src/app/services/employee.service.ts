import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Employee {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  aadhaar: string;
  designation: string;
  status: string;
  department?: string;
  role?: string;
  addedBy?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$ = this.employeesSubject.asObservable(); // ✅ Observable for async pipes

  // ✅ Get current employees snapshot
  get employees(): Employee[] {
    return this.employeesSubject.getValue();
  }

  // ✅ Get employees as Observable (for ReportsService / Dashboard)
  getEmployees(): Observable<Employee[]> {
    return this.employees$;
  }

  // ✅ Replace entire list
  setEmployees(list: Employee[]): void {
    this.employeesSubject.next(list);
  }

  // ✅ Add a new employee
  addEmployee(emp: Employee): void {
    const updated = [...this.employees, emp];
    this.employeesSubject.next(updated);
  }

  // ✅ Delete employee by ID
  deleteEmployee(empId: string): void {
    const updated = this.employees.filter(e => e.id !== empId);
    this.employeesSubject.next(updated);
  }
}
