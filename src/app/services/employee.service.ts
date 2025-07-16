import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  employees$ = this.employeesSubject.asObservable();

  get employees(): Employee[] {
    return this.employeesSubject.getValue();
  }

  setEmployees(list: Employee[]): void {
    this.employeesSubject.next(list);
  }

  addEmployee(emp: Employee): void {
    const updated = [...this.employees, emp];
    this.employeesSubject.next(updated);
  }

  deleteEmployee(empId: string): void {
    const updated = this.employees.filter(e => e.id !== empId);
    this.employeesSubject.next(updated);
  }
}
