import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {HebergeurResponse} from "../../interface/hebergeur-response";
import {HebergeurService} from "../../services/hebergeur.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-crud-hebergement',
  standalone: true,
  imports: [
   CommonModule
  ],
  templateUrl: './crud-hebergement.component.html',
  styleUrl: './crud-hebergement.component.css'
})
export class CrudHebergementComponent implements OnInit {
  hebergement: HebergeurResponse | null = null;

  constructor(
    private hebergeurService: HebergeurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHebergement();
  }

  // Charger l'hébergement de l'utilisateur
  loadHebergement(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.hebergeurService.getHebergeurByUserId(userId).subscribe({
        next: (data: HebergeurResponse) => {
          this.hebergement = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de l\'hébergement:', err);
        }
      });
    }
  }

  // Gestion des erreurs d'image
  onImageError(event: Event, hebergement: HebergeurResponse) {
    console.error('Erreur de chargement de l\'image pour l\'hébergement:', hebergement.id);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-image.jpg'; // Chemin vers une image de remplacement
  }

  // Rediriger vers la page de modification
  onUpdate(hebergementId: string): void {
    this.router.navigate(['/update-hebergement', hebergementId]);
  }

  onDelete(hebergementId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer les informations de cet hébergement ?')) {
      this.hebergeurService.resetHebergementFields(hebergementId).subscribe({
        next: () => {
          alert('Informations de l\'hébergement supprimées avec succès');
          this.hebergement = null; // Réinitialiser l'hébergement
        },
        error: (err) => {
          console.error('Erreur lors de la suppression des informations de l\'hébergement:', err);
        }
      });
    }
  }
}
