/*-----------------------------------Middleware de vérification de l'authentification de l'utisateur------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Sert à protéger les routes auxquelles il est appliqué en vérifiant que l'utilisateur qui envoie une requête est authentifié.

/***********************************************Appel des package et fichiers nécessaires**********************************************/

const jwt = require('jsonwebtoken'); //Package de gestion de token d'identification
const models = require('../models'); //Modèles dans la DB
require('dotenv').config({path: './config/.env'}); //Appel du fichier de configuration de dotenv

/***************************************Middleware de vérification que l'utilisateur est connecté**************************************/

exports.checkAuth = (req, res, next) => {
    const jwtCookie = req.cookies.jwt; //On récupère le contenu du cookie 'jwt'

    if(jwtCookie && jwtCookie != null) {//S'il y a un cookie 'jwt' non null donc contenant un token
        try {
            const decodedToken = jwt.verify(jwtCookie, process.env.SECRET_TOKEN); //On décode le token
            const tokenUId = decodedToken.userId; //On récupère userId dans l'objet issu du décodage

            if(!tokenUId) {//S'il n'y a pas de userId dans le token décodé
                res.locals.user = null; //On passe locals.user à null
                console.log('Problème d\'authentification : identifiant introuvable');
            } else {//S'il y a un userId dans le token décodé
                models.User.findOne({//On recherche l'utilisateur en fonction de cet id
                    where: { id: tokenUId }
                })
                .then(userExist => {
                    if(userExist) {//Si l'utilisateur est présent en base
                        res.locals.user = userExist; //On alimente locals.user avec les donées de l'utilisateur trouvé
                        next();
                    } else {//Si l'utilisateur n'existe pas dans la base
                        res.locals.user = null; //On passe locals.user à null
                        console.log('Utilisateur inconnu');
                        next();
                    }
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            }
        } catch (error) {//En cas d'erreur on retourne un statut d'erreur et un message
            res.status(401).json({ message: 'Problème avec le token' });
        }
    } else {//S'il n'y a pas de cookie 'jwt' avec un contenu
      res.locals.user = null; //On passe l'utilisateur local à null
      console.log('Pas de token dans le navigateur ');
      next();
    }
};

/**********************************Middleware de vérification du token lors d'une requête de connexion*********************************/

exports.requireAuth = (req, res, next) => {
    const jwtCookie = req.cookies.jwt; //On récupère le contenu du cookie 'jwt'

    if(jwtCookie && jwtCookie != null) {//S'il y a un cookie 'jwt' contenant un token
        try {
            const decodedToken = jwt.verify(jwtCookie, process.env.SECRET_TOKEN); //On décode le token
            const tokenUId = decodedToken.userId; //On récupère le userId dans l'objet issu du décodage

            if(!tokenUId) {//S'il n'y a pas de UserId
                console.log('Problème d\'authentification : identifiant introuvable'); //On retourne un message
            } else {//Si un userId est trouvé
                console.log(tokenUId); //On retourne sa valeur
                next();
            }
        } catch (error) {//En cas d'erreur on retourne un statut d'erreur et un message
            res.status(401).json({ message: 'Problème avec le token' });
        }
    } else {//S'il n'y a pas de cookie 'jwt avec un contenu
        console.log('Pas de token dans le navigateur'); //On retourne un message
    }
};