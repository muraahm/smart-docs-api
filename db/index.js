const pg = require("pg");
const ENV = process.env.NODE_ENV || 'development'
const dotEnvFilePath = __dirname + '/../.env.' + ENV
require('dotenv').config({ path: dotEnvFilePath });

// connect to local or production database 
let dbParams = "";
if (process.env.NODE_ENV === "production") {
  dbParams = process.env.DATABASE_URL;
}
else {
  //local db params
  dbParams = {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  };
}

const client = new pg.Client(dbParams
);

client
  .connect()
  .catch(e => console.log(`Error connecting to Postgres server:\n${e}`));

module.exports = client;