import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserModel } from '../../models/user.model';
import { AddressComponent } from '../userdata/mydata/address/address.component';
import { AddressModel } from '../../models/address.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  injectStripe, NGX_STRIPE_VERSION, LazyStripeAPILoader, STRIPE_PUBLISHABLE_KEY, STRIPE_OPTIONS, NgxStripeModule, StripeElementsDirective, StripePaymentElementComponent, StripeFactoryService,
  StripeCardNumberComponent,
  StripeCardComponent, WindowRef, DocumentRef
} from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { ArtworkModel } from '../../models/artwork.model';
import { PieceModel } from '../../models/piece.model';
import { OrderService } from '../../services/order.service';
import { response } from 'express';
import Swal from 'sweetalert2';

interface OrderResponse {
  success: boolean;
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
    NgxStripeModule,
    AddressComponent,
    CommonModule
  ],
  providers: [
    LazyStripeAPILoader,
    StripeFactoryService,
    { provide: NGX_STRIPE_VERSION, useValue: '14.1.1' },
    { provide: STRIPE_PUBLISHABLE_KEY, useValue: 'pk_test_51QL60A01qslkTUypDH7HjcBn7G0E22306bHTsSjDqsGNsK3LT04ipA6PeGp4IajYdwNcIqce2Fi8hgHf4oFCtfMA006sUUYNnq' },
    { provide: STRIPE_OPTIONS, useValue: { apiVersion: '2020-08-27' } },
    { provide: WindowRef, useClass: WindowRef },
    { provide: DocumentRef, useClass: DocumentRef },
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
  ) { }

  // VARIABLES
  user: UserModel | null = null;
  user_id: string | null = null;
  addressString: string | undefined = '';
  logged = false;
  cart_id: number | null = null;
  total_amount: number | null = null;
  artworks: ArtworkModel[] = [];
  isLoading: boolean = false;  // Bandera para controlar el estado de carga

  // STRIPE
  @ViewChild(StripeCardComponent) cardElement!: StripeCardComponent;
  stripe = injectStripe('pk_test_51QL60A01qslkTUypDH7HjcBn7G0E22306bHTsSjDqsGNsK3LT04ipA6PeGp4IajYdwNcIqce2Fi8hgHf4oFCtfMA006sUUYNnq');
  paying = signal(false);
  client_secret = '';
  paymentIntentId = '';

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        backgroundColor: 'white',
        iconColor: 'black',
        color: 'black',
        fontWeight: '300',
        fontFamily: 'inherit',
        fontSize: '18px',
        '::placeholder': {
          color: 'gray'
        }

      }
    }
  };

  ngOnInit() {
    if (!this.stripe) {
      console.error('Stripe has not been initialized.');
      return;
    }
    this.loadUserData();
  }

  reload() {
    this.loadUserData();
  }

  // Carga los datos del usuario, cuando termina, llama a cargar los datos del carrito
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

  // Carga los datos del carrito: cart_id, artworks y total_amount con el que crea un intento de pago con stripe
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

  // Crea un intento de pago y devuelve la clave secreta del usuario
  createPaymentIntent(amount: number) {
    this.cartService.createPaymentIntent({ amount: amount * 100, currency: 'eur' }).subscribe({
      next: (pi) => {
        // Asignar tanto el client_secret como el payment_intent_id
        this.elementsOptions.clientSecret = pi.client_secret;
        this.client_secret = pi.client_secret;
        this.paymentIntentId = pi.payment_intent_id; // Ahora tienes el payment_intent_id también
        if (!this.client_secret) {
          this.handleError('Client secret is missing.');
          return;
        }

        console.log(this.client_secret);
        console.log(this.paymentIntentId);
      },
      error: () => this.handleError('Error al crear la intención de pago'),
    });
  }

  // Confirma el pago, pasando los detalles del mismo y crea un pedido en la base de datos
  pay() {
    this.isLoading = true;

    if (this.user_id && this.cart_id && this.artworks && this.total_amount && this.user?.address) {
      const cardElement = this.cardElement;
      if (!cardElement) {
        this.isLoading = false;
        throw new Error('Card element is not available.');
      }

      // Se crea un token con los datos de la tarjeta para mandarlos al backend
      this.stripe
        .createToken(cardElement.element)
        .subscribe((result) => {
          if (result.token) {
            this.loading()
            this.createOrder(result.token.id);
          } else if (result.error) {
            this.isLoading = false;
            this.handleError(`${result.error.message}`);
          }
        });
    } else {
      if (!this.user?.address) this.snackBar.open('Por favor, añada una dirección de envío', 'Cerrar', { duration: 3000 });
      this.isLoading = false;

      return;
    }
  }
  loading() {
    Swal.fire({
      text: 'El pedido se está tramitando',
      timer: 2000, // Milisegundos
      didOpen: () => {
        Swal.showLoading(); // spinner de carga
      },
    });
  }
  // Recopila todos los datos necesarios y hace la petición al backend donde se termina de confirmar el pago
  createOrder(token: string) {
    const artworks_id = this.artworks.map(artwork => artwork.id);

    const paymentData = {
      token: token,
      payment_intent_id: this.paymentIntentId,
      billing_details: this.getBillingDetails(),
    };
    const orderData = {
      user_id: this.user_id,
      artworks: artworks_id, // Lista de IDs de obras seleccionadas
      total_amount: this.total_amount,
      cart_id: this.cart_id
    };

    this.orderService.newOrder(orderData, paymentData).subscribe({
      next: (response) => {
        console.log('Pedido completado:', response);
        if (response.message) {
          this.isLoading = false;
          this.router.navigate(['/userdata/pedidos']);
          this.snackBar.open('Pedido realizado correctamente', '', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al crear el pedido:', error);
        alert('Hubo un error al crear el pedido. Inténtalo de nuevo.');
        this.router.navigate(['/carrito']);
      }
    });
  }

  // Recoge los detalles del usuario
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
    this.isLoading = false;
    console.error(message);
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  // Recoge la imagen de las obras
  getBackgroundImageUrl(image: string, piece: PieceModel): string {
    return `url('http://127.0.0.1:8080/piece/${piece.id}/${image}')`;
  }

}
