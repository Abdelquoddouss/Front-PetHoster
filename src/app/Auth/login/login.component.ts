import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
  CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login successful', response);

          // Décoder le token pour obtenir le rôle de l'utilisateur
          const token = response.token;
          const decodedToken: any = jwtDecode(token);
          const userRole = decodedToken.role; // Assurez-vous que le rôle est inclus dans le token

          // Rediriger en fonction du rôle
          if (userRole === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else if (userRole === 'HEBERGEUR') {
            this.router.navigate(['/dashboard-hebergeur']);
          } else if (userRole === 'PROPRIETAIRE') {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('Email ou mot de passe incorrect.');
        }
      });
    }
  }
}
