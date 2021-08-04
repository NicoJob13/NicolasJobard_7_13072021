/*---------------------------------------Les controllers destinés à la gestion des utilisateurs-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const bcrypt = require('bcrypt'); //Package de chiffrement pour le cryptage du mot de passe
const jwt = require('../utils/jwt'); //Fichier contenant les outils de gestion de tokens d'identification
const models = require('../models'); //Modèles dans la DB

/***********************************************Controller de création d'un utilisateur************************************************/

exports.signupUser = (req, res, next) => {
    //Paramètres de requête, saisis dans les champs du formulaire
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    
    //Expressions régulières à vérifier pour l'e-mail et le mot de passe afin d'éviter les attaques
    const emailSchema = /^[A-z0-9._-]+[@][a-zA-Z0-9._-]+[.][A-z]{2,}$/; 
    const passwordSchema = /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[_!@#$£µ=§%^&*?-\\/\\]).{8,}$/;

    //Vérification que toutes les paramètres nécessaires à la requête sont présents
    if(firstname == null || lastname == null || email == null || password == null) {//Si un des champs n'est pas renseigné
        return res.status(400).json({ 'error': 'Informations manquantes'});
    }
    models.User.findOne({ //On recherche si l'adresse email est déjà présente dans la DB
        attributes: ['email'],
        where: { email: email }
    })
    .then(userExist => {
        if(!userExist && email.match(emailSchema) && password.match(passwordSchema) ) {/*Si l'utilisateur n'existe pas on va le créer
        à condition que l'email et le mot de passe respectent les expressions régulières*/
            bcrypt.hash(password, 10) //Hash du mot de passe par bcrypt avec 10 passes
            .then(hash => {//En cas de réussite du hash
                models.User.create({ //On crée l'utilisateur
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hash
                })
                .then(newUser => {
                    res.status(201).json({ message: 'Nouvel utilisateur enregistré !' }); //Statut et message de réussite
                    next();
                })
                .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        } else {//Si l'utilisateur est trouvé
            return res.status(409).json({ 'error': 'Cet utilisateur existe déjà !'}); //On renvoie un statut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***********************************************Controller de connexion d'un utilisateur***********************************************/

exports.loginUser = (req, res, next) => {
    //Récupération des information saisies dans les champs de formulaire
    const email = req.body.email;
    const password = req.body.password;

    //Recherche de l'utilisateur dans la base par correspondance des adresses saisie/enregistrée dans la base
    models.User.findOne({//On recherche si l'adresse email est déjà présente dans la DB
        where: { email: email }
    })
    .then(userExist => {
        if(!userExist) {//Si aucune correspondance n'est trouvée
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        } else {//Si une correspondance est trouvée on va comparer les mots de passe saisi/enregistré dans la base
            bcrypt.compare(password, userExist.password)
            .then(passwordMatch => {
                if(!passwordMatch) {//S'ils ne correspondent pas
                    return res.status(401).json({ error: 'Mot de passe incorrect !' }); //On renvoie un statut d'erreur et un message
                }
                res.status(200).json({ //S'ils correspondent la réponse contient :
                    userId: userExist.id, //le userId,
                    token: jwt.genToken(userExist) //un token d'authentification encodé
                });
                next();
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***********************************************Controller d'affichage d'un utilisateur***********************************************/

exports.getMyProfile = (req, res, next) => {
    //Récupération des données de l'authorisation présent dans le header pour en extraire l'id de l'utilisateur connecté
    const authData = req.headers['authorization'];
    const uId = jwt.getUId(authData);
    
    if(id < 0) {
        return res.status(400).json({ error: 'Token incorrect !'});
    }
    models.User.findOne({//On recherche l'utilisateur en fonction de son id et on récupère les champs précisés dans 'attributes'
        attributes: [ 'id', 'firstname', 'lastname', 'email' ],
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
        attributes: [ 'id', 'firstname', 'lastname', 'email', 'password', 'updateAt' ],
        where: { id: uId }
    })
    .then(userFound => {
        if(userFound) {//Si l'utilisateur est présent en base
            //Récupération des données de l'utilisateur présentes dans le body (soit remontées par la requête soit par nouvelle saisie)
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const email = req.body.email;
            const password = req.body.password;
            const controlPassword = req.body.controlPassword; //Le mot de passe saisi pour le contrôle d'identité
            
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
                                password: hash,
                                updatedAt: new Date()
                            }, { 
                                where: { id: userFound.id }
                            })
                        })
                        .then(() => {//On va rechercher à nouveau l'utilisateur...
                            models.User.findOne({
                                attributes: [ 'id', 'firstname', 'lastname', 'email', 'updatedAt' ],
                                where: { id: uId }
                            })
                            .then(updatedProfile => {//...pour en afficher les informations modifiées
                                res.status(200).json({ message: 'Profil mis à jour !', updatedProfile: updatedProfile });
                                next();
                            })
                            .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
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