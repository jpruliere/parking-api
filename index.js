require('dotenv').config();
const express = require('express');
const app = express();
const port = 9900;

// pour que notre serveur comprenne le JSON en tant que dialecte "entrant"
// en effet, il sait nativement le parler avec res.json
// mais il a besoin de cette config pour le comprendre quand on lui en envoie
// et ainsi le rendre disponible dans req.body
app.use(express.json());

// cette technique d'un routeur par type de ressource,
// on va pouvoir la reproduire pour les autres tables de la db
// et l'index restera propre et net
const parkingRouter = require('./routers/parking');

// puisqu'avec REST, toutes les routes concernant les parkings commencent par /parkings,
// autant le définir ici, ça nous évite de le répéter dans le routeur
app.use('/parkings', parkingRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));