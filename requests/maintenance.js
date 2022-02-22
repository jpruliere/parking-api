const db = require('./pool');

// va chercher toutes les maintenances en cours
const findCurrent = async () => {
  const { rows } = await db.query(`SELECT id, start_date, end_date, parking_id FROM maintenance
  WHERE start_date <= now()
  AND end_date >= now();`);
  return rows;
};

module.exports = {
  findCurrent
}