import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserModel } from '../../models/user.model';
import Validation from '../../utils/validation';


import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';


@Component({
	selector: 'app-register',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

	successMessage = "";
	errorMessage = "";
	constructor(private formBuilder: FormBuilder, private _authService: AuthService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

	form: FormGroup = new FormGroup({
		email: new FormControl(''),
		pwd: new FormControl(''),
		pwdConfirm: new FormControl(''),
		name: new FormControl(''),
		surname: new FormControl(''),
		nickname: new FormControl(''),
		phone: new FormControl(''),
	});
	submitted = false

	ngOnInit(): void {
		this.form = this.formBuilder.group(
			{
				name: ['', Validators.required],
				surname: ['', Validators.required],
				nickname: [
					'',
					[
						Validators.required,
						Validators.minLength(6),
						Validators.maxLength(20)
					]
				],
				email: ['', [Validators.required, Validators.email, Validators.nullValidator]],
				pwd: [
					'',
					[
						Validators.required,
						Validators.minLength(6),
						Validators.maxLength(40)
					]
				],
				pwdConfirm: ['', Validators.required],
				phone: ['', Validators.required]
			},
			{
				validators: [Validation.match('pwd', 'pwdConfirm')]
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
		if (this.form.valid) {
			let user = new UserModel(
				this.form.value.email,
				this.form.value.pwd,
				this.form.value.name,
				this.form.value.surname,
				this.form.value.nickname,
				this.form.value.phone
			)


			this._authService.addUser(user).subscribe({
				next: (response) => {
					this.successMessage = 'Usuario añadido correctamente';
					this.form.reset();
					this.submitted = false;
					localStorage.setItem('registeredEmail', user.email);
					let snackBarRef = this.snackBar.open('Usuario registrado correctamente');
					this.router.navigate(['/login']);
				},
				error: (error) => {
					this.form.get('email')?.setErrors(Validators.nullValidator);
					this.snackBar.open(error.message, '', {
						verticalPosition: 'top',
						duration: 3000,
					});
				},
				complete: () => {
					console.log('User add process complete');
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
