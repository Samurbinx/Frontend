import { subscribe } from 'diagnostics_channel';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userdata',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule
  ],
  templateUrl: './userdata.component.html',
  styleUrls: ['./userdata.component.css']
})

export class UserDataComponent implements OnInit {
  user: UserModel | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserSubject().subscribe(
      user => {
        this.user = user;
      }
    );
  }
}
