import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/combos", () => {
  describe("Anonymous User", () => {
    test("should return 401 when trying to create a combo without authentication", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          name: "Test Combo",
          skills: [],
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ForbiddenError",
        status_code: 403,
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "create:combo"',
      });
    });
  });
  describe("Default User", () => {
    test("with invalid data", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          name: "Invalid Combo",
          class_name: "Invalid Class",
          spec: "Invalid",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        status_code: 400,
        message: "Invalid class_name: 'Invalid Class'.",
        action:
          "Please provide a valid BDO class name (e.g Hashashin, Warrior).",
      });
    });
    test("With 43 skills, should to return Validation Error", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);
      const createdSkill = await orchestrator.createSkill();

      const validSkillItem = {
        id: createdSkill.id,
        name: createdSkill.name,
        hits: [],
      };

      const skillArray = Array.from({ length: 43 }, () => ({
        ...validSkillItem,
      }));

      const response = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          name: "Valid Combo",
          class_name: "Hashashin",
          spec: "Awakening",
          skills: skillArray,
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Max 42 skills per combo.",
        message: "Too many skills in combo: 43",
        name: "ValidationError",
        status_code: 400,
      });
    });
    test("With valid data", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          name: "Valid Combo",
          class_name: "Hashashin",
          spec: "Awakening",
          skills: [],
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.user_id).toBe(createdUser.id);
      expect(responseBody.name).toBe("Valid Combo");
      expect(responseBody.spec).toBe("Awakening");
      expect(responseBody.skills).toEqual([]);
      expect(responseBody.class_name).toBe("Hashashin");
      expect(responseBody.preset_id).toBeNull();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With no name, should to return 'Combo #1, Combo#2'", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response1 = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          spec: "Awakening",
          skills: [],
        }),
      });

      expect(response1.status).toBe(201);

      const response1Body = await response1.json();

      expect(uuidVersion(response1Body.id)).toBe(4);
      expect(response1Body.user_id).toBe(createdUser.id);
      expect(response1Body.name).toBe("Combo #1");
      expect(response1Body.spec).toBe("Awakening");
      expect(response1Body.skills).toEqual([]);
      expect(response1Body.class_name).toBe("Hashashin");
      expect(response1Body.preset_id).toBeNull();
      expect(Date.parse(response1Body.created_at)).not.toBeNaN();
      expect(Date.parse(response1Body.updated_at)).not.toBeNaN();

      const response2 = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          class_name: "Hashashin",
          spec: "Awakening",
          skills: [],
        }),
      });

      expect(response2.status).toBe(201);

      const response2Body = await response2.json();

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(response2Body.user_id).toBe(createdUser.id);
      expect(response2Body.name).toBe("Combo #2");
      expect(response2Body.spec).toBe("Awakening");
      expect(response2Body.skills).toEqual([]);
      expect(response2Body.class_name).toBe("Hashashin");
      expect(response2Body.preset_id).toBeNull();
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });
  });
});
