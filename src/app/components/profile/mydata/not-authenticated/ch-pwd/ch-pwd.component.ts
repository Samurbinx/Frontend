import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


export interface DialogData {
  current_pwd: string;
  name: string;
}

@Component({
  selector: 'app-ch-pwd',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,  MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './ch-pwd.component.html',
  styleUrl: './ch-pwd.component.css'
})
export class ChPwdComponent {

  readonly dialogRef = inject(MatDialogRef<ChPwdComponent>);
  readonly current_pwd = inject<DialogData>(MAT_DIALOG_DATA);
  // readonly animal = model(this.data.animal);


  onNoClick(): void {
    this.dialogRef.close();
  }

}
