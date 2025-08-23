import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-correction-requests',
 standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './correction-requests.html',
  styleUrl: './correction-requests.scss'
})
export class CorrectionRequestComponent implements OnInit {
  correctionList: any[] = [];
  filteredCorrections: any[] = [];
  searchCorrection: string = '';

  ngOnInit(): void {
    this.correctionList = [
      { name: 'Alice', date: '2025-07-01', reason: 'Missed punch' },
      { name: 'Bob', date: '2025-07-02', reason: 'Late arrival' },
      { name: 'Charlie', date: '2025-07-03', reason: 'Forgot to log out' }
    ];

    this.filteredCorrections = [...this.correctionList];
  }

  onCorrectionSearch(): void {
    const searchTerm = this.searchCorrection.toLowerCase();
    this.filteredCorrections = this.correctionList.filter(req =>
      Object.values(req).some(val =>
        val?.toString().toLowerCase().includes(searchTerm)
      )
    );
  }
}