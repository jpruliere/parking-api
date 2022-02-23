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

router.post('/', async (req, res) => {
  await parking.insert(req.body);

  res.json('OK');
});

router.delete('/:parkingId', async (req, res) => {
  await parking.destroy(req.params.parkingId);

  res.json('OK');
});

router.put('/:parkingId', async (req, res) => {

  const theParking = await parking.findOne(req.params.parkingId);

  const payload = { ...theParking, ...req.body };

  
  console.log(payload);

  parking.update(payload);

  res.json('OK');
})

module.exports = router;