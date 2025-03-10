import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHebergementComponent } from './form-hebergement.component';

describe('FormHebergementComponent', () => {
  let component: FormHebergementComponent;
  let fixture: ComponentFixture<FormHebergementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHebergementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormHebergementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
