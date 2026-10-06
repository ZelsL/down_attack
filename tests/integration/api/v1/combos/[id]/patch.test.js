import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/combos/[id]", () => {
  describe("Anonymous user", () => {
    test("Should to return 403", async () => {
      const createdUser = await orchestrator.createUser();
      const creadtedCombo = await orchestrator.createCombo(
        undefined,
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${creadtedCombo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application.json",
          },
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: 'Verify if your user has the feature: "update:combo"',
        message: "You do not have permission to run this action.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });
  describe("Default user", () => {
    test("With invalid combo ID, should return 400", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      await orchestrator.createCombo(undefined, createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/invalid-id`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Please provide a valid UUID for combo_id.",
        message: "Invalid combo_id: 'invalid-id'.",
        name: "ValidationError",
        status_code: 400,
      });
    });
    test("With unexisting combo ID, should return 404", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/6017d057-3043-4f6a-833e-1187d5648951`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            class_name: "Dosa",
            spec: "Succession",
            name: "Edited Combo",
            skills: [],
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verify if you typed correctly the combo id.",
        message:
          "Combo with id: 6017d057-3043-4f6a-833e-1187d5648951 not found.",
        name: "NotFoundError",
        status_code: 404,
      });
    });
    test("UserA trying to PATCH UserB combo, should to return 404", async () => {
      const createdUserA = await orchestrator.createUser();
      const createdUserB = await orchestrator.createUser();
      const sessionObjectA = await orchestrator.createSession(createdUserA);
      const userBCombo = await orchestrator.createCombo(
        undefined,
        createdUserB,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${userBCombo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObjectA.token}`,
          },
          body: JSON.stringify({
            class_name: "Dosa",
            spec: "Awakening",
            skills: [],
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verify if you typed correctly the combo id.",
        message: `Combo with id: ${userBCombo.id} not found.`,
        name: "NotFoundError",
        status_code: 404,
      });
    });
    test("With empty payload, should to return 400", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const createdCombo = await orchestrator.createCombo(
        undefined,
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${createdCombo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Please provide at least one valid field to update.",
        message: "No valid fields to update were provided.",
        name: "ValidationError",
        status_code: 400,
      });
    });
    test("With incompatible skills for class, should return 400", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const createdCombo = await orchestrator.createCombo(
        undefined,
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${createdCombo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            class_name: "Dosa",
            spec: "Succession",
            name: "Edited Combo",
          }),
        },
      );

      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Please provide a valid skill ID.",
        message: "Invalid skill ID: 5608",
        name: "ValidationError",
        status_code: 400,
      });
    });
    test("With unallowed fields to update (e.g. user_id), should return 400", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);
      const createdCombo = await orchestrator.createCombo(
        undefined,
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${createdCombo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            user_id: "outro-usuario",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verify if the column user_id is allowed to update.",
        message: "You cannot update user_id.",
        name: "ValidationError",
        status_code: 400,
      });
    });
    test("With valid payload, should to return 200", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const createdCombo = await orchestrator.createCombo(
        undefined,
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${createdCombo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            class_name: "Dosa",
            spec: "Succession",
            name: "Edited Combo",
            skills: [],
          }),
        },
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.class_name).toBe("Dosa");
      expect(responseBody.spec).toBe("Succession");
      expect(responseBody.name).toBe("Edited Combo");
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });
  describe("Privileged user", () => {
    test("With 'update:combo:others' trying to PATCH UserB combo, should to return 200", async () => {
      const privilegedUser = await orchestrator.createUser();
      const createdUserB = await orchestrator.createUser();
      await orchestrator.addFeaturesToUser(privilegedUser, [
        "update:combo:others",
      ]);
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);
      const userBCombo = await orchestrator.createCombo(
        undefined,
        createdUserB,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${userBCombo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${privilegedUserSession.token}`,
          },
          body: JSON.stringify({
            class_name: "Dosa",
            spec: "Awakening",
            name: "Edited by privileged User",
            skills: [],
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.class_name).toBe("Dosa");
      expect(responseBody.spec).toBe("Awakening");
      expect(responseBody.name).toBe("Edited by privileged User");
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });
});
