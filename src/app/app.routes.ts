import { Routes } from '@angular/router';
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {FooterComponent} from "./footer/footer.component";
import {LayoutComponent} from "./layout/layout.component";

export const routes: Routes = [


  { path: 'footer', component: FooterComponent },
  { path: 'nav', component: NavbarComponent },

  { path: '',
    component: LayoutComponent,
  children: [
    { path: 'register', component: RegisterComponent },

    { path: 'login', component: LoginComponent },
  ]}


];
