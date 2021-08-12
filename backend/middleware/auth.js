/*-----------------------------------Middleware de vérification de l'authentification de l'utisateur------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Sert à protéger les routes auxquelles il est appliqué en vérifiant que l'utilisateur qui envoie une requête est authentifié.

/***********************************************Appel des package et fichiers nécessaires**********************************************/

const jwt = require('jsonwebtoken'); //Package de gestion de token d'identification
const models = require('../models'); //Modèles dans la DB
require('dotenv').config({path: './config/.env'}); //Appel du fichier de configuration de dotenv

/***************************************Middleware de vérification que l'utilisateur est connecté**************************************/

exports.checkAuth = (req, res, next) => {
    const jwtCookie = req.cookies.jwt; //Récupération du contenu du cookie 'jwt'

    if(jwtCookie && jwtCookie != null) {//S'il y a un cookie 'jwt' non null donc contenant un token
        try {
            const decodedToken = jwt.verify(jwtCookie, process.env.SECRET_TOKEN); //Décodage du token avec jsonwebtoken
            const tokenUId = decodedToken.userId; //Récupération du userId dans l'objet issu du décodage

            if(!tokenUId) {//S'il n'y a pas de userId dans le token décodé
                res.locals.user = null; //On passe locals.user à null
                res.cookie("jwt", "", { maxAge: 1 }); //On supprime le cookie 'jwt'
                throw 'Problème d\'authentification : identifiant utilisateur absent';
            } else {//S'il y a un userId dans le token décodé
                models.User.findOne({//On recherche l'utilisateur en fonction de cet id et on récupère les champs précisés dans 'attributes'
                    attributes: [ 'id' ],
                    where: { id: tokenUId }
                })
                .then(userExist => {
                    if(userExist) {//Si l'utilisateur est présent en base
                        res.locals.user = userExist; //On alimente locals.user avec les donées de l'utilisateur trouvé
                        next();
                    } else {//Si l'utilisateur n'existe pas dans la base
                        res.locals.user = null; //On passe locals.user à null
                        throw 'Utilisateur inconnu';
                    }
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            }
        } catch (error) {//En cas d'erreur on retourne un statut d'erreur + si on reçoit une erreur on la retourne, sinon on renvoie un message 'standard'
            res.status(401).json({ message: 'Problème avec le token' });
        }
    } else {//S'il n'y a pas de cookie 'jwt' avec un contenu
      res.locals.user = null; //On passe l'utilisateur local à null
      throw 'Pas de token dans le navigateur';
    }
};

/**********************************Middleware de vérification du token lors d'une requête de connexion*********************************/
//Permet de voir si une personne qui arrive sur le site a déjà un token pour pouvoir le connecter automatiquement

exports.requireAuth = (req, res, next) => {
    const jwtCookie = req.cookies.jwt; //Récupération du contenu du cookie 'jwt'

    if(jwtCookie && jwtCookie != null) {//S'il y a un cookie 'jwt' non null donc contenant un token
        try {
            const decodedToken = jwt.verify(jwtCookie, process.env.SECRET_TOKEN); //Décodage du token avec jsonwebtoken
            const tokenUId = decodedToken.userId; //Récupération du userId dans l'objet issu du décodage

            if(!tokenUId) {
                throw 'Problème d\'authentification : identifiant introuvable';
            } else {
                console.log(tokenUId);
                next();
            }
        } catch (error) {
            res.status(401).json({ message: 'Problème avec le token' });
        }
    } else {//S'il n'y a pas de cookie 'jwt avec un contenu
        throw 'Pas de token dans le navigateur';
    }
};