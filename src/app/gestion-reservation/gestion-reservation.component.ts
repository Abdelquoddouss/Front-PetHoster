import {Component, OnInit} from '@angular/core';
import {ReservationService} from "../services/reservation.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {CommonModule, NgClass} from "@angular/common";
import Swal from "sweetalert2";

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
  userRole: string = '';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hebergeurId = localStorage.getItem('userId');
    this.userRole = this.authService.getCurrentUserRole(); // Récupérer le rôle de l'utilisateur
    console.log('Hebergeur ID:', this.hebergeurId);
    console.log('User Role:', this.userRole); // Ajoutez ce log pour vérifier le rôle

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
    const confirmationRequest = { confirmer: true };
    this.reservationService.confirmerReservation(reservationId, confirmationRequest).subscribe({
      next: (response) => {
        console.log('Réservation confirmée avec succès', response);
        this.loadReservations();
        Swal.fire('Succès!', 'Réservation confirmée avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la confirmation de la réservation', error);
        Swal.fire('Erreur', 'Erreur lors de la confirmation de la réservation', 'error');
      }
    });
  }

  annulerReservation(reservationId: string): void {
    const userId = this.authService.getCurrentUserId();
    const userRole = this.authService.getCurrentUserRole();

    if (!userId || !userRole) {
      console.error('ID utilisateur ou rôle non trouvé.');
      return;
    }

    this.reservationService.annulerReservation(reservationId, userId, userRole).subscribe({
      next: () => {
        this.loadReservations();
        Swal.fire('Succès!', 'Réservation annulée avec succès', 'success');
      },
      error: (err) => {
        console.error('Erreur lors de l\'annulation de la réservation', err);
        Swal.fire('Erreur', 'Erreur lors de l\'annulation de la réservation', 'error');
      }
    });
  }
}
