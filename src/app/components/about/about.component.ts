import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services/page.service';
import { PageModel } from '../../models/page.model';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit{
  aboutPage: PageModel | undefined;
  URL_API = `${environment.apiUrl}/`;

  constructor(private pageService: PageService) { }

  ngOnInit(): void {
    this.pageService.getAboutMePage().subscribe(
      (page: PageModel) => {
        this.aboutPage = page;
        
      },
      (error) => {
        console.log("Error", error);
      }
    );
  }
}
