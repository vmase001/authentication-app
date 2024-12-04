import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInterface } from '../user.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    this.http
      .post<{ user: UserInterface }>(
        'https://api.realworld.io/api/users/login',
        {
          user: this.form.getRawValue(),
        }
      )
      .subscribe((response) => {
        localStorage.setItem('token', response.user.token);
        this.authService.currentUserSig.set(response.user);
        this.router.navigateByUrl('/');
      });
  }
}
