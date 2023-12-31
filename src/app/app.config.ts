import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  EnvironmentProviders,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '@env/environment';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { routes } from './app.routes';
import { authorizationInterceptor } from './interceptors/authorization.interceptor';
import { AuthState, SpotifyState } from './state';
import { AlbumsState } from './state/album.state';

const provideNgxs: () => EnvironmentProviders = () =>
  importProvidersFrom(
    NgxsModule.forRoot([SpotifyState, AlbumsState, AuthState], {
      developmentMode: !environment.production,
      selectorOptions: {
        suppressErrors: false,
        injectContainerState: false,
      },
    }),
    NgxsStoragePluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    })
  );

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideAnimations(),
    provideNgxs(),
    importProvidersFrom(),
  ],
};
