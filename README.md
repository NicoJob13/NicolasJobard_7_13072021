# NicolasJobard_7_13072021
Projet 7 de la formation Développeur Web d'OpenClassrooms.
## Intitulé du projet
Créez un réseau social d’entreprise.
## Scénario du projet
* En tant que développeur full stack au sein de l'agence CONNECT-E, créer pour le groupe Groupomania, spécialisé dans la grande distribution, le MVP d'un réseau social interne.
* Présenter l'application à la directrice de l'agence.
## Objectifs
* Authentifier un utilisateur et maintenir sa session;
* Implémenter un stockage de données sécurisé en utilisant SQL;
* Gérer un stockage de données à l'aide de SQL;
* Personnaliser le contenu envoyé à un client web.
## Cadrage du projet
### Exigences client
* Fonctionnalités simples;
* Profil sommaire;
* Création de compte réalisable par mobile;
* Possibilité de suppression du compte;
* Publication de contenus multimédias ou textes;
* Mise en évidence des dernières publications;
* Possibilité de modération. 
### Contraintes techniques
* Développement d'une des fonctionnalités souhaitée par le client :
    * Publication d'articles,
    * Publication de photo;
* Possibilité de commenter;
* Utilisation d'une base de donnée relationnelle SQL;
* Sécurisation des données de connexion;
* Persistance de la session tant que l'utilisateur est connecté;
* HTML, CSS et JS (frontend et backend).
### Libertés techniques
* Libre choix du framework frontend - framework choisi : ReactJS;
* Libre choix du design de l'interface utilisateur.
## Livrables
* Le lien vers un dépôt Git public contenant le code de l'application.
## Comment utiliser ce dépôt
* S'assurer au préalable de disposer de node.js sur le poste, sinon le télécharger (https://nodejs.org/) puis l'installer;
### Partie Backend
* Créer une base de données MySQL vide; 
* Ouvrir le dossier 'backend' du projet dans son IDE;
* Ouvrir un terminal et suivre les étapes d'installation suivantes :
    * npm install (qui installe les dépendances du projet),
    * créer un fichier '.env' dans le dossier 'config' afin d'y renseigner les variables d'environnement suivantes :
        * DB_NAME=le nom de votre base de données
        * DB_USER=votre nom d'utilisateur
        * DB_PASS=votre mot de passe
        * DB_HOST=localhost
        * DIALECT=mysql
        * SECRET_TOKEN=9UYxK7Lt7Np86mUqS2gS
        * PORT=5000
        * CLIENT_URL=http://localhost:3000
* Exécuter 'nodemon server' ou 'npm start' : les message 'Listening on port 5000' et 'Connexion à la base de données MySQL réussie !' doivent apparaître;
* Dans un terminal exécuter la commande : npx sequelize-cli db:migrate. Cela crééra les tables de la base.
### Partie Frontend
* Ouvrir le dossier 'frontend' dans son IDE;
* Ouvrir un terminal et suivre les étapes d'installation suivantes :
    * npm install (qui installe les dépendances du projet);
* Exécuter 'npm start'
* Une fois la compilation effectuée, vous serez automatiquement redirigé vers 'http://localhost:3000/'.