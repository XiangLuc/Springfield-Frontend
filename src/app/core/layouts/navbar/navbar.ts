import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  afficherBoutonMenu = input(false);
  menuDemande = output();

  utilisateur;

  constructor(private authService: AuthService) {
    this.utilisateur = this.authService.utilisateurConnecte;
  }
}
