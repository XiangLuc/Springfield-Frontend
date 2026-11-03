import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { EMPTY, Subject, catchError, debounceTime, filter, map, switchMap, tap } from 'rxjs';
import { PrestataireNote, StatutIncident } from '../../../../api/models/ApiEquipement';
import { FiltresIncidents, IncidentResume, Page } from '../../../../api/models/ApiIncident';
import { Station } from '../../../../api/models/ApiStation';
import { IncidentService } from '../../../core/services/incident.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PrestataireService } from '../../../core/services/prestataire.service';
import { StationService } from '../../../core/services/station.service';
import { calendrierFrancais } from '../../../shared/calendrier/calendrier-francais';
import { messageErreur } from '../../../shared/erreurs/message-erreur';
import { LIBELLES_STATUT_INCIDENT } from '../../../shared/libelles/libelles';
import { ColonneIncident, IncidentTableau } from '../incident-tableau/incident-tableau';

const TAILLE_PAGE_PAR_DEFAUT = 20;
const TRI_PAR_DEFAUT = 'dateOuverture,desc';
const DELAI_RECHERCHE_EN_MS = 300;
const AUCUN_FILTRE: FiltresIncidents = {
  motCle: '',
  statut: null,
  stationId: null,
  prestataireId: null,
  ouvertDepuis: null,
  ouvertJusquAu: null,
};

@Component({
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    IncidentTableau,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MatDatepickerIntl, useFactory: calendrierFrancais },
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
  tris = [
    { valeur: TRI_PAR_DEFAUT, libelle: 'Ouverture récente' },
    { valeur: 'dateOuverture,asc', libelle: 'Ouverture ancienne' },
    { valeur: 'dateResolution,desc', libelle: 'Résolution récente' },
    { valeur: 'statut,asc', libelle: 'Statut' },
    { valeur: 'equipement.station.nom,asc', libelle: 'Station' },
  ];

  stations = signal<Station[]>([]);
  prestataires = signal<PrestataireNote[]>([]);
  saisie = signal('');
  filtres = signal(AUCUN_FILTRE);
  tri = signal(TRI_PAR_DEFAUT);
  resultat = signal<Page<IncidentResume> | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  filtresActifs = computed(
    () => Boolean(this.saisie()) || Object.values(this.filtres()).some(Boolean),
  );

  private readonly chargementDemande = new Subject<{ page: number; taille: number }>();
  private readonly saisieRecherche = new Subject<string>();

  constructor(
    private incidentService: IncidentService,
    private stationService: StationService,
    private prestataireService: PrestataireService,
    private notificationService: NotificationService,
  ) {
    this.chargementDemande
      .pipe(
        tap(() => {
          this.chargement.set(true);
          this.erreur.set(null);
        }),
        switchMap(({ page, taille }) =>
          this.incidentService
            .rechercherIncidents({ ...this.filtres(), page, taille, tri: this.tri() })
            .pipe(
              catchError((erreur: HttpErrorResponse) => {
                this.erreur.set(messageErreur(erreur));
                this.chargement.set(false);
                return EMPTY;
              }),
            ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((resultat) => {
        this.resultat.set(resultat);
        this.chargement.set(false);
      });

    this.saisieRecherche
      .pipe(
        debounceTime(DELAI_RECHERCHE_EN_MS),
        map((saisie) => saisie.trim()),
        filter((motCle) => motCle !== this.filtres().motCle),
        takeUntilDestroyed(),
      )
      .subscribe((motCle) => this.filtrer({ motCle }));

    this.charger(0, TAILLE_PAGE_PAR_DEFAUT);
    this.chargerStations();
    this.chargerPrestataires();
  }

  saisirRecherche(saisie: string): void {
    this.saisie.set(saisie);
    this.saisieRecherche.next(saisie);
  }

  filtrer(changement: Partial<FiltresIncidents>): void {
    this.filtres.update((filtres) => ({ ...filtres, ...changement }));
    this.revenirALaPremierePage();
  }

  trier(tri: string): void {
    this.tri.set(tri);
    this.revenirALaPremierePage();
  }

  reinitialiserFiltres(): void {
    this.saisirRecherche('');
    this.filtres.set(AUCUN_FILTRE);
    this.revenirALaPremierePage();
  }

  changerPage(evenement: PageEvent): void {
    this.charger(evenement.pageIndex, evenement.pageSize);
  }

  private revenirALaPremierePage(): void {
    this.charger(0, this.resultat()?.taille ?? TAILLE_PAGE_PAR_DEFAUT);
  }

  private charger(page: number, taille: number): void {
    this.chargementDemande.next({ page, taille });
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

  private chargerPrestataires(): void {
    this.prestataireService
      .listerPrestataires()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (prestataires) => this.prestataires.set(prestataires),
        error: (erreur: HttpErrorResponse) =>
          this.notificationService.erreur(messageErreur(erreur)),
      });
  }
}
