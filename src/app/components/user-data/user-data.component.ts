import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [
    // Import required Angular modules here
  ],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent  {
  
}
