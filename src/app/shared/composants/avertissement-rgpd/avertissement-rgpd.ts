import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  selector: 'app-avertissement-rgpd',
  styleUrl: './avertissement-rgpd.scss',
  templateUrl: './avertissement-rgpd.html',
})
export class AvertissementRgpd {}
