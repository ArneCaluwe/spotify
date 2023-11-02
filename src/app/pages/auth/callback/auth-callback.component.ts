import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchSpotifyToken } from '@app/state';
import { Store } from '@ngxs/store';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-auth-callback',
  template: `authenticated`,
})
export class AuthCallbackComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _store = inject(Store);

  ngOnInit(): void {
    console.log(this._route.snapshot.queryParams);
    this._store.dispatch(
      new FetchSpotifyToken(
        'pkce',
        this._route.snapshot.queryParamMap.get('code')!
      )
    );
  }
}
