import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestataire } from '../../../api/models/ApiEquipement';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PrestataireService {
  private readonly API = environment.apiUrl;
  private readonly endpoint = 'prestataires';

  constructor(private httpClient: HttpClient) {}

  listerPrestataires(): Observable<Prestataire[]> {
    return this.httpClient.get<Prestataire[]>(`${this.API}/${this.endpoint}`);
  }
}
