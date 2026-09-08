import orchestrator from "~~/tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.clearDatabase();
});

test("POST to /api/v1/migration should return 200", async () => {
  const response1 = await fetch(`${webserver.origin}/api/v1/migrations`, {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();

  expect(response1Body.length).toBeGreaterThan(0);
  expect(Array.isArray(response1Body)).toBe(true);

  const response2 = await fetch(`${webserver.origin}/api/v1/migrations`, {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  expect(response2Body.length).toBe(0);
  expect(Array.isArray(response2Body)).toBe(true);
});
