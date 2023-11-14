import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Album, Artist } from '@app/services/spotify.service';
import { NewReleaseComponent } from '@app/shared/new-release/new-release.component';
import { SpotifyState } from '@app/state';
import { AlbumsState } from '@app/state/album.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, NewReleaseComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @Select(AlbumsState.newReleases)
  albums$!: Observable<Array<Album>>;

  @Select(SpotifyState.artists)
  artists$!: Observable<Array<Artist>>;
}
