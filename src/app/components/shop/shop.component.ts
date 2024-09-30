import { ShopService } from './../../services/shop.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IllustrationModel } from '../../models/illustration.model';
import { ToolbarComponent } from "./toolbar/toolbar.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToolbarComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  illustrations: IllustrationModel[] | undefined;

  constructor(private ShopService: ShopService){
  };

  ngOnInit(): void {
    this.ShopService.getAllIllustration().subscribe(
      (illustrations: IllustrationModel[]) => {
        this.illustrations = illustrations;
        console.log(illustrations);
      },
      (error) => {
        console.error('Error fetching illustrations:', error);
      }
    );

  }

  toggleFav(illustration: IllustrationModel) {
    illustration.fav = !illustration.fav;
  }
  toggleCart(illustration: IllustrationModel) {
    illustration.cart = !illustration.cart;
  }
  


    

  
}
