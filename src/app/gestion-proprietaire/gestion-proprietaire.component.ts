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

  constructor(private reservationService: ReservationService, private authService: AuthService) {}

  ngOnInit(): void {
    const proprietaireId = this.authService.getCurrentUserId(); // Assurez-vous que cette méthode existe
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

  confirmerReservation(reservationId: string): void {
    const confirmationRequest = { /* Données de confirmation si nécessaire */ };
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
    this.reservationService.annulerReservation(reservationId).subscribe({
      next: () => {
        this.ngOnInit(); // Recharger les réservations après annulation
      },
      error: (err) => {
        console.error('Erreur lors de l\'annulation de la réservation', err);
      }
    });
  }
}
