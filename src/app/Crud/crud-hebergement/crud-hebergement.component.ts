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
  currentPhotoIndex = 0;
  private touchStartX = 0;
  loading: boolean = false;
  error: string | null = null;
  isAuthenticated: boolean = false;

  get hasCompleteHebergement(): boolean {
    const h = this.hebergement;
    if (!h) return false;
    return Number(h.tarifParJour) > 0
      || !!h.descriptionService?.trim()
      || h.photosHebergement.length > 0
      || h.typeAnimauxAcceptesNoms.length > 0
      || h.typeAnimauxAcceptesIds.length > 0;
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
        this.hebergement = { ...data, photosHebergement: data.photosHebergement || [], typeAnimauxAcceptesNoms: data.typeAnimauxAcceptesNoms || [], typeAnimauxAcceptesIds: data.typeAnimauxAcceptesIds || [] };
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
          this.error = 'Vous n’avez pas encore créé votre hébergement';
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

  selectPhoto(index: number): void {
    const total = this.hebergement?.photosHebergement.length || 0;
    if (total) this.currentPhotoIndex = Math.max(0, Math.min(index, total - 1));
  }

  previousPhoto(): void {
    const total = this.hebergement?.photosHebergement.length || 0;
    if (total) this.currentPhotoIndex = (this.currentPhotoIndex - 1 + total) % total;
  }

  nextPhoto(): void {
    const total = this.hebergement?.photosHebergement.length || 0;
    if (total) this.currentPhotoIndex = (this.currentPhotoIndex + 1) % total;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0]?.clientX || 0;
  }

  onTouchEnd(event: TouchEvent): void {
    const endX = event.changedTouches[0]?.clientX || 0;
    const distance = endX - this.touchStartX;
    if (Math.abs(distance) > 45) distance < 0 ? this.nextPhoto() : this.previousPhoto();
  }
}





