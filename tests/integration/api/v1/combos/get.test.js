import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/combos", () => {
  describe("Anonymous User", () => {
    test("Should to return 403", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "GET",
        headers: {
          "Content-type": "application.json",
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: 'Verify if your user has the feature: "read:combo"',
        message: "You do not have permission to run this action.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });
  describe("Default User", () => {
    test("With no combo registered", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([]);
    });
    test("With combo registered", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const createdCombo = await orchestrator.createCombo(
        undefined,
        createdUser,
      );

      const response = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          class_name: "Hashashin",
          created_at: responseBody[0].created_at,
          id: createdCombo.id,
          name: "Valid Combo",
          preset_id: null,
          skills: [{ hits: [], id: 5608, name: "Aal's Dominion IV" }],
          spec: "Awakening",
          updated_at: responseBody[0].updated_at,
          user_id: createdUser.id,
        },
      ]);
    });
    test("With userA trying to get userB combos", async () => {
      const createdUserA = await orchestrator.createUser();
      const sessionObjectA = await orchestrator.createSession(createdUserA);
      const createdUserB = await orchestrator.createUser();

      const createdComboA = await orchestrator.createCombo(
        undefined,
        createdUserA,
      );

      await orchestrator.createCombo(undefined, createdUserB);

      const responseA = await fetch(`${webserver.origin}/api/v1/combos`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `session_id=${sessionObjectA.token}`,
        },
      });

      expect(responseA.status).toBe(200);

      const responseABody = await responseA.json();

      expect(responseABody).toEqual([
        {
          class_name: "Hashashin",
          created_at: responseABody[0].created_at,
          id: createdComboA.id,
          name: "Valid Combo",
          preset_id: null,
          skills: [{ hits: [], id: 5608, name: "Aal's Dominion IV" }],
          spec: "Awakening",
          updated_at: responseABody[0].updated_at,
          user_id: createdUserA.id,
        },
      ]);

      expect(Array.isArray(responseABody)).toBe(true);
      expect(responseABody.length).toBe(1);
    });
    test("With valid class_name query param", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      await orchestrator.createCombo(undefined, createdUser);
      const dosaCombo = await orchestrator.createCombo(
        {
          class_name: "Dosa",
          spec: "Succession",
          skills: [],
        },
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos?class_name=Dosa`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          class_name: "Dosa",
          created_at: responseBody[0].created_at,
          id: dosaCombo.id,
          name: "Valid Combo",
          preset_id: null,
          skills: [],
          spec: "Succession",
          updated_at: responseBody[0].updated_at,
          user_id: createdUser.id,
        },
      ]);
    });
    test("With invalid class_name query param", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      await orchestrator.createCombo(
        {
          class_name: "Dosa",
          spec: "Succession",
          skills: [],
        },
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos?class_name=Doosa`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action:
          "Please provide a valid BDO class name (e.g Hashashin, Warrior).",
        message: "Invalid class_name: 'Doosa'.",
        name: "ValidationError",
        status_code: 400,
      });
    });
    test("With valid class_name and spec query param", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      await orchestrator.createCombo(
        {
          class_name: "Dosa",
          spec: "Succession",
          skills: [],
        },
        createdUser,
      );

      const dosaAwakCombo = await orchestrator.createCombo(
        {
          class_name: "Dosa",
          spec: "Awakening",
          skills: [],
        },
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos?class_name=Dosa&spec=awakening`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          class_name: "Dosa",
          created_at: responseBody[0].created_at,
          id: dosaAwakCombo.id,
          name: "Valid Combo",
          preset_id: null,
          skills: [],
          spec: "Awakening",
          updated_at: responseBody[0].updated_at,
          user_id: createdUser.id,
        },
      ]);
    });
    test("With invalid class_name and spec query param", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      await orchestrator.createCombo(
        {
          class_name: "Dosa",
          spec: "Awakening",
          skills: [],
        },
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos?class_name=Doosa&spec=aawakening`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action:
          "Please provide a valid BDO class name (e.g Hashashin, Warrior).",
        message: "Invalid class_name: 'Doosa'.",
        name: "ValidationError",
        status_code: 400,
      });
    });
    test("With valid preset_id query param", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const createdPreset = await orchestrator.createPreset(
        undefined,
        createdUser,
      );

      const comboWithPreset = await orchestrator.createCombo(
        {
          preset_id: createdPreset.id,
        },
        createdUser,
      );

      await orchestrator.createCombo(
        {
          class_name: "Dosa",
          name: "ComboWithoutPreset",
          spec: "Succession",
          skills: [],
        },
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos?preset_id=${createdPreset.id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          class_name: comboWithPreset.class_name,
          created_at: responseBody[0].created_at,
          id: comboWithPreset.id,
          name: comboWithPreset.name,
          preset_id: createdPreset.id,
          skills: comboWithPreset.skills,
          spec: comboWithPreset.spec,
          updated_at: responseBody[0].updated_at,
          user_id: createdUser.id,
        },
      ]);
    });
    test("With invalid preset_id query param", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const createdPreset = await orchestrator.createPreset(
        undefined,
        createdUser,
      );

      const comboWithPreset = await orchestrator.createCombo(
        {
          preset_id: createdPreset.id,
        },
        createdUser,
      );

      await orchestrator.createCombo(
        {
          class_name: "Dosa",
          name: "ComboWithoutPreset",
          spec: "Succession",
          skills: [],
        },
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos?preset_id=invalid`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      const responseBody = await response.json();
      expect(response.status).toBe(400);

      expect(responseBody).toEqual({
        action: "Please provide a valid UUID for preset_id.",
        message: "Invalid preset_id: 'invalid'.",
        name: "ValidationError",
        status_code: 400,
      });
    });
  });
});
