import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadData();
  }

  reload(){
    this.loadData()
    this.snackBar.open('Datos de usuario actualizados correctamente.', '', { duration: 3000, });
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
