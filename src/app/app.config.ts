import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  EnvironmentProviders,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { environment } from '@env/environment';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { routes } from './app.routes';
import { authorizationInterceptor } from './interceptors/authorization.interceptor';
import { SpotifyState } from './state/spotify.state';

const provideNgxs: () => EnvironmentProviders = () =>
  importProvidersFrom(
    NgxsModule.forRoot([SpotifyState], {
      developmentMode: !environment.production,
      selectorOptions: {
        suppressErrors: false,
        injectContainerState: false,
      },
    }),
    NgxsStoragePluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    })
  );

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideAnimations(),
    provideNgxs(),
    importProvidersFrom(),
  ],
};
