/*---------------------------------------Les controllers destinés à la gestion des utilisateurs-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et modèle nécessaires***********************************************/

const bcrypt = require('bcrypt'); //Package de chiffrement pour le cryptage du mot de passe
const jwt = require('../utils/jwt'); //Fichier contenant les outils de gestion de tokens d'identification
const models = require('../models'); //Modèles dans la DB

/***********************************************Controller de création d'un utilisateur************************************************/

exports.registerUser = (req, res, next) => {
    //Paramètres de requête, saisis dans les champs du formulaire
    const {firstname, lastname, email, role, password} = req.body;

    //Vérification que toutes les paramètres nécessaires à la requête sont présents
    if(firstname == null || lastname == null || email == null || password == null || role == null) {//Si un des champs n'est pas renseigné
        return res.status(400).json({ 'error': 'Informations manquantes'});
    }
    models.User.findOne({ //On recherche si l'adresse email est déjà présente dans la DB
        attributes: ['email'],
        where: { email: email }
    })
    .then(userExist => {
        if(!userExist) {//Si l'utilisateur n'existe pas on va le créer à condition que l'email et le mot de passe respectent les expressions régulières
            //Expressions régulières à vérifier pour l'e-mail et le mot de passe afin d'éviter les attaques
            const emailSchema = /^[A-z0-9._-]+[@][a-zA-Z0-9._-]+[.][A-z]{2,}$/; 
            const passwordSchema = /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[_!@#$£µ=§%^&*?-\\/\\]).{8,}$/;

            if(!email.match(emailSchema) && !password.match(passwordSchema)) {
                res.status(400).json({ error: 'Email et mots de passe non conformes'});
            } else if(!email.match(emailSchema)) {
                res.status(400).json({ error: 'Email non conforme'});
            } else if(!password.match(passwordSchema)) {
                res.status(400).json({ error: 'Mot de passe non conforme'});
            } else {
                bcrypt.hash(password, 10) //Hash du mot de passe par bcrypt avec 10 passes
                .then(hash => {//En cas de réussite du hash
                    models.User.create({ //On crée l'utilisateur
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: hash,
                        role: role
                    })
                    .then(newUser => {
                        res.status(201).json({ message: 'Nouvel utilisateur enregistré !' }); //Statut et message de réussite
                        next();
                    })
                    .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            }
        } else {//Si l'utilisateur est trouvé
            res.status(409).json({ 'error': 'Cet utilisateur existe déjà !'}); //On renvoie un statut d'erreur et un message
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***********************************************Controller de connexion d'un utilisateur***********************************************/

exports.loginUser = (req, res, next) => {
    //Récupération des information saisies dans les champs de formulaire
    const {email, password} = req.body;
 
    //Recherche de l'utilisateur dans la base par correspondance des adresses saisie/enregistrée dans la base
    models.User.findOne({//On recherche si l'adresse email est déjà présente dans la DB
        where: { email: email }
    })
    .then(userExist => {
        if(!userExist) {//Si aucune correspondance n'est trouvée
            return res.status(401).json({ error: 'Email utilisateur inconnu' });
        } else {//Si une correspondance est trouvée on va comparer les mots de passe saisi/enregistré dans la base
            bcrypt.compare(password, userExist.password)
            .then(passwordMatch => {
                if(!passwordMatch) {//S'ils ne correspondent pas
                    return res.status(401).json({ error: 'Mot de passe incorrect' }); //On renvoie un statut d'erreur et un message
                } else {
                    const token = jwt.genToken(userExist); //Création d'un token d'authentification
                    res.cookie('jwt', token, { httpOnly: true, maxAge: 43200000 });
                    res.status(200).json({ //S'ils correspondent la réponse contient :
                        userId: userExist.id, //l'id de l'utilisateur
                        token: token
                    });
                }
                next();
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        }
    })
    .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/**********************************************Controller de déconnexion d'un utilisateur**********************************************/

exports.logoutUser = (req, res, next) => {
    res.cookie('jwt', '', { maxAge: 1 }); //Suppression du cookie 'jwt' créé lors de la connexion
    res.redirect('/'); //Redirection
    next();
};