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
import { UserDataComponent } from './components/user-data/user-data.component';
import { FavoritesComponent } from './components/user-data/favorites/favorites.component';
import { OrdersComponent } from './components/user-data/orders/orders.component';
import { CartComponent } from './components/cart/cart.component';

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
