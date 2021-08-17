/*---------------------------------------Les controllers destinés à la gestion des utilisateurs-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const bcrypt = require('bcrypt'); //Package de chiffrement pour le cryptage du mot de passe
const models = require('../models'); //Modèles dans la DB

/***********************************************Controller d'affichage des utilisateurs************************************************/

//Recherche de tous les utilisateurs
exports.getUsers = (req, res, next) => {
    models.User.findAll()
    .then(usersFound => {
        res.status(200).json({ data: usersFound }); //On retourne un statut de réussite et les données
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

//Recherche d'un utilisateur
exports.getUser = (req, res, next) => {
    //On récupère l'identfiant de l'utilisateur
    const uId = req.params.id;
    
    models.User.findOne({//On recherche l'utilisateur en fonction de son id
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est trouvé
            res.status(200).json(userFound); //On retourne les informations
            next();
        } else {//Si l'utilisateur n'est pas trouvé
            res.status(404).json({ error: 'Utilisateur non trouvé' }); //On retourne un statut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/*********************************************Controller de modification d'un utilisateur**********************************************/

exports.updateUser = (req, res, next) => {
    //On récupère l'identifiant de l'utilisateur
    const uId = req.params.id;

    //Récupération des données de l'utilisateur pour la modification
    const {password, controlPassword} = req.body;

    //Expressions régulières à vérifier pour l'e-mail et le mot de passe
    const passwordSchema = /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[_!@#$£µ=§%^&*?-\\/\\]).{8,}$/;
    
    models.User.findOne({//On recherche de l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est présent en base
            //Récupération du mot de passe de l'utilisateur en base de données
            const referencePassword = userFound.password;

            //On compare le mots de passe de contrôle avec celui enregistré dans la base
            bcrypt.compare(controlPassword, referencePassword)
            .then(passwordMatch => {
                if(!passwordMatch) {//S'ils ne correspondent pas
                    return res.status(409).json({ error: 'Mot de passe incorrect !' }); //On retourne un statut d'erreur et un message
                } else {//S'ils correspondent
                    if(!password.match(passwordSchema)) {//Si le nouveau mot de passe ne respecte pas l'expression régulière
                        res.status(400).json({ error: 'Mot de passe non conforme'}); //On retourne un statut d'erreur et un message
                    } else {//Si le nouveau mot de passe respecte l'expression régulière
                        bcrypt.hash(password, 10) //Hash du mot de passe par bcrypt avec 10 passes
                        .then(hash => {
                            models.User.update({//Mise à jour de l'utilisateur ciblé par son Id
                                password: hash,
                            }, { 
                                where: { id: userFound.id }
                            })
                            .then(() => {//On va rechercher à nouveau l'utilisateur...
                                models.User.findOne({
                                    attributes: [ 'id', 'firstname', 'lastname', 'email', 'role', 'updatedAt' ],
                                    where: { id: req.params.id }
                                })
                                .then(updatedProfile => {//...pour en afficher les informations modifiées avec un statut de réussite
                                    res.status(200).json({ message: 'Profil mis à jour !', updatedProfile });
                                    next();
                                })
                                .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                            })
                            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                        })
                        .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    }
                }
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur   
        } else {//Si l'utilisateur n'existe pas
            return res.status(404).json({ error: 'Utilisateur non trouvé !' }); //On retourne un statut d'erreur et un message
        }
    })   
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/*********************************************Controller de suppression d'un utilisateur***********************************************/

exports.deleteUser = (req, res, next) => {
    //On récupère l'identifiant de l'utilisateur
    const uId = req.params.id;
    
    models.User.findOne({//On recherche de l'utilisateur en fonction de son id
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est présent en base
            //On récupère le mot de passe saisi pour le contrôle d'identité
            const controlPassword = req.body.controlPassword; 
            
            //On récupère le mot de passe de l'utilisateur en base de données
            const referencePassword = userFound.password;

            //On compare le mots de passe de contrôle avec celui enregistré dans la base
            bcrypt.compare(controlPassword, referencePassword)
            .then(passwordMatch => {
                if(!passwordMatch) {//S'ils ne correspondent pas
                    return res.status(409).json({ error: 'Mot de passe incorrect !' }); //On retourne un statut d'erreur et un message
                } else {//S'ils correspondent, suppression de l'utilisateur ciblé par son Id
                    userFound.destroy({
                        where: { id: userFound.id }
                    })
                    .then(() => {//Si la commande fonctionne on retourne un statut et un message de réussite
                        res.status(200).json( {message: 'Profil supprimé ' } ); 
                        next();
                    })
                    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                }
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur   
        } else {//Si l'utilisateur n'existe pas
            return res.status(404).json({ error: 'Utilisateur non trouvé !' }); //On retourne un statut d'erreur et un message
        }
    })   
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};