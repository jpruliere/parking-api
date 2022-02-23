const db = require('./pool');

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
 * @property {number} id - l'id du parking, absent lors d'une insertion.
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
  const { rows } = await db.query('SELECT * FROM parking;');
  return rows;
};

/**
 * Va chercher les parkings dans la db et les retourne sous forme d'objets
 * @async
 * @param {number} id - L'id recherché.
 * @returns {Parking} Le parking correspondant.
 */
const findOne = async (id) => {
  const { rows } = await db.query('SELECT * FROM parking WHERE id = $1;', [id]);
  return rows[0];
};

/**
 * Insère un nouveau parking dans la db
 * @async
 * @param {ParkingPayload} newParking - le payload à insérer.
 */
const insert = async ({ name, address, number_of_places, area, always_open, opening_hour, closing_hour }) => {
  await db.query(`INSERT INTO parking (name, address, number_of_places, area, always_open, opening_hour, closing_hour) VALUES
  ($1, $2, $3, $4, $5, $6, $7)`, [name, address, number_of_places, area, always_open, opening_hour, closing_hour]);
};

/**
 * Supprime un parking de la db (attention, c'est irréversible)
 * @async
 * @param {number} id - L'id du parking à supprimer.
 */
const destroy = async (id) => {
  await db.query('DELETE FROM parking WHERE id = $1;', [id]);
};

/**
 * Met à jour un parking (toutes les informations doivent être fournies)
 * @param {ParkingPayload} parking - le payload du parking à modifier, avec son id.
 */
const update = async ({ id, name, address, number_of_places, pricing, area, always_open, opening_hour, closing_hour }) => {
  await db.query(`UPDATE parking
  SET name = $1,
  address = $2,
  number_of_places = $3,
  area = $4,
  always_open = $5,
  opening_hour = $6,
  closing_hour = $7,
  pricing = $8
  WHERE id = $9;`, [
    name,
    address,
    number_of_places,
    area,
    always_open,
    opening_hour,
    closing_hour,
    pricing,
    id
  ]);
}

/**
 * Va chercher les parkings ayant une tarification spécifique, fournie en argument
 * @async
 * @param {string} pricing - Le type tarifaire sur lequel filtrer.
 * @returns {Array<Parking>} Les parkings de la db ayant cette tarification.
 */
const findByPricing = async (pricing) => {
  const { rows } = await db.query(`SELECT * FROM parking WHERE pricing = $1;`, [pricing]);
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

/**
 * Calcule le nombre de places total par type de tarification
 * @async
 * @returns {Array<Object>} Le libellé de chaque tarif et le nombre total de places.
 */
const computePlacesByPricing = async () => {
  // TODO : commenter l'agrég
  const { rows } = await db.query(`SELECT pricing, SUM(number_of_places) AS total_places
  FROM parking
  GROUP BY pricing;`);
  return rows;
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