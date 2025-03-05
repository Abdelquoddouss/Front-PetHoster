import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudUserComponent } from './crud-user.component';

describe('CrudUserComponent', () => {
  let component: CrudUserComponent;
  let fixture: ComponentFixture<CrudUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
