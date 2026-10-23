# FicheAssur CRM

Application de gestion séparée, réservée aux comptes administrateurs du backend FicheAssur.

    npm install
    npm run dev

CRM : http://localhost:3110. API : http://localhost:8100. Site : http://localhost:3100.
Les variables disponibles sont documentées dans `.env.example`.

Modules : tableau de bord, articles et guides, inventaire des leads, comptes clients,
historique des ventes et rapports clients avec export CSV filtré.

Les ventes sont des achats livrés (Purchase), pas des paniers en attente. Les clients
excluent les comptes administrateurs. Les montants sont les prix effectivement enregistrés
sur les achats; le CRM ne modifie ni les paiements ni les données commerciales.
Les leads disponibles tiennent compte de l'âge, des retraits, des exclusivités,
du nombre d'acheteurs et des réservations de paiement en cours.

Articles : blocs texte, titres et listes; pas de HTML arbitraire. Les brouillons sont
visibles dans l'aperçu du CRM uniquement. La publication alimente `/articles-et-guides`
et ses pages de détail sur le site. Les images sont des chemins du site ou des URL HTTPS.

Connexion : utiliser un compte dont le rôle est `admin`. Aucun compte ni mot de passe
administrateur n'est créé automatiquement. Le script existant du backend
`scripts/create_admin.py` permet de créer un administrateur si nécessaire.

Vérification : `npm run build` et `npm run typecheck`.

## Interface

Les composants de navigation, tableaux, boutons, champs et menu de compte sont repris du CRM New World Courtage, avec les couleurs navy de FicheAssur. La typographie est Google Sans Flex. La barre latérale se replie en icônes sur ordinateur et utilise un panneau sur mobile.
