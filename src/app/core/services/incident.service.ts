import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Affectation,
  DeclarationIncident,
  IncidentDetail,
  IncidentResume,
  ModificationIncident,
} from '../../../api/models/ApiIncident';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly API = environment.apiUrl;
  private readonly endpoint = 'incidents';

  constructor(private httpClient: HttpClient) {}

  listerIncidentsEnCours(): Observable<IncidentResume[]> {
    return this.httpClient.get<IncidentResume[]>(`${this.API}/${this.endpoint}`);
  }

  listerIncidentsResolus(): Observable<IncidentResume[]> {
    return this.httpClient.get<IncidentResume[]>(`${this.API}/${this.endpoint}/historique`);
  }

  trouverIncident(id: number): Observable<IncidentDetail> {
    return this.httpClient.get<IncidentDetail>(`${this.API}/${this.endpoint}/${id}`);
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
    return this.httpClient.post<IncidentResume>(
      `${this.API}/${this.endpoint}/${id}/resolution`,
      null,
    );
  }
}
