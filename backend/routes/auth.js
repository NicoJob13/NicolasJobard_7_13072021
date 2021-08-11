/*-------------------------------------------Les routes destinées à gérer l'authentification--------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces routes vont permettre à l'utilisateur de créer son compte, de se connecter à l'application, et de se déconnecter.

/***************************************Appel des packages, controllers et middlewares nécessaires**************************************/

const express = require('express');
const authCtrl = require('../controllers/auth'); //Les controllers liés à l'authentification (inscription, connexion, déconnexion)

/**********************************************************Création du routeur*********************************************************/

const router = express.Router();

/************************************Les routes permettant d'appliquer la logique de fonctionnement************************************/

router.post('/register', authCtrl.registerUser); //Inscription d'un utilisateur
router.post('/login', authCtrl.loginUser); //Connexion d'un utilisateur
router.get('/logout', authCtrl.logoutUser); //Déconnexion d'un utilisateur

/****************************Export du router pour utilisation dans le fichier principal de l'application*****************************/

module.exports = router;