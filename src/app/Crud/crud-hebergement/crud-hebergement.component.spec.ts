import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudHebergementComponent } from './crud-hebergement.component';

describe('CrudHebergementComponent', () => {
  let component: CrudHebergementComponent;
  let fixture: ComponentFixture<CrudHebergementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudHebergementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudHebergementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
