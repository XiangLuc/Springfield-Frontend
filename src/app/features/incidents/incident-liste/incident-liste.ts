import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { IncidentResume } from '../../../../api/models/ApiIncident';
import { IncidentService } from '../../../core/services/incident.service';
import { messageErreur } from '../../../shared/erreurs/message-erreur';
import { ColonneIncident, IncidentTableau } from '../incident-tableau/incident-tableau';

@Component({
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, IncidentTableau],
  selector: 'app-incident-liste',
  styleUrl: './incident-liste.scss',
  templateUrl: './incident-liste.html',
})
export class IncidentListe {
  colonnes: ColonneIncident[] = [
    'dateOuverture',
    'equipement',
    'description',
    'duree',
    'statut',
    'prestataire',
    'action',
  ];

  incidents = signal<IncidentResume[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor(private incidentService: IncidentService) {
    this.incidentService
      .listerIncidentsEnCours()
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (incidents) => this.incidents.set(incidents),
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }
}
