import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {HebergeurResponse} from "../interface/hebergeur-response";

@Injectable({
  providedIn: 'root'
})
export class HebergeurService {

  private apiUrl = 'http://localhost:8081/api/hebergeurs';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 500 && error.error && typeof error.error === 'string' &&
        error.error.includes('value too long for type character varying(255)')) {
        errorMessage = 'Les images téléchargées sont trop volumineuses. Veuillez essayer avec des images plus petites ou moins nombreuses.';
      } else {
        errorMessage = `Code d'erreur : ${error.status}\nMessage : ${error.message}`;

        // Ajouter plus de détails si disponibles
        if (error.error && typeof error.error === 'string') {
          errorMessage += `\nDétails: ${error.error}`;
        }
      }
    }

    console.error('Erreur complète:', error);
    console.error(errorMessage);

    return throwError(errorMessage);
  }

  getAllHebergeurs(): Observable<HebergeurResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<HebergeurResponse[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  createHebergeur(hebergeur: any): Observable<HebergeurResponse> {
    const userId = this.getUserId();
    const headers = this.getHeaders();

    // Créer un objet qui correspond exactement à la structure attendue par le backend
    const requestData = {
      tarifParJour: hebergeur.tarifParJour,
      descriptionService: hebergeur.descriptionService,
      typeAnimauxAcceptesIds: hebergeur.typeAnimauxAcceptesIds,
      photosHebergement: hebergeur.photosHebergement || []
    };

    // Log sans exposer le contenu complet des images
    console.log('URL:', `${this.apiUrl}/${userId}`);
    console.log('Headers:', headers);
    console.log('RequestData:', {
      ...requestData,
      photosHebergement: requestData.photosHebergement ?
        `${requestData.photosHebergement.length} photos` : 'aucune photo'
    });

    return this.http.post<HebergeurResponse>(`${this.apiUrl}/${userId}`, requestData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteHebergeur(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
