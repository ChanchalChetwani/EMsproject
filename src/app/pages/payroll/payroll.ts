import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { FormsModule } from '@angular/forms';

// 👉 PDF generation imports
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SalaryComponent {
  name: string;
  amount: number;
  type: 'Allowance' | 'Deduction';
}

interface EmployeePayroll {
  id: string;
  name: string;
  designation: string;
  department: string;
  salary: number; // ✅ Base Salary
  status: 'Processed' | 'Pending';
  selected?: boolean;
  components?: SalaryComponent[];
}

@Component({
  selector: 'app-payroll',
  imports: [Topbar, Sidebar, CommonModule, FormsModule],
  templateUrl: './payroll.html',
  styleUrl: './payroll.scss'
})
export class PayrollComponent {
  searchTerm: string = '';
  statusFilter: string = '';
  selectAll: boolean = false;

  // ✅ Modal handling
  selectedEmployee: EmployeePayroll | null = null;
  newComponent: SalaryComponent = { name: '', amount: 0, type: 'Allowance' };

  employees: EmployeePayroll[] = [
    { id: 'EMP001', name: 'John Doe', designation: 'Software Engineer', department: 'IT', salary: 50000, status: 'Processed', selected: false, components: [] },
    { id: 'EMP002', name: 'Jane Smith', designation: 'HR Manager', department: 'Human Resources', salary: 60000, status: 'Pending', selected: false, components: [] },
    { id: 'EMP003', name: 'Mark Wilson', designation: 'Accountant', department: 'Finance', salary: 45000, status: 'Processed', selected: false, components: [] },
    { id: 'EMP004', name: 'Lucy Brown', designation: 'Payroll Officer', department: 'Finance', salary: 40000, status: 'Pending', selected: false, components: [] },
  ];

  get totalEmployees() { return this.employees.length; }
  get processedPayrolls() { return this.employees.filter(e => e.status === 'Processed').length; }
  get successfulPayrolls() { return this.processedPayrolls; }
  get pendingPayrolls() { return this.employees.filter(e => e.status === 'Pending').length; }

  // ==============================
  // 🎯 Filtering Logic
  // ==============================
  filteredEmployees(): EmployeePayroll[] {
    return this.employees.filter(emp => {
      const matchesSearch = this.searchTerm
        ? emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.designation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesStatus = this.statusFilter
        ? emp.status === this.statusFilter
        : true;

      return matchesSearch && matchesStatus;
    });
  }

  // ✅ Select/Deselect All
  toggleAll() {
    this.employees.forEach(emp => emp.selected = this.selectAll);
  }
  updateSelectAll() {
    this.selectAll = this.employees.every(emp => emp.selected);
  }

  // ==============================
  // 🎯 Salary Calculation Helpers
  // ==============================
  getAllowances(emp: EmployeePayroll): number {
    return emp?.components?.filter(c => c.type === 'Allowance')
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
  }

  getDeductions(emp: EmployeePayroll): number {
    return emp?.components?.filter(c => c.type === 'Deduction')
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
  }

  getNetSalary(emp: EmployeePayroll): number {
    return (emp?.salary || 0) + this.getAllowances(emp) - this.getDeductions(emp);
  }

  // ==============================
  // 🎯 PDF Salary Slip Generation
  // ==============================
  generateSlip(employee: EmployeePayroll) {
    const doc = new jsPDF();

    // ✅ Company Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 153);
    doc.text("CN Private Limited", 105, 15, { align: "center" });

    // ✅ Address & Contact
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("CN Private Limited, Sant Tukaram Nagar, Pimpri, Pune - 411018, Maharashtra, India", 105, 25, { align: "center" });
    doc.text("Contact: +91 9876543211", 105, 32, { align: "center" });

    // ✅ Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Salary Slip", 105, 45, { align: "center" });

    // ✅ Build table body with INR instead of ₹
    const bodyData: any[] = [
      ['Employee ID', employee.id],
      ['Name', employee.name],
      ['Designation', employee.designation],
      ['Department', employee.department],
      ['Base Salary', `INR ${employee.salary.toLocaleString()}`]
    ];

    // Add allowances
    const allowances = this.getAllowances(employee);
    if (allowances > 0) {
      bodyData.push(['Allowances', `+ INR ${allowances.toLocaleString()}`]);
    }

    // Add deductions
    const deductions = this.getDeductions(employee);
    if (deductions > 0) {
      bodyData.push(['Deductions', `- INR ${deductions.toLocaleString()}`]);
    }

    // Net Salary
    bodyData.push(['Net Salary', `INR ${this.getNetSalary(employee).toLocaleString()}`]);

    // Status
    bodyData.push(['Status', employee.status]);

    autoTable(doc, {
      startY: 55,
      theme: 'grid',
      head: [['Field', 'Details']],
      body: bodyData,
      headStyles: { fillColor: [0, 51, 153], halign: 'center' },
      bodyStyles: { fontSize: 11 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 25;

    // ✅ Signatories
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Chanchal Chetwani", 20, finalY);
    doc.setFont("times", "italic");
    doc.text("Chief Executive Officer (CEO)", 20, finalY + 6);

    doc.setFont("times", "bold");
    doc.text("Nikhil Kukreja", 90, finalY);
    doc.setFont("times", "italic");
    doc.text("Director", 90, finalY + 6);

    doc.setFont("times", "bold");
    doc.text("Priya Sharma", 160, finalY);
    doc.setFont("times", "italic");
    doc.text("HR Department", 160, finalY + 6);

    // ✅ Footer Note
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("This is a system generated salary slip.", 105, doc.internal.pageSize.height - 10, { align: "center" });

    doc.save(`${employee.id}_SalarySlip.pdf`);
  }

  // ==============================
  // 🎯 Add Component Logic
  // ==============================
  addComponent(employee: EmployeePayroll) {
    this.selectedEmployee = employee;
    this.newComponent = { name: '', amount: 0, type: 'Allowance' };

    const modal = document.getElementById('addComponentModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  saveComponent() {
    if (this.selectedEmployee && this.newComponent.name && this.newComponent.amount > 0) {
      if (!this.selectedEmployee.components) {
        this.selectedEmployee.components = [];
      }

      this.selectedEmployee.components.push({ ...this.newComponent });

      // Reset form
      this.newComponent = { name: '', amount: 0, type: 'Allowance' };

      // ✅ Close modal
      const modal = document.getElementById('addComponentModal');
      if (modal) {
        const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
      }

      alert(`Component added for ${this.selectedEmployee.name}`);
    }
  }
}