import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { faker } from "@faker-js/faker";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET to /api/v1/auth/callback/discord", () => {
  describe("Anonymous user", () => {
    test("With valid code", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=${faker.string.alphanumeric(30)}`,
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.application.id.length).toBe(18);
      expect(responseBody.application.name).toBe("Down Attack");
      expect(responseBody.application.icon.length).toBe(32);
      expect(responseBody.application.description).toBeDefined();
      expect(responseBody.application.hook).toBe(true);
      expect(responseBody.application.bot_public).toBe(true);
      expect(responseBody.application.bot_require_code_grant).toBe(false);
      expect(responseBody.application.verify_key.length).toBe(64);
      expect(responseBody.scopes).toEqual(["guilds.join", "identify"]);
      expect(new Date(responseBody.expires).getTime()).toBeGreaterThan(
        Date.now(),
      );
      expect(responseBody.user.id.length).toBe(18);
      expect(responseBody.user.username).toBeDefined();
      expect(responseBody.user.avatar.length).toBe(32);
      expect(responseBody.user.discriminator).toBe("0");
      expect(responseBody.user.global_name).toBeDefined();
      expect(responseBody.user.public_flags).toBe(131072);
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
});
