import { AddressService } from './../../../../../services/address.service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AddressModel } from '../../../../../models/address.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationdialogComponent } from '../../../../commons/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-addresscard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addresscard.component.html',
  styleUrl: './addresscard.component.css'
})
export class AddresscardComponent {

  @Input() user_id: string | null = null;
  @Input() address: AddressModel | null = null;
  @Input() isDefault: boolean = false; // Indica si es la dirección predeterminada
  @Output() reload = new EventEmitter<void>(); // Evento para editar la dirección
  @Output() editAddress = new EventEmitter<any>();

  constructor(private addressService: AddressService, private snackbar: MatSnackBar, public dialog: MatDialog) { }

  // Emite la señal de edición
  onEdit() {
    this.editAddress.emit();
  }

  // Elimina la dirección y emite la señal de reload
  delAddress() {
    if (this.isDefault) {
      this.snackbar.open('No puede eliminar su dirección predeterminada, para hacerlo, seleccione otra como predeterminada.', '', { duration: 5000, verticalPosition: 'top'});
      this.reload.emit();
    } else if (this.address) {
      const message = `¿Está seguro de que desea eliminar "${this.address.recipient}"?`;
      const dialogRef = this.dialog.open(ConfirmationdialogComponent, { data: { message } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.address && this.user_id) {
            this.addressService.delAddress(this.address.id).subscribe(
              (response: any) => {
                this.snackbar.open('Dirección eliminada correctamente', '', { duration: 3000 });
                this.reload.emit();
              }
            );
          }
        }
      })
    }
  }

  setDefault() {
    if (this.address) {
      const message = `¿Está seguro de que desea seleccionar "${this.address.recipient}" como predeterminada?`;
      const dialogRef = this.dialog.open(ConfirmationdialogComponent, { data: { message } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.address && this.user_id) {
            this.addressService.setDefault(this.address.id, this.user_id).subscribe(
              (response: any) => {
                this.snackbar.open('La dirección predeterminada ha sido cambiada.', '', { duration: 3000 });
                this.reload.emit();
              }
            );
          }
        }
      });
    }
  }
}
