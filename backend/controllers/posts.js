/*---------------------------------------Les controllers destinés à la gestion des publications-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const models = require('../models'); //Modèles dans la DB

/*************************************************Controllers d'affichage des posts***************************************************/

exports.getAllPosts = (req, res, next) => {
    models.Post.findAll({//Récupération de tous les posts avec tri chronologique inverse
        order: [[ 'createdAt', 'DESC' ]]
    })
    .then(posts => {//En cas de réussite
        res.status(200).json(posts); //On retourne un statut de réussite et les objets
        next();
    })
    .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***************************************************Controller de création d'un post**************************************************/

exports.createPost = (req, res, next) => {
    models.User.findOne({//On recherche l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'id', 'firstname', 'lastname', 'role' ],
        where: { id: req.body.UserId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est trouvé dans la base
            //Récupération du texte
            const text = req.body.text;
            
            if(text != null) {//Si du texte a été saisi
                models.Post.create({//Création du post
                    UserId: userFound.id,
                    userName: userFound.firstname + ' ' + userFound.lastname,
                    userRole: userFound.role,
                    text: text,
                })
                .then(createdPost => {
                    res.status(200).json(createdPost); //On retourne un statut de réussite et l'objet
                    next();
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            } else {//Si aucune information nécessaire à la création du post n'est présente
                res.status(400).json({ message: 'Aucun contenu à publier n\'est renseigné !' }); //On retourne un statut d'erreur et un message
            }
        } else {//Si aucune correspondance n'est trouvée
            return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //On retourne un statut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/**************************************************Controller de modification d'un post***********************************************/

exports.updatePost = (req, res, next) => {
    //Récupération de l'id du post présent dans les paramètres de la requête
    const pId = req.params.id;
    
    models.Post.findOne({//On recherche le post à modifier en fonction de son id
        where: { id: pId }
    })
    .then(postFound => {
        if(postFound) {//Si le post est trouvé
            models.Post.update({//On met à jour le post ciblé par son Id
                text: req.body.text,
            },
            { where: { id: pId } }
            )
            .then(() => {//On va rechercher à nouveau le post...
                models.Post.findOne({
                    where: { id: pId }
                })
                .then(updatedPost => {//...pour en afficher le texte modifié
                    res.status(200).json(updatedPost);
                    next();
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur 
        } else {//Si le post n'est pas trouvé
            return res.status(404).json({ error: 'Post non trouvé !' }); //On retourne un staut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/**************************************************Controller de suppression d'un post*************************************************/

exports.deletePost = (req, res, next) => {
    //Récupération de l'id du post présent dans les paramètres de la requête
    const pId = req.params.id;

    models.Post.findOne({//On recherche le post à supprimer en fonction de son id
        where: { id: pId }
    })
    .then(postFound => {
        if(postFound) {//Si le post est trouvé
            models.Post.destroy({//On supprime le post ciblé par son Id
                where: { id: pId }
            })
            .then(() => {//Si la commande fonctionne on retourne un message de réussite
                res.status(200).json( {message: 'Post et commentaires supprimés !' } ); 
                next();
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        } else {//Si le post n'est pas trouvé
            return res.status(404).json({ error: 'Post non trouvé !' }); //On retourne un statut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};