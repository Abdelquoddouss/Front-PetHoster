import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Utilisateur} from "../interface/utilisateur";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8081/api/user';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Récupérez le token du localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajoutez le token dans l'en-tête
    });
  }

  getAllUsers(): Observable<Utilisateur[]> {
    const headers = this.getHeaders();
    return this.http.get<Utilisateur[]>(this.apiUrl, { headers });
  }

  deleteUser(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
