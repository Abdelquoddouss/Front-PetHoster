import { Routes } from '@angular/router';
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {NavbarComponent} from "./layout/navbar/navbar.component";

export const routes: Routes = [

  { path: 'register', component: RegisterComponent },

  { path: 'login', component: LoginComponent },
  { path: 'nav', component: NavbarComponent }


];
