# Instructions pour GitHub Copilot

1. **Utilisation de la Composition API avec TypeScript** :

   - Lors de la génération de code Vue.js, utilise toujours la Composition API avec TypeScript.

2. **Documentation des Fonctions** :

   - Pour chaque fonction créée, ajoute une documentation complète, peu importe le langage utilisé.
   - La documentation doit être rédigée en français.

3. **Nommage des Éléments** :

   - Les noms des fonctions, des variables et autres éléments doivent être en anglais.
   - Si une fonction est modifiée, mets à jour la documentation associée en conséquence.

4. **Suggestions de Code** :

   - Lorsque tu proposes des exemples de code, assure-toi qu'ils soient clairs et bien structurés.

5. **Respect des Bonnes Pratiques** :

   - Suis les meilleures pratiques de développement pour le langage utilisé (par exemple, l'indentation, la lisibilité du code, etc.).

6. **Gestion des Erreurs** :

   - Inclue toujours une gestion des erreurs appropriée dans le code généré.

7. **Optimisation des Performances** :

   - Prends en compte l'optimisation des performances dans tes suggestions de code.

8. **Mise à Jour des Fichiers d'Internationalisation** :

   - Lorsque je demande à mettre à jour un fichier d'internationalisation :
     - Corrige toutes les fautes d'orthographe, de grammaire et de conjugaison.
     - Améliore la syntaxe pour une meilleure fluidité.
     - Reformule les phrases peu claires pour les rendre plus compréhensibles et pratiques.
     - Assure-toi que la terminologie est cohérente dans tout le fichier.
     - Propose des alternatives pour améliorer les phrases si nécessaire.
     - Tenez compte des différences culturelles dans la formulation pour garantir l'adéquation du message.
     - Maintiens une structure logique et hiérarchique dans le texte.


10. **Développement Responsive** :

    - Tout développement frontend doit être conçu avec une approche "mobile-first".
    - Implémenter systématiquement les adaptations pour les breakpoints suivants :
      - Mobile (< 640px)
      - Tablette (640px - 1024px)
      - Desktop (> 1024px)
    - Assurer que tous les composants s'adaptent correctement à ces différentes tailles d'écran.
    - Tester et optimiser l'expérience utilisateur pour chaque breakpoint.
    - Utiliser les unités relatives (rem, %, vh, vw) plutôt que les valeurs fixes en pixels quand c'est possible.

11. **Utilisation du N-Grid de Naive UI** :

    - Pour le système de grille, utiliser les propriétés suivantes :
      - `x-gap` et `y-gap` pour définir les espaces entre les éléments
      - `cols` pour le nombre de colonnes (format : "1 640:2 1024:4")
      - Utiliser `n-gi` (abréviation de n-grid-item) avec la propriété `span` appropriée
    - Exemple de structure :
      ```vue
      <n-grid :cols="'1 640:2 1024:4'" :x-gap="12" :y-gap="8">
        <n-gi span="1">
          <!-- Contenu -->
        </n-gi>
      </n-grid>
      ```
    - Toujours adapter la grille aux breakpoints définis dans la section Responsive
    - Éviter l'utilisation de valeurs fixes pour les colonnes
    - Privilégier l'approche responsive native du composant

12. **Architecture AdonisJS 6 avec Inertia et Vue.js** :

    - Backend (AdonisJS 6) :
      - Utiliser les controllers pour la logique métier
      - Implémenter les validations avec les validators d'AdonisJS
      - Suivre l'architecture MVC d'AdonisJS
      - Utiliser les middlewares pour la gestion des autorisations
      - Respecter les conventions de nommage d'AdonisJS

    - Frontend (Inertia + Vue.js) :
      - Utiliser Inertia.js pour la communication entre AdonisJS et Vue.js
      - Structurer les composants Vue.js dans le dossier `resources/js/Pages`
      - Utiliser les layouts Inertia pour la structure commune des pages
      - Utiliser les helpers d'Inertia (`route()`, `usePage()`, etc.)

    - Bonnes pratiques :
      - Typer correctement les props Inertia avec TypeScript
      - Utiliser les shared data d'Inertia pour les données globales
      - Implémenter le middleware HandleInertiaRequests
      - Gérer les erreurs de validation côté serveur via Inertia
      - Optimiser les requêtes avec la méthode only() d'AdonisJS

Merci de respecter ces instructions lors de la génération de code et de la mise à jour des fichiers d'internationalisation.
