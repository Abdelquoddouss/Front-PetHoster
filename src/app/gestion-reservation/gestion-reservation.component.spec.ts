import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReservationComponent } from './gestion-reservation.component';

describe('GestionReservationComponent', () => {
  let component: GestionReservationComponent;
  let fixture: ComponentFixture<GestionReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
