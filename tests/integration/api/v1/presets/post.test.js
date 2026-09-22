import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/presets", () => {
  describe("Default user", () => {
    test("With minimal valid preset (auto-generated name and defaults)", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      // Identifiers & Ownership
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.user_id).toBe(createdUser.id);
      expect(responseBody.name).toBe("Preset 1");
      expect(responseBody.class_name).toBe("Hashashin");
      expect(responseBody.spec).toBe("Awakening");

      // Default Combat Stats
      expect(responseBody.hp).toBe(10000);
      expect(responseBody.ap).toBe(0);
      expect(responseBody.aap).toBe(0);
      expect(responseBody.adventureap).toBe(0);
      expect(responseBody.adventureaap).toBe(0);
      expect(responseBody.mldr).toBe(0);
      expect(responseBody.radr).toBe(0);
      expect(responseBody.madr).toBe(0);
      expect(responseBody.acc).toBe(0);
      expect(responseBody.meev).toBe(0);
      expect(responseBody.raev).toBe(0);
      expect(responseBody.maev).toBe(0);
      expect(responseBody.bdrp).toBe(0);
      expect(responseBody.chrp).toBe(0);
      expect(responseBody.chc).toBe(0);
      expect(responseBody.abad).toBe(0);
      expect(responseBody.adad).toBe(0);
      expect(responseBody.aaad).toBe(0);

      // Metadata
      expect(responseBody.is_public).toBe(true);
      expect(Array.isArray(responseBody.combos)).toBe(true);
      expect(responseBody.combos).toHaveLength(0);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With complete valid preset and custom name", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const presetData = {
        name: "Zels Endgame Build",
        class_name: "Hashashin",
        spec: "Succession",
        hp: 11500,
        ap: 320.5,
        aap: 322,
        adventureap: 1055.8,
        adventureaap: 1060.2,
        mldr: 890,
        radr: 880,
        madr: 870,
        acc: 1080,
        meev: 790,
        raev: 780,
        maev: 770,
        bdrp: 7.5,
        chrp: 12,
        chc: 100,
        abad: 10,
        adad: 15,
        aaad: 5,
        is_public: false,
        combos: [],
      };

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify(presetData),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.user_id).toBe(createdUser.id);
      expect(responseBody.name).toBe("Zels Endgame Build");
      expect(responseBody.class_name).toBe("Hashashin");
      expect(responseBody.spec).toBe("Succession");

      // Verify numeric values parsed correctly
      expect(responseBody.hp).toBe(11500);
      expect(responseBody.ap).toBe(320.5);
      expect(responseBody.aap).toBe(322);
      expect(responseBody.adventureap).toBe(1055.8);
      expect(responseBody.adventureaap).toBe(1060.2);
      expect(responseBody.mldr).toBe(890);
      expect(responseBody.radr).toBe(880);
      expect(responseBody.madr).toBe(870);
      expect(responseBody.acc).toBe(1080);
      expect(responseBody.meev).toBe(790);
      expect(responseBody.raev).toBe(780);
      expect(responseBody.maev).toBe(770);
      expect(responseBody.bdrp).toBe(7.5);
      expect(responseBody.chrp).toBe(12);
      expect(responseBody.chc).toBe(100);
      expect(responseBody.abad).toBe(10);
      expect(responseBody.adad).toBe(15);
      expect(responseBody.aaad).toBe(5);
      expect(responseBody.is_public).toBe(false);
    });

    test("Auto-incrementing preset names for multiple presets of same user", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      // First preset without name -> "Preset 1"
      const res1 = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({ class_name: "Warrior" }),
      });
      const body1 = await res1.json();
      expect(res1.status).toBe(201);
      expect(body1.name).toBe("Preset 1");

      // Second preset without name -> "Preset 2"
      const res2 = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({ class_name: "Warrior" }),
      });
      const body2 = await res2.json();
      expect(res2.status).toBe(201);
      expect(body2.name).toBe("Preset 2");

      // Another user creates a preset -> starts at "Preset 1" for that user
      const anotherUser = await orchestrator.createUser();
      const anotherSession = await orchestrator.createSession(anotherUser);
      const resAnother = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${anotherSession.token}`,
        },
        body: JSON.stringify({ class_name: "Sorceress" }),
      });
      const bodyAnother = await resAnother.json();
      expect(resAnother.status).toBe(201);
      expect(bodyAnother.name).toBe("Preset 1");
    });

    test("With empty payload (missing class_name)", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With invalid class_name", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "InvalidClass",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With invalid spec", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          spec: "SuperSaiyan",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With empty string in name", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          name: "   ",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With name exceeding 100 characters", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          name: "a".repeat(101),
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With string in numeric field (e.g. hp: 'invalid')", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          hp: "ten-thousand",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With negative number in numeric field (e.g. ap: -10)", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          ap: -10,
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With non-boolean in is_public", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          is_public: "true",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With non-array in combos", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          combos: "my-combo",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });
  });

  describe("Anonymous user", () => {
    test("Trying to create a preset without authentication", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_name: "Hashashin",
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "create:preset"',
        status_code: 403,
      });
    });
  });
});
