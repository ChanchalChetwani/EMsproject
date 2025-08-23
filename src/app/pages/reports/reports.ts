import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { ReportsService } from '../../services/reports.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Topbar, BaseChartDirective],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {
  totalEmployees = 0;
  totalPayroll = 0;
  performanceScore = 0;
  selectedView = 'monthly';

  chartLabels: string[] = [];
  chartConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{ label: 'Payroll Report', data: [], backgroundColor: '#4CAF50' }]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  };

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.reportsService.getReports(this.selectedView).subscribe((data: any) => {
      this.totalEmployees = data.totalEmployees;
      this.totalPayroll = data.totalPayroll;
      this.performanceScore = Math.round(data.performanceScore);

      this.chartLabels = data.chartData.map((c: any) => c.label);
      this.chartConfig.data.labels = this.chartLabels;
      this.chartConfig.data.datasets[0].data = data.chartData.map((c: any) => c.total);
    });
  }

  onViewChange(view: string) {
    this.selectedView = view;
    this.fetchReports();
  }
}
