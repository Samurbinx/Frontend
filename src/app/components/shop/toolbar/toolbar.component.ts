import { Component, OnInit } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { ShopComponent } from '../shop.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ 
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    ShopComponent
    ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit {

  constructor(){}
  orderby: string[] | undefined;
  selected: string | undefined;

  ngOnInit(): void {
      this.orderby = [
        "Más populares",
        "Novedades",
        "Mejor valorados",
        "Precio: de menor a mayor",
        "Precio: de mayor a menor"
      ]
  }

}
