import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { paginateurFrancais } from './shared/pagination/paginateur-francais';
import { AuthService } from './core/services/auth.service';

function enregistrerIcones(): void {
  const sanitizer = inject(DomSanitizer);
  inject(MatIconRegistry).addSvgIconResolver((nom) =>
    sanitizer.bypassSecurityTrustResourceUrl(`icons/${nom}.svg`),
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(enregistrerIcones),
    provideAppInitializer(() => inject(AuthService).chargerUtilisateurConnecte()),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: MatPaginatorIntl, useFactory: paginateurFrancais },
  ],
};
