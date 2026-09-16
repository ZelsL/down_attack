import orchestrator from "~/tests/orchestrator.js";
import webserver from "~/infra/webserver";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/skills/[className]", () => {
  describe("Anonymous user", () => {
    test("With existent class", async () => {
      const createdSkill = await orchestrator.createSkill();

      const response = await fetch(
        `${webserver.origin}/api/v1/skills/Hashashin`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Date.parse(responseBody[0].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[0].hits[0].created_at)).not.toBeNaN();

      expect(uuidVersion(responseBody[0].hits[0].id)).toBe(4);

      expect(responseBody).toEqual([createdSkill]);
    });
    test("With nonexistent class", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/skills/nonexistentClass`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Class not found.",
        action: "Please check if the class is typed correctly.",
        status_code: 404,
      });
    });
  });
});
