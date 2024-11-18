import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UserModel } from '../../models/user.model';
import { AddressFormComponent } from "../address-form/address-form.component";
import { AddressModel } from '../../models/address.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  injectStripe, NGX_STRIPE_VERSION, STRIPE_PUBLISHABLE_KEY, STRIPE_OPTIONS, NgxStripeModule, StripeElementsDirective, StripePaymentElementComponent, StripeFactoryService, LazyStripeAPILoader, WindowRef, DocumentRef
} from 'ngx-stripe';
import {
  StripeElementsOptions, StripePaymentElementOptions
} from '@stripe/stripe-js';
import { ArtworkModel } from '../../models/artwork.model';


@Component({
  selector: 'ngstr-checkout-form',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, StripeElementsDirective, StripePaymentElementComponent, NgxStripeModule, AddressFormComponent, CommonModule],
  providers: [StripeFactoryService,
    { provide: NGX_STRIPE_VERSION, useValue: '14.1.1' },
    { provide: STRIPE_PUBLISHABLE_KEY, useValue: 'pk_test_51QL60A01qslkTUypDH7HjcBn7G0E22306bHTsSjDqsGNsK3LT04ipA6PeGp4IajYdwNcIqce2Fi8hgHf4oFCtfMA006sUUYNnq' },
    { provide: STRIPE_OPTIONS, useValue: { apiVersion: '2020-08-27' } },
    { provide: LazyStripeAPILoader, useClass: LazyStripeAPILoader },
    { provide: WindowRef, useClass: WindowRef },
    { provide: DocumentRef, useClass: DocumentRef },
  ],
})

export class CheckoutComponent implements OnInit {
  constructor(private fb: UntypedFormBuilder, private router: Router, private cartService: CartService, private authService: AuthService, private userService: UserService) { }

  // VARIABLES DE USO COMÚN DE USUARIO
  user: UserModel | null = null;
  user_id: string | null = null;
  addressString: string | undefined = "";
  logged = false;
  cart_id: number | null = null
  total_amount: number | null = null
  artworks: ArtworkModel[] = [];


  //  STRIPE
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;
  stripe = injectStripe(this.cartService.StripePublicKey);
  paying = signal(false);


  // OPCIONES DE CONFIGURACIÓN DEL FORMULARIO DE PAGO
  elementsOptions: StripeElementsOptions = {
    locale: 'es',
    appearance: {
      theme: 'flat',
    },
  };
  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false
    }
  };


  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.user_id = this.authService.getUserId()
    if (this.user_id) {
      this.authService.getUserById(this.user_id).subscribe(
        (response) => {
          this.user = response;
          this.addressString = AddressModel.toString(this.user.address);
          this.loadCartData();
        }
      )
    }

  }
  loadCartData() {
    if (this.user_id) {
      
      this.userService.getCartId(this.user_id).subscribe(
        (response) => {
          this.cart_id = response;
          if (this.cart_id) {
            this.cartService.getCartedSelected(this.cart_id).subscribe(
              (response) => {
                this.artworks = response.map(artwork => ArtworkModel.fromJson(artwork));
                console.log(this.artworks);
              }
            )
            this.cartService.getTotalAmount(this.cart_id.toString()).subscribe(
              (response) => {
                this.total_amount = response;
                if (this.total_amount) { this.createPaymentIntent(this.total_amount) }
              }
            )
          }
        }
      )
    }
  }

  createPaymentIntent(amount: number) {
    amount *= 100;
    this.cartService
      .createPaymentIntent({ amount, currency: 'eur' })
      .subscribe(pi => {
        this.elementsOptions.clientSecret = pi.client_secret as string;
      });
  }

  pay() {
    if (this.paying()) return;
    this.paying.set(true);

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.user?.name as string,
              email: this.user?.email as string,
              address: {
                line1: this.user?.address?.street as string,
                line2: this.user?.address?.details as string,
                postal_code: this.user?.address?.zipcode as string,
                city: this.user?.address?.city as string
              }
            }
          }
        },
        redirect: 'if_required'
      })
      .subscribe(result => {
        this.paying.set(false);
        console.log('Result', result);
        if (result.error) {
          alert({ success: false, error: result.error.message });
        } else if (result.paymentIntent.status === 'succeeded') {
          this.router.navigate(['/login']);
        }
      });
  }
}
