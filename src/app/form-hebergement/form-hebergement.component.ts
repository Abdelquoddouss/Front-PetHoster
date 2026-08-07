import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HebergeurService } from '../services/hebergeur.service';
import { HebergeurResponse } from '../interface/hebergeur-response';
import Swal from 'sweetalert2';
import { NgForOf, NgIf } from "@angular/common";
import { TypaAnimalService } from '../services/typa-animal.service';
import { TypeAnimal } from '../interface/type-animal';

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
  selectedFiles: (File | null)[] = [null, null, null];
  photoPreviews: (string | null)[] = [null, null, null];
  isSubmitting = false;

  // Dynamic animal types fetched from the backend
  typeAnimauxOptions: TypeAnimal[] = [];

  selectedAnimalTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private hebergeurService: HebergeurService,
    private typeAnimalService: TypaAnimalService,
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
          text: 'Impossible de charger les types d\'animaux. Veuillez rÃ©essayer plus tard.',
          icon: 'error',
          confirmButtonColor: '#173f35'
        });
      }
    });
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[index] = file;
      const reader = new FileReader();
      reader.onload = () => this.photoPreviews[index] = reader.result as string;
      reader.readAsDataURL(file);
    } else {
      this.selectedFiles[index] = null;
      this.photoPreviews[index] = null;
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
      Swal.fire('Erreur de validation', 'Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const filesSelected = this.selectedFiles.filter(file => file !== null).length;
    if (filesSelected !== 3) {
      Swal.fire('Erreur de validation', 'Veuillez tÃ©lÃ©charger exactement 3 photos de votre hÃ©bergement.', 'error');
      return;
    }

    if (this.selectedAnimalTypes.length === 0) {
      Swal.fire('Erreur de validation', 'Veuillez sÃ©lectionner au moins un type d\'animal acceptÃ©.', 'error');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('tarifParJour', this.hebergementForm.value.tarifParJour);
    formData.append('descriptionService', this.hebergementForm.value.descriptionService);
    formData.append('typeAnimauxAcceptesIds', JSON.stringify(this.selectedAnimalTypes));
    this.selectedFiles.forEach((file, index) => {
      if (file) {
        formData.append('photosHebergement', file, file.name);
      }
    });

    this.hebergeurService.createHebergeur(formData).subscribe({
      next: (response: HebergeurResponse) => {
        console.log('HÃ©bergeur crÃ©Ã© avec succÃ¨s:', response);
        Swal.fire({
          title: 'SuccÃ¨s!',
          text: 'Votre service d\'hÃ©bergement a Ã©tÃ© enregistrÃ© avec succÃ¨s',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard-hebergeur/crud-herbergement']);
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la crÃ©ation de l\'hÃ©bergeur:', error);
        Swal.fire('Erreur', 'Ã‰chec de l\'enregistrement de votre hÃ©bergement: ' + (error.error?.message || error.message || 'Erreur inconnue'), 'error');
        this.isSubmitting = false;
      },
    });
  }
}

