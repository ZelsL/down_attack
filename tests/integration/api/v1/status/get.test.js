describe("Anonymous user", () => {
  test("Retrieving current system status", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    expect(response.status).toBe(201);
  });
});
