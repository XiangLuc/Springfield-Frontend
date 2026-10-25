import { Injectable, signal } from '@angular/core';

export type TypeNotification = 'succes' | 'erreur' | 'info';

export interface Notification {
  id: number;
  type: TypeNotification;
  message: string;
}

const TEMPS_AFFICHAGE = 5000;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private prochainId = 0;
  private readonly liste = signal<Notification[]>([]);

  readonly notifications = this.liste.asReadonly();

  succes(message: string): void {
    this.afficher('succes', message);
  }

  erreur(message: string): void {
    this.afficher('erreur', message);
  }

  info(message: string): void {
    this.afficher('info', message);
  }

  fermer(id: number): void {
    this.liste.update((notifications) =>
      notifications.filter((notification) => notification.id !== id),
    );
  }

  private afficher(type: TypeNotification, message: string): void {
    const id = ++this.prochainId;
    this.liste.update((notifications) => [...notifications, { id, type, message }]);
    setTimeout(() => this.fermer(id), TEMPS_AFFICHAGE);
  }
}
