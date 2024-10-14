import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChPwdComponent } from './ch-pwd.component';

describe('ChPwdComponent', () => {
  let component: ChPwdComponent;
  let fixture: ComponentFixture<ChPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChPwdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
