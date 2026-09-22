import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/presets/[id]", () => {
  describe("Privileged user", () => {
    test("with 'delete:preset:others feature'", async () => {
      const privilegedUser = await orchestrator.createUser();
      await orchestrator.addFeaturesToUser(privilegedUser, [
        "delete:preset:others",
      ]);
      const defaultUser = await orchestrator.createUser();
      const defaultUserPreset = await orchestrator.createPreset(
        undefined,
        defaultUser,
      );

      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${defaultUserPreset.id}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${privilegedUserSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(defaultUserPreset);
    });
  });
  describe("Default user", () => {
    test("With valid id", async () => {
      const createdUser = await orchestrator.createUser();
      const userSessionObject = await orchestrator.createSession(createdUser);

      const userPreset = await orchestrator.createPreset(
        undefined,
        createdUser,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${userPreset.id}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${userSessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...userPreset,
      });
    });
    test("Trying to delete UserB preset", async () => {
      const createdUserA = await orchestrator.createUser();
      const createdUserB = await orchestrator.createUser();
      const userASessionObject = await orchestrator.createSession(createdUserA);

      const userBPreset = await orchestrator.createPreset(
        undefined,
        createdUserB,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${userBPreset.id}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${userASessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "delete:preset:others"',
        status_code: 403,
      });
    });
    test("With invalid id", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/00000000-0000-0000-0000-000000000000`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verify if you typed id correctly",
        message:
          'Preset with id "00000000-0000-0000-0000-000000000000" not found',
        name: "NotFoundError",
        status_code: 404,
      });
    });
    test("With invalid UUID format", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/12345670`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verify if you typed id correctly",
        message: 'Preset with id "12345670" not found',
        name: "NotFoundError",
        status_code: 404,
      });
    });
  });
  describe("Anonymous user", () => {
    test("Without 'delete:preset' feature", async () => {
      const createdPreset = await orchestrator.createPreset();
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${createdPreset.id}`,
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "delete:preset"',
        status_code: 403,
      });
    });
  });
});
