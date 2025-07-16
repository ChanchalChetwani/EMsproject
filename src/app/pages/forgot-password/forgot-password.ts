import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RightPanel } from '../../shared/right-panel/right-panel';
@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RightPanel],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
forgotForm: FormGroup;
  submitted = false;
  message = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotForm.invalid) return;

    const email = this.forgotForm.value.email;

    // Placeholder for your backend API
    this.http.post('https://your-backend-api.com/api/auth/forgot-password', { email })
      .subscribe({
        next: () => this.message = 'Reset link sent to your email.',
        error: () => this.message = 'Email not found or error occurred.'
      });
  }
}

