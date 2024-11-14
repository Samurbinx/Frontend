import { MatFormFieldModule } from '@angular/material/form-field';
import { CartService } from './../../services/cart.service';
import { WorkService } from './../../services/work.service';
import { Component } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { ArtworkModel } from '../../models/artwork.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PieceModel } from '../../models/piece.model';
import { RouterLink } from '@angular/router';
import { toASCII } from 'punycode';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  user: UserModel | null = null;
  userId: string | null = null;
  carted: ArtworkModel[] = [];
  cartId: string | null = null;
  checkedArtworks: {[id: number]: boolean} = {};

  constructor(private authService: AuthService, private workService: WorkService, private cartService: CartService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.authService.getUserSubject().subscribe((user) => {
      this.user = user;
      const token = this.authService.getToken();

      if (this.userId) {
        this.authService.getCartId(this.userId).subscribe(
          (response) => {
            this.cartId = response.toString();
          }
        )
      }

      if (token) {
        this.userId = this.authService.getUserId();
        this.loadArtworks();
      }
    });
  }

  loadArtworks(): void {
    if (this.userId) {
      this.authService.getCarted(this.userId).subscribe(
        (response) => {
          this.carted = response.map(artwork => ArtworkModel.fromJson(artwork));
          this.carted.forEach(artwork => {
            this.checkedArtworks[artwork.id] = true; // Set default checked state to true
          });
        }
      )
    }
  }

  delArtwork(artworkId: number) {
    if (this.cartId) {
      this.cartService.delFromCart(this.cartId, artworkId).subscribe(
        (response) => {
          this.loadArtworks();
        })
    }
  }

  getBackgroundImageUrl(image: string, piece: PieceModel): string {
    return `url('http://127.0.0.1:8080/piece/${piece.id}/${image}')`;

  }

  getTotalAmount() {
    let totalAmount = 0;

    this.carted.forEach(artwork => {
      if (this.checkedArtworks[artwork.id] && artwork.price) { // Check if this artwork is selected
        totalAmount += artwork.price;
      }
    });

    return totalAmount;
  }

 get selectedProducts(): string {
  const count = Object.values(this.checkedArtworks).filter(isChecked => isChecked).length;
  return `${count} ${count === 1 ? 'producto seleccionado' : 'productos seleccionados'}`;
}



}

