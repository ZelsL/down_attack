describe("Anonymous user", () => {
  test("Retrieving current system status", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    const responseBody = await response.json();

    expect(response.status).toBe(200);

    const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

    expect(responseBody.updated_at).toBeDefined();
    expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
    expect(responseBody.dependencies.database.version).toBe("16.15");
    expect(responseBody.dependencies.database.opened_connections).toBeDefined();
    expect(responseBody.dependencies.database.opened_connections).toBe(1);
    expect(responseBody.dependencies.database.max_connections).toBe(100);
  });
});
