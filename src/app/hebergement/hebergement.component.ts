import { Component, OnInit } from '@angular/core';
import { HerosComponent } from "../heros/heros.component";
import { AuthService } from "../services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { UtilisateurService } from "../services/utilisateur.service";
import { CommonModule } from "@angular/common";
import { HebergeurService } from "../services/hebergeur.service";
import { HebergeurResponse } from "../interface/hebergeur-response";
import Swal from "sweetalert2";

@Component({
  selector: 'app-hebergement',
  standalone: true,
  imports: [
    HerosComponent,
    RouterLink,
    CommonModule
  ],
  templateUrl: './hebergement.component.html',
  styleUrl: './hebergement.component.css'
})
export class HebergementComponent implements OnInit {
  userRole: string | null = null; // Pour stocker le rôle de l'utilisateur
  hebergements: HebergeurResponse[] = []; // Déclarez la variable pour stocker les hébergements

  constructor(
    private authService: AuthService,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private hebergeurService: HebergeurService,
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadHebergements();
  }

  loadHebergements(): void {
    this.hebergeurService.getAllHebergements().subscribe(
      (data: HebergeurResponse[]) => {
        // Filtrer les hébergements pour ne garder que ceux qui ont les propriétés requises
        this.hebergements = data.filter(hebergement =>
          hebergement.tarifParJour !== undefined &&
          hebergement.descriptionService !== undefined &&
          hebergement.typeAnimauxAcceptesIds !== undefined &&
          hebergement.typeAnimauxAcceptesNoms !== undefined &&
          hebergement.photosHebergement !== undefined
        );
      },
      (error) => {
        console.error('Erreur lors de la récupération des hébergements', error);
      }
    );
  }

  checkUserRole(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.utilisateurService.getUserRole(userId).subscribe(
        (role: string) => {
          this.userRole = role; // Stocker le rôle de l'utilisateur
        },
        (error) => {
          console.error('Erreur lors de la récupération du rôle', error);
          alert('Une erreur est survenue lors de la récupération du rôle. Veuillez réessayer.');
        }
      );
    }
  }

  devenirHebergeur(): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment devenir hébergeur ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, devenir hébergeur !'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.authService.isLoggedIn()) {
          console.error('Aucun utilisateur connecté trouvé');
          this.router.navigate(['/login']);
          return;
        }

        const userId = localStorage.getItem('userId');

        if (!userId) {
          console.error('Aucun utilisateur connecté trouvé');
          this.router.navigate(['/login']);
          return;
        }

        const newRole = 'HEBERGEUR';

        this.utilisateurService.updateUserRole(userId, newRole).subscribe(
          (response) => {
            console.log('Rôle mis à jour avec succès', response);
            this.userRole = newRole;
            Swal.fire('Succès!', 'Vous êtes maintenant hébergeur', 'success');
            this.router.navigate(['/dashboard-hebergeur']);
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du rôle', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du rôle. Veuillez réessayer.', 'error');
          }
        );
      }
    });
  }
}
