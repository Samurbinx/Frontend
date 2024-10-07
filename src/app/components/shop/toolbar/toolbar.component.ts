import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

import { ShopService } from './../../../services/shop.service';
import { ShopComponent } from '../shop.component';
import { IllustrationModel } from '../../../models/illustration.model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ 
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    ShopComponent,
    CommonModule
    ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit {

  constructor(private ShopService: ShopService){}
  orderby: string[] | undefined;
  illustrations: IllustrationModel[] | undefined;
  collections: string[] | undefined;
  searchBar: string = "";

  @Output() collectionSelected: EventEmitter<string> = new EventEmitter<string>(); // Evento para emitir el valor seleccionado
  @Output() orderSelected: EventEmitter<string> = new EventEmitter<string>(); // Evento para emitir el valor seleccionado
  @Output() searchBarText: EventEmitter<string> = new EventEmitter<string>(); // Evento para emitir el valor seleccionado

  ngOnInit(): void {
      this.orderby = [
        "Más populares",
        "Novedades",
        "Mejor valorados",
        "Precio: de menor a mayor",
        "Precio: de mayor a menor"
      ]

      this.ShopService.getAllIllustration().subscribe(
        (illustrations: IllustrationModel[]) => {
          this.illustrations = illustrations;
          this.collections = Array.from(new Set(this.illustrations.map(illustration => illustration.collection)));
        },
        (error) => {
          console.error('Error fetching illustrations:', error);
        }
      );
  }


  // Método para manejar el cambio de selección
  onCollectionChange(event: any): void {
    const selectedValue = event.target.value;
    this.collectionSelected.emit(selectedValue); // Emitir el valor seleccionado
  }

  onOrderByChange(event: any): void {
    const selectedValue = event.target.value;
    this.orderSelected.emit(selectedValue); // Emitir el valor seleccionado
  }

  search():void {
    this.searchBarText.emit(this.searchBar); // Emitir el valor seleccionado
  }

}
