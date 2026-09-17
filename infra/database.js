import { Client } from "pg";
import { ServiceError } from "./errors.js";

function getDatabaseCredentials() {
  return {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  };
}

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const res = await client.query(queryObject);
    return res;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com o Banco ou na Query.",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client(getDatabaseCredentials());
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
