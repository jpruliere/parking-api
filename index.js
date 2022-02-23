require('dotenv').config();
const express = require('express');
const app = express();

const port = 9900;

// REST
// les verbes HTTP ont un rôle
// GET : récupérer des données, lecture
// POST : insérer des données, écriture
// PUT : modifier des données, écriture
// PATCH : modifier des données, écriture
// DELETE : supprimer des données, écriture

// les endpoints désignent ce qu'ils concernent
// GET /parkings doit retourner des parkings, pas des chantiers
// DELETE /maintenances/14 doit servir à supprimer le chantier dont l'id est 14, pas à supprimer le véhicule dont l'id est 14

// les noms des ressources sont au pluriel
// /parkings et pas /parking
// /visits et pas /visit

app.use(express.json());


const parkingRouter = require('./routers/parking');

app.use('/parkings', parkingRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));