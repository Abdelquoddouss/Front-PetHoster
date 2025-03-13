import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HebergeurService } from '../services/hebergeur.service';
import { HebergeurResponse } from '../interface/hebergeur-response';
import Swal from 'sweetalert2';
import { NgForOf, NgIf } from "@angular/common";
import { TypaAnimalService } from '../services/typa-animal.service'; // Import the service
import { TypeAnimal } from '../interface/type-animal'; // Import the TypeAnimal interface

@Component({
  selector: 'app-form-hebergement',
  templateUrl: './form-hebergement.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./form-hebergement.component.css']
})
export class FormHebergementComponent implements OnInit {
  hebergementForm: FormGroup = new FormGroup({});
  selectedFiles: File[] = []; // Array to hold up to 3 files
  isSubmitting = false;

  // Dynamic animal types fetched from the backend
  typeAnimauxOptions: TypeAnimal[] = [];

  selectedAnimalTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private hebergeurService: HebergeurService,
    private typeAnimalService: TypaAnimalService, // Inject the service
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Fetch animal types from the backend
    this.loadAnimalTypes();
  }

  initForm(): void {
    this.hebergementForm = this.fb.group({
      tarifParJour: ['', [Validators.required, Validators.min(0)]],
      descriptionService: ['', Validators.required]
    });
  }

  // Fetch animal types from the backend
  loadAnimalTypes(): void {
    this.typeAnimalService.getAllTypeAnimals().subscribe({
      next: (data: TypeAnimal[]) => {
        this.typeAnimauxOptions = data; // Populate the array with data from the backend
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types d\'animaux:', err);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les types d\'animaux. Veuillez réessayer plus tard.',
          icon: 'error',
          confirmButtonColor: '#c1121f'
        });
      }
    });
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[index] = file;
    }
  }

  onAnimalTypeChange(event: any): void {
    const animalId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      if (!this.selectedAnimalTypes.includes(animalId)) {
        this.selectedAnimalTypes.push(animalId);
      }
    } else {
      this.selectedAnimalTypes = this.selectedAnimalTypes.filter(id => id !== animalId);
    }
  }

  onSubmit(): void {
    if (this.hebergementForm.invalid) {
      Swal.fire({
        title: 'Erreur de validation',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        confirmButtonColor: '#c1121f'
      });
      return;
    }

    // Check if at least one file is selected
    if (!this.selectedFiles.some(file => file !== null && file !== undefined)) {
      Swal.fire({
        title: 'Erreur de validation',
        text: 'Veuillez télécharger au moins une photo de votre hébergement.',
        icon: 'error',
        confirmButtonColor: '#c1121f'
      });
      return;
    }

    // Check if at least one animal type is selected
    if (this.selectedAnimalTypes.length === 0) {
      Swal.fire({
        title: 'Erreur de validation',
        text: 'Veuillez sélectionner au moins un type d\'animal accepté.',
        icon: 'error',
        confirmButtonColor: '#c1121f'
      });
      return;
    }

    this.isSubmitting = true;

    // Create FormData
    const formData = new FormData();

    // Add form values
    formData.append('tarifParJour', this.hebergementForm.value.tarifParJour);
    formData.append('descriptionService', this.hebergementForm.value.descriptionService);

    // Add animal types - send as a string representing JSON array
    formData.append('typeAnimauxAcceptesIds', JSON.stringify(this.selectedAnimalTypes));

    // Add photos
    this.selectedFiles.forEach((file, index) => {
      if (file) {
        formData.append('photosHebergement', file, file.name);
      }
    });

    // Submit the form
    this.hebergeurService.createHebergeur(formData).subscribe({
      next: (response: HebergeurResponse) => {
        console.log('Hébergeur créé avec succès:', response);

        Swal.fire({
          title: 'Succès!',
          text: 'Votre service d\'hébergement a été enregistré avec succès',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        // Redirect after success
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la création de l\'hébergeur:', error);

        // More detailed error logging
        if (error.error && error.error.message) {
          console.error('Error message from server:', error.error.message);
        }

        Swal.fire({
          title: 'Erreur',
          text: 'Échec de l\'enregistrement de votre hébergement: ' + (error.error?.message || error.message || 'Erreur inconnue'),
          icon: 'error',
          confirmButtonColor: '#c1121f'
        });

        this.isSubmitting = false;
      },
    });
  }
}
