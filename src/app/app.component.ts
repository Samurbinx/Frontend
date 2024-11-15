import { StorageService } from './services/storage.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {} from '@angular/common/http';

import { FormsModule } from '@angular/forms'

import { FooterComponent } from './components/commons/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/commons/navbar/navbar.component';
import { MessageService } from './services/message.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    NavbarComponent, 
    HomeComponent, 
    FooterComponent, 
    MatIconModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  
}
