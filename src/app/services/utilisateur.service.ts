import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Utilisateur} from "../interface/utilisateur";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8084/api/user';

  constructor(private http: HttpClient) { }


  getAllUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}/role`; // URL de l'API backend
    const params = { role: role }; // Paramètre pour le nouveau rôle

    return this.http.put<any>(url, null, {  params }).pipe(
      tap(response => {
        console.log('Rôle mis à jour avec succès', response);
      })
    );
  }

  getUserRole(userId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${userId}/role`, { responseType: 'text' });
  }
}
