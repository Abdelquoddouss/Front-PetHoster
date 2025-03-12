import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HebergeurService } from '../services/hebergeur.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TypeAnimal } from '../interface/type-animal';
import { TypaAnimalService } from '../services/typa-animal.service';

@Component({
  selector: 'app-form-hebergement',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './form-hebergement.component.html',
  styleUrls: ['./form-hebergement.component.css']
})
export class FormHebergementComponent {
  hebergeurForm: FormGroup;
  errorMessage: string | null = null;
  typesAnimaux: TypeAnimal[] = [];
  selectedFiles: File[] = [];
  imagePreviewUrls: string[] = []; // Pour prévisualiser les images

  constructor(
    private fb: FormBuilder,
    private hebergeurService: HebergeurService,
    private typeAnimalService: TypaAnimalService,
    private router: Router
  ) {
    this.hebergeurForm = this.fb.group({
      tarifParJour: ['', [Validators.required, Validators.min(0)]],
      descriptionService: ['', [Validators.required, Validators.maxLength(500)]],
      typeAnimauxAcceptesIds: [[], Validators.required],
      photosHebergement: [[]]
    });
  }

  ngOnInit(): void {
    this.loadTypesAnimaux();
    this.testAuthentication();
  }

  loadTypesAnimaux(): void {
    this.typeAnimalService.getAllTypeAnimals().subscribe({
      next: (data) => {
        this.typesAnimaux = data;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des types d\'animaux. Veuillez réessayer plus tard.';
        console.error(err);
      }
    });
  }

  testAuthentication(): void {
    this.hebergeurService.getAllHebergeurs().subscribe({
      next: (data) => {
        console.log('Appel réussi, autorisations OK:', data);
      },
      error: (err) => {
        console.error('Erreur d\'autorisation:', err);
      }
    });
  }

  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (!files.length) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);

    if (validFiles.length !== files.length) {
      this.errorMessage = 'Certaines images sont trop volumineuses. La taille maximale est de 2MB.';
      return;
    }

    this.selectedFiles = validFiles;
    this.imagePreviewUrls = [];

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    this.processAndCompressImages(validFiles);
  }

  // Méthode pour compresser et convertir les images
  processAndCompressImages(files: File[]): void {
    const base64Images: string[] = [];
    let processed = 0;

    files.forEach((file) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;

        img.onload = () => {
          // Créer un canvas pour la compression
          const canvas = document.createElement('canvas');

          // Définir les dimensions maximales
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 300;

          // Calculer les dimensions en gardant le ratio
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          // Redimensionner l'image
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Obtenir l'image compressée en base64
          const compressedImage = canvas.toDataURL('image/jpeg', 0.5);

          base64Images.push(compressedImage);
          processed++;

          if (processed === files.length) {
            this.hebergeurForm.patchValue({ photosHebergement: base64Images });
            console.log(`${processed} images compressées et converties`);
          }
        };
      };

      reader.readAsDataURL(file);
    });
  }

  onSubmit(): void {
    if (this.hebergeurForm.valid) {
      const hebergeurData = this.hebergeurForm.value;
      console.log('Formulaire soumis avec les données:', {
        ...hebergeurData,
        photosHebergement: hebergeurData.photosHebergement ?
          `${hebergeurData.photosHebergement.length} photos` : 'aucune photo'
      });

      this.hebergeurService.createHebergeur(hebergeurData).subscribe({
        next: (response) => {
          console.log('Hébergement créé avec succès:', response);
          this.router.navigate(['/dashboard-hebergeur/crud-hebergement']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création de l\'hébergement. Veuillez réessayer plus tard.';
          console.error('Erreur détaillée:', err);
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      console.log('Formulaire invalide:', this.hebergeurForm.errors);
    }
  }
}
