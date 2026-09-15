import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import discord from "~~/infra/discord.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("anonymous user", () => {
    test("Should redirect to Discord authorization", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "manual",
      });

      expect(response.status).toBe(302);

      const locationUrl = new URL(response.headers.get("location"));
      expect(
        locationUrl.href.startsWith(`${discord.api}/oauth2/authorize`),
      ).toBe(true);
      expect(locationUrl.pathname).toBe(
        new URL(`${discord.api}/oauth2/authorize`).pathname,
      );
      expect(locationUrl.searchParams.get("client_id")).toBe(
        process.env.DISCORD_CLIENT_ID,
      );

      expect(locationUrl.searchParams.get("redirect_uri")).toBe(
        process.env.DISCORD_REDIRECT_URI,
      );
      expect(locationUrl.searchParams.get("response_type")).toBe("code");
      expect(locationUrl.searchParams.get("scope")).toBe("identify");
    });
  });
  describe("Default user", () => {
    test("With unique and valid data", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(`${webserver.origin}/api/v1/users`, {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: 'Verify if your user has the feature: "create:user"',
        message: "You do not have permission to run this action.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });
});
