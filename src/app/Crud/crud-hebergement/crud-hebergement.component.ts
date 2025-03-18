import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HebergeurResponse } from "../../interface/hebergeur-response";
import { HebergeurService } from "../../services/hebergeur.service";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-crud-hebergement',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './crud-hebergement.component.html',
  styleUrl: './crud-hebergement.component.css'
})
export class CrudHebergementComponent implements OnInit {
  hebergement: HebergeurResponse | null = null;
  loading: boolean = false;
  error: string | null = null;
  isAuthenticated: boolean = false;

  constructor(
    private hebergeurService: HebergeurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    this.isAuthenticated = !!authToken;

    if (!this.isAuthenticated) {
      console.error('User is not authenticated');
      this.error = 'Veuillez vous connecter pour accéder à cette page';
      // Redirect to login page
      this.router.navigate(['/login']);
      return;
    }

    this.loadHebergement();
  }

  // Charger l'hébergement de l'utilisateur
  loadHebergement(): void {
    const userId = localStorage.getItem('userId');
    this.loading = true;
    this.error = null;

    if (!userId) {
      this.error = 'Utilisateur non identifié';
      this.loading = false;
      return;
    }

    console.log('Loading hebergement for user:', userId);

    this.hebergeurService.getHebergeurByUserId(userId).subscribe({
      next: (data: HebergeurResponse) => {
        console.log('Hebergement data received:', data);
        this.hebergement = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'hébergement:', err);

        if (err.status === 403) {
          this.error = 'Accès refusé. Votre session a peut-être expiré.';
          // Redirect to login
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        } else if (err.status === 404) {
          this.error = 'Aucun hébergement trouvé pour cet utilisateur';
        } else {
          this.error = 'Une erreur est survenue lors du chargement des données';
        }

        this.loading = false;
      }
    });
  }

  // Gestion des erreurs d'image
  onImageError(event: Event, hebergement: HebergeurResponse): void {
    console.error('Erreur de chargement de l\'image pour l\'hébergement:', hebergement.id);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-image.jpg'; // Chemin vers une image de remplacement
  }

  onDelete(hebergeurId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer les informations de cet hébergement ?')) {
      this.loading = true;

      this.hebergeurService.resetHebergementFields(hebergeurId).subscribe({
        next: () => {
          alert('Informations de l\'hébergement supprimées avec succès');
          this.hebergement = null; // Réinitialiser l'hébergement
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression des informations de l\'hébergement:', err);

          if (err.status === 403) {
            this.error = 'Accès refusé. Votre session a peut-être expiré.';
            localStorage.removeItem('authToken');
            this.router.navigate(['/login']);
          } else {
            this.error = 'Impossible de supprimer les informations de l\'hébergement';
          }

          this.loading = false;
        }
      });
    }
  }
}
