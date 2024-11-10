import { Routes } from '@angular/router';
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
import { CartComponent } from './components/user-data/cart/cart.component';
import { AuthGuard } from './guards/auth.guard';  // Importa el guard que creaste


export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'proyectos', component: WorksComponent },
    { path: 'proyectos/:title', component: WorkdetailComponent },
    { path: 'contacto', component: ContactComponent },
    { path: 'sobremi', component: AboutComponent },
    { path: 'registro', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    // canActivate: [AuthGuard],
    { path: 'userdata', component: UserDataComponent, 
        children: [
            { path: 'favoritos', component: FavoritesComponent },
            { path: 'pedidos', component: OrdersComponent },
            { path: 'carrito', component: CartComponent },
        ]
    },
    { path: '', redirectTo:'home', pathMatch:'full'},
    { path: '**', redirectTo:'home', pathMatch:'full'},
];
