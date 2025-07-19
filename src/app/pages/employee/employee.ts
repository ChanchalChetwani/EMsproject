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
  selecteDesignation = '';
  selectedStatus = '';
  selectedAddedBy = '';
  selectedCountryCode: string = '+91';

  departments: string[] = ['HR', 'Tech', 'Design'];
  designation: string[] = ['Admin','UI/UX Designer','Backend Developer','Frontend Developer','QA Engineer','HR Executive','Manager'];
  statuses: string[] = ['Active', 'Inactive'];
  addedByOptions: string[] = [];

  currentUser = {
    name: 'Chanchal Chetwani',
    designation: 'HR Executive'
  };
  editingEmployee: Employee = this.getEmptyEmployee();



  showAddForm: boolean = false;
   showFilterPanel: boolean = false;
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
        designation: 'UI/UX Designer',
        status: 'Active',
        department: 'Design',
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
      (!this.selecteDesignation || emp.designation === this.selecteDesignation) &&
      (!this.selectedStatus || emp.status === this.selectedStatus) &&
      (!this.selectedAddedBy || emp.addedBy === this.selectedAddedBy)
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selecteDesignation = '';
    this.selectedStatus = '';
    this.selectedAddedBy = '';
    this.filter();
  }

 editEmployee(emp: Employee): void {
  this.startEditing(emp);
}

  deleteEmployee(emp: Employee): void {
    const confirmDelete = confirm(`Are you sure you want to delete ${emp.name}?`);
    if (confirmDelete) {
      this.employeeService.deleteEmployee(emp.id);
    }
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  applyFilter() {
    this.filter();
    this.showFilterPanel = false;
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
    const headers = ['ID', 'Name', 'Email', 'Contact', 'Address', 'Aadhaar', 'Designation', 'Status', 'Department','Added By'];
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

canEdit(emp: Employee): boolean {
  return this.currentUser.designation === 'Admin' || this.currentUser.designation === 'HR Executive';
}

startEditing(emp: Employee): void {
  if (this.canEdit(emp)) {
    this.editingEmployee = { ...emp };
  }
}

cancelEdit(): void {
this.editingEmployee = this.getEmptyEmployee();

}

saveEdit(): void {
  if (!this.editingEmployee) return;

  const index = this.employees.findIndex(e => e.id === this.editingEmployee?.id);
  if (index !== -1) {
    this.employees[index] = { ...this.editingEmployee };
    this.filteredEmployees[index] = { ...this.editingEmployee };
    this.employeeService.setEmployees([...this.employees]);
    alert('Employee details updated successfully!');
  }

  this.editingEmployee = this.getEmptyEmployee();


}
}
