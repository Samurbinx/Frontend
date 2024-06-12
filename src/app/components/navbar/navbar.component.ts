import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
isLoggedIn: any;
  constructor(private $userservice: UserService){}

  ngOnInit(): void {
      this.isLoggedIn = this.$userservice.isLoggedIn();
  }
  logout(){
    this.$userservice.logout();
      location.reload()
  }

}
