import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/presets/import", () => {
  describe("Anonymous User", () => {
    test("With nonexistent garmoth character", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "1.0.0.1",
          },
          body: JSON.stringify({
            provider: "garmoth",
            character_id: "InvalidCharacter",
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Not found character with id:'InvalidCharacter'.",
        action: "Verify if you typed id correctly.",
        status_code: 404,
      });
    });
    test("With invalid provider", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "1.0.0.2",
          },
          body: JSON.stringify({
            provider: "InvalidProvider",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Invalid provider, valid options are: 'garmoth",
        action: "Verify if you typed provider correctly.",
        status_code: 400,
      });
    });
    test("With missing character_id", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "1.0.0.3",
          },
          body: JSON.stringify({
            provider: "garmoth",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: 'Field "character_id" is required',
        action: "Please check the provided data and try again.",
        status_code: 400,
      });
    });
    test("With private garmoth character", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "1.0.0.4",
          },
          body: JSON.stringify({
            provider: "garmoth",
            character_id: "privateCharacter",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "This garmoth character is private.",
        action:
          "Make sure the character or build is public on Garmoth before importing.",
        status_code: 403,
      });
    });
    test("With valid body", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "1.0.0.5",
          },
          body: JSON.stringify({
            provider: "garmoth",
            character_id: "dysbcFhfgj",
            position: 0,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.class_name).toBe("Witch");
      expect(responseBody.spec).toBe("Awakening");
      expect(responseBody.hp).toBe(8185);
      expect(responseBody.ap).toBe(379.5);
      expect(responseBody.mldr).toBe(598);
      expect(responseBody.is_public).toBe(true);
      expect(Array.isArray(responseBody.combos)).toBe(true);
    });
    test("With repeated requests from same IP within cooldown (should return 429)", async () => {
      const response1 = await fetch(
        `${webserver.origin}/api/v1/presets/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "9.9.9.9",
          },
          body: JSON.stringify({
            provider: "garmoth",
            character_id: "dysbcFhfgj",
            position: 0,
          }),
        },
      );

      expect(response1.status).toBe(200);

      const response2 = await fetch(
        `${webserver.origin}/api/v1/presets/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "9.9.9.9",
          },
          body: JSON.stringify({
            provider: "garmoth",
            character_id: "dysbcFhfgj",
            position: 0,
          }),
        },
      );

      expect(response2.status).toBe(429);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        action: "Wait a few seconds and try again.",
        message:
          "Please wait 5 seconds before making another request to Garmoth.",
        name: "TooManyRequestsError",
        status_code: 429,
      });
    });
    test("With valid body without position (should list all combat builds)", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "1.0.0.6",
          },
          body: JSON.stringify({
            provider: "garmoth",
            character_id: "dysbcFhfgj",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(2);
      expect(responseBody[0].name).toBe("Witch Awakening - Blank Preset");
      expect(responseBody[0].class_name).toBe("Witch");
      expect(responseBody[0].hp).toBe(8185);
      expect(responseBody[1].name).toBe("Witch Succession - DR Preset");
      expect(responseBody[1].class_name).toBe("Witch");
      expect(responseBody[1].hp).toBe(8500);
    });
  });
});
