import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChInfComponent } from './ch-inf.component';

describe('ChInfComponent', () => {
  let component: ChInfComponent;
  let fixture: ComponentFixture<ChInfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChInfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChInfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
