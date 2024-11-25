import { subscribe } from 'diagnostics_channel';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AddressModel } from '../../../../../models/address.model';
import { AddressService } from '../../../../../services/address.service';
import { AuthService } from '../../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../../../models/user.model';
import { UserService } from '../../../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';



@Component({
  selector: 'app-addressform',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, CommonModule],
  templateUrl: './addressform.component.html',
  styleUrl: './addressform.component.css'
})
export class AddressformComponent implements OnInit {

  constructor(private fb: FormBuilder, private addressService: AddressService, private snackbar: MatSnackBar) { }

  @Input() address: AddressModel | null = null;
  @Input() user_id: string | null = null;
  @Output() reload = new EventEmitter<void>(); // Evento para editar la dirección


  form: FormGroup = new FormGroup({
    street: new FormControl(''),
    details: new FormControl(''),
    zipcode: new FormControl(''),
    city: new FormControl(''),
    province: new FormControl(''),
  });

  submitted = false;

  ngOnInit(): void {
    this.loadForm();
  }

  private loadForm() {
    this.form = this.fb.group({
      street: [this.address?.street ?? '', [Validators.required]],
      details: [this.address?.details ?? '', [Validators.required]],
      zipcode: [this.address?.zipcode ?? '', [Validators.required]],
      city: [this.address?.city ?? '', [Validators.required]],
      province: [this.address?.province ?? '', [Validators.required]],
      recipient: [this.address?.recipient ?? '', [Validators.required]],
      phone: [this.address?.phone ?? '', [Validators.required]],
    });
  }

  //To access form controls using -> (ex: f.username)
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true

    let address = new AddressModel(
      0,
      this.form.value.street,
      this.form.value.details,
      this.form.value.zipcode,
      this.form.value.city,
      this.form.value.province,
      this.form.value.recipient,
      this.form.value.phone,
    )

    // Si el formulario es válido, comprueba si estamos editando o creando una nueva dirección
    if (this.form.valid && this.user_id) {
      if (this.address) {
        address.id = this.address.id;
        this.updateAddress(address);
      } else {
        this.newAddress(address);
      }
    } else {
      return;
    }
  }

  updateAddress(address: AddressModel) {
    this.addressService.editAddress(address).subscribe({
      next: (response: any) => {
        this.form.reset();
        this.submitted = false;
        this.reload.emit();
      },
      error: (error: any) => {
        this.form.get('email')?.setErrors(Validators.nullValidator);
        console.log(error);
      },
      complete: () => {
        console.log('address add process complete');
      }
    });
  }

  newAddress(address: AddressModel) {
    if (this.user_id) {
      this.addressService.addAddress(address, this.user_id).subscribe({
        next: (response: any) => {
          this.form.reset();
          this.submitted = false;
          this.reload.emit();
        },
        error: (error: any) => {
          this.form.get('email')?.setErrors(Validators.nullValidator);
          console.log(error);
        },
        complete: () => {
          console.log('address add process complete');
        }
      });
    }
  }

  onReset(): void {
    this.form.reset();
    this.submitted = false
  }

}
