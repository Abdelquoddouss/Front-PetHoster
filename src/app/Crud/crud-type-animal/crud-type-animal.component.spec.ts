import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTypeAnimalComponent } from './crud-type-animal.component';

describe('CrudTypeAnimalComponent', () => {
  let component: CrudTypeAnimalComponent;
  let fixture: ComponentFixture<CrudTypeAnimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudTypeAnimalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudTypeAnimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
