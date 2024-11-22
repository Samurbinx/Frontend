import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { WorkService } from '../../../services/work.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { AddressFormComponent } from './address-form/address-form.component';
import { CommonModule } from '@angular/common';
import { DataFormComponent } from './data-form/data-form.component';
import { PwdFormComponent } from './pwd-form/pwd-form.component';

@Component({
  selector: 'app-mydata',
  standalone: true,
  imports: [CommonModule, AddressFormComponent, DataFormComponent, PwdFormComponent],
  templateUrl: './mydata.component.html',
  styleUrl: './mydata.component.css'
})
export class MydataComponent implements OnInit{

  user: UserModel | null = null;
  userId: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    this.authService.getUserSubject().subscribe((user) => {
      this.user = user;
      const token = this.authService.getToken();

      if (token) {
        this.userId = this.authService.getUserId();
      }
    });
  }
}
