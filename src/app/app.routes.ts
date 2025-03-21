import { Routes } from '@angular/router';
import { RegisterComponent } from "./Auth/register/register.component";
import { LoginComponent } from "./Auth/login/login.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { LayoutComponent } from "./layout/layout.component";
import { HomeComponent } from "./home/home.component";
import { HerosComponent } from "./heros/heros.component";
import { HebergementComponent } from "./hebergement/hebergement.component";
import { SidebarComponent } from "./dashboard-hebergeur/sidebar/sidebar.component";
import { CrudUserComponent } from "./Crud/crud-user/crud-user.component";
import { CrudTypeAnimalComponent } from "./Crud/crud-type-animal/crud-type-animal.component";
import { CrudHebergementComponent } from "./Crud/crud-hebergement/crud-hebergement.component";
import { FormHebergementComponent } from "./form-hebergement/form-hebergement.component";
import { DashboardAdminComponent } from "./dashboard-admin/dashboard-admin.component";
import { DetailHebergementComponent } from "./detail-hebergement/detail-hebergement.component";
import { GestionReservationComponent } from "./gestion-reservation/gestion-reservation.component";
import { GestionProprietaireComponent } from "./gestion-proprietaire/gestion-proprietaire.component";
import { AdminGuard } from './guards/admin.guard';
import { HebergeurGuard } from './guards/hebergeur.guard';
import {AuthGuard} from "./guards/auth-guard.guard";

export const routes: Routes = [
  { path: 'footer', component: FooterComponent },
  { path: 'nav', component: NavbarComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    canActivate: [AuthGuard, AdminGuard], // Appliquer les guards
    children: [
      { path: 'crud-user', component: CrudUserComponent },
      { path: 'crud-typeanimal', component: CrudTypeAnimalComponent },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Appliquer le guard pour vérifier la connexion
    children: [

      { path: 'home', component: HomeComponent },
      { path: 'heb', component: HebergementComponent },
      { path: 'detail-hebergement/:id', component: DetailHebergementComponent },
      { path: 'reservation-prprietaire', component: GestionProprietaireComponent },
    ],
  },
  {
    path: 'dashboard-hebergeur',
    component: SidebarComponent,
    canActivate: [AuthGuard, HebergeurGuard], // Appliquer les guards
    children: [
      { path: 'crud-herbergement', component: CrudHebergementComponent },
      { path: 'form-herbergement', component: FormHebergementComponent },
      { path: 'gestion-reservation', component: GestionReservationComponent },
    ],
  },
];
