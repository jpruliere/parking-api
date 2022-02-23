const { Router } = require('express');
const parking = require('../requests/parking');

const router = new Router();

// mon premier endpoint, celui qui répond avec l'ensemble des parkings
router.get('/', async (req, res) => {
  // tout est déjà codé, je n'ai qu'à utiliser la fonction findAll(), elle se charge de récupérer les parkings
  const parkings = await parking.findAll();
  // le middleware doit répondre à la requête
  // ce qu'attend l'utilisateur, c'est un ensemble de parkings
  // répondons donc avec notre variable parkings
  // res.json permet d'envoyer une réponse au format JSON
  res.json(parkings);
});

// pour les deux prochains endpoints, c'est assez répétitif et simple
// 1. on crée la méthode qui se charge de la partie SQL
// 2. on crée la route correspondante
// 3. dans le middleware, on utilise notre nouvelle méthode
// 4. si c'est un SELECT, on répond avec le résultat, sinon on répond OK
router.post('/', async (req, res) => {
  await parking.insert(req.body);

  res.json('OK');
});

router.delete('/:parkingId', async (req, res) => {
  await parking.destroy(req.params.parkingId);

  res.json('OK');
});

// l'update fait déjà un peu plus débat, car on peut mettre à jour un parking de beaucoup de façons
// on peut simplement le renommer, ou modifier son pricing, ou rectifier ses horaires d'ouverture
// ou n'importe quelle combinaison de plusieurs infos à modifier
// mais pas question de coder 300 routes et 300 méthodes pour ça
// on va plutôt réfléchir à ce qui pourrait faciliter la vie de nos utilisateurs
// idéalement, ils n'enverraient que ce qui doit être modifié
// et l'id du parking, ça, c'est obligatoire
router.put('/:parkingId', async (req, res) => {

  // si on a l'id, on peut déjà aller chercher les données d'origine
  const theParking = await parking.findOne(req.params.parkingId);

  // puis avec un spread, on copie les propriétés du parking
  // et les données envoyées par l'utilisateur, qui viendront écraser les originales
  // payload représente donc le parking complet, dans sa nouvelle version
  // pour chaque propriété, soit c'est l'originale, provenant de parking.findOne ci-dessus
  // soit elle a été écrasée et remplacée par celle présente dans req.body
  const payload = { ...theParking, ...req.body };

  // il ne nous reste qu'à utiliser notre méthode de mise à jour de parking
  await parking.update(payload);

  // et à répondre OK, évidemment 😎
  res.json('OK');
})

module.exports = router;