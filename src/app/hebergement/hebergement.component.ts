import { Component } from '@angular/core';
import {HerosComponent} from "../heros/heros.component";

@Component({
  selector: 'app-hebergement',
  standalone: true,
  imports: [
    HerosComponent
  ],
  templateUrl: './hebergement.component.html',
  styleUrl: './hebergement.component.css'
})
export class HebergementComponent {

}
