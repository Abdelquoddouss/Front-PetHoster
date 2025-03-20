import {Component, OnInit} from '@angular/core';
import {ReservationService} from "../services/reservation.service";
import {AuthService} from "../services/auth.service";
import {CommonModule, DatePipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-gestion-proprietaire',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    CommonModule
  ],
  templateUrl: './gestion-proprietaire.component.html',
  styleUrl: './gestion-proprietaire.component.css'
})
export class GestionProprietaireComponent implements OnInit {
  reservations: any[] = [];
  userRole: string = ''; // Ajoutez cette propriété

  constructor(private reservationService: ReservationService, private authService: AuthService) {
  }

  ngOnInit(): void {
    const proprietaireId = this.authService.getCurrentUserId(); // Assurez-vous que cette méthode existe
    this.userRole = this.authService.getCurrentUserRole(); // Initialisez userRole

    if (proprietaireId) {
      this.reservationService.getReservationsByProprietaire(proprietaireId).subscribe({
        next: (data) => {
          this.reservations = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des réservations', err);
        }
      });
    }
  }

  // Ajouter dans votre fichier .ts du composant
  getDurationText(dateDebut: string | Date, dateFin: string | Date): string {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    // Calculer la différence en jours
    const differenceMs = fin.getTime() - debut.getTime();
    const differenceJours = Math.ceil(differenceMs / (1000 * 3600 * 24));

    return `${differenceJours} jours`;
  }

  confirmerReservation(reservationId: string): void {
    const confirmationRequest = { /* Données de confirmation si nécessaire */};
    this.reservationService.confirmerReservation(reservationId, confirmationRequest).subscribe({
      next: () => {
        this.ngOnInit(); // Recharger les réservations après confirmation
      },
      error: (err) => {
        console.error('Erreur lors de la confirmation de la réservation', err);
      }
    });
  }

  annulerReservation(reservationId: string): void {
    const userId = this.authService.getCurrentUserId(); // Récupérer l'ID de l'utilisateur
    const userRole = this.authService.getCurrentUserRole(); // Récupérer le rôle de l'utilisateur

    if (!userId || !userRole) {
      console.error('ID utilisateur ou rôle non trouvé.');
      return;
    }

    this.reservationService.annulerReservation(reservationId, userId, userRole).subscribe({
      next: () => {
        this.ngOnInit(); // Recharger les réservations après annulation
      },
      error: (err) => {
        console.error('Erreur lors de l\'annulation de la réservation', err);
      }
    });
  }
}
