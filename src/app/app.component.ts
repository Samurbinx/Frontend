import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/commons/footer/footer.component';
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
    NgbModule,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  
}
