import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkService } from '../../services/work.service';
import { CommonModule } from '@angular/common';
import { WorkModel } from '../../models/work.model';
import { PieceService } from '../../services/piece.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { response } from 'express';
import { subscribe } from 'diagnostics_channel';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
   selector: 'app-workdetail',
   standalone: true,
   imports: [CommonModule, NgbModule],
   templateUrl: './workdetail.component.html',
   styleUrl: './workdetail.component.css'
})
export class WorkdetailComponent implements OnInit {
   work: WorkModel;
   user_id: string = "";
   cart_id: string = "";
   favs: number[] = [];
   carted: number[] = [];

   logged: boolean = false;


   constructor(private router: Router, private route: ActivatedRoute, private workService: WorkService, private authService: AuthService, private cartService: CartService, private snackBar: MatSnackBar) {
      this.work = new WorkModel(0, "Sin título", "", "", "", []);
   }

   ngOnInit() {
      this.setWork();
      this.setUserData();
   }


   public setWork() {
      const workID = this.route.snapshot.queryParams["id"];

      if (!workID) {
         console.error('No work ID found in route.');
         return;
      }
      this.workService.getWorkById(workID).subscribe(
         (response: any) => {
            if (response) {
               // Convierte el JSON recibido a una instancia de WorkModel
               this.work = WorkModel.fromJson(response);
            }
         },
         (error) => {
            console.error('Error fetching work:', error);
         }
      );
   }

   public setUserData() {
      let user_id = this.authService.getUserId();
      if (user_id) {
         this.user_id = user_id;
         this.logged = true;
         this.getFavs();
         this.getCarted();
         this.getCartId();
      }
   }

   public getFavs() {
      this.authService.getFavsId(this.user_id).subscribe(
         (response: number[]) => {
            if (response) {
               this.favs = response;
               if (this.favs && this.work) {
                  this.setFavs();
               }
            }
         },
         (error) => {
            console.error('Error fetching favorites:', error);
         }
      );
   }
   public setFavs() {
      this.work.artworks.forEach(artwork => {
         this.favs.forEach(id => {
            if (artwork.id == id) {
               let favicon = document.getElementById("fav-icon" + id);
               favicon?.classList.toggle('favorited');
            }
         })
      });
   }
   public favoriteToggle(artwork_id: number) {
      let favicon = document.getElementById("fav-icon" + artwork_id);
      favicon?.classList.toggle('favorited');

      let shouldAdd;
      if (favicon?.classList.contains('favorited')) {
         shouldAdd = true;
      } else {
         shouldAdd = false;
      }

      this.workService.toggleFavorite(this.user_id, artwork_id.toString(), shouldAdd).subscribe(
         (response: any) => {
            if (response) {
               console.log(response);
            }
         }
      )
   }

   public getCartId() {
      this.authService.getCartId(this.user_id).subscribe(
         (response: number) => {
            if (response) {
               this.cart_id = response.toString();
            }
         },
         (error) => {
            console.error('Error fetching cart_id:', error);
         }
      )
   }
   public getCarted() {
      this.authService.getCarted(this.user_id).subscribe(
         (response: number[]) => {
            if (response) {
               this.carted = response;
               if (this.carted && this.work) {
                  this.setCarted();
               }
            }
         },
         (error) => {
            console.error('Error fetching carted:', error);
         }
      )
   }
   public setCarted() {
      this.work.artworks.forEach(artwork => {
         this.carted.forEach(id => {
            if (artwork.id == id) {
               this.toggleIcon(artwork.id);
            }
         })
      });
   }

   public isCarted(artwork_id: number): boolean {
      let isCarted = false;
      this.carted.forEach(id => {
         if (id == artwork_id) {
            isCarted = true
         }
      });
      return isCarted;
   }

   public addToCart(artwork_id: number) {
      if (!this.isCarted(artwork_id)) {
         this.cartService.addToCart(this.cart_id, artwork_id.toString()).subscribe(
            (response: any) => {
               if (response) {
                  console.log(response);
                  this.snackBar.open('Producto añadido al carrito', '', { duration: 3000 });
               }
            }
         )
      }
   }

   public toggleIcon(artwork_id: number) {
      let isCarted = this.isCarted(artwork_id);

      let checkicon = document.getElementById('check-icon' + artwork_id);
      checkicon?.classList.toggle('icontoggle');
      let carticon = document.getElementById('cart-icon' + artwork_id);
      carticon?.classList.toggle('icontoggle');

   }

   public seeCart() {
      this.router.navigate(['/cart']);

   }
}

