import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mydata',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
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

  openAllAddress(){
    console.log("hola");
    document.getElementById('')
  }
}
