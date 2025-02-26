import { Routes } from '@angular/router';
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";

export const routes: Routes = [

  { path: 'register', component: RegisterComponent },

  { path: 'login', component: LoginComponent }


];
