const db = require('./pool');

/**
 * Va chercher les chantiers en cours
 * @async
 * @returns {Array<Object>} Les chantiers de la db dont les dates indiquent qu'ils sont en cours.
 */
const findCurrent = async () => {
  const { rows } = await db.query(`SELECT maintenance.id, start_date, end_date, parking.name AS parking
  FROM maintenance
  JOIN parking ON maintenance.parking_id = parking.id
  WHERE start_date <= now()
  AND end_date >= now();`);
  return rows;
};

module.exports = {
  findCurrent
}