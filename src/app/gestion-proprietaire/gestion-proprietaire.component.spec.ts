import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProprietaireComponent } from './gestion-proprietaire.component';

describe('GestionProprietaireComponent', () => {
  let component: GestionProprietaireComponent;
  let fixture: ComponentFixture<GestionProprietaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionProprietaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionProprietaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
