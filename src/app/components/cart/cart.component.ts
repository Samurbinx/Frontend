import { MatFormFieldModule } from '@angular/material/form-field';
import { CartService } from './../../services/cart.service';
import { WorkService } from './../../services/work.service';
import { Component } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { ArtworkModel } from '../../models/artwork.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PieceModel } from '../../models/piece.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { UserService } from '../../services/user.service';
import { map, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  checkedArtworks: { [id: number]: boolean } = {};

  constructor(private authService: AuthService, private workService: WorkService, private snackBar: MatSnackBar, private cartService: CartService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.userId = this.authService.getUserId()
    if (this.userId) {

      this.authService.getUserById(this.userId).subscribe(
        (response) => {
          this.user = response;

        }
      )
      this.userService.getCartId(this.userId).subscribe(
        (response) => {
          this.cartId = response.toString();
          this.loadArtworks();

        }
      )
    }
  }

  loadArtworks(): void {
    if (this.userId) {
      this.userService.getCarted(this.userId).subscribe(
        (response) => {
          this.carted = response.map(artwork => ArtworkModel.fromJson(artwork));
          this.carted.forEach(artwork => {
            this.isSelected(artwork.id, (isSelected: boolean) => {
              this.checkedArtworks[artwork.id] = isSelected; // Set default checked state to true
            });
          });
          if (this.cartId) {
          }
        })
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

  toggleSelected(artworkId: number) {
    if (this.cartId) {
      this.cartService.toggleSelected(this.cartId, artworkId).subscribe(
        (response) => {
          this.loadArtworks();
        })
    }
  }


  isSelected(artworkId: number, callback: (isSelected: boolean) => void): void {
    if (this.cartId) {
      this.cartService.isSelected(this.cartId, artworkId).subscribe(
        (response: any) => {
          if (response.isSelected !== undefined) {
            callback(response.isSelected);  // Call the callback with the result
          } else if (response.error) {
            console.log('Error:', response.error);
          }
        },
        (error) => {
          console.error('Request failed', error);
        }
      );
    }
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


  checkout() {
    const count = Object.values(this.checkedArtworks).filter(isChecked => isChecked).length;
    if (count <= 0) {
      this.snackBar.open("Por favor, seleccione un producto para continuar", "", { duration: 3000 });
    } else {
      if (this.cartId) {
        this.cartService.updateTotalAmount(this.cartId, this.getTotalAmount()).subscribe()
        this.router.navigate(["/checkout"]);
      }
    }

  }



}

