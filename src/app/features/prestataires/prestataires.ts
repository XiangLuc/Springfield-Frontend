import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { PrestataireNote } from '../../../api/models/ApiEquipement';
import { NOTE_MAXIMALE } from '../../../api/models/ApiIncident';
import { PrestataireService } from '../../core/services/prestataire.service';
import { messageErreur } from '../../shared/erreurs/message-erreur';

const FORMAT_NOTE = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

@Component({
  imports: [MatCardModule, MatTableModule],
  selector: 'app-prestataires',
  styleUrl: './prestataires.scss',
  templateUrl: './prestataires.html',
})
export class Prestataires {
  colonnes = ['nom', 'contact', 'noteMoyenne', 'nombreEvaluations'];
  noteMaximale = NOTE_MAXIMALE;

  prestataires = signal<PrestataireNote[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor(prestataireService: PrestataireService) {
    prestataireService
      .listerPrestataires()
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (prestataires) => this.prestataires.set(prestataires),
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }

  formaterNote(note: number): string {
    return FORMAT_NOTE.format(note);
  }
}
