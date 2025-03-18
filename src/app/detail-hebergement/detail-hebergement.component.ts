import {Component, OnInit} from '@angular/core';
import {HebergeurResponse} from "../interface/hebergeur-response";
import {ActivatedRoute, Router} from "@angular/router";
import {HebergeurService} from "../services/hebergeur.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-detail-hebergement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-hebergement.component.html',
  styleUrl: './detail-hebergement.component.css'
})
export class DetailHebergementComponent implements OnInit {
  hebergement: HebergeurResponse | null = null;
  currentMainImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private hebergeurService: HebergeurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'hébergement depuis l'URL
    const hebergementId = this.route.snapshot.paramMap.get('id');
    if (hebergementId) {
      this.loadHebergementDetails(hebergementId);
    }
  }

  loadHebergementDetails(hebergementId: string): void {
    this.hebergeurService.getHebergeurById(hebergementId).subscribe({
      next: (data: HebergeurResponse) => {
        this.hebergement = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des détails de l\'hébergement', error);
        if (error.status === 403) {
          this.router.navigate(['/login']); // Rediriger vers la page de connexion
        }
      }
    });
  }

  // Fonction pour changer l'image principale
  changeMainImage(index: number): void {
    if (this.hebergement && this.hebergement.photosHebergement.length > index) {
      // Sauvegarde temporaire de l'image principale actuelle
      const tempMainImage = this.hebergement.photosHebergement[0];

      // Remplace l'image principale par celle cliquée
      this.hebergement.photosHebergement[0] = this.hebergement.photosHebergement[index];

      // Remplace l'image cliquée par l'ancienne image principale
      this.hebergement.photosHebergement[index] = tempMainImage;

      // Mise à jour de l'index courant
      this.currentMainImageIndex = index;
    }
  }
}
