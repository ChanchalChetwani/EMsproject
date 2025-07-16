import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes the service available application-wide
})
export class DashboardService {
  private baseUrl = 'http://localhost:3000/api/dashboard'; // base API URL

  constructor(private http: HttpClient) {}

  /**
   * Get overall dashboard statistics
   */
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  /**
   * (Optional) Get recent activity logs (new employee, birthday, etc.)
   */
  getRecentActivities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/activities`);
  }

  /**
   * (Optional) Get attendance trend data separately
   */
  getAttendanceTrend(): Observable<any> {
    return this.http.get(`${this.baseUrl}/attendance-trend`);
  }
}
