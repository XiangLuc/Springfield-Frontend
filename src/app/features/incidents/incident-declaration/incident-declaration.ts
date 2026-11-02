import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { Equipement } from '../../../../api/models/ApiEquipement';
import { LONGUEUR_MAX_DESCRIPTION } from '../../../../api/models/ApiIncident';
import { Station } from '../../../../api/models/ApiStation';
import { EquipementService } from '../../../core/services/equipement.service';
import { IncidentService } from '../../../core/services/incident.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StationService } from '../../../core/services/station.service';
import { messageErreur } from '../../../shared/erreurs/message-erreur';

// Refuse une description composée uniquement d'espaces, comme le fait le serveur (@NotBlank)
const CONTIENT_UN_CARACTERE_VISIBLE = /\S/;

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  selector: 'app-incident-declaration',
  styleUrl: './incident-declaration.scss',
  templateUrl: './incident-declaration.html',
})
export class IncidentDeclaration {
  longueurMaxDescription = LONGUEUR_MAX_DESCRIPTION;

  formulaire = new FormGroup({
    stationId: new FormControl<number | null>(null, Validators.required),
    equipementId: new FormControl<number | null>(null, Validators.required),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(CONTIENT_UN_CARACTERE_VISIBLE),
        Validators.maxLength(LONGUEUR_MAX_DESCRIPTION),
      ],
    }),
  });

  stations = signal<Station[]>([]);
  equipements = signal<Equipement[]>([]);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  constructor(
    private stationService: StationService,
    private equipementService: EquipementService,
    private incidentService: IncidentService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.stationService.listerStations().subscribe({
      next: (stations) => this.stations.set(stations),
      error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
    });

    this.formulaire.controls.stationId.valueChanges
      .pipe(
        tap(() => this.equipements.set([])),
        switchMap((idStation) =>
          idStation
            ? this.equipementService.listerEquipementsDeLaStation(idStation).pipe(
                catchError((erreur: HttpErrorResponse) => {
                  this.erreur.set(messageErreur(erreur));
                  return of([]);
                }),
              )
            : of([]),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((equipements) => this.equipements.set(equipements));

    this.preselectionnerEquipement();
  }

  changerStation(): void {
    this.formulaire.controls.equipementId.reset();
  }

  declarer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    const { equipementId, description } = this.formulaire.getRawValue();
    this.chargement.set(true);
    this.erreur.set(null);
    this.incidentService
      .declarer({ equipementId: equipementId!, description })
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (incident) => {
          this.notificationService.succes(`L'incident n°${incident.id} a été déclaré.`);
          this.router.navigate(['/incidents', incident.id]);
        },
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }

  // Arrivée depuis la fiche d'un équipement : la station et l'équipement sont déjà connus
  private preselectionnerEquipement(): void {
    const idEquipement = Number(this.route.snapshot.queryParamMap.get('equipement'));
    if (!idEquipement) {
      return;
    }
    this.equipementService.trouverEquipement(idEquipement).subscribe({
      next: (equipement) =>
        this.formulaire.patchValue({
          stationId: equipement.station.id,
          equipementId: equipement.id,
        }),
      error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
    });
  }
}
