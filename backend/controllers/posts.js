/*---------------------------------------Les controllers destinés à la gestion des publications-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const models = require('../models'); //Modèles dans la DB
const jwt = require('../utils/jwt'); //Fichier contenant les outils de gestion de tokens d'identification

/*************************************************Controllers d'affichage des posts***************************************************/

 exports.getAllPosts = (req, res, next) => {
    models.Post.findAll({//Récupération de tous les posts avec les informations précisées dans 'attributes' et tri chronologique inverse
        order: [[ 'createdAt', 'DESC' ]]
    })
        .then(posts => {//En cas de réussite
            res.status(200).json(posts); //Retourne tous les objets avec les attributs précédemment spécifiés
            next();
        })
        .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***************************************************Controller de création d'un post**************************************************/

exports.createPost = (req, res, next) => {
    //Récupération des données de l'authorisation présente dans le header pour en extraire l'id de l'utilisateur connecté
    const authData = req.headers['authorization'];
    const uId = jwt.getUId(authData);
    
    models.User.findOne({//On recherche l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'id', 'firstname', 'lastname', 'role' ],
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est trouvé dans la base
            //Récupération des données saisies pour la création du post depuis le body
            const text = req.body.text;
            
            if(text != null) {//Si des données sont renseignées
                models.Post.create({//Création du post
                    userId: userFound.id,
                    userName: userFound.firstname + ' ' + userFound.lastname,
                    userRole: userFound.role,
                    text: text
                })
                .then(createdPost => {//On va rechercher le post...
                    models.Post.findOne({
                        attributes: [ 'id', 'userId', 'userName', 'userRole', 'text', 'createdAt' ],
                        where: { id: createdPost.id }
                    })
                    .then(newPost => {//...pour en afficher les données
                        res.status(200).json( { message: 'Nouveau post enregistré !', newPost: newPost } ); //Retourne l'objet
                        next();
                    })
                    .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            } else {//Si aucune information nécessaire à la création du post n'est présente
                res.status(400).json({ message: 'Aucun contenu à publier n\'est renseigné !' }); //On retourne un staut d'erreur et un message
            }
        } else {//Si aucune correspondance n'est trouvée
            return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //On retourne un staut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/**************************************************Controller de modification d'un post***********************************************/

exports.modifyPost = (req, res, next) => {
    //Récupération de l'id du post présent dans les paramètres de la requête
    const pId = req.params.id;
    
    models.Post.findOne({//On recherche le post à modifier en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'userId', 'text', 'updatedAt' ],
        where: { id: pId }
    })
    .then(postFound => {
        if(postFound) {
            //Récupération des données de l'authorisation présent dans le header pour en extraire l'id puis le role de cet utilisateur
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
                    
                    if(uId === postFound.userId || uRole === 'Chargé(e) de communication') {//Si les identifiants utilisateur du post et connecté correspondent ou que l'utilisateur est modérateur
                        //Recupération du texte saisi
                        const text = req.body.text;
                        
                        models.Post.update({//Mise à jour du post ciblé par son Id
                            text: (text ? text : postFound.text),
                            updatedAt: new Date()
                        },
                        { where: { id: pId } }
                        )
                        .then(() => {//On va rechercher à nouveau le post...
                            models.Post.findOne({
                                attributes: [ 'id', 'text', 'updatedAt' ],
                                where: { id: pId }
                            })
                            .then(updatedPost => {//...pour en afficher le texte modifié et la date de modification
                                res.status(200).json( {message: 'Post modifié !', updatedPost: updatedPost} );
                                next();
                            })
                            .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                        })
                        .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    } else {//Si les identifiants utilisateur du post et connecté ne correspondent pas ou que l'utilisateur n'est pas modérateur
                        return res.status(400).json({ error: 'Droits insuffisants pour procéder à la modification' }); //En cas d'erreur on retourne un statut d'erreur et un message
                    }   
                } else {//Si l'utilisateur n'est pas trouvé
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //On retourne un statut d'erreur et un message
                }
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        } else {
            return res.status(401).json({ error: 'Post non trouvé !' }); //On retourne un staut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/**************************************************Controller de suppression d'un post*************************************************/

exports.deletePost = (req, res, next) => {
    //Récupération de l'id du post présent dans les paramètres de la requête
    const pId = req.params.id;

    models.Post.findOne({//On recherche le post à supprimer en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'userId' ],
        where: { id: pId }
    })
    .then(postFound => {
        if(postFound) {
            //Récupération des données de l'authorisation présent dans le header pour en extraire l'id
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
                    
                    if(uId === postFound.userId || uRole === 'Chargé(e) de communication') {//Si les identifiants utilisateur du post et connecté correspondent ou que l'utilisateur est modérateur
                        
                        models.Comment.destroy({//Suppression préalable des commentaires du post ciblés par l'id du post, clé étrangère empêchant la suppression directe du post
                            where: { postId: pId }
                        })
                        .then(() => {//Si la commande fonctionne on retourne un message de réussite
                            models.Post.destroy({//Suppression du post ciblé par son Id
                                where: { id: pId }
                            })
                            .then(() => {//Si la commande fonctionne on retourne un message de réussite
                                res.status(200).json( {message: 'Post et commentaires supprimés !' } ); 
                                next();
                            })
                            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                        })
                        .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    } else {//Si les identifiants utilisateur du post et connecté ne correspondent pas ou que l'utilisateur n'est pas modérateur
                        return res.status(400).json({ error: 'Droits insuffisants pour procéder à la suppression' }); //En cas d'erreur on retourne un statut d'erreur et un message
                    }
                } else {//Si l'utilisateur n'est pas trouvé
                    return res.status(400).json({ error: 'Utilisateur non trouvé !' }); //On retourne un statut d'erreur et un message
                }
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        } else {
            return res.status(401).json({ error: 'Post non trouvé !' }); //On retourne un staut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};
