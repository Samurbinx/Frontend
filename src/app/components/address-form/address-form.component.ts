import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AddressModel } from '../../models/address.model';
import { AddressService } from '../../services/address.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../models/user.model';



@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, CommonModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private addressService: AddressService, private authService: AuthService) { }

  user: UserModel | null = null;
  userId: string | null = null;

  form: FormGroup = new FormGroup({
    street: new FormControl(''),
    details: new FormControl(''),
    zipcode: new FormControl(''),
    city: new FormControl(''),
    province: new FormControl(''),
  });

  submitted = false;
  successMessage = "";
  errorMessage = "";

  ngOnInit(): void {
    this.loadData();
   


  }

  private loadData(): void {
    this.authService.getUserSubject().subscribe((user) => {
      this.user = user;
      const token = this.authService.getToken();
     
      if (token) {
        this.userId = this.authService.getUserId();
        this.loadForm();
      }
    });
  }

  private loadForm(){
      this.form = this.fb.group({
        street: [this.user?.address?.street ?? '', [Validators.required]],
        details: [this.user?.address?.details ?? '', [Validators.required]],
        zipcode: [this.user?.address?.zipcode ?? '', [Validators.required]],
        city: [this.user?.address?.city ?? '', [Validators.required]],
        province: [this.user?.address?.province ?? '', [Validators.required]],
      });
  }

  //To access form controls using -> (ex: f.username)
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true
    if (this.form.invalid) {
      return;
    }
    if (this.form.valid && this.userId) {

      let address = new AddressModel(
        this.form.value.street,
        this.form.value.details,
        this.form.value.zipcode,
        this.form.value.city,
        this.form.value.province
      )

      this.addressService.addAddress(address, this.userId).subscribe({
        next: (response: any) => {
          this.successMessage = 'ADdress añadido correctamente';
          this.form.reset();
          this.submitted = false;
          // let snackBarRef = this.snackBar.open('Usuario registrado correctamente');
          // this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.form.get('email')?.setErrors(Validators.nullValidator);
          console.log(error);
          // this.snackBar.open(error.message, '', {
          //   verticalPosition: 'top',
          //   duration: 3000,
          // });
        },
        complete: () => {
          console.log('address add process complete');
          window.location.reload();
        }
      });
    }
    console.log(JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.form.reset();
    this.submitted = false
  }

}
