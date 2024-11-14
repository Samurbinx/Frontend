import { CommonModule } from '@angular/common';
import { ArtworkModel } from '../../../models/artwork.model';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkService } from '../../../services/work.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'] // Corrección en el nombre 'styleUrl' -> 'styleUrls'
})
export class FavoritesComponent implements OnInit {
  user: UserModel | null = null;
  userId: string | null = null;
  favorites: ArtworkModel[] = [];

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
      this.authService.getFavsArt(this.userId).subscribe((response) => {
        this.favorites = response.map(artwork => ArtworkModel.fromJson(artwork));
      });
    }
  }

  public favoriteToggle(artwork_id: number) {
    let favicon = document.getElementById("fav-icon" + artwork_id);
    favicon?.classList.toggle('favorited');

    let shouldAdd;
    if (favicon?.classList.contains('favorited')) {
      shouldAdd = true;
    } else {
      shouldAdd = false;
    }

    if (this.userId) {
      this.workService.toggleFavorite(this.userId, artwork_id.toString(), shouldAdd).subscribe(
        (response: any) => {
          if (response) {
            this.loadArtworks();
          }
        }
      )
    }
  }

}
