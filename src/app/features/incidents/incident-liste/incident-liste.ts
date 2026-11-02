import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { StatutIncident } from '../../../../api/models/ApiEquipement';
import { IncidentResume, Page } from '../../../../api/models/ApiIncident';
import { IncidentService } from '../../../core/services/incident.service';
import { messageErreur } from '../../../shared/erreurs/message-erreur';
import { LIBELLES_STATUT_INCIDENT } from '../../../shared/libelles/libelles';
import { ColonneIncident, IncidentTableau } from '../incident-tableau/incident-tableau';

const TAILLE_PAGE_PAR_DEFAUT = 20;
const TRI_PAR_DATE_OUVERTURE = 'dateOuverture,desc';

@Component({
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    IncidentTableau,
  ],
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
  statuts = Object.entries(LIBELLES_STATUT_INCIDENT) as [StatutIncident, string][];
  taillesDePage = [10, 20, 50];

  statut = signal<StatutIncident | null>(null);
  resultat = signal<Page<IncidentResume> | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor(private incidentService: IncidentService) {
    this.charger(0, TAILLE_PAGE_PAR_DEFAUT);
  }

  filtrerParStatut(statut: StatutIncident | null): void {
    this.statut.set(statut);
    this.charger(0, this.resultat()?.taille ?? TAILLE_PAGE_PAR_DEFAUT);
  }

  changerPage(evenement: PageEvent): void {
    this.charger(evenement.pageIndex, evenement.pageSize);
  }

  private charger(page: number, taille: number): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.incidentService
      .rechercherIncidents({ statut: this.statut(), page, taille, tri: TRI_PAR_DATE_OUVERTURE })
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (resultat) => this.resultat.set(resultat),
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }
}
