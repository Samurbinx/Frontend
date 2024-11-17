import { StorageService } from './services/storage.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms'

import { FooterComponent } from './components/commons/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/commons/navbar/navbar.component';
import { MessageService } from './services/message.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NavbarComponent, 
    FooterComponent, 
    NgbModule
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  
}
