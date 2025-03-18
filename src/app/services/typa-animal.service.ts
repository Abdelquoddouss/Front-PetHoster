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


  getAllTypeAnimals(): Observable<TypeAnimal[]> {
    return this.http.get<TypeAnimal[]>(this.apiUrl);
  }

  createTypeAnimal(typeAnimal: TypeAnimal): Observable<TypeAnimal> {
    return this.http.post<TypeAnimal>(this.apiUrl, typeAnimal);
  }

  updateTypeAnimal(id: string, typeAnimal: TypeAnimal): Observable<TypeAnimal> {
    return this.http.put<TypeAnimal>(`${this.apiUrl}/${id}`, typeAnimal);
  }

  deleteTypeAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
