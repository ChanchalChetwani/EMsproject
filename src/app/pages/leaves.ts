import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../services/leave.service';
import { Sidebar } from '../../app/shared/sidebar/sidebar';
import { Topbar } from '../../app/shared/topbar/topbar';
import { Leave } from '../../app/models/leave.model';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

type LeaveWithSelection = Leave & { selected: boolean };

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Sidebar, Topbar, FormsModule],
  templateUrl: './leaves.html',
  styleUrls: ['./leaves.scss']
})
export class LeaveManagementComponent implements OnInit {
  leaves: LeaveWithSelection[] = [];
  filteredLeaves: LeaveWithSelection[] = [];
  searchQuery: string = '';
  selectAll: boolean = false;
  selectedStatus: string = 'All';   // 👈 Default filter

  // ✅ Status options for filter dropdown
  statusOptions: string[] = ['All', 'Pending', 'Approved', 'Rejected'];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveService.getLeaves().subscribe((data: Leave[]) => {
      this.leaves = data.map(leave => ({ ...leave, selected: false }));
      this.applyFilters();
    });
  }

  // 🔎 Apply both search & status filter
  applyFilters(): void {
    const q = this.searchQuery.toLowerCase();

    this.filteredLeaves = this.leaves.filter(leave => {
      const matchesSearch =
        leave.employeeName.toLowerCase().includes(q) ||
        leave.employeeId.toLowerCase().includes(q) ||
        leave.leaveType.toLowerCase().includes(q) ||
        leave.status.toLowerCase().includes(q);

      const matchesStatus =
        this.selectedStatus === 'All' || leave.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  // 🔎 search
  searchLeaves(): void {
    this.applyFilters();
  }

  // ✅ filter status change
  filterByStatus(event: any): void {
    this.selectedStatus = event.target.value;
    this.applyFilters();
  }

  // ✅ select all checkbox
  toggleAllSelection(): void {
    this.filteredLeaves.forEach(leave => {
      leave.selected = this.selectAll;
    });
  }

  // ✅ approve
  approve(id: number): void {
    const leave = this.leaves.find(l => l.id === id);
    if (leave && leave.status === 'Pending') {
      leave.status = 'Approved';
    }
    this.applyFilters();
  }

  // ✅ reject
  reject(id: number): void {
    const leave = this.leaves.find(l => l.id === id);
    if (leave && leave.status === 'Pending') {
      leave.status = 'Rejected';
    }
    this.applyFilters();
  }
}
