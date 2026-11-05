import { MatPaginatorIntl } from '@angular/material/paginator';

export function paginateurFrancais(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = 'Éléments par page';
  intl.firstPageLabel = 'Première page';
  intl.lastPageLabel = 'Dernière page';
  intl.nextPageLabel = 'Page suivante';
  intl.previousPageLabel = 'Page précédente';
  intl.getRangeLabel = (page, taille, total) => {
    if (total === 0) {
      return '0 sur 0';
    }
    const debut = page * taille + 1;
    const fin = Math.min(debut + taille - 1, total);
    return `${debut} – ${fin} sur ${total}`;
  };
  return intl;
}
