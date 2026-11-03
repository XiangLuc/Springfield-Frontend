import { Directive, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AvertissementRgpd } from './avertissement-rgpd';

const CLE_STOCKAGE = 'consentement-rgpd';
const VALEUR_ACCEPTE = 'accepte';

@Directive({
  selector: '[appAvertissementRgpd]',
})
export class AvertissementRgpdDirective {
  // À la fermeture, le focus revient sur le champ : sans ce drapeau, la modale se rouvrirait
  private dejaAffiche = false;
  private ignorerProchainDepart = false;

  constructor(
    private dialog: MatDialog,
    @Optional() @Self() private champ: NgControl | null,
  ) {}

  @HostListener('focus')
  afficher(): void {
    if (this.dejaAffiche || this.consentementDonne()) {
      return;
    }
    this.dejaAffiche = true;
    this.ignorerProchainDepart = !this.champ?.touched;
    this.dialog
      .open(AvertissementRgpd, { width: '480px', maxWidth: 'calc(100vw - 32px)' })
      .afterClosed()
      .subscribe((accepte) => {
        if (accepte) {
          this.enregistrerConsentement();
        }
      });
  }

  // La modale retire le focus du champ : il ne doit pas s'afficher en erreur avant toute saisie.
  // Différé, car le formulaire le marque touché sur ce même événement.
  @HostListener('blur')
  ignorerDepartVersLaModale(): void {
    if (this.ignorerProchainDepart) {
      this.ignorerProchainDepart = false;
      queueMicrotask(() => this.champ?.control?.markAsUntouched());
    }
  }

  private consentementDonne(): boolean {
    try {
      return localStorage.getItem(CLE_STOCKAGE) === VALEUR_ACCEPTE;
    } catch {
      return false;
    }
  }

  private enregistrerConsentement(): void {
    try {
      localStorage.setItem(CLE_STOCKAGE, VALEUR_ACCEPTE);
    } catch {}
  }
}
