import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Album, Artist } from '@app/services/spotify.service';
import { SpotifyState } from '@app/state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @Select(SpotifyState.albums)
  albums$!: Observable<Array<Album>>;

  @Select(SpotifyState.artists)
  artists$!: Observable<Array<Artist>>;
}
