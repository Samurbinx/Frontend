import { ArtworkService } from './../../services/artwork.service';
import { StorageService } from './../../services/storage.service';
import { CartService } from './../../services/cart.service';
import { Component } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { ArtworkModel } from '../../models/artwork.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PieceModel } from '../../models/piece.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationdialogComponent } from '../commons/confirmationdialog/confirmationdialog.component';
import { AlertdialogComponent } from '../commons/alertdialog/alertdialog.component';


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

  constructor(private authService: AuthService, public dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object, private artworkService: ArtworkService, private storageService: StorageService, private snackBar: MatSnackBar, private cartService: CartService, private router: Router, private userService: UserService) { }
  ngOnInit(): void {

    this.loadData();
    if (isPlatformBrowser(this.platformId)) {
      this.modal = document.getElementById('soldModal');
    }
    if (this.modal) {
      // Escucha el evento 'hidden.bs.modal' cuando el modal se cierra
      this.modal.addEventListener('hidden.bs.modal', () => {
        this.reload();
      });
    }
  }

  loadData() {
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
    } else {
      // OFFLINE CART
      this.loadOfflineArtworks();
    }
  }


  loadArtworks() {
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

  delArtwork(artwork: ArtworkModel) {
    const message = `Seguro que desea eliminar "${artwork.title}"?`;
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, { data: { message } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.cartId) {
          this.cartService.delFromCart(this.cartId, artwork.id).subscribe(
            (response) => {
              this.loadArtworks();
              this.snackBar.open(`Obra eliminada del carrito`, "", { duration: 3000 });
            })
        } else {
          let cart = this.storageService.getOfflineCart();
          let i = cart.indexOf(artwork.id)
          if (i > -1) {
            cart.splice(i, 1);
            this.storageService.setOfflineCart(cart);
            this.loadOfflineArtworks();
            this.snackBar.open(`Obra eliminada del carrito`, "", { duration: 3000 });
          }
        }
      }
    })
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
                  this.snackBar.open(`Por favor, seleccione una obra para continuar`, "", { duration: 3000 });
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
    } else {
      // OFFLINECART
      if (isPlatformBrowser(this.platformId)) {
        const message = `Para tramitar un pedido, porfavor inicie sesión`;
        const dialogRef = this.dialog.open(AlertdialogComponent, { data: { message } });
        dialogRef.afterClosed().subscribe(result => {
          window.open('/login', '_blank');
        })
      }
    }
  }

  // Acciones del soldModal
  openSoldModal() {
    const message = `Lo sentimos, una de las obras que tenías en el carrito ha sido vendida`;
    const dialogRef = this.dialog.open(AlertdialogComponent, { data: { message } });
    dialogRef.afterClosed().subscribe(result => {
      this.reload();
    })
  }

  reload() {
    window.location.reload();
  }


  // OFFLINE CART
  loadOfflineArtworks() {
    let cart = this.storageService.getOfflineCart();
    this.carted = [];
    cart.forEach(artwork_id => {
      let art = this.artworkService.getArtwork(artwork_id).subscribe(
        (response) => {
          let artwork = ArtworkModel.fromJson(response);
          this.checkedArtworks[artwork.id] = true; // Set default checked state to true     
          this.carted.push(artwork)
          console.log(this.carted);
        }
      );
    });
  }


}

