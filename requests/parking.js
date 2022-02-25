const db = require('./pool');
const knex = require('./knexClient');

/**
 * Un objet JS représentant un parking issu de la db
 * @typedef Parking
 * @property {number} id - l'id d'un parking.
 * @property {string} name - le nom d'un parking.
 * @property {string} address - l'adresse de ce parking.
 * @property {string} pricing - le type tarifaire.
 * @property {number} number_of_places - le nombre total de places.
 * @property {string} area - la zone de la ville dans laquelle se trouve le parking.
 * @property {string} opening_hour - l'heure d'ouverture du parking, sous la forme HH:MM:SS
 * @property {string} closing_hour - l'heure de fermeture du parking, sous la forme HH:MM:SS
 */

/**
 * Un object JS représentant des données à insérer/mettre à jour dans la table parking
 * @typedef ParkingPayload
 * @property {string} name - le nom du futur parking.
 * @property {string} address - l'adresse de ce parking.
 * @property {string} pricing - le type tarifaire.
 * @property {number} number_of_places - le nombre total de places.
 * @property {string} area - la zone de la ville dans laquelle se trouve le parking.
 * @property {string} opening_hour - l'heure d'ouverture du parking, sous la forme HH:MM:SS
 * @property {string} closing_hour - l'heure de fermeture du parking, sous la forme HH:MM:SS
 */

/**
 * Va chercher les parkings dans la db et les retourne sous forme d'objets
 * @async
 * @returns {Array<Parking>} L'ensemble des parkings de la db.
 */
const findAll = async () => {
  // simple et efficace
  // en même temps, la version SQL était également simple et efficace
  return await knex('parking').select();
};

/**
 * Va chercher un parking dans la db et le retourne sous forme d'objet
 * @async
 * @param {number} id - L'id recherché.
 * @returns {Parking} Le parking correspondant.
 */
const findOne = async (id) => {
  // pratique, si le nom du param correspond au nom de la colonne
  // Knex, c'est du JS, les superpouvoirs de JS s'appliquent donc aussi à Knex
  return await knex('parking').select().where({ id }).first();
};

/**
 * Insère un nouveau parking dans la db
 * @async
 * @param {ParkingPayload} newParking - le payload à insérer.
 */
const insert = async (payload) => {
  // là, c'est du génie
  // Knex va repérer le nom des propriétés et générer le nom des colonnes entre parenthèses
  // et il va utiliser la valeur des propriétés pour la partie VALUES
  await knex('parking').insert(payload);
};

/**
 * Supprime un parking de la db (attention, c'est irréversible)
 * @async
 * @param {number} id - L'id du parking à supprimer.
 */
const destroy = async (id) => {
  // bon, là, c'est anecdotique, la différence avec DELETE est négligeable
  // par contre, mauvais point pour Knex, il n'utilise pas delete() mais destroy(), il faut s'en rappeler
  await knex('parking').destroy().where({ id });
};

/**
 * Met à jour un parking (toutes les informations doivent être fournies)
 * @param {number} id - l'id du parking à modifier.
 * @param {ParkingPayload} payload - le payload du parking à modifier.
 */
const update = async (id, payload) => {
  // certainement la plus belle fonctionnalité de Knex, l'update dynamique
  // un insert, c'est un peu dynamique, grâce aux valeurs par défaut
  // mais des fois, il n'y a aucune valeur par défaut et donc une seule façon d'insérer : fournir toutes les infos
  // un update, c'est toujours très dynamique, on peut tout mettre à jour,
  // ou un seul champ, mais pas tout le temps le même
  // ou plusieurs champs
  // avec Knex, on a une unique méthode qui couvre tous les usages
  await knex('parking').update(payload).where({ id });
}

/**
 * Va chercher les parkings ayant une tarification spécifique, fournie en argument
 * @async
 * @param {string} pricing - Le type tarifaire sur lequel filtrer.
 * @returns {Array<Parking>} Les parkings de la db ayant cette tarification.
 */
const findByPricing = async (pricing) => {
  return await knex('parking').select().where({ pricing });
};

/**
 * Va chercher les parkings ayant au moins un certain nombre de places, fourni en argument
 * @async
 * @param {number} nbPlaces - Le nombre minimum de places souhaité.
 * @returns {Array<Parking>} Les parkings de la db ayant au moins ce nombre de places.
 */
const findByMinimumPlaces = async (nbPlaces) => {
  // pour sélectionner certaines colonnes, Knex propose plusieurs syntaxes
  // la plus avantageuse, c'est l'array qui contient le nom des colonnes
  // car il peut être déclaré avant et ainsi modifié plus facilement au gré des besoins
  const columns = ['id', 'name', 'pricing', 'number_of_places'];

  // pour un where avec autre chose que l'égalité (=), la magie s'estompe, il faut tout écrire à la main
  // et le résultat est plus long que si on l'avait écrit en SQL...
  return await knex('parking').select(columns).where('number_of_places', '>=', nbPlaces);
};

/**
 * Calcule le nombre de places total par type de tarification
 * @async
 * @returns {Array<Object>} Le libellé de chaque tarif et le nombre total de places.
 */
const computePlacesByPricing = async () => {
  // Knex sait aussi faire des agrégations
  // par contre, on remarque qu'on doit finalement passer par knex.raw pour les fonctions d'agrégat
  return await knex('parking').select('pricing', knex.raw('SUM(number_of_places) AS total_places')).groupBy('pricing');
}

module.exports = {
  findAll,
  findOne,
  insert,
  destroy,
  update,
  findByPricing,
  findByMinimumPlaces,
  computePlacesByPricing
};