import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {ChangeDetectionStrategy, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ChPwdComponent } from './ch-pwd/ch-pwd.component';
import { ChInfComponent } from './ch-inf/ch-inf.component';

@Component({
  selector: 'app-not-authenticated',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './not-authenticated.component.html',
  styleUrl: './not-authenticated.component.css'
})
export class NotAuthenticatedComponent {


    readonly animal = signal('');
    readonly name = model('');
    readonly dialog = inject(MatDialog);

    chInf(): void {
      const dialogRef = this.dialog.open(ChInfComponent, {
        data: {name: this.name(), animal: this.animal()},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          this.animal.set(result);
        }
      });
    }

    chPwd(){
      const dialogRef = this.dialog.open(ChPwdComponent);
    }

}
