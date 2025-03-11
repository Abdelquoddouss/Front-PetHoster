import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Utilisateur} from "../../interface/utilisateur";
import {UtilisateurService} from "../../services/utilisateur.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-crud-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crud-user.component.html',
  styleUrl: './crud-user.component.css'
})
export class CrudUserComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router // Injectez Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']); // Redirigez vers la page de connexion si l'utilisateur n'est pas authentifié
    } else {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.utilisateurService.getAllUsers().subscribe({
      next: (data) => this.utilisateurs = data,
      error: (err) => {
        console.error('Erreur de chargement:', err);
        if (err.status === 403) {
          alert('Accès refusé. Veuillez vous reconnecter.');
          this.router.navigate(['/login']); // Redirigez vers la page de connexion en cas d'erreur 403
        }
      }
    });
  }

  deleteUser(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.utilisateurService.deleteUser(id).subscribe({
        next: () => {
          this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
          alert('Utilisateur supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur de suppression:', err);
          if (err.status === 403) {
            alert('Accès refusé. Veuillez vous reconnecter.');
            this.router.navigate(['/login']); // Redirigez vers la page de connexion en cas d'erreur 403
          }
        }
      });
    }
  }
}
