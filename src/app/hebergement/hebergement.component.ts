import { Component } from '@angular/core';
import {HerosComponent} from "../heros/heros.component";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {UtilisateurService} from "../services/utilisateur.service";

@Component({
  selector: 'app-hebergement',
  standalone: true,
  imports: [
    HerosComponent
  ],
  templateUrl: './hebergement.component.html',
  styleUrl: './hebergement.component.css'
})
export class HebergementComponent {

  constructor(private authService: AuthService,private utilisateurService: UtilisateurService, private router: Router) {}

  devenirHebergeur() {
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
      response => {
        console.log('Rôle mis à jour avec succès', response);
        // Rediriger vers le tableau de bord des hébergeurs
        this.router.navigate(['/dashboard-hebergeur']);
      },
      error => {
        console.error('Erreur lors de la mise à jour du rôle', error);
        // Afficher un message d'erreur à l'utilisateur
        alert('Une erreur est survenue lors de la mise à jour du rôle. Veuillez réessayer.');
      }
    );
  }
}
