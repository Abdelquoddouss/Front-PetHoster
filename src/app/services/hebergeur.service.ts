import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { HebergeurResponse } from '../interface/hebergeur-response';
import {HebergeurSearchRequest} from "../interface/hebergeur-search-request";

@Injectable({
  providedIn: 'root'
})
export class HebergeurService {
  private apiUrl = 'http://localhost:8084/api/hebergeurs';

  constructor(private http: HttpClient) {}

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
    console.error('API Error:', errorMessage);
    return throwError(() => error);
  }

  createHebergeur(formData: FormData): Observable<HebergeurResponse> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('User ID not found in localStorage'));
    }

    console.log('Sending request to:', `${this.apiUrl}/${userId}`);

    return this.http.post<HebergeurResponse>(
      `${this.apiUrl}/${userId}`,
      formData
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  uploadHebergeurPhotos(hebergeurId: string, photos: File[]): Observable<HebergeurResponse> {
    const formData = new FormData();
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    return this.http.post<HebergeurResponse>(
      `${this.apiUrl}/${hebergeurId}/upload-photos`,
      formData
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getHebergeurByUserId(userId: string): Observable<HebergeurResponse> {
    console.log('Getting hebergeur with userId:', userId);

    return this.http.get<HebergeurResponse>(
      `${this.apiUrl}/${userId}`
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateHebergeur(hebergeurId: string, formData: FormData): Observable<HebergeurResponse> {
    return this.http.put<HebergeurResponse>(
      `${this.apiUrl}/${hebergeurId}`,
      formData
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteHebergeur(hebergeurId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${hebergeurId}`
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getHebergeurById(id: string): Observable<HebergeurResponse> {
    return this.http.get<HebergeurResponse>(
      `${this.apiUrl}/${id}`
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getAllHebergements(): Observable<HebergeurResponse[]> {
    return this.http.get<HebergeurResponse[]>(
      this.apiUrl
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  resetHebergementFields(hebergeurId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${hebergeurId}/reset-hebergement`
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  searchHebergements(searchRequest: HebergeurSearchRequest | null): Observable<HebergeurResponse[]> {
    return this.http.post<HebergeurResponse[]>(`${this.apiUrl}/search`, searchRequest)
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }
}
