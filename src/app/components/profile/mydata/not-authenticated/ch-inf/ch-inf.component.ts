import { Component } from '@angular/core';
import {ChangeDetectionStrategy, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {
  Router,
} from '@angular/router';


export interface DialogData {
  pwd: string;
}

@Component({
  selector: 'app-ch-inf',
  standalone: true,
  imports: [ FormsModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,  MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './ch-inf.component.html',
  styleUrl: './ch-inf.component.css'
})
export class ChInfComponent {
  constructor(private router: Router){}

  readonly dialogRef = inject(MatDialogRef<ChInfComponent>);
  readonly pwd = inject<DialogData>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);


  onNoClick(): void {
    this.dialogRef.close();
  }
  
  authenticate(){
    this.dialogRef.close();
    this.router.navigate(['/perfil/misdatos/autenticado']);

  }

}
