const jwt = require('jsonwebtoken'); //Package de gestion de token d'identification

//Appel du fichier de configuration de dotenv 
require('dotenv').config();

exports.genToken = (userData) => {
    return jwt.sign( //un token d'authentification encodé
    { userId: userData.id }, //contenant lui-même le userId,
    process.env.SECRET_TOKEN, //la clé d'encodage,
    { expiresIn: '12h' } //la durée de validité du token
)};

exports.getUId = (authorization) => {
    let userId = -1;
    const sessionToken = (authorization != null) ? authorization.replace('Bearer ', '') : null;

    if(sessionToken != null) {
        try {
            const token = jwt.verify(sessionToken, process.env.SECRET_TOKEN);
            
            if(token != null) {
                userId = token.userId;
                return userId;
            } else {
                return res.status(400).json({ error }); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            }
        }
        catch (error) {
            return res.status(500).json({ error }); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        }
    } else {
        return res.status(400).json({ error: 'Token inexistant' }); //En cas d'erreur on retourne un statut d'erreur et un message
    }
};