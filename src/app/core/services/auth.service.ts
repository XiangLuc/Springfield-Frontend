import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Identifiants, NouvelAgent, Utilisateur } from '../../../api/models/ApiUtilisateur';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = environment.apiUrl;
  private readonly endpoint = 'auth';
  private readonly utilisateur = signal<Utilisateur | null>(null);

  readonly utilisateurConnecte = this.utilisateur.asReadonly();

  constructor(private httpClient: HttpClient) {}

  connecter(identifiants: Identifiants): Observable<Utilisateur> {
    return this.httpClient
      .post<Utilisateur>(`${this.API}/${this.endpoint}/connexion`, identifiants)
      .pipe(tap((utilisateur) => this.utilisateur.set(utilisateur)));
  }

  inscrire(nouvelAgent: NouvelAgent): Observable<Utilisateur> {
    return this.httpClient.post<Utilisateur>(
      `${this.API}/${this.endpoint}/inscription`,
      nouvelAgent,
    );
  }

  chargerUtilisateurConnecte(): Observable<Utilisateur | null> {
    return this.httpClient.get<Utilisateur | null>(`${this.API}/${this.endpoint}/info`).pipe(
      catchError(() => of(null)),
      tap((utilisateur) => this.utilisateur.set(utilisateur)),
    );
  }

  deconnecter(): Observable<unknown> {
    return this.httpClient.post(`${this.API}/${this.endpoint}/deconnexion`, null).pipe(
      catchError(() => of(null)),
      tap(() => this.oublierUtilisateur()),
    );
  }

  oublierUtilisateur(): void {
    this.utilisateur.set(null);
  }
}
