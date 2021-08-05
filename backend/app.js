/*-------------------------------------------------Fichier principal de l'application---------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/**********************************************Appel des framework et packages nécessaires*********************************************/

const express = require('express'); //Package de création d'API
const Sequelize = require('sequelize'); //Package permettant l'utilisation de l'ORM Sequelize pour interagir avec la DB
const helmet = require('helmet'); //Package de sécurisation des en-têtes
const rateLimit = require('express-rate-limit'); //Package permettant de limiter les requêtes pour une même adresse IP
const bodyParser = require('body-parser'); //Package d'analyse du corps d'une requête
const path = require('path'); //Package permettant d'accéder au path du serveur

/****************************************************Création de l'API avec Express****************************************************/

const app = express();

/***************************************Appel des fichiers de gestion des routes de l'application**************************************/

const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

/***************************************Limitation du nombre de requêtes pour une même adresse IP**************************************/
//Le but est d'empêcher les attaques en force brute

const limiter = rateLimit({//Appel du package
    windowMS: 5 * 60 * 1000, //Délai de mémorisation des requêtes et de blocage après dépassement du nombre de requêtes (en millisecondes)
    max: 50, //Nombre maximum de requêtes pour une même adresse IP
    message: "Trop de requêtes effectuées avec cette adresse IP",
});
  
app.use(limiter); //Utilisation de la règle créée

/***************Connexion à la base MySQL avec utilisation de variables d'environnement pour sécuriser l'accès à la base***************/

//Appel du fichier de configuration de dotenv 
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
        dialect: "mysql",
        host: process.env.DB_HOST,
        logging: false
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données MySQL réussie !');
    })
    .catch(err => {
        console.error('Echec de la connexion à la base de données MySQL :', err);
    });

/**********************************************************Middlewares généraux********************************************************/

app.use((req, res, next) => {//Middleware destiné à éviter les erreurs de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet()); //Middleware permettant de sécuriser les en-têtes

app.use(bodyParser.urlencoded({ extended: true })); //Permet de parser dans les objets inclus dans d'autres
app.use(bodyParser.json()); //Indique que l'on veut parser du JSON

app.use('/images', express.static(path.join(__dirname, 'images'))); //Gestion du routage de la ressource 'images' en statique

app.use('/api/users', usersRoutes); //Utilisation du routeur users pour toutes les demandes vers '/api/users/'
app.use('/api/posts', postsRoutes); //Utilisation du routeur posts pour toutes les demandes vers '/api/posts/'
app.use('/api/comments', commentsRoutes); //Utilisation du routeur comments pour toutes les demandes vers '/api/comments/'

/********************************************************Export de l'application*******************************************************/

module.exports = app;