import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';
import { IncidentResume } from '../../../api/models/ApiIncident';
import { IncidentService } from '../../core/services/incident.service';
import { messageErreur } from '../../shared/erreurs/message-erreur';
import {
  ColonneIncident,
  IncidentTableau,
} from '../incidents/incident-tableau/incident-tableau';

@Component({
  imports: [MatCardModule, IncidentTableau],
  selector: 'app-historique',
  styleUrl: './historique.scss',
  templateUrl: './historique.html',
})
export class Historique {
  colonnes: ColonneIncident[] = [
    'dateResolution',
    'equipement',
    'description',
    'prestataire',
    'duree',
    'action',
  ];

  incidents = signal<IncidentResume[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor(private incidentService: IncidentService) {
    this.incidentService
      .listerIncidentsResolus()
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (incidents) => this.incidents.set(incidents),
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }
}
