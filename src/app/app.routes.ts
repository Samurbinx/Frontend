import { CheckoutComponent } from './components/checkout/checkout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WorksComponent } from './components/works/works.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { WorkdetailComponent } from './components/workdetail/workdetail.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserDataComponent } from './components/userdata/userdata.component';
import { FavoritesComponent } from './components/userdata/favorites/favorites.component';
import { OrdersComponent } from './components/userdata/orders/orders.component';
import { CartComponent } from './components/cart/cart.component';
import { MydataComponent } from './components/userdata/mydata/mydata.component';
import { DataFormComponent } from './components/userdata/mydata/dataform/dataform.component';
import { PwdFormComponent } from './components/userdata/mydata/pwdform/pwdform.component';
import { AddressComponent } from './components/userdata/mydata/address/address.component';

// Configuración de rutas
export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'proyectos', component: WorksComponent },
    { path: 'proyecto', component: WorkdetailComponent },
    { path: 'contacto', component: ContactComponent },
    { path: 'sobremi', component: AboutComponent },
    { path: 'registro', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'carrito', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    {
        path: 'userdata', component: UserDataComponent, 
        children: [
            {
                path: 'mydata', component: MydataComponent,
                children: [
                    // { path: '', redirectTo: 'data', pathMatch: 'full' },
                    { path: 'address', component: AddressComponent },
                    { path: 'data', component: DataFormComponent },
                    { path: 'pwd', component: PwdFormComponent },
                ]
            },
            { path: 'favoritos', component: FavoritesComponent },
            { path: 'pedidos', component: OrdersComponent },
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

// Declaración del módulo de rutas con configuraciones adicionales
@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',  // Restaura la posición de desplazamiento
        anchorScrolling: 'enabled',             // Habilita desplazamiento por anclas
        onSameUrlNavigation: 'reload' // Este parámetro permite recargar en la misma URL con diferente fragmento
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
