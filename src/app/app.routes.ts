import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WorksComponent } from './components/works/works.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { WorkdetailComponent } from './components/workdetail/workdetail.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ShopComponent } from './components/shop/shop.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'proyectos', component: WorksComponent },
    { path: 'proyectos/:title', component: WorkdetailComponent },
    { path: 'contacto', component: ContactComponent },
    { path: 'sobremi', component: AboutComponent },
    { path: 'registro', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'tienda', component: ShopComponent },
    { path: '', redirectTo:'home', pathMatch:'full'},
    { path: '**', redirectTo:'home', pathMatch:'full'},
];
