import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../services/leave.service';
// Shared Components
import { Sidebar } from '../../app/shared/sidebar/sidebar';
import { Topbar } from '../../app/shared/topbar/topbar';
import { Leave } from '../../app/models/leave.model'

@Component({
  selector: 'app-leaves',
  imports: [Sidebar,Topbar],
  templateUrl: './leaves.html',
  styleUrl: './leaves.scss'
})
export class Leaves {
export class LeaveComponent implements OnInit {
  leaves: Leave[] = [];
  searchText = '';

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.leaveService.getLeaves().subscribe((data) => {
      this.leaves = data;
    });
  }

  filteredLeaves(): Leave[] {
    return this.leaves.filter((leave) =>
      leave.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
}
