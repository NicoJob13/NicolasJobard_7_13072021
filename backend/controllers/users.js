/*---------------------------------------Les controllers destinés à la gestion des utilisateurs-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const bcrypt = require('bcrypt'); //Package de chiffrement pour le cryptage du mot de passe
const jwt = require('../utils/jwt'); //Fichier contenant les outils de gestion de tokens d'identification
const models = require('../models'); //Modèles dans la DB

/***********************************************Controller d'affichage d'un utilisateur***********************************************/

exports.getMyProfile = (req, res, next) => {
    //Récupération des données de l'authorisation présent dans le header pour en extraire l'id de l'utilisateur connecté
    const authData = req.headers['authorization'];
    const uId = jwt.getUId(authData);
    
    models.User.findOne({//On recherche l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'id', 'firstname', 'lastname', 'email', 'role' ],
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est présent en base
            res.status(200).json({ message: 'Utilisateur trouvé !', userFound }); //On retourne les informations de profil
            next();
        } else {//Si l'utilisateur n'existe pas
            return res.status(500).json({ error: 'Impossible de récupérer l\'utilisateur !' }); //On retourne un statut d'erreur et un message
        }
    })
    .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/*********************************************Controller de modification d'un utilisateur**********************************************/

exports.updateMyProfile = (req, res, next) => {
    //Récupération des données de l'authorisation présent dans le header pour en extraire l'id
    const authData = req.headers['authorization'];
    const uId = jwt.getUId(authData);
    
    models.User.findOne({//On recherche de l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'id', 'firstname', 'lastname', 'email', 'password', 'role', 'updatedAt' ],
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est présent en base
            //Récupération des données de l'utilisateur présentes dans le body (soit remontées par la requête soit par nouvelle saisie)
            const {firstname, lastname, email, role, password, controlPassword} = req.body;
            
            //Récupération du mot de passe de l'utilisateur en base de données
            const referencePassword = userFound.password;

            //On compare le mots de passe de contrôle avec celui enregistré dans la base
            bcrypt.compare(controlPassword, referencePassword)
            .then(passwordMatch => {
                if(!passwordMatch) {//S'ils ne correspondent pas
                    return res.status(409).json({ error: 'Mot de passe incorrect !' });
                } else {//S'ils correspondent
                    //Expressions régulières à vérifier pour l'e-mail et le mot de passe
                    const emailSchema = /^[A-z0-9._-]+[@][a-zA-Z0-9._-]+[.][A-z]{2,}$/; 
                    const passwordSchema = /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[_!@#$£µ=§%^&*?-\\/\\]).{8,}$/;

                    if(email.match(emailSchema) && password.match(passwordSchema)) {//Si les saisies vérifient les expressions régulières
                        bcrypt.hash(password, 10) //Hash du mot de passe par bcrypt avec 10 passes
                        .then(hash => {
                            models.User.update({//Mise à jour de l'utilisateur cible par son Id
                                firstname: (firstname ? firstname : userFound.firstname),
                                lastname: (lastname ? lastname : userFound.lastname),
                                email: (email ? email : userFound.email),
                                role: (role ? role : userFound.role),
                                password: hash,
                                updatedAt: new Date()
                            }, { 
                                where: { id: userFound.id }
                            })
                            .then(() => {//On va rechercher à nouveau l'utilisateur...
                                models.User.findOne({
                                    attributes: [ 'id', 'firstname', 'lastname', 'email', 'role', 'updatedAt' ],
                                    where: { id: uId }
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
                    } else {//Si une des saisies ne respecte pas l'expression régulière qui s'y rapporte on renvoie le statut de l'erreur et un message
                        return res.status(401).json({ error: 'Le nouvel email/mot de passe ne correspond pas à un format valide !' });
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

exports.deleteMyProfile = (req, res, next) => {
    //Récupération des données de l'authorisation présent dans le header pour en extraire l'id
    const authData = req.headers['authorization'];
    const uId = jwt.getUId(authData);
    
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