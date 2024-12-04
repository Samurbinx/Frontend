import { Component, OnInit } from '@angular/core';

import { WorkModel } from '../../models/work.model';
import { WorkService } from '../../services/work.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './works.component.html',
  styleUrl: './works.component.css'
})
export class WorksComponent implements OnInit {

  works: WorkModel[] | undefined;
  URL_API = `${environment.apiUrl}/`;

  constructor(private workService: WorkService) { 
  }

  ngOnInit(): void {
    this.workService.getAllWorks().subscribe(
      (works: WorkModel[]) => {
        this.works = works;
        // console.log(works);
      },
      (error) => {
        console.error('Error fetching works:', error);
      }
    );
  }
}
