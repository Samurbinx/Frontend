import { User } from './../../interfaces/user.interface';
import { AuthService } from './../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import {
  injectStripe,
  NGX_STRIPE_VERSION,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS,
  NgxStripeModule,
  StripeElementsDirective,
  StripePaymentElementComponent,
  StripeFactoryService,
  LazyStripeAPILoader,
  WindowRef,
  DocumentRef
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import { UserModel } from '../../models/user.model';
@Component({
  selector: 'ngstr-checkout-form',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    StripeElementsDirective,
    StripePaymentElementComponent,
    NgxStripeModule,
  ],
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
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  user: UserModel | null = null;
  // user: UserModel | null = new UserModel('samurbinx@gmail.com', 'samurbinx', 'Samuel', 'Urbina Flor', 'Surbinx', '622039286');

  private readonly fb = inject(UntypedFormBuilder);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  paymentElementForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [1000, [Validators.required, Validators.pattern(/^\d+$/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
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

  stripe = injectStripe(this.cartService.StripePublicKey);
  paying = signal(false);

  ngOnInit() {
    this.cartService.totalAmount$.subscribe((total) => {
      const amount = total;
      if (amount) {
        this.cartService
          .createPaymentIntent({ amount, currency: 'eur' })
          .subscribe(pi => {
            this.elementsOptions.clientSecret = pi.client_secret as string;
          });
      }
    });

    // let userid = this.authService.getUserId();
    // if (userid) {
    //   this.user = this.authService.getUser();
    // }
  }

  pay() {
    if (this.paying() || this.paymentElementForm.invalid) return;
    this.paying.set(true);

    const { name, email, address, zipcode, city } = this.paymentElementForm.getRawValue();

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                city: city as string
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
          alert({ success: true });
        }
      });
  }
}
