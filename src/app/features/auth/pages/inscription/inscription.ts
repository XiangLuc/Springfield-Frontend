import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { messageErreur } from '../../../../shared/erreurs/message-erreur';

const LONGUEUR_MAX_TEXTE = 50;
const LONGUEUR_MIN_MOT_DE_PASSE = 15;
const LONGUEUR_MAX_MOT_DE_PASSE = 128;

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  selector: 'app-inscription',
  styleUrl: './inscription.scss',
  templateUrl: './inscription.html',
})
export class Inscription {
  longueurMaxTexte = LONGUEUR_MAX_TEXTE;
  longueurMinMotDePasse = LONGUEUR_MIN_MOT_DE_PASSE;
  longueurMaxMotDePasse = LONGUEUR_MAX_MOT_DE_PASSE;

  formulaire: FormGroup;
  motDePasseVisible = signal(false);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.formulaire = this.formBuilder.group({
      prenom: ['', [Validators.required, Validators.maxLength(LONGUEUR_MAX_TEXTE)]],
      login: ['', [Validators.required, Validators.maxLength(LONGUEUR_MAX_TEXTE)]],
      motDePasse: [
        '',
        [
          Validators.required,
          Validators.minLength(LONGUEUR_MIN_MOT_DE_PASSE),
          Validators.maxLength(LONGUEUR_MAX_MOT_DE_PASSE),
        ],
      ],
    });
  }

  basculerVisibiliteMotDePasse(): void {
    this.motDePasseVisible.update((visible) => !visible);
  }

  creerCompte(formulaireSoumis: FormGroupDirective): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set(null);
    this.authService
      .inscrire(this.formulaire.value)
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (agent) => {
          this.notificationService.succes(`Le compte de ${agent.prenom} a été créé.`);
          formulaireSoumis.resetForm();
        },
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }
}
