import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { Equipement } from '../../../api/models/ApiEquipement';
import { Station } from '../../../api/models/ApiStation';
import { EquipementService } from '../../core/services/equipement.service';
import { StationService } from '../../core/services/station.service';
import { messageErreur } from '../../shared/erreurs/message-erreur';
import { EquipementListe } from '../equipements/equipement-liste/equipement-liste';

@Component({
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule, EquipementListe],
  selector: 'app-stations',
  styleUrl: './stations.scss',
  templateUrl: './stations.html',
})
export class Stations {
  stations = signal<Station[]>([]);
  idStationSelectionnee = signal<number | null>(null);
  equipements = signal<Equipement[]>([]);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  stationSelectionnee;

  constructor(
    private stationService: StationService,
    private equipementService: EquipementService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.stationSelectionnee = computed(() =>
      this.stations().find((station) => station.id === this.idStationSelectionnee()),
    );

    this.stationService.listerStations().subscribe({
      next: (stations) => this.stations.set(stations),
      error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
    });

    this.route.queryParamMap
      .pipe(
        map((parametres) => Number(parametres.get('station'))),
        filter((idStation) => idStation > 0),
        tap((idStation) => {
          this.idStationSelectionnee.set(idStation);
          this.chargement.set(true);
          this.erreur.set(null);
        }),
        switchMap((idStation) =>
          this.equipementService.listerEquipementsDeLaStation(idStation).pipe(
            catchError((erreur: HttpErrorResponse) => {
              this.erreur.set(messageErreur(erreur));
              return of([]);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((equipements) => {
        this.equipements.set(equipements);
        this.chargement.set(false);
      });
  }

  selectionnerStation(idStation: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { station: idStation },
      replaceUrl: true,
    });
  }
}
