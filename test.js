// dotenv va aller chercher un éventuel fichier .env à la racine du repo
// et "charger" ses variables dans l'environnement
// c'est à dire les rendre disponible pour le présent script Node
require('dotenv').config();

// A quoi ça sert d'avoir ces variables disponibles ?
// Ces variables sont disponibles dans TOUT le script Node
// ainsi que dans les modules qu'on require depuis ce script
// ici, je n'en ai pas besoin
// dans le module parking non plus
// par contre, le module parking require le module pg
// et pg a besoin de ces variables pour savoir où se connecter


const parking = require('./requests/parking');

// Youpi, ça marche
//parking.findAll().then(console.table);

parking.findByPricing('privé').then(console.table);