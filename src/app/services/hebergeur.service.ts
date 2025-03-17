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
    // Remove Content-Type for FormData
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
      reportProgress: true, // This will allow tracking upload progress if needed
    }).pipe(
      catchError(this.handleError)
    );
  }

  getHebergeurByUserId(userId: string): Observable<HebergeurResponse> {
    const headers = this.getHeaders();
    return this.http.get<HebergeurResponse>(`${this.apiUrl}/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateHebergeur(hebergementId: string, formData: FormData): Observable<HebergeurResponse> {
    const headers = this.getHeaders();
    return this.http.put<HebergeurResponse>(`${this.apiUrl}/${hebergementId}`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer un hébergement
  deleteHebergeur(hebergementId: string): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${hebergementId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllHebergements(): Observable<HebergeurResponse[]> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
    return this.http.get<HebergeurResponse[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}
