import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services/page.service';
import { PageModel } from '../../models/page.model';
import { error } from 'console';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  homePage: PageModel | undefined;

  constructor(private pageService: PageService) { }

  ngOnInit(): void {
    this.pageService.getHomePage().subscribe(
      (page: PageModel) => {
        this.homePage = page;
      },
      (error) => {
        console.log("Error", error);
      }
    );

  }


}
