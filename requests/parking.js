const db = require('./pool');

/**
 * Un objet JS représentant un parking issu de la db
 * @typedef Parking
 * @property {number} id - l'id d'un parking.
 * @property {string} name - le nom d'un parking.
 */

/**
 * Un object JS représentant des données à insérer dans la table parking
 * @typedef ParkingPayload
 * @property {string} name - le nom du futur parking.
 * @property {string} address - l'adresse de ce parking.
 * 
 */

/**
 * Va chercher les parkings dans la db et les retourne sous forme d'objets
 * @async
 * @returns {Array<Parking>} L'ensemble des parkings de la db.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT id, name, pricing FROM parking;');
  return rows;
};

/**
 * Insère un nouveau parking dans la db
 * @async
 * @param {ParkingPayload} newParking - le payload à insérer.
 */
const insert = async ({ name, address, numberOfPlaces, area, alwaysOpen, openingHour, closingHour }) => {
  await db.query(`INSERT INTO parking (name, address, number_of_places, area, always_open, opening_hour, closing_hour) VALUES
  ($1, $2, $3, $4, $5, $6, $7)`, [name, address, numberOfPlaces, area, alwaysOpen, openingHour, closingHour]);
};

const destroy = async (id) => {
  await db.query('DELETE FROM parking WHERE id = $1;', [id]);
}

/**
 * Va chercher les parkings ayant une tarification spécifique, fournie en argument
 * @async
 * @param {string} pricing - Le type tarifaire sur lequel filtrer.
 * @returns {Array<Parking>} Les parkings de la db ayant cette tarification.
 */
const findByPricing = async (pricing) => {
  const { rows } = await db.query(`SELECT id, name, pricing FROM parking WHERE pricing = $1;`, [pricing]);
  return rows;
};

/**
 * Va chercher les parkings ayant au moins un certain nombre de places, fourni en argument
 * @async
 * @param {number} nbPlaces - Le nombre minimum de places souhaité.
 * @returns {Array<Parking>} Les parkings de la db ayant au moins ce nombre de places.
 */
const findByMinimumPlaces = async (nbPlaces) => {
  const { rows } = await db.query(`SELECT id, name, pricing, number_of_places
  FROM parking
  WHERE number_of_places >= $1;`, [nbPlaces]);
  return rows;
};

// TODO : JSDoc
const computePlacesByPricing = async () => {
  // TODO : commenter l'agrég
  const { rows } = await db.query(`SELECT pricing, SUM(number_of_places)
  FROM parking
  GROUP BY pricing;`);
  return rows;
}

// plus besoin de déconnecteur le client, ça se fera tout seul quand on fermera le programme Node

module.exports = {
  findAll,
  insert,
  destroy,
  findByPricing,
  findByMinimumPlaces,
  computePlacesByPricing
};