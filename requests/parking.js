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
 * @returns {Array<Parking>} L'ensemble des parkings de la db.
 */
const findAll = async () => {
  await db.connect();
  const { rows } = await db.query('SELECT * FROM parking;');
  await db.end();
  return rows;
};

/**
 * Va chercher les parkings ayant une tarification spécifique, fournie en argument
 * @param {string} pricing - Le type tarifaire sur lequel filtrer.
 * @returns {Array<Parking>} Les parkings de la db ayant cette tarification.
 */
const findByPricing = (pricing) => {};

module.exports = {
  findAll,
  findByPricing
};