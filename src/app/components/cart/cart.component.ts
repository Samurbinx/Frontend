import { WorkService } from './../../services/work.service';
import { Component } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { ArtworkModel } from '../../models/artwork.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { PieceModel } from '../../models/piece.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  user: UserModel | null = null;
  userId: string | null = null;
  carted: ArtworkModel[] = [];

  constructor(private authService: AuthService, private workService: WorkService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.authService.getUserSubject().subscribe((user) => {
      this.user = user;
      const token = this.authService.getToken();

      if (token) {
        this.userId = this.authService.getUserId();
        this.loadArtworks();
      }
    });
  }

  private loadArtworks(): void {
    if (this.userId) {
      this.authService.getCarted(this.userId).subscribe(
        (response) => {
          this.carted = response.map(artwork => ArtworkModel.fromJson(artwork));
          console.log(this.carted);
        }
      )
    }
  }

  // getWorkTitle(id: number){
  //   this.workService.getWorkTitle(id.toString()).subscribe(
  //     (response) => {
  //       return response;
  //     }
  //   )
  // }

  getBackgroundImageUrl(image: string, piece: PieceModel): string {
    return `url('http://127.0.0.1:8080/piece/${piece.id}/${image}')`;

  }
}
