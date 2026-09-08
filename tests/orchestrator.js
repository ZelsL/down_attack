import database from "~/infra/database";
import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatuspage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatuspage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
