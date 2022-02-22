require('dotenv').config();

// tests manuels
const parking = require('./requests/parking');

parking.findAll().then(console.table);