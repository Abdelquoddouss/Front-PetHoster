export interface HebergeurResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  tarifParJour: number;
  descriptionService: string;
  typeAnimauxAcceptesIds: string[]; // Liste des IDs des types d'animaux acceptés
  photosHebergement: string[]; // Liste des URLs des photos de l'hébergement
}
