/*---------------------------------------Middleware de création d'URL pour les images uploadées-----------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/******************************************************Appel du package nécessaire*****************************************************/

const multer = require('multer'); //Package de gestion des fichiers entrants

/************************************Création d'un dictionnaire pour résoudre l'extension de fichier***********************************/

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

/********************************************************Configuration de multer*******************************************************/
//Indique à multer comment gérer les fichiers entrants
const storage = multer.diskStorage({//Stockage
    destination: (req, file, callback) => {//Le dossier de destination : 'images'
        callback(null, 'images');
    },
    filename: (req, file, callback) => {//Norme de nommage
        const name = file.originalname.split(' ').join('_'); //Remplacement des espaces par des underscores
        const extension = MIME_TYPES[file.mimetype]; //Résolution de l'extension selon le dictionnaire précédemment créé
        callback(null, name + Date.now() + '.' + extension); //Ajout d'un timestamp pour individualiser encore mieux le fichier
    }
});

/**********************************************Export du module avec la configuration créée********************************************/
//On précise également qu'on ne gèrera que le téléchargement d'images

module.exports = multer({ storage }).single('image');