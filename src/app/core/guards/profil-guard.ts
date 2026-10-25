import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const profilGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return (
    authService.utilisateurConnecte()?.profil === route.data['profil'] ||
    router.createUrlTree(['/'])
  );
};
