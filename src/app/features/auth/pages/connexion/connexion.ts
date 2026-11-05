import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { messageErreur } from '../../../../shared/erreurs/message-erreur';
import { VitrineConnexion } from '../../components/vitrine-connexion/vitrine-connexion';

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    VitrineConnexion,
  ],
  selector: 'app-connexion',
  styleUrl: './connexion.scss',
  templateUrl: './connexion.html',
})
export class Connexion {
  formulaire: FormGroup;
  motDePasseVisible = signal(false);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.formulaire = this.formBuilder.group({
      login: ['', Validators.required],
      motDePasse: ['', Validators.required],
    });
  }

  basculerVisibiliteMotDePasse(): void {
    this.motDePasseVisible.update((visible) => !visible);
  }

  connecter(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set(null);
    this.authService
      .connecter(this.formulaire.value)
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: () =>
          this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('retour') ?? '/', {
            replaceUrl: true,
          }),
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }
}
