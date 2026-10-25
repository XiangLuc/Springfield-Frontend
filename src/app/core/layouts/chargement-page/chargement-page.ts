import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter, map, of, switchMap, timer } from 'rxjs';

const TEMPS_AFFICHAGE = 150;

@Component({
  imports: [],
  selector: 'app-chargement-page',
  styleUrl: './chargement-page.scss',
  templateUrl: './chargement-page.html',
})
export class ChargementPage {
  enCours: Signal<boolean>;

  constructor(router: Router) {
    this.enCours = toSignal(
      router.events.pipe(
        filter(
          (evenement) =>
            evenement instanceof NavigationStart ||
            evenement instanceof NavigationEnd ||
            evenement instanceof NavigationCancel ||
            evenement instanceof NavigationError,
        ),
        switchMap((evenement) =>
          evenement instanceof NavigationStart
            ? timer(TEMPS_AFFICHAGE).pipe(map(() => true))
            : of(false),
        ),
      ),
      { initialValue: false },
    );
  }
}
