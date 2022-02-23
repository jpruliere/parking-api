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
const maintenance = require('./requests/maintenance');

// Youpi, ça marche
//parking.findAll().then(console.table);

// Youpi, ça marche
//parking.findByPricing('gratuit').then(console.table);

// Youpi, ça marche
//parking.findByMinimumPlaces(61).then(console.table);

// Youpi, ça marche
maintenance.findCurrent().then(console.table);

// grâce à notre petite modification du moment de la connection du client
// on peut maintenant appeler nos fonctions autant qu'on veut