import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/combos/[id]", () => {
  describe("Anonymous User", () => {
    test("Should to return 403", async () => {
      const createdUser = await orchestrator.createUser();
      const creadtedCombo = await orchestrator.createCombo(
        undefined,
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${creadtedCombo.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application.json",
          },
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: 'Verify if your user has the feature: "delete:combo"',
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
          method: "DELETE",
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
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
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
    test("UserA trying to Delete UserB combo, should to return 404", async () => {
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
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObjectA.token}`,
          },
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
    test("With own combo, should return 200", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);
      const createdCombo = await orchestrator.createCombo(
        undefined,
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${createdCombo.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        class_name: createdCombo.class_name,
        spec: createdCombo.spec,
        id: createdCombo.id,
        name: createdCombo.name,
        preset_id: createdCombo.preset_id,
        skills: createdCombo.skills,
        created_at: createdCombo.created_at.toISOString(),
        updated_at: createdCombo.updated_at.toISOString(),
        user_id: createdUser.id,
      });
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });
  describe("Privileged User", () => {
    test("With 'delete:combo:others' feature, trying to get UserB combo, should to return 200", async () => {
      const privilegedUser = await orchestrator.createUser();
      const createdUserB = await orchestrator.createUser();
      const privilegedUserSessionObject =
        await orchestrator.createSession(privilegedUser);
      await orchestrator.addFeaturesToUser(privilegedUser, [
        "delete:combo:others",
      ]);
      const userBCombo = await orchestrator.createCombo(
        undefined,
        createdUserB,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/combos/${userBCombo.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Cookie: `session_id=${privilegedUserSessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        class_name: userBCombo.class_name,
        spec: userBCombo.spec,
        id: userBCombo.id,
        name: userBCombo.name,
        preset_id: userBCombo.preset_id,
        skills: userBCombo.skills,
        created_at: userBCombo.created_at.toISOString(),
        updated_at: userBCombo.updated_at.toISOString(),
        user_id: createdUserB.id,
      });
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });
});
