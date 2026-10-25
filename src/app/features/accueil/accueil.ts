import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [],
  selector: 'app-accueil',
  templateUrl: './accueil.html',
})
export class Accueil {
  utilisateur;

  constructor(private authService: AuthService) {
    this.utilisateur = this.authService.utilisateurConnecte;
  }
}
