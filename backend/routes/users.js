/*--------------------------------------------Les routes destinées à gérer les utilisateurs---------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces routes vont permettre à l'utilisateur d'afficher, modifier et supprimer son compte.

/***************************************Appel des packages, controllers et middlewares nécessaires**************************************/

const express = require('express');
const usersCtrl = require('../controllers/users'); //Les controllers liés à la gestion des utilisateurs (affichage, modification,
                                                   //suppression de compte)
const { checkAuth } = require('../middleware/auth');

/**********************************************************Création du routeur*********************************************************/

const router = express.Router();

/************************************Les routes permettant d'appliquer la logique de fonctionnement************************************/

router.get('/profile', checkAuth, usersCtrl.getMyProfile); //Affichage du profil d'un utilisateur
router.put('/update', checkAuth, usersCtrl.updateMyProfile); //Modification d'un utilisateur
router.delete('/delete', checkAuth, usersCtrl.deleteMyProfile); //Suppression d'un utilisateur

/****************************Export du router pour utilisation dans le fichier principal de l'application*****************************/

module.exports = router;