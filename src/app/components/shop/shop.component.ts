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

  All_illustrations: IllustrationModel[] | undefined;
  illustrationsToShow: IllustrationModel[] | undefined;


  // Filters
  selectedCollection: string = "AllCollections"
  searchText: string = "";
  selectedOrder: string = "";



  constructor(private ShopService: ShopService){
  };

  ngOnInit(): void {
    this.ShopService.getAllIllustration().subscribe(
      (illustrations: IllustrationModel[]) => {
        this.All_illustrations = illustrations;
        this.illustrationsToShow = illustrations;
      },
      (error) => {
        console.error('Error fetching illustrations:', error);
      }
    );
  }

  // Funcionamiento de los iconos de favorito y carro de la compra
  toggleFav(illustration: IllustrationModel) {
    illustration.fav = !illustration.fav;
  }
  toggleCart(illustration: IllustrationModel) {
    illustration.cart = !illustration.cart;
  }

  // Los métodos handleCollectionChange, onOrderByChange y searching determinan el funcionamiento de los filtros de la toolbar
  //Checkfilters comprueba que todos los filtros funcionen a la vez cada vez que uno de estos cambia.
  
  // Comprueba la coleccion seleccionada y actualiza el array para mostrarlo
  handleCollectionChange(selectedCollection: string, checking: boolean): void {
    this.selectedCollection = selectedCollection

    if (selectedCollection == "AllCollections") {
      this.illustrationsToShow = this.All_illustrations;
    } else {
      if (this.All_illustrations) {
        this.illustrationsToShow = [];
        this.All_illustrations.forEach(illustration => {
          if (illustration.collection == selectedCollection) {
            this.illustrationsToShow?.push(illustration);
          }
        });
      }
    }
    if (!checking) {
      this.checkFilters();
    }  
  }

  // Comprueba el orden seleccionado y actualiza el array ordenándolo
  onOrderByChange(selectedOrder: string, checking: boolean): void {
    this.selectedOrder = selectedOrder;
    if (this.illustrationsToShow) {
      
      if (selectedOrder === "3") { // ordenar alfabéticamente
        this.illustrationsToShow.sort((a, b) => a.title.localeCompare(b.title));

      } else if (selectedOrder === "4") { // Ordenar por precio de menor a mayor
        this.illustrationsToShow.sort((a, b) => a.price - b.price);
        
      } else if (selectedOrder === "5") {  // Ordenar por precio de mayor a menor
        this.illustrationsToShow.sort((a, b) => b.price - a.price);

      } 
    }
    if (!checking) {
      this.checkFilters();
    }  
  }

  searching(searchText: string, checking: boolean) {
    this.searchText = searchText;
    let temporal: IllustrationModel[] = [];
    if (this.illustrationsToShow) {
      this.illustrationsToShow.forEach(illustration => {
        if (
          illustration.title.toLowerCase().includes(searchText.toLowerCase()) || 
          illustration.collection.toLowerCase().includes(searchText.toLowerCase())
        ) {
          temporal?.push(illustration);
        }
      });
    this.illustrationsToShow = temporal;
    }
    if (!checking) {
      this.checkFilters();
    }  
  }
  
  // Después de algun cambio en alguno de los tres filtros, comprueba los demás para asegurar que todo se mantenga
  checkFilters(){
    if (this.selectedCollection) {
        this.handleCollectionChange(this.selectedCollection, true);
    } else {
      this.illustrationsToShow = this.All_illustrations;
    }
    if (this.searchText) {
      this.searching(this.searchText, true);  
    }
    if (this.selectedOrder) {
      this.onOrderByChange(this.selectedOrder, true);
    }
  }
}
