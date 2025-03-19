import { Routes } from '@angular/router';
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {FooterComponent} from "./footer/footer.component";
import {LayoutComponent} from "./layout/layout.component";
import {HomeComponent} from "./home/home.component";
import {HerosComponent} from "./heros/heros.component";
import {HebergementComponent} from "./hebergement/hebergement.component";
import {SidebarComponent} from "./dashboard-hebergeur/sidebar/sidebar.component";
import {CrudUserComponent} from "./Crud/crud-user/crud-user.component";
import {CrudTypeAnimalComponent} from "./Crud/crud-type-animal/crud-type-animal.component";
import {CrudAnimalComponent} from "./Crud/crud-animal/crud-animal.component";
import {CrudHebergementComponent} from "./Crud/crud-hebergement/crud-hebergement.component";
import {FormHebergementComponent} from "./form-hebergement/form-hebergement.component";
import {DashboardAdminComponent} from "./dashboard-admin/dashboard-admin.component";
import {DetailHebergementComponent} from "./detail-hebergement/detail-hebergement.component";
import {GestionReservationComponent} from "./gestion-reservation/gestion-reservation.component";

export const routes: Routes = [
  { path: 'footer', component: FooterComponent },
  { path: 'nav', component: NavbarComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'heros', component: HerosComponent },
  { path: 'crud-animal', component: CrudAnimalComponent },
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    children: [
      { path: 'crud-user', component: CrudUserComponent },
      { path: 'crud-typeanimal', component: CrudTypeAnimalComponent },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'heb', component: HebergementComponent },
      { path: 'detail-hebergement/:id', component: DetailHebergementComponent },
    ],
  },
  {
    path: 'dashboard-hebergeur',
    component: SidebarComponent,
    children: [
      { path: 'crud-herbergement', component: CrudHebergementComponent },
      { path: 'form-herbergement', component: FormHebergementComponent },
      { path: 'gestion-reservation', component: GestionReservationComponent },

    ],
  },
];
