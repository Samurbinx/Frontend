import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdFormComponent } from './pwd-form.component';

describe('PwdFormComponent', () => {
  let component: PwdFormComponent;
  let fixture: ComponentFixture<PwdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwdFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
