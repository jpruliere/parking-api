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

// l'update, avec Knex, c'est simple
router.put('/:parkingId', async (req, res) => {

  console.log(req.body)

  await parking.update(req.params.parkingId, req.body);

  // et à répondre OK, évidemment 😎
  res.json('OK');
});

module.exports = router;