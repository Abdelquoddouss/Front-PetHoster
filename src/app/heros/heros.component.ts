import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TypaAnimalService } from "../services/typa-animal.service";
import { TypeAnimal } from "../interface/type-animal";

@Component({
  selector: 'app-heros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './heros.component.html',
  styleUrl: './heros.component.css'
})
export class HerosComponent implements OnInit {
  searchForm: FormGroup;
  typeAnimaux: TypeAnimal[] = [];
  typeAnimauxPopulaires: TypeAnimal[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private typeAnimalService: TypaAnimalService
  ) {
    this.searchForm = this.fb.group({
      localisation: [''],
      typeAnimauxIds: [null],
      tarifMaxParJour: [null],
    });
  }

  ngOnInit(): void {
    this.loadTypeAnimaux();
  }

  loadTypeAnimaux(): void {
    this.isLoading = true;
    this.typeAnimalService.getAllTypeAnimals().subscribe({
      next: (data) => {
        this.typeAnimaux = data;
        // Sélectionner les 5 premiers types d'animaux comme populaires
        // ou utilisez votre propre logique pour déterminer les plus populaires
        this.typeAnimauxPopulaires = data.slice(0, 5);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types d\'animaux', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  selectionnerTypeAnimal(type: TypeAnimal): void {
    this.searchForm.patchValue({
      typeAnimauxIds: type.id
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      return;
    }

    // Vérifier si typeAnimauxIds est une valeur unique et la transformer en tableau si nécessaire
    const typeAnimauxValue = this.searchForm.get('typeAnimauxIds')?.value;
    const typeAnimauxIds = typeAnimauxValue
      ? (Array.isArray(typeAnimauxValue) ? typeAnimauxValue : [typeAnimauxValue])
      : null;

    // Construit l'objet de recherche à partir du formulaire
    const searchRequest = {
      localisation: this.searchForm.get('localisation')?.value || null,
      typeAnimauxIds: typeAnimauxIds, // Maintenant, c'est toujours null ou un tableau
      tarifMaxParJour: this.searchForm.get('tarifMaxParJour')?.value || null,
    };

    // Navigue vers la page des hébergements avec les paramètres de recherche
    this.router.navigate(['/heb'], {
      queryParams: {search: JSON.stringify(searchRequest)}
    });
  }
}
