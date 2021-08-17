/*--------------------------------------------Les routes destinées à gérer les commentaires---------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces routes vont permettre à l'utilisateur de commenter un post, de modifier et supprimer son commentaire.

/***************************************Appel des packages, controllers et middlewares nécessaires**************************************/

const express = require('express');
const commentsCtrl = require('../controllers/comments'); //Les controllers d'affichage, création, modification, suppression des commentaires

/**********************************************************Création du routeur*********************************************************/

const router = express.Router();

/************************************Les routes permettant d'appliquer la logique de fonctionnement************************************/

router.get('/post/:id', commentsCtrl.getOnePostComments); //Affichage des commentaires du post cible
router.post('/', commentsCtrl.createComment); //Création d'un commentaire
router.put('/:id', commentsCtrl.modifyComment); //Modification d'un commentaire
router.delete('/:id', commentsCtrl.deleteComment); //Suppression d'un commentaire

/****************************Export du router pour utilisation dans le fichier principal de l'application*****************************/

module.exports = router;