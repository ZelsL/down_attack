import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/presets/[id]", () => {
  describe("Anonymous User", () => {
    test("With invalid ID format", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/999999999`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        status_code: 404,
        message: 'Preset with id "999999999" not found',
        action: "Verify if you typed id correctly",
      });
    });

    test("With nonexistent UUID", async () => {
      const nonexistentId = "00000000-0000-0000-0000-000000000000";
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${nonexistentId}`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        status_code: 404,
        message: `Preset with id "${nonexistentId}" not found`,
        action: "Verify if you typed id correctly",
      });
    });

    test("With existent public preset", async () => {
      const author = await orchestrator.createUser();
      const publicPreset = await orchestrator.createPreset(
        {
          name: "Community Hashashin DR",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: true,
          hp: 11200,
          ap: 320,
        },
        author,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${publicPreset.id}`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.id).toBe(publicPreset.id);
      expect(responseBody.user_id).toBe(author.id);
      expect(responseBody.name).toBe("Community Hashashin DR");
      expect(responseBody.class_name).toBe("Hashashin");
      expect(responseBody.spec).toBe("Awakening");
      expect(responseBody.is_public).toBe(true);
      expect(responseBody.hp).toBe(11200);
      expect(responseBody.ap).toBe(320);
      expect(Array.isArray(responseBody.combos)).toBe(true);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("Trying to access a private preset of a user (should not be found)", async () => {
      const author = await orchestrator.createUser();
      const privatePreset = await orchestrator.createPreset(
        {
          name: "Secret Build",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: false,
        },
        author,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${privatePreset.id}`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        status_code: 404,
        message: `Preset with id "${privatePreset.id}" not found`,
        action: "Verify if you typed id correctly",
      });
    });
  });

  describe("Default user", () => {
    test("Can consult their own private preset", async () => {
      const user = await orchestrator.createUser();
      const session = await orchestrator.createSession(user);

      const myPrivatePreset = await orchestrator.createPreset(
        {
          name: "My Secret Tournament Preset",
          class_name: "Warrior",
          spec: "Succession",
          is_public: false,
          hp: 12000,
        },
        user,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${myPrivatePreset.id}`,
        {
          headers: {
            Cookie: `session_id=${session.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.id).toBe(myPrivatePreset.id);
      expect(responseBody.user_id).toBe(user.id);
      expect(responseBody.name).toBe("My Secret Tournament Preset");
      expect(responseBody.class_name).toBe("Warrior");
      expect(responseBody.spec).toBe("Succession");
      expect(responseBody.is_public).toBe(false);
      expect(responseBody.hp).toBe(12000);
      expect(Array.isArray(responseBody.combos)).toBe(true);
    });

    test("Cannot consult another user's private preset (returns 404)", async () => {
      const userA = await orchestrator.createUser();

      const userB = await orchestrator.createUser();
      const sessionB = await orchestrator.createSession(userB);

      // User A creates a private preset
      const privatePresetOfA = await orchestrator.createPreset(
        {
          name: "User A Top Secret",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: false,
        },
        userA,
      );

      // User B tries to fetch User A's private preset
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${privatePresetOfA.id}`,
        {
          headers: {
            Cookie: `session_id=${sessionB.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        status_code: 404,
        message: `Preset with id "${privatePresetOfA.id}" not found`,
        action: "Verify if you typed id correctly",
      });
    });

    test("Can consult any public preset created by another user", async () => {
      const author = await orchestrator.createUser();
      const publicPreset = await orchestrator.createPreset(
        {
          name: "Open Source Hashashin",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: true,
        },
        author,
      );

      const visitorUser = await orchestrator.createUser();
      const visitorSession = await orchestrator.createSession(visitorUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${publicPreset.id}`,
        {
          headers: {
            Cookie: `session_id=${visitorSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.id).toBe(publicPreset.id);
      expect(responseBody.name).toBe("Open Source Hashashin");
      expect(responseBody.is_public).toBe(true);
    });

    test("With nonexistent UUID", async () => {
      const user = await orchestrator.createUser();
      const session = await orchestrator.createSession(user);

      const nonexistentId = "11111111-1111-1111-1111-111111111111";

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${nonexistentId}`,
        {
          headers: {
            Cookie: `session_id=${session.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        status_code: 404,
        message: `Preset with id "${nonexistentId}" not found`,
        action: "Verify if you typed id correctly",
      });
    });
  });
});
