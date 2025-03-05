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
import {CrudTypeAnimalComponent} from "./crud-type-animal/crud-type-animal.component";
import {CrudAnimalComponent} from "./crud-animal/crud-animal.component";
import {CrudHebergementComponent} from "./crud-hebergement/crud-hebergement.component";

export const routes: Routes = [


  { path: 'footer', component: FooterComponent },
  { path: 'nav', component: NavbarComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'login', component: LoginComponent },

  { path: 'heros', component: HerosComponent },

  { path: 'crud-user', component: CrudUserComponent },


  { path: '',
    component: LayoutComponent,

  children: [
    { path: 'home', component: HomeComponent },
    { path: 'heb', component: HebergementComponent },
  ]},

  {
    path: 'dashboard-hebergeur',
    component: SidebarComponent,
    children: [
      { path: 'crud-typeanimal', component: CrudTypeAnimalComponent },
      { path: 'crud-animal', component: CrudAnimalComponent },
      { path: 'crud-herbergement', component: CrudHebergementComponent },



    ]
  },

];
