import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { faker } from "@faker-js/faker";
import { validate as validateUUID } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/auth/callback/discord", () => {
  describe("Anonymous user", () => {
    test("With valid code", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=${faker.string.alphanumeric(30)}`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(validateUUID(responseBody.id)).toBe(true);
      expect(responseBody.discord_id.length).toEqual(18);
      expect(responseBody.display_name).toBeDefined();
      expect(responseBody.avatar).toBeDefined();
      expect(responseBody.created_at > responseBody.updated_at).toBe(false);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With invalid code", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=fictitious_code`,
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Invalid Discord code",
        action: "Start a new authorization flow.",
        status_code: 400,
      });
    });
    test("Without code query parameter", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord`,
      );
      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Missing 'code' query parameter",
        action: "Send a valid 'code' query parameter in the request.",
        status_code: 400,
      });
    });
  });
  describe("Default user", () => {
    test("Login with no changes", async () => {
      const createdUser = await orchestrator.createUser("NoChangesUser");
      const code = `mocked_user_${createdUser.discord_id}_${createdUser.username}`;

      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=${code}`,
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.discord_id).toEqual(createdUser.discord_id);
      expect(responseBody.username).toEqual(createdUser.username);
      expect(responseBody.created_at).toBe(
        createdUser.created_at.toISOString(),
      );
      expect(responseBody.id).toBe(createdUser.id);
    });
    test("Login with username change", async () => {
      const createdUser = await orchestrator.createUser("BeforeChange");
      const code = `mocked_user_${createdUser.discord_id}_AfterChange`;

      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=${code}`,
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.discord_id).toEqual(createdUser.discord_id);
      expect(responseBody.username).toEqual("AfterChange");
      expect(responseBody.created_at).toBe(
        createdUser.created_at.toISOString(),
      );
      expect(responseBody.id).toBe(createdUser.id);
      expect(
        new Date(responseBody.updated_at).getTime(),
      ).toBeGreaterThanOrEqual(new Date(createdUser.updated_at).getTime());
    });
  });
});
