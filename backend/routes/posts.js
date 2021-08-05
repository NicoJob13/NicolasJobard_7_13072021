/*-----------------------------------------------Les routes destinées à gérer les posts-------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces routes vont permettre à l'utilisateur de créer un post, de le modifier et le supprimer.

/***************************************Appel des packages, controllers et middlewares nécessaires**************************************/

const express = require('express');
const postsCtrl = require('../controllers/posts');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); //Middleware de configuration du package de gestion des fichiers image

/**********************************************************Création du routeur*********************************************************/

const router = express.Router();

/************************************Les routes permettant d'appliquer la logique de fonctionnement************************************/

router.get('/', auth, postsCtrl.getAllPosts); //Affichage de tous les posts
router.post('/', auth, multer, postsCtrl.createPost); //Création d'un post
router.put('/:id', auth, multer, postsCtrl.modifyPost); //Modification d'un post
router.delete('/:id', auth, postsCtrl.deletePost); //Suppression d'un post

/****************************Export du router pour utilisation dans le fichier principal de l'application*****************************/

module.exports = router;