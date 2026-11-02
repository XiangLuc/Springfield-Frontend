import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Affectation,
  CreationEvaluation,
  CriteresRecherche,
  DeclarationIncident,
  Evaluation,
  IncidentResume,
  ModificationIncident,
  Page,
} from '../../../api/models/ApiIncident';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly API = environment.apiUrl;
  private readonly endpoint = 'incidents';

  constructor(private httpClient: HttpClient) {}

  rechercherIncidents(criteres: CriteresRecherche): Observable<Page<IncidentResume>> {
    let parametres = new HttpParams()
      .set('page', criteres.page)
      .set('size', criteres.taille)
      .set('sort', criteres.tri);
    if (criteres.statut) {
      parametres = parametres.set('statut', criteres.statut);
    }
    return this.httpClient.get<Page<IncidentResume>>(`${this.API}/${this.endpoint}`, {
      params: parametres,
    });
  }

  trouverIncident(id: number): Observable<IncidentResume> {
    return this.httpClient.get<IncidentResume>(`${this.API}/${this.endpoint}/${id}`);
  }

  trouverEvaluation(id: number): Observable<Evaluation> {
    return this.httpClient.get<Evaluation>(`${this.API}/${this.endpoint}/${id}/evaluation`);
  }

  evaluer(id: number, evaluation: CreationEvaluation): Observable<Evaluation> {
    return this.httpClient.post<Evaluation>(
      `${this.API}/${this.endpoint}/${id}/evaluation`,
      evaluation,
    );
  }

  declarer(declaration: DeclarationIncident): Observable<IncidentResume> {
    return this.httpClient.post<IncidentResume>(`${this.API}/${this.endpoint}`, declaration);
  }

  modifierDescription(id: number, modification: ModificationIncident): Observable<IncidentResume> {
    return this.httpClient.patch<IncidentResume>(`${this.API}/${this.endpoint}/${id}`, modification);
  }

  affecter(id: number, affectation: Affectation): Observable<IncidentResume> {
    return this.httpClient.put<IncidentResume>(
      `${this.API}/${this.endpoint}/${id}/prestataire`,
      affectation,
    );
  }

  resoudre(id: number): Observable<IncidentResume> {
    return this.httpClient.patch<IncidentResume>(
      `${this.API}/${this.endpoint}/${id}/resolution`,
      null,
    );
  }
}
