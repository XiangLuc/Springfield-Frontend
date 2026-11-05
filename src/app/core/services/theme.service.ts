import { Injectable, signal } from '@angular/core';

const CLE_STOCKAGE = 'theme';
const VALEUR_NUIT = 'nuit';
const VALEUR_JOUR = 'jour';
const CLASSE_NUIT = 'mode-nuit';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
 
  modeNuit = signal(document.documentElement.classList.contains(CLASSE_NUIT));

  basculer(): void {
    const nuit = !this.modeNuit();
    this.modeNuit.set(nuit);
    document.documentElement.classList.toggle(CLASSE_NUIT, nuit);
    try {
      localStorage.setItem(CLE_STOCKAGE, nuit ? VALEUR_NUIT : VALEUR_JOUR);
    } catch {
    }
  }
}
