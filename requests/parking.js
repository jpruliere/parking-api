const { Client } = require('pg');
const db = new Client();

/**
 * Un objet JS représentant un parking issu de la db
 * @typedef Parking
 * @property {number} id - l'id d'un parking.
 * @property {string} name - le nom d'un parking.
 */

/**
 * Va chercher les parkings dans la db et les retourne sous forme d'objets
 * @async
 * @returns {Array<Parking>} L'ensemble des parkings de la db.
 */
const findAll = async () => {
  await db.connect();
  const { rows } = await db.query('SELECT id, name, pricing FROM parking;');
  await db.end();
  return rows;
};

/**
 * Va chercher les parkings ayant une tarification spécifique, fournie en argument
 * @async
 * @param {string} pricing - Le type tarifaire sur lequel filtrer.
 * @returns {Array<Parking>} Les parkings de la db ayant cette tarification.
 */
const findByPricing = async (pricing) => {
  await db.connect();
  const { rows } = await db.query(`SELECT id, name, pricing FROM parking WHERE pricing = $1;`, [pricing]);
  await db.end();
  return rows;
};

/**
 * Va chercher les parkings ayant au moins un certain nombre de places, fourni en argument
 * @async
 * @param {number} nbPlaces - Le nombre minimum de places souhaité.
 * @returns {Array<Parking>} Les parkings de la db ayant au moins ce nombre de places.
 */
const findByMinimumPlaces = async (nbPlaces) => {
  await db.connect();
  const { rows } = await db.query(`SELECT id, name, pricing, number_of_places
  FROM parking
  WHERE number_of_places >= $1;`, [nbPlaces]);
  await db.end();
  return rows;
};

module.exports = {
  findAll,
  findByPricing,
  findByMinimumPlaces
};