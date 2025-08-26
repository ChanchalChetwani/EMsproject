import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.scss'
})
export class LogoutComponent {

  constructor(private router: Router) {}

  ngOnInit() {
    this.logout();
  }

  /** ✅ Clear session and redirect */
  logout() {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();

    // Optional: Show feedback (toast/alert)
    alert("You have been logged out successfully!");

    // Navigate to login
    this.router.navigate(['/login']);
  }
}