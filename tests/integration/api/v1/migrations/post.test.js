import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/migrations`, {
        method: "POST",
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: 'Verify if your user has the feature: \"run:migrations\"',
        message: "You do not have permission to run this action.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });
  describe("Default user", () => {
    test("Running pending migrations", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response1 = await fetch(`${webserver.origin}/api/v1/migrations`, {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response1.status).toBe(403);

      const response1Body = await response1.json();

      expect(response1Body).toEqual({
        action: 'Verify if your user has the feature: \"run:migrations\"',
        message: "You do not have permission to run this action.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });
});
describe("Privileged user", () => {
  describe("With `run:migrations`", () => {
    test("Running pending migrations", async () => {
      const privilegedUser = await orchestrator.createUser();
      await orchestrator.addFeaturesToUser(privilegedUser, ["run:migrations"]);
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);

      const response = await fetch(`${webserver.origin}/api/v1/migrations`, {
        method: "POST",
        headers: {
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toEqual([]);
    });
  });
});
