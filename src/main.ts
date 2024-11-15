/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideNgxStripe } from 'ngx-stripe';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,  // Si tienes más proveedores en appConfig, los mantienes
    provideNgxStripe('pk_test_51QL60A01qslkTUypDH7HjcBn7G0E22306bHTsSjDqsGNsK3LT04ipA6PeGp4IajYdwNcIqce2Fi8hgHf4oFCtfMA006sUUYNnq')  // Aquí agregas el proveedor de Stripe
  ]
}).catch((err) => console.error(err));
