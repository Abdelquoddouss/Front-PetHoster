import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { UtilisateurService } from '../services/utilisateur.service';
import { TypaAnimalService } from '../services/typa-animal.service';
@Component({selector:'app-dashboard-admin',standalone:true,imports:[CommonModule,RouterLink,RouterLinkActive,RouterOutlet],templateUrl:'./dashboard-admin.component.html',styleUrl:'./dashboard-admin.component.css'})
export class DashboardAdminComponent implements OnInit,OnDestroy {
 sidebarOpen=false; isOverview=true; userCount:number|null=null; animalTypeCount:number|null=null;
 currentDate=new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date()); private sub?:Subscription;
 constructor(private auth:AuthService,private users:UtilisateurService,private types:TypaAnimalService,private router:Router){}
 ngOnInit(){this.setView(this.router.url);this.sub=this.router.events.pipe(filter(e=>e instanceof NavigationEnd)).subscribe(e=>{this.setView((e as NavigationEnd).urlAfterRedirects);this.sidebarOpen=false});this.users.getAllUsers().subscribe({next:v=>this.userCount=v.length,error:()=>this.userCount=null});this.types.getAllTypeAnimals().subscribe({next:v=>this.animalTypeCount=v.length,error:()=>this.animalTypeCount=null})}
 ngOnDestroy(){this.sub?.unsubscribe()} toggleSidebar(){this.sidebarOpen=!this.sidebarOpen} confirmLogout(){Swal.fire({title:'Se déconnecter ?',text:'Vous devrez vous identifier pour accéder à nouveau au dashboard.',icon:'question',showCancelButton:true,buttonsStyling:false,customClass:{container:'ph-logout-container',popup:'ph-logout-popup',icon:'ph-logout-icon',title:'ph-logout-title',htmlContainer:'ph-logout-text',actions:'ph-logout-actions',confirmButton:'ph-logout-confirm',cancelButton:'ph-logout-cancel'},confirmButtonText:'Oui, me déconnecter',cancelButtonText:'Rester connecté',reverseButtons:true}).then(r=>{if(r.isConfirmed)this.logout()})} logout(){this.auth.logout();this.router.navigate(['/login'])}
 private setView(url:string){this.isOverview=url.split('?')[0].replace(/\/$/,'')==='/dashboard-admin'}
}



