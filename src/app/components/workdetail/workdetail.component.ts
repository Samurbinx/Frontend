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



   constructor(private router: Router, private route: ActivatedRoute, private workService: WorkService, private authService: AuthService) {
      this.work = new WorkModel(0, "Sin título", "", "", "", []);
   }

   ngOnInit() {
      // Obtiene el id del trabajo de los parámetros de la ruta
      const workID = this.route.snapshot.queryParams["id"];
   
      // Verifica si `workID` existe antes de continuar
      if (!workID) {
         console.error('No work ID found in route.');
         return;
      }
   
      // Obtiene el proyecto usando el servicio
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
   

   public favorite(artwork_id: number){
      let favicon = document.getElementById("fav-icon");
      favicon?.classList.toggle('favorited');

      let token = this.authService.getToken();
      console.log(token);

      let user_id = undefined;
      if (token) {
         this.authService.getIdByToken(token).subscribe(
            (response: any) => {
               if (response) {
                  user_id = response['user_id']
                  this.workService.addFavorite(user_id, artwork_id.toString()).subscribe(
                     (response: any) => {
                        if (response) {
                           console.log(response);
                        }
                     }
                  )
               }
            }
         )
      }
      console.log(user_id);

      
      // this.workService.addFavorite().subscribe(
      //    (response: any) => {
      //       if (response) {
      //          console.log(response);
      //       }
      //    }
      // )      
    }



}
