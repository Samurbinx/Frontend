import { UserService } from '../../../../services/user.service';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { UserModel } from '../../../../models/user.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import Validation from '../../../../utils/validation';

@Component({
  selector: 'app-pwdform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pwdform.component.html',
  styleUrl: './pwdform.component.css'
})
export class PwdFormComponent {
  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private userService: UserService) { }

  user: UserModel | null = null;
  userId: string | null = null;

  form: FormGroup = new FormGroup({
    pwd: new FormControl(''),
    npwd: new FormControl(''),
    cpwd: new FormControl(''),
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
      pwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      npwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      cpwd: ['', [Validators.required]],
    }, {
      validators: [Validation.match('npwd', 'cpwd'), Validation.notMatch('pwd', 'npwd')],
    }
  
  );
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
      let data = {
        pwd: this.form.value.pwd,
        npwd: this.form.value.npwd,
      }

      this.authService.updatePwd(data, this.userId).subscribe({
        next: (response: any) => {
          this.onReset();
          this.snackBar.open('Datos de usuario actualizados correctamente.', '', { duration: 3000, });
          window.location.reload();
        },
        error: (error: any) => {
          if (error.status === 401 && error.error.message === 'La contraseña actual no es correcta') {
            this.form.get('pwd')?.setErrors({ incorrectPassword: true });
          }

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
