import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8081/api/reservations';

  constructor(private http: HttpClient, private authService: AuthService) {}



  createReservation(reservationRequest: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservationRequest);
  }

  annulerReservation(id: string, userId: string, userRole: string): Observable<any> {
    const headers = new HttpHeaders({
      'userId': userId,
      'userRole': userRole
    });

    return this.http.put<any>(`${this.apiUrl}/${id}/annuler`, {}, { headers });
  }

  confirmerReservation(id: string, confirmationRequest: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/confirmer`, confirmationRequest);
  }

  getReservationsByHebergeur(hebergeurId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hebergeur/${hebergeurId}`);
  }

  getReservationsByProprietaire(proprietaireId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
  }
}
