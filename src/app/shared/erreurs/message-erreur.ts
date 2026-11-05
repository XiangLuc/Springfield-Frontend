import { HttpErrorResponse } from '@angular/common/http';

export function messageErreur(erreur: HttpErrorResponse): string {
  if (erreur.status === 0) {
    return 'Le serveur est injoignable. Réessayez dans quelques instants.';
  }
  return erreur.error?.message ?? 'Une erreur inattendue est survenue.';
}
