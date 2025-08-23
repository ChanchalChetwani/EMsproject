import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.html',
  styleUrl: './error.scss'
})
export class Error {
  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);  // ✅ works now
  }
}
