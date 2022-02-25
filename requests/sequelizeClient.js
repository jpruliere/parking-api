const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres'
  }
);

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch ((error) => {
  console.error('Unable to connect to the database:', error);
});

module.exports = sequelize;