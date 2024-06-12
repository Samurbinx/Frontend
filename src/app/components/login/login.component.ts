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
    this.submitted = true

    if (this.form.invalid) {
      return;
    }

    if (this.form.valid) {
      this._userService.login(this.form.value.email, this.form.value.pwd)
        .subscribe(
          (token: string) => {
            console.log(token); // Handle token here
            // Set token to localStorage
            this.snackBar.open('Usted ha iniciado sesión con éxito');
            this._userService.setToken(token);
            this.router.navigate(['/home']);
          },
          (error) => {
            this.loginError = error
          }
        );
    }
  }

  //To access form controls using -> (ex: f.username)
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
