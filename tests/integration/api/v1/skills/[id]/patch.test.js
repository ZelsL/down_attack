import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/skills/[id]", () => {
  describe("Privileged user", () => {
    test("With valid update data (partial update)", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["update:skill"]);

      const initialSkill = await orchestrator.createSkill({
        id: 5001,
        name: "Initial Skill",
        class_name: "Hashashin",
        skill_spec: "Awakening",
        cooldown: 10,
        pvp_damage: 50,
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/skills/${initialSkill.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${privilegedUserSession.token}`,
          },
          body: JSON.stringify({
            cooldown: 5,
            pvp_damage: 75.5,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.id).toBe(5001);
      expect(responseBody.name).toBe("Initial Skill");
      expect(responseBody.class_name).toBe("Hashashin");
      expect(responseBody.skill_spec).toBe("Awakening");
      expect(responseBody.cooldown).toBe(5);
      expect(responseBody.pvp_damage).toBe(75.5);
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With hits replacement", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["update:skill"]);

      const initialSkill = await orchestrator.createSkill({
        id: 5002,
        name: "Skill With Hits",
        class_name: "Hashashin",
        skill_spec: "Awakening",
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/skills/${initialSkill.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${privilegedUserSession.token}`,
          },
          body: JSON.stringify({
            hits: [
              {
                description: "New 1st hit",
                damage_percent: 2500,
                hit_count: 4,
                is_sa: true,
              },
            ],
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.hits).toHaveLength(1);
      expect(responseBody.hits[0].description).toBe("New 1st hit");
      expect(responseBody.hits[0].damage_percent).toBe(2500);
      expect(responseBody.hits[0].hit_count).toBe(4);
      expect(uuidVersion(responseBody.hits[0].id)).toBe(4);
    });

    test("With nonexistent skill id", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["update:skill"]);

      const response = await fetch(`${webserver.origin}/api/v1/skills/999999`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
        body: JSON.stringify({
          cooldown: 5,
        }),
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

    test("With invalid data type", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["update:skill"]);

      const response = await fetch(`${webserver.origin}/api/v1/skills/5001`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
        body: JSON.stringify({
          cooldown: "invalid_cooldown",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
    });
  });

  describe("Default user", () => {
    test("Trying to update a skill", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/skills/5001`, {
        method: "PATCH",
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
        action: 'Verify if your user has the feature: "update:skill"',
        status_code: 403,
      });
    });
  });

  describe("Anonymous user", () => {
    test("Trying to update a skill", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/skills/5001`, {
        method: "PATCH",
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
        action: 'Verify if your user has the feature: "update:skill"',
        status_code: 403,
      });
    });
  });
});
