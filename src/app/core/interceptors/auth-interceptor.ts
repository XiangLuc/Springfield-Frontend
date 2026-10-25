import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((erreur: HttpErrorResponse) => {
      if (erreur.status === HttpStatusCode.Unauthorized && authService.utilisateurConnecte()) {
        authService.oublierUtilisateur();
        notificationService.info('Votre session a expiré. Reconnectez-vous.');
        router.navigate(['/connexion']);
      }
      return throwError(() => erreur);
    }),
  );
};
