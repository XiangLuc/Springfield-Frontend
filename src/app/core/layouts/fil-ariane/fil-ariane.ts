import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

interface LienFilAriane {
  libelle: string;
  chemin?: string;
}

const ACCUEIL: LienFilAriane = { libelle: 'Accueil', chemin: '/' };

@Component({
  imports: [RouterLink, MatIconModule],
  selector: 'app-fil-ariane',
  styleUrl: './fil-ariane.scss',
  templateUrl: './fil-ariane.html',
})
export class FilAriane {
  liens: Signal<LienFilAriane[]>;

  constructor(private router: Router) {
    this.liens = toSignal(
      this.router.events.pipe(
        filter((evenement) => evenement instanceof NavigationEnd),
        map(() => this.construireLiens()),
      ),
      { initialValue: this.construireLiens() },
    );
  }

  private construireLiens(): LienFilAriane[] {
    let page = this.router.routerState.snapshot.root;
    while (page.firstChild) {
      page = page.firstChild;
    }
    if (!page.title || page.routeConfig?.path === '') {
      return [];
    }
    const parents: LienFilAriane[] = page.data['parents'] ?? [];
    // Une page peut avoir plusieurs parents : on suit celui d'où l'on vient, comme le lien de retour
    const origine = this.router.currentNavigation()?.previousNavigation?.finalUrl?.toString();
    const parent = parents.find((lien) => lien.chemin === origine) ?? parents[0];
    return [ACCUEIL, ...(parent ? [parent] : []), { libelle: page.title }];
  }
}
