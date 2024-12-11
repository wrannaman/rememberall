import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import models from '../models/index.js';

// Load environment variables from .env file

const {
  PG_HOST,
  PG_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,
  PG_SSL,
  ENV
} = process.env;

let dialectOptions = {};

// Configure SSL options if specified
if (PG_SSL === 'true') {
  dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const opts = {
  dialect: 'postgres',
  logging: false, // Set to true if you need to see SQL logs
  replication: {
    read: {
      host: PG_HOST,
      port: PG_PORT,
      username: PG_USER,
      password: PG_PASSWORD
    },
    write: {
      host: PG_HOST,
      port: PG_PORT,
      username: PG_USER,
      password: PG_PASSWORD
    }
  },
  dialectOptions,
};

let sql = null;

if (process.env.PG_CONNECTION) {
  opts.host = `/cloudsql/${process.env.PG_CONNECTION}`;
  opts.dialectOptions = { socketPath: `/cloudsql/${process.env.PG_CONNECTION}` };
  delete opts.replication;
  console.log('Connecting to Cloud SQL with options:', opts);
  sql = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, opts);
} else {
  sql = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, opts);
}

(async () => {
  try {
    await sql.authenticate();
    await models(sql);
    const alter = true;
    await sql.sync({ alter });
    console.log('✅  POSTGRES   OK', PG_HOST, ' modified ', alter);

    global.db_ready = true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sql;
