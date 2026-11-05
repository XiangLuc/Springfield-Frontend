import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Signal, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { FilAriane } from '../fil-ariane/fil-ariane';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  imports: [RouterOutlet, MatSidenavModule, FilAriane, Navbar, Sidebar],
  selector: 'app-layout',
  styleUrl: './layout.scss',
  templateUrl: './layout.html',
})
export class Layout {
  private sidenav = viewChild.required(MatSidenav);

  estPetitEcran: Signal<boolean>;
  menuReplie = signal(false);

  constructor(breakpointObserver: BreakpointObserver) {
    this.estPetitEcran = toSignal(
      breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small])
        .pipe(map((etat) => etat.matches)),
      { initialValue: false },
    );
  }

  ouvrirMenu(): void {
    this.sidenav().open();
  }

  basculerRepliement(): void {
    if (this.estPetitEcran()) {
      this.sidenav().close();
    } else {
      this.menuReplie.update((replie) => !replie);
    }
  }

  fermerMenuSurPetitEcran(): void {
    if (this.estPetitEcran()) {
      this.sidenav().close();
    }
  }
}
