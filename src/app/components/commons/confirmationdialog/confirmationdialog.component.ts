import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog'; // Importa MatDialogRef

@Component({
  selector: 'app-confirmationdialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmationdialog.component.html',
  styleUrl: './confirmationdialog.component.css'
})
export class ConfirmationdialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string } // Recibe el mensaje
  ) {}

  close(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }
}
