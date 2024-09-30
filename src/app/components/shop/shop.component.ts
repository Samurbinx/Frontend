import { ShopService } from './../../services/shop.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IllustrationModel } from '../../models/illustration.model';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';



@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, 
    RouterModule, 
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  illustrations: IllustrationModel[] | undefined;

  constructor(private ShopService: ShopService){};

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

  
}
