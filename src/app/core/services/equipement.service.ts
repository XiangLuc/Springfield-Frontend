import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipement, Incident } from '../../../api/models/ApiEquipement';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class EquipementService {
  private readonly API = environment.apiUrl;
  private readonly endpoint = 'equipements';

  constructor(private httpClient: HttpClient) {}

  trouverEquipement(id: number): Observable<Equipement> {
    return this.httpClient.get<Equipement>(`${this.API}/${this.endpoint}/${id}`);
  }

  listerIncidentsEnCours(id: number): Observable<Incident[]> {
    return this.httpClient.get<Incident[]>(`${this.API}/${this.endpoint}/${id}/incidents/en-cours`);
  }

  listerIncidentsPasses(id: number): Observable<Incident[]> {
    return this.httpClient.get<Incident[]>(`${this.API}/${this.endpoint}/${id}/incidents/passes`);
  }
}
