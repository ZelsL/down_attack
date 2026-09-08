import orchestrator from "~~/tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.clearDatabase();
});

test("GET to /api/v1/migrations shoul return 200", async () => {
  const response = await fetch(`${webserver.origin}/api/v1/migrations`);
  expect(response.status).toBe(200);
  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
