/*-----------------------------------Middleware de vérification de l'authentification de l'utisateur------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Sert à protéger les routes auxquelles il est appliqué en vérifiant que l'utilisateur qui envoie une requête est authentifié.

/***********************************************Appel des package et fichiers nécessaires**********************************************/

const jwt = require('jsonwebtoken'); //Package de gestion de token d'identification

//Appel du fichier de configuration de dotenv 
require('dotenv').config();

/**************************************************************Middleware*************************************************************/

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //Récupération dans le header "authorization" splitté autour de l'espace
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); //Décodage du token avec jsonwebtoken
        const userId = decodedToken.userId; //Récupération du userId dans l'objet issu du décodage
        
        //Vérification du userId de la requête
        if(req.body.userId && req.body.userId !== userId) {//Si ne correspond pas à celui du token
            throw 'User ID non valable';
        } else {//Si correspond le processus peut continuer
            next();
        }
    } catch (error) {/*En cas d'erreur on retourne un statut d'erreur + si on reçoit une erreur on la retourne, sinon on renvoie un
    message 'standard'*/
        res.status(401).json({ error: error | 'Requête non authentifiée' });
    }
};