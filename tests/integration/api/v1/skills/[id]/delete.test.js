import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/skills/[id]", () => {
  describe("Privileged user", () => {
    test("With existent skill id", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["delete:skill"]);

      const createdSkill = await orchestrator.createSkill({
        id: 101,
        name: "Glaive Skill",
        class_name: "Hashashin",
        skill_spec: "Awakening",
      });

      const response = await fetch(`${webserver.origin}/api/v1/skills/101`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(createdSkill);
    });
    test("With nonexistent skill id", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["delete:skill"]);

      const response = await fetch(`${webserver.origin}/api/v1/skills/999999`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
      });

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Skill with id '999999' not found.",
        action: "Please check if the skill id is correct.",
        status_code: 404,
      });
    });
  });

  describe("Default user", () => {
    test("Trying to delete a skill", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/skills/5001`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({ cooldown: 3 }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "delete:skill"',
        status_code: 403,
      });
    });
  });

  describe("Anonymous user", () => {
    test("Trying to delete a skill", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/skills/5001`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cooldown: 3 }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "delete:skill"',
        status_code: 403,
      });
    });
  });
});
