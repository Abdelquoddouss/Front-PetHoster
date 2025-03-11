import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  register(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }

  login(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        // Stocker le token dans le localStorage
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Méthode pour récupérer le token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
