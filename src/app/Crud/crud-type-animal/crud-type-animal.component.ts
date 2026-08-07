import { Component, HostListener, OnInit } from '@angular/core';
import { TypeAnimal } from '../../interface/type-animal';
import { TypaAnimalService } from '../../services/typa-animal.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({selector:'app-crud-type-animal',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./crud-type-animal.component.html',styleUrl:'./crud-type-animal.component.css'})
export class CrudTypeAnimalComponent implements OnInit {
 typeAnimals:TypeAnimal[]=[];showModal=false;newTypeAnimal:TypeAnimal={id:'',animalType:''};loading=true;loadError=false;submitting=false;
 constructor(private service:TypaAnimalService,private router:Router){}
 ngOnInit(){this.loadTypeAnimals()}
 @HostListener('document:keydown.escape') closeOnEscape(){if(this.showModal&&!this.submitting)this.closeModal()}
 loadTypeAnimals(){this.loading=true;this.loadError=false;this.service.getAllTypeAnimals().subscribe({next:data=>{this.typeAnimals=data;this.loading=false},error:err=>{this.loading=false;this.loadError=true;if(err.status===403)this.router.navigate(['/login'])}})}
 openModal(){this.showModal=true;setTimeout(()=>document.getElementById('animalType')?.focus())}
 closeModal(){this.showModal=false;this.newTypeAnimal={id:'',animalType:''}}
 deleteTypeAnimal(item:TypeAnimal){Swal.fire({title:'Supprimer cette catégorie ?',html:`La catégorie <b>${item.animalType}</b> ne sera plus proposée.`,icon:'warning',showCancelButton:true,confirmButtonColor:'#e77c58',cancelButtonColor:'#173f35',confirmButtonText:'Oui, supprimer',cancelButtonText:'Annuler',reverseButtons:true}).then(r=>{if(r.isConfirmed)this.service.deleteTypeAnimal(item.id).subscribe({next:()=>{this.typeAnimals=this.typeAnimals.filter(t=>t.id!==item.id);Swal.fire({title:'Catégorie supprimée',icon:'success',confirmButtonColor:'#173f35'})},error:()=>Swal.fire({title:'Suppression impossible',text:'Cette catégorie est peut-être encore utilisée.',icon:'error',confirmButtonColor:'#173f35'})})})}
 onSubmit(){const name=this.newTypeAnimal.animalType.trim();if(!name||this.submitting)return;this.newTypeAnimal.animalType=name;this.submitting=true;this.service.createTypeAnimal(this.newTypeAnimal).subscribe({next:data=>{this.typeAnimals.push(data);this.submitting=false;this.closeModal();Swal.fire({title:'Catégorie ajoutée',text:`${data.animalType} est maintenant disponible.`,icon:'success',confirmButtonColor:'#173f35'})},error:()=>{this.submitting=false;Swal.fire({title:'Ajout impossible',text:'Vérifiez que cette catégorie n’existe pas déjà.',icon:'error',confirmButtonColor:'#173f35'})}})}
}
