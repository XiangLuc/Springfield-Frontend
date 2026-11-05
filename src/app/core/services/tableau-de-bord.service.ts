import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonneesTableauDeBord, NiveauAttention } from '../../../api/models/ApiTableauDeBord';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TableauDeBordService {
  private readonly API = environment.apiUrl;
  private readonly endpoint = 'tableau-de-bord';

  constructor(private httpClient: HttpClient) {}

  consulter(stationId: number | null, niveauAttention: NiveauAttention | null,): Observable<DonneesTableauDeBord> {
    let params = new HttpParams();
    if (stationId !== null) {
      params = params.set('stationId', stationId);
    }
    if (niveauAttention !== null) {
      params = params.set('niveauAttention', niveauAttention);
    }
    return this.httpClient.get<DonneesTableauDeBord>(`${this.API}/${this.endpoint}`, { params });
  }
}
