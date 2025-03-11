import {Component, OnInit} from '@angular/core';
import {TypeAnimal} from "../../interface/type-animal";
import {TypaAnimalService} from "../../services/typa-animal.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-crud-type-animal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-type-animal.component.html',
  styleUrl: './crud-type-animal.component.css'
})
export class CrudTypeAnimalComponent implements OnInit {
  typeAnimals: TypeAnimal[] = [];
  showModal: boolean = false; // Contrôle l'affichage de la modal
  newTypeAnimal: TypeAnimal = { id: '', animalType: '' }; // Nouveau type d'animal à ajouter

  constructor(
    private typeAnimalService: TypaAnimalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTypeAnimals();
  }

  loadTypeAnimals(): void {
    this.typeAnimalService.getAllTypeAnimals().subscribe({
      next: (data) => this.typeAnimals = data,
      error: (err) => {
        console.error('Erreur de chargement:', err);
        if (err.status === 403) {
          alert('Accès refusé. Veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  deleteTypeAnimal(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type d\'animal ?')) {
      this.typeAnimalService.deleteTypeAnimal(id).subscribe({
        next: () => {
          this.typeAnimals = this.typeAnimals.filter(ta => ta.id !== id);
          alert('Type d\'animal supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur de suppression:', err);
          if (err.status === 403) {
            alert('Accès refusé. Veuillez vous reconnecter.');
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  // Ouvrir la modal
  openModal(): void {
    this.showModal = true;
  }

  // Fermer la modal
  closeModal(): void {
    this.showModal = false;
    this.newTypeAnimal = { id: '', animalType: '' }; // Réinitialiser le formulaire
  }

  // Soumettre le formulaire d'ajout
  onSubmit(): void {
    this.typeAnimalService.createTypeAnimal(this.newTypeAnimal).subscribe({
      next: (data) => {
        this.typeAnimals.push(data); // Ajouter le nouveau type d'animal à la liste
        this.closeModal(); // Fermer la modal
        alert('Type d\'animal ajouté avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
        if (err.status === 403) {
          alert('Accès refusé. Veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
