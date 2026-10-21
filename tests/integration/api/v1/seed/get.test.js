import orchestrator from "tests/orchestrator.js";
import webserver from "~/infra/webserver";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/seed", () => {
  describe("Anonymous User", () => {
    test("Should to return 403", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/seed`, {
        method: "GET",
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: 'Verify if your user has the feature: "update:skill"',
        message: "You do not have permission to run this action.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });
  describe("Default User", () => {
    test("Should to return 403", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch(`${webserver.origin}/api/v1/seed`, {
        method: "GET",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: 'Verify if your user has the feature: "update:skill"',
        message: "You do not have permission to run this action.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });
  describe("Privileged User", () => {
    test("With update:skill feature", async () => {
      const privilegedUser = await orchestrator.createUser();
      await orchestrator.addFeaturesToUser(privilegedUser, ["update:skill"]);
      const sessionObject = await orchestrator.createSession(privilegedUser);
      const createdSkill = await orchestrator.createSkill();

      const response = await fetch(`${webserver.origin}/api/v1/seed`, {
        method: "GET",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      expect(response.headers.get("Content-Disposition")).toBe(
        `attachment; filename=skills.json`,
      );

      expect(response.headers.get("Content-Type")).toBe("application/json");

      const responseBody = await response.json();

      expect(responseBody[0].id).toEqual(5608);
      expect(responseBody[0].class_name).toEqual("Hashashin");
      expect(responseBody[0].skill_spec).toEqual("Absolute");
      expect(responseBody[0].cooldown).toEqual(7);
      expect(responseBody[0].created_at).toBe(undefined);
      expect(responseBody[0].updated_at).toBe(undefined);
    });
  });
});
