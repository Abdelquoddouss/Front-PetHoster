import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utilisateur } from '../../interface/utilisateur';
import { UtilisateurService } from '../../services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({selector:'app-crud-user',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./crud-user.component.html',styleUrl:'./crud-user.component.css'})
export class CrudUserComponent implements OnInit {
 utilisateurs:Utilisateur[]=[]; searchTerm=''; loading=true; loadError=false;
 constructor(private utilisateurService:UtilisateurService,private router:Router){}
 get filteredUsers():Utilisateur[]{const q=this.searchTerm.trim().toLowerCase();return q?this.utilisateurs.filter(u=>`${u.nom} ${u.prenom} ${u.email} ${u.role}`.toLowerCase().includes(q)):this.utilisateurs}
 ngOnInit(){if(!localStorage.getItem('authToken'))this.router.navigate(['/login']);else this.loadUsers()}
 loadUsers(){this.loading=true;this.loadError=false;this.utilisateurService.getAllUsers().subscribe({next:data=>{this.utilisateurs=data;this.loading=false},error:err=>{this.loading=false;this.loadError=true;if(err.status===403)this.router.navigate(['/login'])}})}
 initials(user:Utilisateur){return `${user.prenom?.[0]||''}${user.nom?.[0]||''}`.toUpperCase()}
 roleLabel(role:string){return role?.replace('ROLE_','').replace('_',' ')||'Utilisateur'}
 deleteUser(user:Utilisateur){Swal.fire({title:'Supprimer cet utilisateur ?',html:`Le compte de <b>${user.prenom} ${user.nom}</b> sera définitivement supprimé.`,icon:'warning',showCancelButton:true,confirmButtonColor:'#e77c58',cancelButtonColor:'#173f35',confirmButtonText:'Oui, supprimer',cancelButtonText:'Annuler',reverseButtons:true}).then(result=>{if(result.isConfirmed)this.utilisateurService.deleteUser(user.id).subscribe({next:()=>{this.utilisateurs=this.utilisateurs.filter(u=>u.id!==user.id);Swal.fire({title:'Utilisateur supprimé',text:'Le compte a bien été retiré.',icon:'success',confirmButtonColor:'#173f35'})},error:()=>Swal.fire({title:'Suppression impossible',text:'Une erreur est survenue. Veuillez réessayer.',icon:'error',confirmButtonColor:'#173f35'})})})}
}
