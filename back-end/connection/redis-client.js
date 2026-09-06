import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: true,
  },
  password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
  console.log("Iniciando conexão com o Redis");
});

client.on("ready", () => {
  console.log("Conexão com o Redis estabelecida");
});

client.on("end", () => {
  console.log("Conexão com o Redis encerrada");
});

export default client;
