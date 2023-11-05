import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PkceAuthenticate, RefreshSpotifyToken } from '@app/state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
})
export class AuthenticateComponent {
  private _store = inject(Store);

  onAuthenticate() {
    this._store.dispatch(new PkceAuthenticate());
  }

  onRefreshToken() {
    this._store.dispatch(new RefreshSpotifyToken());
  }
}
