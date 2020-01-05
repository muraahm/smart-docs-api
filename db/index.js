const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development'
const dotEnvFilePath = __dirname + '/../.env.' + ENV
require('dotenv').config({ path: dotEnvFilePath });

// connect to local or production database 
let dbParams = "";
let ssl = "";
if (process.env.NODE_ENV === "production") {
  dbParams = process.env.DATABASE_URL;
  ssl = true
}
else {
  //local db params
  dbParams = `${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
  ssl = false
}

const client = new Pool({connectionString: dbParams, ssl: ssl}
);

client
  .connect()
  .catch(e => console.log(`Error connecting to Postgres server:\n${e}`));

module.exports = client;