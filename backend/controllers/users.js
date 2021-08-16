/*---------------------------------------Les controllers destinés à la gestion des utilisateurs-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const bcrypt = require('bcrypt'); //Package de chiffrement pour le cryptage du mot de passe
//const jwt = require('../utils/jwt'); //Fichier contenant les outils de gestion de tokens d'identification
const models = require('../models'); //Modèles dans la DB

/***********************************************Controller d'affichage des utilisateurs************************************************/

exports.getUsers = (req, res, next) => {
    models.User.findAll()
    .then(usersFound => {
        res.status(200).json({ data: usersFound });
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

exports.getUser = (req, res, next) => {
    const uId = req.params.id;
    
    if(uId < 1) {
        return res.status(400).json({ error: 'Problème de token'});
    }

    models.User.findOne({//On recherche l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        //attributes: [ 'id', 'firstname', 'lastname', 'email', 'role' ],
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {
            res.status(200).json(userFound); //On retourne les informations de profil
            next();
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/*********************************************Controller de modification d'un utilisateur**********************************************/

exports.updateUser = (req, res, next) => {
    const uId = req.params.id;

    //Récupération des données de l'utilisateur présentes dans le body (soit remontées par la requête soit par nouvelle saisie)
    const {firstname, lastname, email, role, password, controlPassword} = req.body;

    //Expressions régulières à vérifier pour l'e-mail et le mot de passe
    //const emailSchema = /^[A-z0-9._-]+[@][a-zA-Z0-9._-]+[.][A-z]{2,}$/; 
    const passwordSchema = /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[_!@#$£µ=§%^&*?-\\/\\]).{8,}$/;
    
    models.User.findOne({//On recherche de l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'id', 'password', 'updatedAt' ],
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
                    return res.status(409).json({ error: 'Mot de passe incorrect !' });
                } else {//S'ils correspondent
                    if(!password.match(passwordSchema)) {
                        res.status(400).json({ error: 'Mot de passe non conforme'});
                    } else {//Si les saisies vérifient les expressions régulières
                        bcrypt.hash(password, 10) //Hash du mot de passe par bcrypt avec 10 passes
                        .then(hash => {
                            models.User.update({//Mise à jour de l'utilisateur cible par son Id
                                password: hash,
                                updatedAt: new Date()
                            }, { 
                                where: { id: userFound.id }
                            })
                            .then(() => {//On va rechercher à nouveau l'utilisateur...
                                models.User.findOne({
                                    attributes: [ 'id', 'firstname', 'lastname', 'email', 'role', 'updatedAt' ],
                                    where: { id: req.params.id }
                                })
                                .then(updatedProfile => {//...pour en afficher les informations modifiées
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
    const uId = req.params.id;
    
    models.User.findOne({//On recherche de l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'id', 'password' ],
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est présent en base
            //Récupération du mot de passe saisi pour le contrôle d'identité
            const controlPassword = req.body.controlPassword; 
            
            //Récupération du mot de passe de l'utilisateur en base de données
            const referencePassword = userFound.password;

            //On compare le mots de passe de contrôle avec celui enregistré dans la base
            bcrypt.compare(controlPassword, referencePassword)
            .then(passwordMatch => {
                if(!passwordMatch) {//S'ils ne correspondent pas
                    return res.status(409).json({ error: 'Mot de passe incorrect !' });
                } else {//S'ils correspondent, suppression du post ciblé par son Id
                    userFound.destroy({
                        where: { id: userFound.id }
                    })
                    .then(() => {//Si la commande fonctionne on retourne un message de réussite
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