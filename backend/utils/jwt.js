const jwt = require('jsonwebtoken'); //Package de gestion de token d'identification
require('dotenv').config({path: './config/.env'}); //Appel du fichier de configuration de dotenv

exports.genToken = (userData) => {
    return jwt.sign( //un token d'authentification encodé
    { userId: userData.id }, //contenant lui-même le userId,
    process.env.SECRET_TOKEN, //la clé d'encodage,
    { expiresIn: '12h' } //la durée de validité du token
)};