import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/skills", () => {
  describe("Privileged user", () => {
    test("With valid data", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["create:skill"]);
      const fictionalSkill = {
        id: 9999,
        name: "Sandstorm Slash",
        class_name: "Hashashin",
        skill_spec: "Awakening",
        cooldown: 6,
        crit_hit_rate: 50,
        pvp_damage: 62.5,
        icon_path: "/icons/sandstorm_slash.webp",
        is_sa: true,
        is_fg: false,
        is_if: false,
        is_down_attack: true,
        is_air_attack: false,
        is_down_smash: false,
        is_knockback: false,
        is_stun: false,
        is_knockdown: true,
        is_floating: false,
        is_air_smash: false,
        is_stiffness: false,
        is_bound: false,
        is_grapple: false,
        is_freezing: false,
        hits: [
          {
            description: "Slash damage",
            damage_percent: 1250,
            hit_count: 3,
            is_sa: true,
            is_fg: false,
            is_if: false,
            is_down_attack: true,
          },
          {
            description: "Sand vortex explosion",
            damage_percent: 1580,
            hit_count: 2,
            is_sa: true,
            is_fg: false,
            is_if: false,
            is_knockdown: true,
            is_down_attack: true,
          },
        ],
      };

      const response = await fetch(`${webserver.origin}/api/v1/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
        body: JSON.stringify(fictionalSkill),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      // Name and Id
      expect(responseBody.id).toBe(fictionalSkill.id);
      expect(responseBody.name).toBe(fictionalSkill.name);
      expect(responseBody.class_name).toBe(fictionalSkill.class_name);

      // Numeric Itens
      expect(typeof responseBody.cooldown).toBe("number");
      expect(responseBody.cooldown).toBe(6);
      expect(responseBody.pvp_damage).toBe(62.5);

      // HITS
      expect(Array.isArray(responseBody.hits)).toBe(true);
      expect(responseBody.hits).toHaveLength(2);
      expect(uuidVersion(responseBody.hits[0].id)).toBe(4);
      expect(Date.parse(responseBody.hits[0].created_at)).not.toBeNaN();
      expect(responseBody.hits[0].damage_percent).toBe(1250);
      expect(responseBody.hits[0].hit_count).toBe(3);

      // Skill Data
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With invalid data (missing id)", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["create:skill"]);

      const invalidSkill = {
        name: "Skill Without ID",
        class_name: "Hashashin",
        skill_spec: "Awakening",
      };

      const response = await fetch(`${webserver.origin}/api/v1/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
        body: JSON.stringify(invalidSkill),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Invalid skill object.",
        action: "Verify if skill object is typed correctly.",
        status_code: 400,
      });
    });
    test("With string in numeric field (e.g., pvp_damage) ", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["create:skill"]);

      const invalidSkill = {
        id: 9999,
        name: "SkillWithStringNumericField",
        class_name: "Hashashin",
        skill_spec: "Awakening",
        pvp_damage: "damage",
        cooldown: "cooldown",
        crit_hit_rate: "critical",
      };

      const response = await fetch(`${webserver.origin}/api/v1/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
        body: JSON.stringify(invalidSkill),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Field cooldown must be a valid posite number.",
        action: "Provide a valid number for cooldown",
        status_code: 400,
      });
    });
    test("With string in boolean field (e.g., is_sa) ", async () => {
      const privilegedUser = await orchestrator.createUser();
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, ["create:skill"]);

      const invalidSkill = {
        id: 9999,
        name: "SkillWithStringNumericField",
        class_name: "Hashashin",
        skill_spec: "Awakening",
        is_sa: "yes",
      };

      const response = await fetch(`${webserver.origin}/api/v1/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
        body: JSON.stringify(invalidSkill),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Field is_sa must be a boolean (true or false)",
        action: 'Provide true or false for "is_sa"',
        status_code: 400,
      });
    });
  });
  describe("Default user", () => {
    test("Trying to post a new Skill", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/skills`, {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: \"create:skill\"',
        status_code: 403,
      });
    });
  });
  describe("Anonymous user", () => {
    test("Trying to post a new Skill", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/skills`, {
        method: "POST",
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: \"create:skill\"',
        status_code: 403,
      });
    });
  });
});
