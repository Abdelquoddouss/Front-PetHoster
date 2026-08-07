import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HebergeurResponse } from "../../interface/hebergeur-response";
import { HebergeurService } from "../../services/hebergeur.service";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import Swal from "sweetalert2";

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

  get hasCompleteHebergement(): boolean {
    const h = this.hebergement;
    return !!h
      && Number(h.tarifParJour) > 0
      && !!h.descriptionService?.trim()
      && Array.isArray(h.typeAnimauxAcceptesNoms)
      && h.typeAnimauxAcceptesNoms.length > 0
      && Array.isArray(h.photosHebergement)
      && h.photosHebergement.length === 3;
  }
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
      this.error = 'Veuillez vous connecter pour accÃ©der Ã  cette page';
      // Redirect to login page
      this.router.navigate(['/login']);
      return;
    }

    this.loadHebergement();
  }

  // Charger l'hÃ©bergement de l'utilisateur
  loadHebergement(): void {
    const userId = localStorage.getItem('userId');
    this.loading = true;
    this.error = null;

    if (!userId) {
      this.error = 'Utilisateur non identifiÃ©';
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
        console.error('Erreur lors de la rÃ©cupÃ©ration de l\'hÃ©bergement:', err);

        if (err.status === 403) {
          this.error = 'AccÃ¨s refusÃ©. Votre session a peut-Ãªtre expirÃ©.';
          // Redirect to login
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        } else if (err.status === 404) {
          this.error = 'Aucun hÃ©bergement trouvÃ© pour cet utilisateur';
        } else {
          this.error = 'Une erreur est survenue lors du chargement des donnÃ©es';
        }

        this.loading = false;
      }
    });
  }

  // Gestion des erreurs d'image
  onImageError(event: Event, hebergement: HebergeurResponse): void {
    console.error('Erreur de chargement de l\'image pour l\'hÃ©bergement:', hebergement.id);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/bg_1.jpg';
  }

  onDelete(hebergeurId: string): void {
    Swal.fire({
      title: 'Réinitialiser cette annonce ?',
      text: 'Les informations et les photos de votre hébergement seront retirées.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e77c58',
      cancelButtonColor: '#173f35',
      confirmButtonText: 'Oui, réinitialiser'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;

        this.hebergeurService.resetHebergementFields(hebergeurId).subscribe({
          next: () => {
            Swal.fire('SuccÃ¨s!', 'Informations de l\'hÃ©bergement supprimÃ©es avec succÃ¨s', 'success');
            this.hebergement = null;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erreur lors de la suppression des informations de l\'hÃ©bergement:', err);
            Swal.fire('Erreur', 'Impossible de supprimer les informations de l\'hÃ©bergement', 'error');
            this.loading = false;
          }
        });
      }
    });
  }

}


