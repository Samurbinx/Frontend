import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alertdialog',
  standalone: true,
  imports: [],
  templateUrl: './alertdialog.component.html',
  styleUrl: './alertdialog.component.css'
})
export class AlertdialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string } // Recibe el mensaje
  ) {}

  close(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }
}
