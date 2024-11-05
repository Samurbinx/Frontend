import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkService } from '../../services/work.service';
import { CommonModule } from '@angular/common';
import { WorkModel } from '../../models/work.model';
import { PieceService } from '../../services/piece.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-workdetail',
   standalone: true,
   imports: [CommonModule, NgbModule],
   templateUrl: './workdetail.component.html',
   styleUrl: './workdetail.component.css'
})
export class WorkdetailComponent implements OnInit {
   work: WorkModel;



   constructor(private router: Router, private route: ActivatedRoute, private workService: WorkService, private pieceService: PieceService) {
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
   




}
