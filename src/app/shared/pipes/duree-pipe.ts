import { Pipe, PipeTransform } from '@angular/core';

const MINUTES_PAR_HEURE = 60;
const HEURES_PAR_JOUR = 24;
const MINUTES_PAR_JOUR = MINUTES_PAR_HEURE * HEURES_PAR_JOUR;

// Affiche une durée exprimée en minutes avec les deux unités les plus parlantes (« 2 j 3 h », « 5 h 12 min »)
@Pipe({
  name: 'duree',
})
export class DureePipe implements PipeTransform {
  transform(minutes: number): string {
    const jours = Math.floor(minutes / MINUTES_PAR_JOUR);
    const heures = Math.floor(minutes / MINUTES_PAR_HEURE) % HEURES_PAR_JOUR;
    const minutesRestantes = minutes % MINUTES_PAR_HEURE;

    if (jours > 0) {
      return `${jours} j ${heures} h`;
    }
    if (heures > 0) {
      return `${heures} h ${minutesRestantes} min`;
    }
    return `${minutesRestantes} min`;
  }
}
