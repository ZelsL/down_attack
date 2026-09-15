import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser("SameCase");

      const response = await fetch(`${webserver.origin}/api/v1/users/SameCase`);

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        avatar: responseBody.avatar,
        display_name: responseBody.display_name,
        username: "SameCase",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        discord_id: responseBody.discord_id,
        features: responseBody.features,
        id: responseBody.id,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With case mismatch", async () => {
      const user = await orchestrator.createUser("DifferentCase");

      const response = await fetch(
        `${webserver.origin}/api/v1/users/differentcase`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        avatar: responseBody.avatar,
        display_name: responseBody.display_name,
        username: "DifferentCase",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        discord_id: responseBody.discord_id,
        features: responseBody.features,
        id: responseBody.id,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With nonexistent username", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/users/NonexistentUser`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Username not found.",
        action: "Please check if the username is typed correctly.",
        status_code: 404,
      });
    });
  });
});
