/*-----------------------------------------------Les routes destinées à gérer les posts-------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces routes vont permettre à l'utilisateur de créer un post, de le modifier et le supprimer.

/***************************************Appel des packages, controllers et middlewares nécessaires**************************************/

const express = require('express');
const postsCtrl = require('../controllers/posts'); //Les controllers d'affichage, création, modification, suppression des posts

/**********************************************************Création du routeur*********************************************************/

const router = express.Router();

/************************************Les routes permettant d'appliquer la logique de fonctionnement************************************/

router.get('/', postsCtrl.getAllPosts); //Affichage de tous les posts
router.post('/', postsCtrl.createPost); //Création d'un post
router.put('/:id', postsCtrl.updatePost); //Modification d'un post
router.delete('/:id', postsCtrl.deletePost); //Suppression d'un post

/****************************Export du router pour utilisation dans le fichier principal de l'application*****************************/

module.exports = router;