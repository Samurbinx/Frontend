import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserModel } from '../../models/user.model';
import { AddressFormComponent } from "../address-form/address-form.component";
import { AddressModel } from '../../models/address.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  injectStripe, NGX_STRIPE_VERSION, STRIPE_PUBLISHABLE_KEY, STRIPE_OPTIONS, NgxStripeModule, StripeElementsDirective, StripePaymentElementComponent, StripeFactoryService
} from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { ArtworkModel } from '../../models/artwork.model';
import { PieceModel } from '../../models/piece.model';
import { OrderService } from '../../services/order.service';

interface OrderResponse {
  success: boolean;
  error: boolean;
  message: string;
  details?: any;
}

@Component({
  selector: 'ngstr-checkout-form',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    StripeElementsDirective,
    StripePaymentElementComponent,
    NgxStripeModule,
    AddressFormComponent,
    CommonModule
  ],
  providers: [
    StripeFactoryService,
    { provide: NGX_STRIPE_VERSION, useValue: '14.1.1' },
    { provide: STRIPE_PUBLISHABLE_KEY, useValue: 'pk_test_51QL60A01qslkTUypDH7HjcBn7G0E22306bHTsSjDqsGNsK3LT04ipA6PeGp4IajYdwNcIqce2Fi8hgHf4oFCtfMA006sUUYNnq' },
    { provide: STRIPE_OPTIONS, useValue: { apiVersion: '2020-08-27' } }
  ],
})
export class CheckoutComponent implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  // VARIABLES
  user: UserModel | null = null;
  user_id: string | null = null;
  addressString: string | undefined = '';
  logged = false;
  cart_id: number | null = null;
  total_amount: number | null = null;
  artworks: ArtworkModel[] = [];

  // STRIPE
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;
  stripe = injectStripe(this.cartService.StripePublicKey);
  paying = signal(false);
  client_secret = '';

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
    appearance: { theme: 'flat' },
  };
  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  ngOnInit() {
    this.loadUserData();
  }

  // MÉTODOS
  loadUserData() {
    this.user_id = this.authService.getUserId();
    if (this.user_id) {
      this.authService.getUserById(this.user_id).subscribe({
        next: (response) => {
          this.user = response;
          this.addressString = AddressModel.toString(this.user.address);
          this.loadCartData();
        },
        error: () => this.handleError('Error al cargar los datos del usuario'),
      });
    }
  }

  loadCartData() {
    if (this.user_id) {
      this.userService.getCartId(this.user_id).subscribe({
        next: (cartId) => {
          this.cart_id = cartId;
          if (this.cart_id) {
            this.cartService.getCartedSelected(this.cart_id).subscribe({
              next: (response) => {
                this.artworks = response.map(artwork => ArtworkModel.fromJson(artwork));
              },
              error: () => this.handleError('Error al cargar los artworks del carrito'),
            });

            this.cartService.getTotalAmount(this.cart_id).subscribe({
              next: (total) => {
                this.total_amount = total;
                if (this.total_amount) this.createPaymentIntent(this.total_amount);
              },
              error: () => this.handleError('Error al calcular el total del carrito'),
            });
          }
        },
        error: () => this.handleError('Error al obtener el ID del carrito'),
      });
    }
  }

  createPaymentIntent(amount: number) {
    this.cartService.createPaymentIntent({ amount: amount * 100, currency: 'eur' }).subscribe({
      next: (pi) => {
        this.elementsOptions.clientSecret = pi.client_secret as string;
        this.client_secret = pi.client_secret as string;
      },
      error: () => this.handleError('Error al crear la intención de pago'),
    });
  }

  pay() {
    if (!this.user || !this.paymentElement?.elements) {
      this.handleError('Datos de usuario o pago incompletos');
      return;
    }
    if (this.paying()) return;
    this.paying.set(true);

    this.stripe.confirmPayment({
      elements: this.paymentElement.elements,
      confirmParams: { payment_method_data: { billing_details: this.getBillingDetails() } },
      redirect: 'if_required',
    }).subscribe({
      next: (result) => {
        if (result.error) {
          this.cancel();
          this.handleError(result.error.message || 'Error durante el pago');
        } else if (result.paymentIntent.status === 'succeeded') {
          this.createOrder();
          this.router.navigate(['/userdata/pedidos']);
        }
      },
      error: () => this.handleError('Error durante la confirmación del pago'),
      complete: () => this.paying.set(false),
    });
  }

  createOrder() {
    if (this.user_id && this.cart_id && this.artworks && this.total_amount) {
      const artworks_id = this.artworks.map(artwork => artwork.id);
      this.orderService.newOrder(this.user_id, artworks_id, this.total_amount, this.cart_id).subscribe({
        next: (response: OrderResponse) => {
          if (!response.success) this.cancel();
        },
        error: () => this.cancel(),
      });
    }
  }

  cancel() {
    this.cartService.cancelPaymentIntent({ client_secret: this.client_secret });
    this.paying.set(false);
  }

  getBillingDetails() {
    return {
      name: this.user?.name,
      email: this.user?.email,
      address: {
        line1: this.user?.address?.street,
        line2: this.user?.address?.details,
        postal_code: this.user?.address?.zipcode,
        city: this.user?.address?.city,
      },
    };
  }

  handleError(message: string) {
    console.error(message);
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
  getBackgroundImageUrl(image: string, piece: PieceModel): string {
    return `url('http://127.0.0.1:8080/piece/${piece.id}/${image}')`;
  }

}
