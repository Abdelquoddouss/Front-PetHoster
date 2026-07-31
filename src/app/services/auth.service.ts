import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {jwtDecode} from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8084/api/auth';

  constructor(private http: HttpClient) {}

  register(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }

  login(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);

          const decodedToken: any = jwtDecode(response.token);
          const userId = decodedToken.id;

          if (userId) {
            localStorage.setItem('userId', userId);
          }
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
    localStorage.removeItem('userId');
  }

  // Méthode pour récupérer le token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getCurrentUserRole(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role; // Assurez-vous que le rôle est bien stocké dans le token JWT
    }
    return ''; // Retourne une chaîne vide si le token n'est pas trouvé
  }
}
