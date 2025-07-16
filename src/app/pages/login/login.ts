import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RightPanel } from '../../shared/right-panel/right-panel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,RightPanel, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      console.warn('Form invalid');
      return;
    }

    const { email, password } = this.loginForm.value;

    const dummyUser = {
      email: 'admin@example.com',
      password: 'admin123'
    };

    if (email === dummyUser.email && password === dummyUser.password) {
      console.log('Login successful');

      localStorage.setItem('token', 'dummy-token');
      localStorage.setItem('role', 'admin');

      // ✅ Use navigation promise to debug
      this.router.navigate(['/dashboard']).then(success => {
        if (success) {
          console.log('Navigated to dashboard');
        } else {
          console.error('Navigation failed!');
        }
      });
    } else {
      console.warn('Login failed');
      this.errorMessage = 'Invalid email or password';
    }
  }
}

  /*  this.http.post<any>('https://your-backend-api.com/api/auth/login', credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user?.role || 'admin');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });*/
