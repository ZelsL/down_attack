import { Client } from "pg";
import { ServiceError } from "./errors.js";

function getSSL() {
  if (process.env.POSTGRES_SSL === "false") {
    return false;
  }
  if (process.env.POSTGRES_SSL === "true") {
    return true;
  }
  if (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV ||
    (process.env.POSTGRES_HOST &&
      process.env.POSTGRES_HOST !== "localhost" &&
      process.env.POSTGRES_HOST !== "127.0.0.1")
  ) {
    return true;
  }
  return false;
}

function getDatabaseCredentials() {
  return {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSL(),
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
