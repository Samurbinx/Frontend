import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import Validation from '../../utils/validation';

import {
  Router,
  ActivatedRoute,
  ParamMap,
  NavigationEnd,
} from '@angular/router';
import { filter, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    pwd: new FormControl(''),
  });
  submitted = false;
  loginError = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: [
        '',
        [
          Validators.required
        ]
      ],
    });

    // if (typeof localStorage !== 'undefined') {
    //   const registeredEmail = localStorage.getItem('registeredEmail');
    //   if (registeredEmail) {
    //     this.form.patchValue({ email: registeredEmail });
    //   }
    // }
    // window.addEventListener('beforeunload', function (event) {
    //   localStorage.removeItem('registeredEmail');
    // });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
        return;
    }

    this._userService.login(this.form.value.email, this.form.value.pwd).subscribe(
        (response) => {
            const token = response.token; // Obtener el token
            const user = response.user;   // Obtener los datos del usuario
            console.log(token, user);      // Imprimir ambos para verificar
            this._userService.setToken(token); // Almacenar el token
            this._userService.setUser(response.user); // Almacenar el user
            // Guardar los datos del usuario en algún lugar si es necesario
            this.router.navigate(['/home']);
            this.snackBar.open('Usted ha iniciado sesión con éxito', '', { duration: 3000 });
        },
        (error) => {
            this.loginError = error;
            console.error('Error al iniciar sesión:', error);
            this.snackBar.open('Error al iniciar sesión. Por favor, verifica tus credenciales.', '', { duration: 3000 });
        }
    );
}



  //To access form controls using -> (ex: f.username)
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
