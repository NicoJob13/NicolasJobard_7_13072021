/*-------------------------------------------------Fichier principal de l'application---------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/**********************************************Appel des framework et packages nécessaires*********************************************/

const express = require('express'); //Package de création d'API
const Sequelize = require('sequelize'); //Package permettant l'utilisation de l'ORM Sequelize pour interagir avec la DB
const helmet = require('helmet'); //Package de sécurisation des en-têtes
const rateLimit = require('express-rate-limit'); //Package permettant de limiter les requêtes pour une même adresse IP
const bodyParser = require('body-parser'); //Package d'analyse du corps d'une requête
const cookieParser = require('cookie-parser'); //Package d'analyse du contenu d'un cookie
const path = require('path'); //Package permettant d'accéder au path du serveur
const { checkAuth, requireAuth } = require('./middleware/auth');
const cors = require('cors');

/****************************************************Création de l'API avec Express****************************************************/

const app = express();

/***************************************Appel des fichiers de gestion des routes de l'application**************************************/

const authRoutes = require('./routes/auth');
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
require('dotenv').config({path: './config/.env'});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
        dialect: process.env.DIALECT,
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

//Middleware de gestion des erreurs de CORS
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
};
app.use(cors(corsOptions));

app.use(helmet()); //Middleware permettant de sécuriser les en-têtes

//Body-Parser
app.use(bodyParser.urlencoded({ extended: true })); //Permet de parser dans les objets inclus dans d'autres
app.use(bodyParser.json()); //Indique que l'on veut parser du JSON

//Cookie-Parser
app.use(cookieParser()); //Permet de lire et décoder les cookies

//JSON Web Token
app.get('*', checkAuth); //Appel du middleware de vérification de l'authentification de l'utilisateur
app.get('/jwtid', requireAuth, (req, res) => {//Permet d'appeler le middleware de vérification de la présence d'un token dans le navigateur
    res.status(200).json(res.locals.user);
});

//Routes
app.use('/images', express.static(path.join(__dirname, 'images'))); //Gestion du routage de la ressource 'images' en statique

app.use('/api/auth', authRoutes); //Utilisation du routeur auth pour toutes les demandes vers '/api/auth/'
app.use('/api/users', checkAuth, usersRoutes); //Utilisation du routeur users pour toutes les demandes vers '/api/users/'
app.use('/api/posts', postsRoutes); //Utilisation du routeur posts pour toutes les demandes vers '/api/posts/'
app.use('/api/comments', commentsRoutes); //Utilisation du routeur comments pour toutes les demandes vers '/api/comments/'

/********************************************************Export de l'application*******************************************************/

module.exports = app;