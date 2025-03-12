import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {HebergeurResponse} from "../../interface/hebergeur-response";
import {HebergeurService} from "../../services/hebergeur.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-crud-hebergement',
  standalone: true,
  imports: [
   CommonModule
  ],
  templateUrl: './crud-hebergement.component.html',
  styleUrl: './crud-hebergement.component.css'
})
export class CrudHebergementComponent implements OnInit {
  hebergeurs: HebergeurResponse[] = [];
  errorMessage: string | null = null;

  constructor(private hebergeurService: HebergeurService) {}

  ngOnInit(): void {
    this.loadHebergeurs();
  }

  loadHebergeurs(): void {
    this.hebergeurService.getAllHebergeurs().subscribe({
      next: (data) => {
        this.hebergeurs = data;
        this.errorMessage = null;
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = 'Accès refusé. Veuillez vous connecter ou vérifier vos permissions.';
        } else {
          this.errorMessage = 'Erreur lors du chargement des hébergements. Veuillez réessayer plus tard.';
        }
        console.error(err);
      }
    });
  }
}
