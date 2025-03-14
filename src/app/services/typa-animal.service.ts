import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeAnimal} from "../interface/type-animal";

@Injectable({
  providedIn: 'root'
})
export class TypaAnimalService {
  private apiUrl = 'http://localhost:8081/api/type-animals';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Récupérez le token du localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajoutez le token dans l'en-tête
    });
  }

  getAllTypeAnimals(): Observable<TypeAnimal[]> {
    const headers = this.getHeaders(); // Ajoutez les headers d'authentification
    return this.http.get<TypeAnimal[]>(this.apiUrl, { headers });
  }

  createTypeAnimal(typeAnimal: TypeAnimal): Observable<TypeAnimal> {
    const headers = this.getHeaders();
    return this.http.post<TypeAnimal>(this.apiUrl, typeAnimal, { headers });
  }

  updateTypeAnimal(id: string, typeAnimal: TypeAnimal): Observable<TypeAnimal> {
    const headers = this.getHeaders();
    return this.http.put<TypeAnimal>(`${this.apiUrl}/${id}`, typeAnimal, { headers });
  }

  deleteTypeAnimal(id: string): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
