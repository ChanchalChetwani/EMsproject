import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';

// Shared Components
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';

// Service
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.html',
  styleUrls: ['./employee.scss'],
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Topbar,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule
  ]
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  searchTerm = '';
  selectedDepartment = '';
  selectedRole = '';
  selectedStatus = '';
  selectedAddedBy = '';
  selectedCountryCode: string = '+91';

  departments: string[] = ['HR', 'Tech', 'Design'];
  roles: string[] = ['Admin', 'Manager', 'Employee'];
  statuses: string[] = ['Active', 'Inactive'];
  addedByOptions: string[] = [];

  currentUser = {
    name: 'Chanchal Chetwani',
    role: 'HR'
  };

  showAddForm: boolean = false;
  newEmployee: Employee = this.getEmptyEmployee();

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    const initialEmployees: Employee[] = [
      {
        id: 'EMS12345',
        name: 'Sanika Kalaskar',
        email: 'example@gmail.com',
        contact: '+919876543210',
        address: 'Pune, Maharashtra',
        aadhaar: '123456789123',
        designation: 'UI/UX designer',
        status: 'Active',
        department: 'Design',
        role: 'Employee',
        addedBy: 'Admin User'
      },
      {
        id: 'EMS12346',
        name: 'John Doe',
        email: 'john@example.com',
        contact: '+919988776655',
        address: 'Mumbai, Maharashtra',
        aadhaar: '987654321012',
        designation: 'Backend Developer',
        status: 'Inactive',
        department: 'Tech',
        role: 'Manager',
        addedBy: 'HR Lead'
      }
    ];

    if (this.employeeService.employees.length === 0) {
      this.employeeService.setEmployees(initialEmployees);
    }

    this.employeeService.employees$.subscribe(employees => {
      this.employees = employees;
      this.filteredEmployees = [...employees];
      this.updateAddedByOptions();
    });
  }

  filter(): void {
    const search = this.searchTerm.trim().toLowerCase();

    this.filteredEmployees = this.employees.filter(emp =>
      (!search || (
        emp.name.toLowerCase().includes(search) ||
        emp.id.toLowerCase().includes(search) ||
        emp.contact.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.aadhaar.replace(/-/g, '').toLowerCase().includes(search) ||
        (emp.addedBy?.toLowerCase().includes(search))
      )) &&
      (!this.selectedDepartment || emp.department === this.selectedDepartment) &&
      (!this.selectedRole || emp.role === this.selectedRole) &&
      (!this.selectedStatus || emp.status === this.selectedStatus) &&
      (!this.selectedAddedBy || emp.addedBy === this.selectedAddedBy)
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.selectedAddedBy = '';
    this.filter();
  }

  editEmployee(emp: Employee): void {
    alert(`Edit Employee: ${emp.name} (${emp.id})`);
  }

  deleteEmployee(emp: Employee): void {
    const confirmDelete = confirm(`Are you sure you want to delete ${emp.name}?`);
    if (confirmDelete) {
      this.employeeService.deleteEmployee(emp.id);
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) this.newEmployee = this.getEmptyEmployee();
  }

  addEmployee(): void {
    if (!this.validateAadhaar(this.newEmployee.aadhaar)) {
      alert('Aadhaar must be a 12-digit number.');
      return;
    }

    if (!this.validateContact(this.newEmployee.contact)) {
      alert('Phone number must be valid for selected country.');
      return;
    }

    const emp: Employee = {
      ...this.newEmployee,
      contact: this.selectedCountryCode + this.newEmployee.contact,
      id: this.generateEmployeeId(),
      addedBy: this.currentUser.name
    };

    this.employeeService.addEmployee(emp);
    this.toggleAddForm();
  }

  private getEmptyEmployee(): Employee {
    return {
      id: '',
      name: '',
      email: '',
      contact: '',
      address: '',
      aadhaar: '',
      designation: '',
      status: 'Active',
      department: '',
      role: '',
      addedBy: ''
    };
  }

  private generateEmployeeId(): string {
    const next = this.employees.length + 1;
    return `EMS${next.toString().padStart(5, '0')}`;
  }

  private updateAddedByOptions(): void {
    const uniqueNames = new Set(this.employees.map(e => e.addedBy ?? '').filter(name => name !== ''));
    this.addedByOptions = Array.from(uniqueNames);
  }

  private validateAadhaar(aadhaar: string): boolean {
    return /^[0-9]{12}$/.test(aadhaar);
  }

  private validateContact(contact: string): boolean {
    if (this.selectedCountryCode === '+91') {
      return /^[6-9][0-9]{9}$/.test(contact);
    }
    if (this.selectedCountryCode === '+1') {
      return /^[2-9][0-9]{9}$/.test(contact);
    }
    if (this.selectedCountryCode === '+44') {
      return /^[1-9][0-9]{9,10}$/.test(contact);
    }
    return true;
  }

  exportToCSV(): void {
    const headers = ['ID', 'Name', 'Email', 'Contact', 'Address', 'Aadhaar', 'Designation', 'Status', 'Department', 'Role', 'Added By'];
    const rows = this.filteredEmployees.map(emp => [
      emp.id,
      emp.name,
      emp.email,
      emp.contact,
      emp.address,
      emp.aadhaar,
      emp.designation,
      emp.status,
      emp.department || '',
      emp.role || '',
      emp.addedBy || ''
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    link.click();
  }
}
