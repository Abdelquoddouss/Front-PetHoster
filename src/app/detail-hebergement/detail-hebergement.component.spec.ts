import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHebergementComponent } from './detail-hebergement.component';

describe('DetailHebergementComponent', () => {
  let component: DetailHebergementComponent;
  let fixture: ComponentFixture<DetailHebergementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailHebergementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailHebergementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
