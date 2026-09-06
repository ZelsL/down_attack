// database/connection.js
import knex from "knex";

const db = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "Negoney2030@",
    database: "bdo-opt-db",
    ssl: false,
  },
  pool: { min: 2, max: 10 },
});

// Exporte a instância DIRETAMENTE
export default db;
