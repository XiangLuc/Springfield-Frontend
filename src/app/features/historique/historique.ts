import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs';
import { IncidentResume, Page } from '../../../api/models/ApiIncident';
import { IncidentService } from '../../core/services/incident.service';
import { messageErreur } from '../../shared/erreurs/message-erreur';
import {
  ColonneIncident,
  IncidentTableau,
} from '../incidents/incident-tableau/incident-tableau';

const TAILLE_PAGE_PAR_DEFAUT = 20;
// RG7 : du plus récent au plus ancien, selon la date de résolution
const TRI_PAR_DATE_RESOLUTION = 'dateResolution,desc';

@Component({
  imports: [MatCardModule, MatPaginatorModule, IncidentTableau],
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
  taillesDePage = [10, 20, 50];

  resultat = signal<Page<IncidentResume> | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor(private incidentService: IncidentService) {
    this.charger(0, TAILLE_PAGE_PAR_DEFAUT);
  }

  changerPage(evenement: PageEvent): void {
    this.charger(evenement.pageIndex, evenement.pageSize);
  }

  private charger(page: number, taille: number): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.incidentService
      .rechercherIncidents({ statut: 'RESOLU', page, taille, tri: TRI_PAR_DATE_RESOLUTION })
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (resultat) => this.resultat.set(resultat),
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }
}
