import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService, TypeNotification } from '../../services/notification.service';

const ICONES: Record<TypeNotification, string> = {
  succes: 'check_circle',
  erreur: 'error',
  info: 'info',
};

@Component({
  imports: [MatIconModule],
  selector: 'app-toaster',
  styleUrl: './toaster.scss',
  templateUrl: './toaster.html',
})
export class Toaster {
  icones = ICONES;
  notifications;

  constructor(private notificationService: NotificationService) {
    this.notifications = this.notificationService.notifications;
  }

  fermer(id: number): void {
    this.notificationService.fermer(id);
  }
}
