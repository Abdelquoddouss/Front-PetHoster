import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HerosComponent } from './heros.component';

describe('HerosComponent', () => {
  let component: HerosComponent;
  let fixture: ComponentFixture<HerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HerosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
