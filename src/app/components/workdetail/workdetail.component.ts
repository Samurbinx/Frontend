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
   hasdetails: boolean;



   constructor(private router: Router, private route: ActivatedRoute, private workService: WorkService, private pieceService: PieceService) {
      this.work = new WorkModel(0, "Sin título", "", "", "", []);
      this.hasdetails = false;
   }

   ngOnInit() {
      // Coge la ruta, la divide y almacena el id
      const workID = this.route.snapshot.queryParams["id"];

      // Busca el proyecto mediante la ruta
      this.workService.getWorkById(workID).subscribe(
         (work: WorkModel) => {
            if (work != undefined) {
               this.work = work;
               work.pieces.forEach(piece => {
                  if (piece.title === "CarruselPortada") {
                     this.hasdetails = true;
                  }
               });
            }
         },
         (error) => {
            console.error('Error fetching works:', error);
         }
      );
   }




}
