const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost', // adresse du serveur
user :  'root', // le nom d'utilisateur
password :  'Tv36Lu24', // le mot de passe
database :  'pokedex', // le nom de la base de données
});
module.exports = connection;