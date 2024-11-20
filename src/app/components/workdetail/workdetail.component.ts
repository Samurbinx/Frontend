import { CartService } from './../../services/cart.service';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkService } from '../../services/work.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { WorkModel } from '../../models/work.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { ArtworkModel } from '../../models/artwork.model';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../services/user.service';

@Component({
   selector: 'app-workdetail',
   standalone: true,
   imports: [CommonModule, NgbModule],
   templateUrl: './workdetail.component.html',
   styleUrl: './workdetail.component.css'
})

export class WorkdetailComponent implements OnInit, AfterViewInit {
   work: WorkModel;
   user_id: string = "";
  cart_id: number | null = null;
   favs: number[] = [];
   carted: ArtworkModel[] = [];

   logged: boolean = false;

   private fragment: string | null = null;

   constructor(
      private router: Router,
      private route: ActivatedRoute,
      private workService: WorkService,
      private authService: AuthService,
      private cartService: CartService,
      private userService: UserService,
      private snackBar: MatSnackBar,
      private viewportScroller: ViewportScroller,
      @Inject(PLATFORM_ID) private platformId: object
   ) {
      this.work = new WorkModel(0, "Sin título", "", "", "", []);
   }


   ngOnInit() {
      this.setWork();
      this.setUserData();
      this.route.fragment.subscribe(fragment => {
         this.fragment = fragment;
      });
   }
   ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
         // Usamos un setTimeout para asegurarnos de que el contenido esté cargado
         setTimeout(() => {
            if (this.fragment) {
               this.viewportScroller.scrollToAnchor(this.fragment);
            }
         }, 3000);
      }
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
      this.userService.getFavsId(this.user_id).subscribe(
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
      this.userService.getCartId(this.user_id).subscribe(
         (response: number) => {
            if (response) {
               this.cart_id = response;
            }
         },
         (error) => {
            console.error('Error fetching cart_id:', error);
         }
      )
   }
   public getCarted() {
      this.userService.getCarted(this.user_id).subscribe(
         (response: ArtworkModel[]) => {
            if (response) {
               response.forEach(artwork => {
                  this.carted.push(ArtworkModel.fromJson(artwork));
               });
               console.log(this.carted);
            }
         },
         (error) => {
            console.error('Error fetching carted:', error);
         }
      )
   }

   public isCarted(artwork_id: number): boolean {
      let isCarted = false;
      if (this.carted) {
      this.carted.forEach(artwork => {
         if (artwork.id == artwork_id) {
            isCarted = true
         }
      });
   }
      return isCarted;
   }

   public addToCart(artwork_id: number) {
      if (!this.isCarted(artwork_id) && this.cart_id) {
         this.cartService.addToCart(this.cart_id, artwork_id).subscribe(
            (response: any) => {
               if (response) {
                  console.log();
                  this.userService.updateCartLength(response['cart_length']);
                  this.snackBar.open('Producto añadido al carrito', '', { duration: 3000 });
               }
            }
         )
      }
   }

   public seeLogin() {
      window.open('/login', '_blank');
   }
}

