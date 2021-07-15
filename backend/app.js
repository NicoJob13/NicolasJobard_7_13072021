const express = require('express');
const Sequelize = require('sequelize');

const app = express();

require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
        dialect: "mysql",
        host: process.env.DB_HOST,
        logging: false
    }
);

try {
    sequelize.authenticate();
    console.log('Connexion à la base de données MySQL réussie !');
} catch (error) {
    console.log('Connexion à la base de donnée impossible ! Erreur :', error);
}

module.exports = app;