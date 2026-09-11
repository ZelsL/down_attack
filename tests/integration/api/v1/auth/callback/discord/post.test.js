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
        message: "Método não permitido para este endpoint.",
        action: "Verifique se o metodo http é valido para este endpoint.",
        status_code: 405,
      });
    });
  });
});
