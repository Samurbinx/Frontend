import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataComponent } from './userdata.component';

describe('UserDataComponent', () => {
  let component: UserDataComponent;
  let fixture: ComponentFixture<UserDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
