/*---------------------------------------Les controllers destinés à la gestion des commentaires-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const models = require('../models'); //Modèles dans la DB

/**********************************************Controllers d'affichage des commentaires************************************************/

exports.getOnePostComments = (req, res, next) => {
    //Récupération de l'id du post cible
    const pId = req.params.id;

    models.Comment.findAll({//Récupération de tous les commentaires du post cible
        where: { PostId: pId }
    })
    .then(comments => {//En cas de réussite
        res.status(200).json(comments); //Retourne les objets
        next();
    })
    .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/************************************************Controller de création d'un commentaire***********************************************/

exports.createComment = (req, res, next) => {
    //On récupère les informations nécessaires à la création du commentaire
    const { UserId, PostId, text } = req.body;
    
    models.User.findOne({//On recherche l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'firstname', 'lastname', 'role' ],
        where: { id: UserId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est trouvé dans la base
            models.Comment.create({//On crée du commentaire
                    UserId: UserId,
                    PostId: PostId,
                    userName: userFound.firstname + ' ' + userFound.lastname,
                    userRole: userFound.role,
                    text: text
                })
                .then(comment => {//Si la création réussit
                    res.status(200).json(comment); //On retourne la réponse et l'objet
                    next();
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        } else {//Si aucune correspondance n'est trouvée
            return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //On retourne un staut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/**********************************************Controller de modification d'un commentaire*********************************************/

exports.modifyComment = (req, res, next) => {
    //On récupère l'id du commentaire présent dans les paramètres de la requête
    const cId = req.params.id;
    
    models.Comment.findOne({//On recherche le commentaire en fonction de son id
        where: { id: cId }
    })
    .then(commentFound => {
        if(commentFound) {
            //On récupère le texte saisi
            const text = req.body.text;
            
            models.Comment.update({//On met à jour le commentaire ciblé par son Id
                text: text,
            },
            { where: { id: cId }}
            )
            .then(() => {//On va rechercher à nouveau le commentaire...
                models.Comment.findOne({
                    where: { id: cId }
                })
                .then(updatedComment => {//...pour en afficher le texte modifié
                    res.status(200).json(updatedComment);
                    next();
                })
                .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        } else {//Si le commentaire n'est pas trouvé
            return res.status(401).json({ error: 'Commentaire non trouvé !' }); //On retourne un staut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***********************************************Controller de suppression d'un commentaire*********************************************/

exports.deleteComment = (req, res, next) => {
    //On récupère l'id du commentaire présent dans les paramètres de la requête
    const cId = req.params.id;
    
    models.Comment.findOne({//On recherche le commentaire en fonction de son id
        where: { id: cId }
    })
    .then(commentFound => {
        if(commentFound) {
            models.Comment.destroy({//On supprime le commentaire ciblé par son Id
                where: { id: cId }
            })
            .then(() => {//Si la commande fonctionne on retourne un statut et un message de réussite
                res.status(200).json( {message: 'Commentaire supprimé !' } ); 
                next();
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        } else {//Si le commentaire n'est pas trouvé
            return res.status(401).json({ error: 'Commentaire non trouvé !' }); //On retourne un staut d'erreur et un message
        } 
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};