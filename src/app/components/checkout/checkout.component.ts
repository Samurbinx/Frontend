import { CartService } from '../../services/cart.service';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';

@Component({
  selector: 'ngstr-checkout-form',
  templateUrl: './checkout.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    StripeElementsDirective,
    StripePaymentElementComponent
  ]
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  private readonly fb = inject(UntypedFormBuilder);
  private readonly cartService = inject(CartService);

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
    // const amount = this.paymentElementForm.get('amount')?.value || 1000;

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
