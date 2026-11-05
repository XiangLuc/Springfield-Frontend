import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

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
  modeNuit;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
  ) {
    this.utilisateur = this.authService.utilisateurConnecte;
    this.modeNuit = this.themeService.modeNuit;
  }

  basculerTheme(): void {
    this.themeService.basculer();
  }
}
