import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WorksComponent } from './components/works/works.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { WorkdetailComponent } from './components/workdetail/workdetail.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ShopComponent } from './components/shop/shop.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MydataComponent } from './components/profile/mydata/mydata.component';
import { WishlistComponent } from './components/profile/wishlist/wishlist.component';
import { OrdersComponent } from './components/profile/orders/orders.component';
import { PaymentComponent } from './components/profile/payment/payment.component';
import { NotAuthenticatedComponent } from './components/profile/mydata/not-authenticated/not-authenticated.component';
import { AuthenticatedComponent } from './components/profile/mydata/authenticated/authenticated.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'proyectos', component: WorksComponent },
    { path: 'proyectos/:title', component: WorkdetailComponent },
    { path: 'contacto', component: ContactComponent },
    { path: 'sobremi', component: AboutComponent },
    { path: 'registro', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'tienda', component: ShopComponent },
    { path: 'perfil', component: ProfileComponent, 
        children: [
            { path: 'misdatos', component: MydataComponent,
                children: [
                    // { path: 'informacion', component: NotAuthenticatedComponent },
                    { path: 'autenticado', component: AuthenticatedComponent }]
            },
            { path: 'wishlist', component: WishlistComponent },
            { path: 'pedidos', component: OrdersComponent },
            { path: 'pago', component: PaymentComponent },
        ]
    },
    { path: '', redirectTo:'home', pathMatch:'full'},
    { path: '**', redirectTo:'home', pathMatch:'full'},
];
