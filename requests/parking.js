const { Pool } = require('pg');
const db = new Pool();

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
  const { rows } = await db.query('SELECT id, name, pricing FROM parking;');
  return rows;
};

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

// plus besoin de déconnecteur le client, ça se fera tout seul quand on fermera le programme Node

module.exports = {
  findAll,
  findByPricing,
  findByMinimumPlaces
};