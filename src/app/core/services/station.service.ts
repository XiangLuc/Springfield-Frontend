import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultatImport } from '../../../api/models/ApiImport';
import { Station } from '../../../api/models/ApiStation';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private readonly API = environment.apiUrl;
  private readonly endpoint = 'stations';

  constructor(private httpClient: HttpClient) {}

  listerStations(): Observable<Station[]> {
    return this.httpClient.get<Station[]>(`${this.API}/${this.endpoint}`);
  }

  importer(fichier: File): Observable<ResultatImport> {
    const formulaire = new FormData();
    formulaire.append('fichier', fichier);
    return this.httpClient.post<ResultatImport>(`${this.API}/${this.endpoint}/import`, formulaire);
  }
}
