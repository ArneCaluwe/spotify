import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpotifyState } from '@app/state';
import { Store } from '@ngxs/store';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Store).selectSnapshot(SpotifyState.accesToken);
  if (!token) {
    console.debug('no token found, skipping handling');
    return next(req);
  }
  console.debug('extending request with token', token);
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(req);
  return next(req);
};
