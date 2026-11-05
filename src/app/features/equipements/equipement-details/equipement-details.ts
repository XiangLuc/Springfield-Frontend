import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import { Equipement, Incident } from '../../../../api/models/ApiEquipement';
import { EquipementService } from '../../../core/services/equipement.service';
import { Badge } from '../../../shared/composants/badge/badge';
import { messageErreur } from '../../../shared/erreurs/message-erreur';
import { LIBELLES_ETAT_EQUIPEMENT } from '../../../shared/libelles/libelles';

@Component({
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    Badge,
  ],
  selector: 'app-equipement-details',
  styleUrl: './equipement-details.scss',
  templateUrl: './equipement-details.html',
})
export class EquipementDetails {
  libellesEtat = LIBELLES_ETAT_EQUIPEMENT;
  colonnesEnCours = ['dateOuverture', 'description', 'statut', 'prestataire'];
  colonnesPasses = ['dateOuverture', 'description', 'prestataire', 'dateResolution'];

  equipement = signal<Equipement | null>(null);
  incidentsEnCours = signal<Incident[]>([]);
  incidentsPasses = signal<Incident[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor(
    private equipementService: EquipementService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap
      .pipe(
        map((parametres) => Number(parametres.get('id'))),
        tap(() => {
          this.chargement.set(true);
          this.erreur.set(null);
        }),
        switchMap((id) =>
          forkJoin({
            equipement: this.equipementService.trouverEquipement(id),
            incidentsEnCours: this.equipementService.listerIncidentsEnCours(id),
            incidentsPasses: this.equipementService.listerIncidentsPasses(id),
          }),
        ),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (fiche) => {
          this.equipement.set(fiche.equipement);
          this.incidentsEnCours.set(fiche.incidentsEnCours);
          this.incidentsPasses.set(fiche.incidentsPasses);
          this.chargement.set(false);
        },
        error: (erreur: HttpErrorResponse) => {
          this.erreur.set(messageErreur(erreur));
          this.chargement.set(false);
        },
      });
  }
}
