import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChargementPage } from './core/layouts/chargement-page/chargement-page';
import { Toaster } from './core/layouts/toaster/toaster';

@Component({
  imports: [RouterOutlet, ChargementPage, Toaster],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
