import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { Prestataire } from '../../../../api/models/ApiEquipement';
import {
  Evaluation,
  IncidentResume,
  LONGUEUR_MAX_DESCRIPTION,
} from '../../../../api/models/ApiIncident';
import { AuthService } from '../../../core/services/auth.service';
import { IncidentService } from '../../../core/services/incident.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PrestataireService } from '../../../core/services/prestataire.service';
import { Badge } from '../../../shared/composants/badge/badge';
import { messageErreur } from '../../../shared/erreurs/message-erreur';
import { DureePipe } from '../../../shared/pipes/duree-pipe';

const CONTIENT_UN_CARACTERE_VISIBLE = /\S/;

@Component({
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    Badge,
    DureePipe,
  ],
  selector: 'app-incident-details',
  styleUrl: './incident-details.scss',
  templateUrl: './incident-details.html',
})
export class IncidentDetails {
  longueurMaxDescription = LONGUEUR_MAX_DESCRIPTION;

  description = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(CONTIENT_UN_CARACTERE_VISIBLE),
      Validators.maxLength(LONGUEUR_MAX_DESCRIPTION),
    ],
  });
  prestataireChoisi = new FormControl<number | null>(null, Validators.required);

  incident = signal<IncidentResume | null>(null);
  evaluation = signal<Evaluation | null>(null);
  prestataires = signal<Prestataire[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);
  editionDescription = signal(false);
  confirmationResolution = signal(false);
  actionEnCours = signal(false);

  estResolu;
  estResponsable;

  constructor(
    private incidentService: IncidentService,
    private prestataireService: PrestataireService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {
    this.estResolu = computed(() => this.incident()?.statut === 'RESOLU');
    this.estResponsable = computed(
      () => this.authService.utilisateurConnecte()?.profil === 'RESPONSABLE_EXPLOITATION',
    );

    this.route.paramMap
      .pipe(
        map((parametres) => Number(parametres.get('id'))),
        tap(() => {
          this.chargement.set(true);
          this.erreur.set(null);
        }),
        switchMap((id) => this.incidentService.trouverIncident(id)),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (incident) => {
          this.incident.set(incident);
          this.chargement.set(false);
          this.chargerEvaluationSiResolu();
          this.chargerPrestatairesSiNecessaire();
        },
        error: (erreur: HttpErrorResponse) => {
          this.erreur.set(messageErreur(erreur));
          this.chargement.set(false);
        },
      });
  }

  commencerEditionDescription(): void {
    this.description.setValue(this.incident()!.description);
    this.editionDescription.set(true);
  }

  annulerEditionDescription(): void {
    this.editionDescription.set(false);
  }

  enregistrerDescription(): void {
    if (this.description.invalid) {
      this.description.markAsTouched();
      return;
    }
    this.executer(
      this.incidentService.modifierDescription(this.incident()!.id, {
        description: this.description.value,
      }),
      'La description a été modifiée.',
      () => this.editionDescription.set(false),
    );
  }

  affecter(): void {
    if (this.prestataireChoisi.invalid) {
      this.prestataireChoisi.markAsTouched();
      return;
    }
    this.executer(
      this.incidentService.affecter(this.incident()!.id, {
        prestataireId: this.prestataireChoisi.value!,
      }),
      'Le prestataire a été affecté.',
      () => this.prestataireChoisi.reset(),
    );
  }

  demanderResolution(): void {
    this.confirmationResolution.set(true);
  }

  annulerResolution(): void {
    this.confirmationResolution.set(false);
  }

  confirmerResolution(): void {
    this.executer(
      this.incidentService.resoudre(this.incident()!.id),
      "L'incident est résolu.",
      () => this.confirmationResolution.set(false),
    );
  }

  private executer(
    action: Observable<IncidentResume>,
    messageSucces: string,
    apresSucces: () => void,
  ): void {
    this.actionEnCours.set(true);
    action.pipe(finalize(() => this.actionEnCours.set(false))).subscribe({
      next: (incident) => {
        this.incident.set(incident);
        apresSucces();
        this.notificationService.succes(messageSucces);
      },
      error: (erreur: HttpErrorResponse) => this.notificationService.erreur(messageErreur(erreur)),
    });
  }

  // Un incident résolu n'a pas forcément été évalué : l'absence d'évaluation n'est pas une erreur
  private chargerEvaluationSiResolu(): void {
    if (!this.estResolu()) {
      return;
    }
    this.incidentService
      .trouverEvaluation(this.incident()!.id)
      .pipe(catchError(() => of(null)))
      .subscribe((evaluation) => this.evaluation.set(evaluation));
  }

  // Seul le responsable peut affecter : inutile de charger la liste pour l'agent
  private chargerPrestatairesSiNecessaire(): void {
    if (!this.estResponsable() || this.estResolu() || this.prestataires().length > 0) {
      return;
    }
    this.prestataireService.listerPrestataires().subscribe({
      next: (prestataires) => this.prestataires.set(prestataires),
      error: (erreur: HttpErrorResponse) => this.notificationService.erreur(messageErreur(erreur)),
    });
  }
}
