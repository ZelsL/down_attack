import database from "~/infra/database";
import retry from "async-retry";
import { faker } from "@faker-js/faker";
import migrator from "~/server/utils/migrator.js";
import user from "~/server/utils/user.js";
import skills from "~/server/utils/skills.js";
import session from "~/server/utils/session.js";
import preset from "~/server/utils/preset.js";
import webserver from "~/infra/webserver.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatuspage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatuspage() {
      const response = await fetch(`${webserver.origin}/api/v1/status`);
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
    id: fakeUserId,
    username: fakeUsername,
    avatar: fakeAvatar,
    discriminator: "0",
    global_name: "Discord",
    public_flags: 131072,
  };

  return await user.create(userObject);
}

async function createSession(user) {
  const userId = user?.id || user;
  return await session.create(userId);
}

async function addFeaturesToUser(userObject, features) {
  const updatedUser = await user.addFeatures(userObject.id, features);

  return updatedUser;
}

async function createSkill(skillObject) {
  const defaultSkillObject = {
    id: 5608,
    name: `Aal's Dominion IV`,
    class_name: "Hashashin",
    skill_spec: "Absolute",
    crit_hit_rate: 100,
    is_floating: true,
    is_air_attack: true,
    pvp_damage: 58.48,
    cooldown: 7,
    hits: [
      {
        description: "1st hit",
        damage_percent: 2130,
        hit_count: 2,
        is_air_attack: true,
        is_floating: true,
      },
    ],
  };

  return await skills.create(skillObject ? skillObject : defaultSkillObject);
}

async function createPreset(presetObject, user) {
  const defaultPresetObject = {
    class_name: "Hashashin",
    spec: "Awakening",
    is_public: true,
  };

  return await preset.create(
    {
      ...defaultPresetObject,
      ...presetObject,
    },
    user,
  );
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createSession,
  addFeaturesToUser,
  createSkill,
  createPreset,
};

export default orchestrator;
