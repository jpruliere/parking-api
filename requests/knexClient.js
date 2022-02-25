const knex = require('knex')({
  client: 'pg',
  connection: {
    // les infos sont dans .env
    // si dotenv a été invoqué, les infos sont maintenant "dans l'environnement"
    // pour accéder à l'environnement dans Node, on utilise process.env
    host : process.env.PGHOST,
    port : process.env.PGPORT,
    user : process.env.PGUSER,
    password : process.env.PGPASSWORD,
    database : process.env.PGDATABASE
  }
});

module.exports = knex;