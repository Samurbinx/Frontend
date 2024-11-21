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
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { response } from 'express';


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
  cartId: number | null = null;
  checkedArtworks: { [id: number]: boolean } = {};
  selectedProduct = "";
  modal: any;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private cartService: CartService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loadData();
    this.modal = document.getElementById('soldModal');

    if (this.modal) {
      // Escucha el evento 'hidden.bs.modal' cuando el modal se cierra
      this.modal.addEventListener('hidden.bs.modal', () => {
        this.reload(); // Recargar la página
      });
    }
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
          this.cartId = response;
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
              if (!artwork.sold) {
                this.checkedArtworks[artwork.id] = isSelected; // Set default checked state to true     
                   
              }
            });
          });
        })
        this.userService.getCartLength(this.userId).subscribe(
          (response) => {
            this.userService.updateCartLength(response);        
          }
        )
    }
  }

  delArtwork(artworkId: number) {
    if (this.cartId) {
      this.cartService.delFromCart(this.cartId, artworkId).subscribe(
        (response) => {
          this.loadArtworks();

 

          this.snackBar.open(`Obra eliminada del carrito`,"", { duration: 3000 });
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
      if (this.checkedArtworks[artwork.id] && artwork.price && !artwork.sold) { // Check if this artwork is selected
        totalAmount += artwork.price;
      }
    });
    return totalAmount;
  }

  getselectedProductsString(): string {
    let count = this.count()
    return `${count} ${count === 1 ? 'producto seleccionado' : 'productos seleccionados'}`;
  }

  count(): number {
    let count = 0;

    this.carted.forEach(artwork => {
      if (!artwork.sold && this.checkedArtworks[artwork.id]) {
        count += 1;
      }
    });
    return count;
  }




  checkout() {
    let proceed = true;
    // 1. Comprobar que ninguna de las obras se haya vendido
    if (this.cartId) {

      this.cartService.getCartArtworks(this.cartId).subscribe(
        (response) => {
          let artworks = response.map(artwork => ArtworkModel.fromJson(artwork));
          console.log(artworks);
          artworks.forEach(artwork => {
            // Si alguna obra del carrito ha sido vendida pero el checkbox del html está seleccionado, avisar y recargar la página
            if (artwork.sold && this.checkedArtworks[artwork.id]) {
              proceed = false;
              this.openSoldModal();
            }
          });
          if (proceed && this.cartId) {
            // 2. Comprobar que haya alguna obra seleccionada
            this.cartService.getCartedSelected(this.cartId).subscribe(
              (response) => {
                let artworks = response.map(artwork => ArtworkModel.fromJson(artwork));
                // si no hay ninugna obra seleccionada, no procede
                if (artworks.length <= 0) {
                  proceed = false;
                  this.snackBar.open(`Por favor, seleccione una obra para continuar`,"", { duration: 3000 });
                } else {
                  if (proceed && this.cartId) {
                    this.cartService.updateTotalAmount(this.cartId, this.getTotalAmount()).subscribe()
                    this.router.navigate(["/checkout"]);
                  }
                }
              }
            )
          }
        }
      )
    }
  }

  // Acciones del soldModal
  openSoldModal() {
    const button = document.getElementById('soldModalBtn');
    button?.click();
  }
  reload() {
    window.location.reload();
  }

}

