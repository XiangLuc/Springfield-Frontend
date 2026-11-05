# Springfield-Frontend

Interface web de Springfield.

Elle a besoin du backend, qui est dans le dépôt [Springfield-Backend](https://github.com/XiangLuc/Springfield-Backend). Le détail du projet est dans le `journal.md` du backend.

## Prérequis

- Node.js LTS
- Angular CLI : `npm install -g @angular/cli`
- Le backend lancé sur http://localhost:8080

## Lancement

```bash
npm install
ng serve
```

L'application s'ouvre sur http://localhost:4200. Les appels à `/api` sont envoyés au backend grâce à `proxy.conf.json`.

## Autres commandes

- Tests : `ng test`
- Version de production : `ng build`

## Comptes de test

| Profil | Identifiant | Mot de passe |
|---|---|---|
| Responsable d'exploitation | `resp.exploitation` | `motdepasse-Admin12345@?` |
| Agent | `agent.terrain` | `motdepasse-Admin12345@?` |

Application déployée : https://springfield-d105.onrender.com/