import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/auth/callback/discord", () => {
  describe("anonymous user", () => {
    test("With valid request", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord`,
        {
          method: "POST",
        },
      );
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Method not allowed for this endpoint.",
        action:
          "Please verify that the HTTP method is valid for this endpoint.",
        status_code: 405,
      });
    });
  });
});
