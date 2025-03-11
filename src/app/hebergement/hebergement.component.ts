import { Component } from '@angular/core';
import {HerosComponent} from "../heros/heros.component";
import {AuthService} from "../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {UtilisateurService} from "../services/utilisateur.service";
import {CommonModule} from "@angular/common";

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
export class HebergementComponent {
  userRole: string | null = null; // Pour stocker le rôle de l'utilisateur

  constructor(
    private authService: AuthService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier le rôle de l'utilisateur au chargement du composant
    this.checkUserRole();
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
    const confirmation = confirm("Êtes-vous sûr de vouloir devenir hébergeur ? Cette action est irréversible.");

    // Si l'utilisateur clique sur "Annuler", ne rien faire
    if (!confirmation) {
      return;
    }

    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      console.error('Aucun utilisateur connecté trouvé');
      this.router.navigate(['/login']);
      return;
    }

    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('Aucun utilisateur connecté trouvé');
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
      return;
    }

    const newRole = 'HEBERGEUR'; // Nouveau rôle

    // Appeler la méthode updateUserRole du service UtilisateurService
    this.utilisateurService.updateUserRole(userId, newRole).subscribe(
      (response) => {
        console.log('Rôle mis à jour avec succès', response);
        this.userRole = newRole; // Mettre à jour le rôle localement
        // Rediriger vers le tableau de bord des hébergeurs
        this.router.navigate(['/dashboard-hebergeur']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du rôle', error);
        // Afficher un message d'erreur à l'utilisateur
        alert('Une erreur est survenue lors de la mise à jour du rôle. Veuillez réessayer.');
      }
    );
  }
}
