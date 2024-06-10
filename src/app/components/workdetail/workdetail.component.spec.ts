import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkdetailComponent } from './workdetail.component';

describe('WorkdetailComponent', () => {
  let component: WorkdetailComponent;
  let fixture: ComponentFixture<WorkdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
