import database from "~/infra/database";
import retry from "async-retry";
import { faker } from "@faker-js/faker";
import migrator from "~/server/utils/migrator.js";
import user from "~/server/utils/user.js";
import session from "~/server/utils/session.js";

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

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(username) {
  const fakeUsername = username ? username : faker.internet.username();
  const fakeUserId = faker.string.numeric(18);
  const fakeAvatar = faker.string.alphanumeric(32);

  const userObject = {
    application: {
      id: "159799960412356608",
      name: "Down Attack",
      icon: "300ae0e41577b4ceb9cd41d2ee91f96a",
      description: "",
      hook: true,
      bot_public: true,
      bot_require_code_grant: false,
      verify_key:
        "c8cde6a3c8c6e49d86af3191287b3ce255872be1fff6dc285bdb420c06a2c3c8",
    },
    scopes: ["guilds.join", "identify"],
    expires: new Date(Date.now() + 604800000).toISOString(),
    user: {
      id: fakeUserId,
      username: fakeUsername,
      avatar: fakeAvatar,
      discriminator: "0",
      global_name: "Discord",
      public_flags: 131072,
    },
  };

  return await user.create(userObject);
}

async function createSession(user) {
  const userId = user?.id || user;
  return await session.create(userId);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createSession,
};

export default orchestrator;
