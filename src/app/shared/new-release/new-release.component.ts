import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Album } from '@app/services/spotify.service';
import { SpotifyState } from '@app/state';
import { Store } from '@ngxs/store';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-new-release',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-release.component.html',
  styleUrl: './new-release.component.scss',
})
export class NewReleaseComponent {
  @Input({ required: true })
  albumId!: string;

  album$: Observable<Album | undefined>;

  constructor(store: Store) {
    this.album$ = store
      .select(SpotifyState.albums)
      .pipe(map(albums => albums.find(a => a.id == this.albumId)));
  }
}
