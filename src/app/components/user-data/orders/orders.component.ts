import { CommonModule } from '@angular/common';
import { ArtworkModel } from '../../../models/artwork.model';
import { UserModel } from '../../../models/user.model';
import { OrderModel } from '../../../models/order.model';
import { AuthService } from '../../../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkService } from '../../../services/work.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  user: UserModel | null = null;
  userId: string | null = null;
  orders: OrderModel[] = [];

  constructor(private authService: AuthService, private workService: WorkService,private userService: UserService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.authService.getUserSubject().subscribe((user) => {
      this.user = user;
      const token = this.authService.getToken();

      if (token) {
        this.userId = this.authService.getUserId();
        this.loadArtworks();
      }
    });
  }

  private loadArtworks(): void {
    if (this.userId) {
      this.userService.getOrders(this.userId).subscribe((response) => {
        console.log(response);
        this.orders = response.map(order => OrderModel.fromJson(order));
      });
    }
  }

  getDate(order: OrderModel){
    return order.created_at.toString().split(" ");
  }
}
