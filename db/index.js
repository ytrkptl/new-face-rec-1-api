const knex = require("knex");

// for using locally and connecting to pgAdmin as well
// as for making calls to heroku postgres from server
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

module.exports = db;