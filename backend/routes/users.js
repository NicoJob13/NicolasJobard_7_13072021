/*--------------------------------------------Les routes destinées à gérer les utilisateurs---------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces routes vont permettre à l'utilisateur de créer son compte, de se connecter à l'application, de modifier et supprimer son compte.

/***************************************Appel des packages, controllers et middlewares nécessaires**************************************/

const express = require('express');
const usersCtrl = require('../controllers/users');
const auth = require('../middleware/auth');

/**********************************************************Création du routeur*********************************************************/

const router = express.Router();

/************************************Les routes permettant d'appliquer la logique de fonctionnement************************************/

router.post('/signup', usersCtrl.signupUser); //Inscription d'un utilisateur
router.post('/login', usersCtrl.loginUser); //Connexion d'un utilisateur
router.get('/myaccount', auth, usersCtrl.getMyProfile); //Affichage du profil d'un utilisateur
router.put('/myaccount', auth, usersCtrl.updateMyProfile); //Modification d'un utilisateur
router.delete('/myaccount', auth, usersCtrl.deleteMyProfile); //Suppression d'un utilisateur

/****************************Export du router pour utilisation dans le fichier principal de l'application*****************************/

module.exports = router;