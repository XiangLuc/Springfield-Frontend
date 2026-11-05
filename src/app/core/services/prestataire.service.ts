import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrestataireNote } from '../../../api/models/ApiEquipement';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PrestataireService {
  private readonly API = environment.apiUrl;
  private readonly endpoint = 'prestataires';

  constructor(private httpClient: HttpClient) {}

  listerPrestataires(): Observable<PrestataireNote[]> {
    return this.httpClient.get<PrestataireNote[]>(`${this.API}/${this.endpoint}`);
  }
}
