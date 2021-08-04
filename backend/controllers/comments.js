/*---------------------------------------Les controllers destinés à la gestion des commentaires-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const models = require('../models'); //Modèles dans la DB
const jwt = require('../utils/jwt'); //Fichier contenant les outils de gestion de tokens d'identification

/**********************************************Controllers d'affichage des commentaires************************************************/

exports.getOnePostComments = (req, res, next) => {
    //Récupération de l'id du post cible
    const pId = req.params.postId;

    models.Comment.findAll({//Récupération de tous les commentaires du post cible avec les informations précisées dans 'attributes' et tri chronologique inverse
        attributes: [ 'id', 'userId', 'postId', 'userName', 'text' ],
        order: [[ 'createdAt', 'ASC' ]],
        where: { postId: pId }
    })
    .then(comments => {//En cas de réussite
        res.status(200).json(comments); //Retourne tous les objets avec les attributs précédemment spécifiés
        next();
    })
    .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/************************************************Controller de création d'un commentaire***********************************************/

exports.createComment = (req, res, next) => {
    //Récupération des données de l'authorisation présente dans le header pour en extraire l'id de l'utilisateur connecté
    const authData = req.headers['authorization'];
    const uId = jwt.getUId(authData);
    
    models.User.findOne({//On recherche l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'id', 'firstname', 'lastname', 'role' ],
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est trouvé dans la base
            //Récupération de l'id du post depuis le body
            const pId = req.body.postId;

            //Récupération des données saisies pour la création du post depuis le body
            const text = req.body.text;
            
            if(text != null) {//Si des données sont renseignées
                models.Comment.create({//Création du commentaire
                    userId: userFound.id,
                    postId: pId,
                    userName: userFound.firstname + ' ' + userFound.lastname,
                    userRole: userFound.role,
                    text: text
                })
                .then(createdComment => {//On va rechercher le commentaire...
                    models.Comment.findOne({
                        attributes: [ 'id', 'userId', 'postId', 'userName', 'userRole', 'text' ],
                        where: { id: createdComment.id }
                    })
                    .then(newComment => {//...pour en afficher les données
                        res.status(200).json( { message: 'Nouveau commentaire enregistré !', newComment: newComment } ); //Retourne l'objet
                        next();
                    })
                    .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            } else {//Si aucune information nécessaire à la création du commentaire n'est présente
                res.status(400).json({ message: 'Aucun contenu à publier n\'est renseigné !' }); //On retourne un staut d'erreur et un message
            }
        } else {//Si aucune correspondance n'est trouvée
            return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //On retourne un staut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/**********************************************Controller de modification d'un commentaire*********************************************/

exports.modifyComment = (req, res, next) => {
    //Récupération de l'id du commentaire présent dans les paramètres de la requête
    const cId = req.params.id;
    
    models.Comment.findOne({//On recherche le commentaire en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'userId', 'text', 'updatedAt' ],
        where: { id: cId }
    })
    .then(commentFound => {
        if(commentFound) {
            //Récupération des données de l'authorisation présente dans le header pour en extraire l'id de l'utilisateur connecté
            const authData = req.headers['authorization'];
            const uId = jwt.getUId(authData);

            models.User.findOne({//On recherche l'utilisateur connecté par son id
                attributes: [ 'role' ],
                where: { id: uId }
            })
            .then(userFound => {
                if(userFound) {
                    //Récupération du rôle de l'utilisateur
                    const uRole = userFound.role;
                    
                    if(uId === commentFound.userId || uRole === 'Chargé(e) de communication') {//Si les identifiants utilisateur du post et connecté correspondent ou que l'utilisateur connecté est modérateur
                        //Recupération du texte saisi
                        const text = req.body.text;
                        
                        models.Comment.update({//Mise à jour du commentaire ciblé par son Id
                            text: (text ? text : commentFound.text),
                            updatedAt: new Date()
                        },
                        { where: { id: cId }}
                        )
                        .then(() => {//On va rechercher à nouveau le commentaire...
                            models.Comment.findOne({
                                attributes: [ 'id', 'text', 'updatedAt' ],
                                where: { id: cId }
                            })
                            .then(updatedComment => {//...pour en afficher le texte modifié et la date de modification
                                res.status(200).json( { message: 'Commentaire modifié !', updatedComment: updatedComment } );
                                next();
                            })
                            .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                        })
                        .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    } else {//Si les identifiants utilisateur du post et connecté ne correspondent pas ou que l'utilisateur connecté n'est pas modérateur
                        return res.status(400).json({ error: 'Droits insuffisants pour procéder à la modification' }); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    }   
                } else {////Si l'utilisateur n'est pas trouvé
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //On retourne un staut d'erreur et un message
                }
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
    //Récupération de l'id du commentaire présent dans les paramètres de la requête
    const cId = req.params.id;
    
    models.Comment.findOne({//On recherche le commentaire en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'userId' ],
        where: { id: cId }
    })
    .then(commentFound => {
        if(commentFound) {
            //Récupération des données de l'authorisation présente dans le header pour en extraire l'id de l'utilisateur connecté
            const authData = req.headers['authorization'];
            const uId = jwt.getUId(authData);

            models.User.findOne({//On recherche l'utilisateur connecté par son id
                attributes: [ 'role' ],
                where: { id: uId }
            })
            .then(userFound => {
                if(userFound) {
                    //Récupération du rôle de l'utilisateur
                    const uRole = userFound.role;
                    
                    if(uId === commentFound.userId || uRole === 'Chargé(e) de communication') {//Si les identifiants utilisateur du post et connecté correspondent ou que l'utilisateur connecté est modérateur 
                        //Recupération du texte saisi
                        const text = req.body.text;
                        
                        models.Comment.destroy({//Suppression du commentaire ciblé par son Id
                            where: { id: cId }
                        })
                        .then(() => {//Si la commande fonctionne on retourne un message de réussite
                            res.status(200).json( {message: 'Commentaire supprimé !' } ); 
                            next();
                        })
                        .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    } else {//Si les identifiants utilisateur du post et connecté ne correspondent pas ou que l'utilisateur connecté n'est pas modérateur
                        return res.status(400).json({ error: 'Droits insuffisants pour procéder à la suppression' }); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    }
                } else {//Si l'utilisateur n'est pas trouvé
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //On retourne un staut d'erreur et un message
                }
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        } else {//Si le commentaire n'est pas trouvé
            return res.status(401).json({ error: 'Commentaire non trouvé !' }); //On retourne un staut d'erreur et un message
        } 
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};