import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import discord from "~~/infra/discord.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
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
});
