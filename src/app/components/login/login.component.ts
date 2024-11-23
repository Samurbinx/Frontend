import { UserService } from './../../services/user.service';
import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { ArtworkService } from '../../services/artwork.service';
import { ArtworkModel } from '../../models/artwork.model';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private userService: UserService, private router: Router, private cartService: CartService, private artworkService: ArtworkService, private snackBar: MatSnackBar, private storageService: StorageService) { }

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
        this.loadData()

      },
      (error) => {
        this.loginError = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        console.error('Error al iniciar sesión:', error);
        this.snackBar.open(this.loginError, '', { duration: 3000 });
      }
    );
  }

  loadData() {
    let userId = this.authService.getUserId()
    if (userId) {
      this.userService.getCartId(userId).subscribe(
        (response) => {
          let cartId = response;
          this.userService.getCarted(userId).subscribe(
            (response) => {
              let carted = response;
              let localCart = this.storageService.getOfflineCart();
              if (localCart.length > 0) {
                localCart.forEach(artwork => {
                  const exists = carted.some(art => art.id === artwork); // true
                  if (cartId && !exists) {
                    this.cartService.addToCart(cartId, artwork).subscribe();
                  }
                });
              }
              this.router.navigate(['/carrito']);
                this.loginError = null;

            }
          )
        }
      )
    }
  }

  //To access form controls using -> (ex: f.username)
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


}
