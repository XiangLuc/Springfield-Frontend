import { MatDatepickerIntl } from '@angular/material/datepicker';

export function calendrierFrancais(): MatDatepickerIntl {
  const intl = new MatDatepickerIntl();
  intl.calendarLabel = 'Calendrier';
  intl.openCalendarLabel = 'Ouvrir le calendrier';
  intl.closeCalendarLabel = 'Fermer le calendrier';
  intl.prevMonthLabel = 'Mois précédent';
  intl.nextMonthLabel = 'Mois suivant';
  intl.prevYearLabel = 'Année précédente';
  intl.nextYearLabel = 'Année suivante';
  intl.prevMultiYearLabel = '24 années précédentes';
  intl.nextMultiYearLabel = '24 années suivantes';
  intl.switchToMonthViewLabel = 'Choisir une date';
  intl.switchToMultiYearViewLabel = 'Choisir un mois et une année';
  return intl;
}
