import orchestrator from "~/tests/orchestrator.js";
import webserver from "~/infra/webserver";
import discord from "~~/infra/discord.js";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("Use case: Registration flow (all successful)", () => {
  let sessionToken;
  let expectedUsername;
  let expectedDiscordId;

  test("Create user account", async () => {
    const createUserResponse1 = await fetch(
      `${webserver.origin}/api/v1/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "manual",
      },
    );

    expect(createUserResponse1.status).toBe(302);

    const createUserLocation1 = new URL(
      createUserResponse1.headers.get("location"),
    );

    expect(
      createUserLocation1.href.startsWith(`${discord.api}/oauth2/authorize`),
    ).toBe(true);

    const createUserResponse2 = await fetch(createUserLocation1, {
      redirect: "manual",
    });

    expect(createUserResponse2.status).toBe(302);

    const createUserLocation2 = new URL(
      createUserResponse2.headers.get("location"),
    );

    expectedUsername = "RegistrationFlow";
    expectedDiscordId = "123456789012345678";

    createUserLocation2.searchParams.set(
      "code",
      `mocked_user_${expectedDiscordId}_${expectedUsername}`,
    );

    expect(
      createUserLocation2.href.startsWith(
        `${webserver.origin}/api/v1/auth/callback/discord`,
      ),
    ).toBe(true);

    const createUserResponse3 = await fetch(createUserLocation2, {
      redirect: "manual",
    });

    expect(createUserResponse3.status).toBe(302);

    const parsedSetCookie = setCookieParser(createUserResponse3, {
      map: true,
    });

    sessionToken = parsedSetCookie.session_id.value;
  });
  test("Get user information", async () => {
    const userResponse = await fetch(`${webserver.origin}/api/v1/user`, {
      headers: {
        Cookie: `session_id=${sessionToken}`,
      },
    });

    expect(userResponse.status).toBe(200);

    const userResponseBody = await userResponse.json();

    expect(userResponseBody).toEqual({
      id: expect.any(String),
      username: expectedUsername,
      display_name: expect.any(String),
      avatar: expect.any(String),
      discord_id: expectedDiscordId,
      features: ["read:session", "read:status", "read:user"],
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });
});
