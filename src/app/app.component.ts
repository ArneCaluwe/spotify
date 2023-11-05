import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PkceAuthenticate } from './state';
import { AuthState } from './state/auth.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @Select(AuthState.hasAccesToken)
  hasAccessToken$!: Observable<boolean>;

  private _store = inject(Store);
  authenticate() {
    this._store.dispatch(new PkceAuthenticate());
  }
}
