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


import {
  Router,
  ActivatedRoute,
  ParamMap,
  NavigationEnd,
} from '@angular/router';
import { filter, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar
  ) { }

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    pwd: new FormControl(''),
  });
  submitted = false;
  loginError: string | null = null;


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

  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
        return;
    }

    this.authService.login(this.form.value.email, this.form.value.pwd).subscribe(
      (response) => {
        // Navigate to home on successful login
        this.router.navigate(['/home']);
        this.snackBar.open('Usted ha iniciado sesión con éxito', '', { duration: 3000 });
        this.loginError = null; // Clear any previous error
      },
      (error) => {
        this.loginError = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        console.error('Error al iniciar sesión:', error);
        this.snackBar.open(this.loginError, '', { duration: 3000 });
      }
    );
}



  //To access form controls using -> (ex: f.username)
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
