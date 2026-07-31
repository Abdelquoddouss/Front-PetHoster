import { Component, OnInit } from '@angular/core';
import { HebergeurResponse } from "../interface/hebergeur-response";
import { ActivatedRoute, Router } from "@angular/router";
import { HebergeurService } from "../services/hebergeur.service";
import { ReservationService } from '../services/reservation.service';
import { CommonModule } from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-detail-hebergement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-hebergement.component.html',
  styleUrl: './detail-hebergement.component.css'
})
export class DetailHebergementComponent implements OnInit {
  hebergement: HebergeurResponse | null = null;
  currentMainImageIndex: number = 0;
  isReservationModalOpen: boolean = false;
  reservationRequest: any = {
    dateDebut: '',
    dateFin: '',
    nombreAnimaux: 1,
    hebergeurId: '',
    proprietaireId: ''
  };
  reservationSubmitted: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private hebergeurService: HebergeurService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const hebergementId = this.route.snapshot.paramMap.get('id');
    if (hebergementId) {
      this.loadHebergementDetails(hebergementId);
    }
  }

  loadHebergementDetails(hebergementId: string): void {
    this.hebergeurService.getHebergeurById(hebergementId).subscribe({
      next: (data: HebergeurResponse) => {
        this.hebergement = data;
        this.reservationRequest.hebergeurId = data.id;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des détails de l\'hébergement', error);
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  openReservationModal(): void {
    this.isReservationModalOpen = true;
  }

  closeReservationModal(): void {
    this.isReservationModalOpen = false;
  }

  submitReservation(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const tarifParJour = this.hebergement?.tarifParJour || 0;
    const dateDebut = new Date(this.reservationRequest.dateDebut);
    const dateFin = new Date(this.reservationRequest.dateFin);
    const nombreJours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
    const montantTotal = tarifParJour * nombreJours;

    this.reservationRequest.montantTotal = montantTotal;
    this.reservationRequest.proprietaireId = localStorage.getItem('userId');

    this.reservationService.createReservation(this.reservationRequest).subscribe({
      next: (response) => {
        console.log('Réservation créée avec succès', response);
        this.closeReservationModal();
        Swal.fire('Succès!', 'Votre réservation a été soumise avec succès. Veuillez attendre l\'acceptation de l\'hébergeur.', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la création de la réservation', error);
        if (error.status === 400) {
          Swal.fire('Erreur', 'Les données de réservation sont invalides. Veuillez vérifier les informations saisies.', 'error');
        } else if (error.status === 500) {
          Swal.fire('Erreur', 'Une erreur interne est survenue. Veuillez réessayer plus tard.', 'error');
        } else {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la création de la réservation. Veuillez réessayer.', 'error');
        }
      }
    });
  }

  changeMainImage(index: number): void {
    if (this.hebergement && this.hebergement.photosHebergement.length > index) {
      const tempMainImage = this.hebergement.photosHebergement[0];
      this.hebergement.photosHebergement[0] = this.hebergement.photosHebergement[index];
      this.hebergement.photosHebergement[index] = tempMainImage;
      this.currentMainImageIndex = index;
    }
  }
}
