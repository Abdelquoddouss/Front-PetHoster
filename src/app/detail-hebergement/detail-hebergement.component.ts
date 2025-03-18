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
}
