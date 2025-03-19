import {Component, OnInit} from '@angular/core';
import {ReservationService} from "../services/reservation.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {CommonModule, NgClass} from "@angular/common";

@Component({
  selector: 'app-gestion-reservation',
  standalone: true,
  imports: [
    NgClass ,CommonModule,
  ],
  templateUrl: './gestion-reservation.component.html',
  styleUrl: './gestion-reservation.component.css'
})
export class GestionReservationComponent implements OnInit {
  reservations: any[] = []; // Liste des réservations
  hebergeurId: string | null = null; // ID de l'hébergeur connecté

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hebergeurId = localStorage.getItem('userId');
    console.log('Hebergeur ID:', this.hebergeurId); // Ajoutez ce log pour vérifier l'ID
    if (this.hebergeurId) {
      this.loadReservations();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadReservations(): void {
    if (this.hebergeurId) {
      this.reservationService.getReservationsByHebergeur(this.hebergeurId).subscribe({
        next: (data) => {
          console.log('Réservations reçues:', data);
          this.reservations = data;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des réservations', error);
          console.log('Détails de l\'erreur:', error.error); // Affichez le contenu de l'erreur
        }
      });
    }
  }
  confirmerReservation(reservationId: string): void {
    const confirmationRequest = { confirmer: true }; // Demande de confirmation
    this.reservationService.confirmerReservation(reservationId, confirmationRequest).subscribe({
      next: (response) => {
        console.log('Réservation confirmée avec succès', response);
        this.loadReservations(); // Recharger les réservations après confirmation
      },
      error: (error) => {
        console.error('Erreur lors de la confirmation de la réservation', error);
      }
    });
  }

  annulerReservation(reservationId: string): void {
    this.reservationService.annulerReservation(reservationId).subscribe({
      next: (response) => {
        console.log('Réservation annulée avec succès', response);
        this.loadReservations(); // Recharger les réservations après annulation
      },
      error: (error) => {
        console.error('Erreur lors de l\'annulation de la réservation', error);
      }
    });
  }
}
