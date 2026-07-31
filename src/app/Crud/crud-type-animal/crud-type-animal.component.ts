import {Component, OnInit} from '@angular/core';
import {TypeAnimal} from "../../interface/type-animal";
import {TypaAnimalService} from "../../services/typa-animal.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";

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
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce type d\'animal ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.typeAnimalService.deleteTypeAnimal(id).subscribe({
          next: () => {
            this.typeAnimals = this.typeAnimals.filter(ta => ta.id !== id);
            Swal.fire('Succès!', 'Type d\'animal supprimé avec succès', 'success');
          },
          error: (err) => {
            console.error('Erreur de suppression:', err);
            Swal.fire('Erreur', 'Accès refusé. Veuillez vous reconnecter.', 'error');
            this.router.navigate(['/login']);
          }
        });
      }
    });
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
        this.typeAnimals.push(data);
        this.closeModal();
        Swal.fire('Succès!', 'Type d\'animal ajouté avec succès', 'success');
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
        Swal.fire('Erreur', 'Accès refusé. Veuillez vous reconnecter.', 'error');
        this.router.navigate(['/login']);
      }
    });
  }
}
