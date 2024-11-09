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
   favs: number[] = [];


   constructor(private router: Router, private route: ActivatedRoute, private workService: WorkService, private authService: AuthService) {
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

   public setUserData(){
      let token = this.authService.getToken();

      if (token) {
         this.authService.getIdByToken(token).subscribe(
             (response: any) => {
                 if (response) {
                     this.user_id = response['user_id'];
                     if (this.user_id) {
                         this.authService.getFavs(this.user_id).subscribe(
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
                 }
             },
             (error) => {
                 console.error('Error fetching user ID:', error);
             }
         );
     }
   }

   public setFavs(){
      this.work.artworks.forEach(artwork => {
         this.favs.forEach(id => {
            if (artwork.id == id) {
               let favicon = document.getElementById("fav-icon"+id);
               favicon?.classList.toggle('favorited');
            }
         })
      });
   }

   public favorite(artwork_id: number) {
      let favicon = document.getElementById("fav-icon"+artwork_id);
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
}

