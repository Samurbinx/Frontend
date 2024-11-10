import { subscribe } from 'diagnostics_channel';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})

export class UserDataComponent  implements OnInit{
  user: UserModel | null = null;
  
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.getUserSubject().subscribe(
      user => {
        this.user = user;
      }
    );
  }
}
