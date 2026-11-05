export function telechargerCsv(contenu: Blob, nomFichier: string): void {
  const url = URL.createObjectURL(contenu);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(url);
}