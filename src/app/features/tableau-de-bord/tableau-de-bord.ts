import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { EMPTY, Subject, catchError, switchMap, tap } from 'rxjs';
import { Station } from '../../../api/models/ApiStation';
import { DonneesTableauDeBord, NiveauAttention } from '../../../api/models/ApiTableauDeBord';
import { NotificationService } from '../../core/services/notification.service';
import { StationService } from '../../core/services/station.service';
import { TableauDeBordService } from '../../core/services/tableau-de-bord.service';
import { messageErreur } from '../../shared/erreurs/message-erreur';

interface PresentationNiveau {
  valeur: NiveauAttention;
  libelle: string;
  icone: string;
}

const NIVEAUX: PresentationNiveau[] = [
  { valeur: 'ROUGE', libelle: 'Rouge', icone: 'error' },
  { valeur: 'ORANGE', libelle: 'Orange', icone: 'warning' },
  { valeur: 'VERT', libelle: 'Vert', icone: 'check_circle' },
  { valeur: 'AFFECTE', libelle: 'Pris en charge', icone: 'engineering' },
];

@Component({
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  selector: 'app-tableau-de-bord',
  styleUrl: './tableau-de-bord.scss',
  templateUrl: './tableau-de-bord.html',
})
export class TableauDeBord {
  niveaux = NIVEAUX;

  tableauDeBord = signal<DonneesTableauDeBord | null>(null);
  stations = signal<Station[]>([]);
  stationId = signal<number | null>(null);
  niveauAttention = signal<NiveauAttention | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  private readonly chargementDemande = new Subject<void>();

  constructor(private tableauDeBordService: TableauDeBordService, private stationService: StationService, private notificationService: NotificationService) {
    this.chargementDemande
      .pipe(
        tap(() => {
          this.chargement.set(true);
          this.erreur.set(null);
        }),
        switchMap(() =>
          this.tableauDeBordService.consulter(this.stationId(), this.niveauAttention()).pipe(
            catchError((erreur: HttpErrorResponse) => {
              this.erreur.set(messageErreur(erreur));
              this.chargement.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((tableauDeBord) => {
        this.tableauDeBord.set(tableauDeBord);
        this.chargement.set(false);
      });

    this.charger();
    this.chargerStations();
  }

  charger(): void {
    this.chargementDemande.next();
  }

  filtrerParStation(stationId: number | null): void {
    this.stationId.set(stationId);
    this.charger();
  }

  basculerNiveau(niveau: NiveauAttention): void {
    this.niveauAttention.update((actuel) => (actuel === niveau ? null : niveau));
    this.charger();
  }

  reinitialiserFiltres(): void {
    this.stationId.set(null);
    this.niveauAttention.set(null);
    this.charger();
  }

  presentationDe(niveau: NiveauAttention): PresentationNiveau {
    return NIVEAUX.find((presentation) => presentation.valeur === niveau)!;
  }

  private chargerStations(): void {
    this.stationService
      .listerStations()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (stations) => this.stations.set(stations),
        error: (erreur: HttpErrorResponse) =>
          this.notificationService.erreur(messageErreur(erreur)),
      });
  }
}