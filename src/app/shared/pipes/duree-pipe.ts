import { Pipe, PipeTransform } from '@angular/core';

const HEURES_PAR_JOUR = 24;

// Affiche une durée exprimée en heures (« 1 j 23 h », « 5 h ») ; l'API ne donne pas de précision plus fine
@Pipe({
  name: 'duree',
})
export class DureePipe implements PipeTransform {
  transform(heures: number): string {
    const jours = Math.floor(heures / HEURES_PAR_JOUR);
    const heuresRestantes = heures % HEURES_PAR_JOUR;

    if (jours > 0) {
      return `${jours} j ${heuresRestantes} h`;
    }
    if (heures > 0) {
      return `${heures} h`;
    }
    return 'moins d’une heure';
  }
}
