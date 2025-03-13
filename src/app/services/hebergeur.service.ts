import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { HebergeurResponse } from '../interface/hebergeur-response';

@Injectable({
  providedIn: 'root'
})
export class HebergeurService {
  private apiUrl = 'http://localhost:8081/api/hebergeurs';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    // Note: For FormData, don't set Content-Type - browser will set it with boundary
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur : ${error.status}\nMessage : ${error.message}`;

      // Try to extract more detailed error message if available
      if (error.error && typeof error.error === 'object') {
        if (error.error.message) {
          errorMessage += `\nDétails : ${error.error.message}`;
        }
      }
    }
    console.error('API Error:', error);
    return throwError(() => error); // Return the full error object for more info
  }

  createHebergeur(formData: FormData): Observable<HebergeurResponse> {
    const userId = localStorage.getItem('userId');
    const headers = this.getHeaders();

    console.log('Sending request to:', `${this.apiUrl}/${userId}`);

    return this.http.post<HebergeurResponse>(`${this.apiUrl}/${userId}`, formData, {
      headers,
      // Add observe: 'response' to get the full response including headers
      // This can help debug issues
    }).pipe(
      catchError(this.handleError)
    );
  }
}
