import { UserService } from '../../../../services/user.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { UserModel } from '../../../../models/user.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dataform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dataform.component.html',
  styleUrl: './dataform.component.css'
})
export class DataFormComponent {

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private userService: UserService) { }

  user: UserModel | null = null;
  userId: string | null = null;

  @Output() reload = new EventEmitter<void>(); // Evento para editar la dirección

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    nick: new FormControl(''),
    phone: new FormControl(''),
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

  private loadForm() {
    this.form = this.fb.group({
      name: [this.user?.name ?? '', [Validators.required]],
      surname: [this.user?.surname ?? '', [Validators.required]],
      email: [this.user?.email ?? '', [Validators.required, Validators.email, Validators.nullValidator]],
      nick: [this.user?.nick ?? '', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        phone: [this.user?.phone ?? '', [Validators.required], Validators.pattern(/^\+?\d{1,3}\s?\d{9,15}$/)
      ],
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
      let user = {
        name: this.form.value.name,
        surname: this.form.value.surname,
        email: this.form.value.email,
        nick: this.form.value.nick,
        phone: this.form.value.phone
      }

      this.authService.updateUser(user, this.userId).subscribe({
        next: (response: any) => {
          this.onReset();
          this.reload.emit();
        },
        error: (error: any) => {
          this.form.get('email')?.setErrors(Validators.nullValidator);
          console.log(error);
          this.snackBar.open('Ha ocurrido un error actualizando sus datos.', '', { duration: 3000, });

        }
      });
    }
    console.log(JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.form.reset();
    this.submitted = false
    window.location.reload();
  }

}
