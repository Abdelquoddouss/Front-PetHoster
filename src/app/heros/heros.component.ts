import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {TypaAnimalService} from "../services/typa-animal.service";

@Component({
  selector: 'app-heros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './heros.component.html',
  styleUrl: './heros.component.css'
})
export class HerosComponent implements OnInit {
  searchForm: FormGroup;
  typeAnimaux: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private typeAnimalService: TypaAnimalService
  ) {
    this.searchForm = this.fb.group({
      localisation: [''],
      typeAnimauxIds: [[]],
      tarifMaxParJour: [null],

    });
  }

  ngOnInit(): void {
    this.loadTypeAnimaux();
  }

  loadTypeAnimaux(): void {
    this.typeAnimalService.getAllTypeAnimals().subscribe(
      (data) => {
        this.typeAnimaux = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des types d\'animaux', error);
      }
    );
  }

  onSearch(): void {
    // Construit l'objet de recherche à partir du formulaire
    const searchRequest = {
      localisation: this.searchForm.get('localisation')?.value || null,
      typeAnimauxIds: this.searchForm.get('typeAnimauxIds')?.value || null,
      tarifMaxParJour: this.searchForm.get('tarifMaxParJour')?.value || null,
    };

    // Navigue vers la page des hébergements avec les paramètres de recherche
    this.router.navigate(['/heb'], {
      queryParams: { search: JSON.stringify(searchRequest) }
    });
  }
}
