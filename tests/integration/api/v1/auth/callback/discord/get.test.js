import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { faker } from "@faker-js/faker";
import session from "~/server/utils/session.js";
import setCookieParser from "set-cookie-parser";
import database from "~/infra/database.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/auth/callback/discord", () => {
  describe("Anonymous user", () => {
    test("With valid code", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=${faker.string.alphanumeric(30)}`,
        {
          redirect: "manual",
        },
      );

      expect(response.status).toBe(302);

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });
      const sessionToken = parsedSetCookie.session_id.value;

      const sessionResult = await database.query({
        text: `
        SELECT
          *
        FROM
          sessions
        WHERE
          token = $1
        ;`,
        values: [sessionToken],
      });

      const savedSession = sessionResult.rows[0];

      expect(savedSession.token).toBe(sessionToken);
      expect(uuidVersion(savedSession.id)).toBe(4);
      expect(Date.parse(savedSession.expires_at)).not.toBeNaN();
      expect(Date.parse(savedSession.created_at)).not.toBeNaN();

      const expiresAt = new Date(savedSession.expires_at);
      const createdAt = new Date(savedSession.created_at);

      expiresAt.setMilliseconds(0);
      createdAt.setMilliseconds(0);

      expect(expiresAt - createdAt).toBe(session.EXPIRATION_IN_MILLISECONDS);
    });
    test("With invalid code", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=fictitious_code`,
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Invalid Discord code",
        action: "Start a new authorization flow.",
        status_code: 400,
      });
    });
    test("Without code query parameter", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord`,
      );
      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Missing 'code' query parameter",
        action: "Send a valid 'code' query parameter in the request.",
        status_code: 400,
      });
    });
  });
  describe("Default user", () => {
    test("Login with no changes", async () => {
      const createdUser = await orchestrator.createUser("NoChangesUser");
      const code = `mocked_user_${createdUser.discord_id}_${createdUser.username}`;

      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=${code}`,
        {
          redirect: "manual",
        },
      );

      expect(response.status).toBe(302);
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: parsedSetCookie.session_id.value,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        sameSite: "Lax",
        httpOnly: true,
      });
    });
    test("Login with username change", async () => {
      const createdUser = await orchestrator.createUser("BeforeChange");
      const code = `mocked_user_${createdUser.discord_id}_AfterChange`;

      const response = await fetch(
        `${webserver.origin}/api/v1/auth/callback/discord?code=${code}`,
        {
          redirect: "manual",
        },
      );

      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toBe("/");

      const parsedSetCookie = setCookieParser(response, { map: true });
      expect(parsedSetCookie.session_id.value).toBeDefined();

      const userInDatabase = await database.query({
        text: "SELECT * FROM users WHERE id = $1;",
        values: [createdUser.id],
      });

      const updatedUser = userInDatabase.rows[0];

      expect(updatedUser.id).toBe(createdUser.id);
      expect(updatedUser.discord_id).toBe(createdUser.discord_id);
      expect(updatedUser.username).toBe("AfterChange");
      expect(updatedUser.created_at.toISOString()).toBe(
        createdUser.created_at.toISOString(),
      );
      expect(new Date(updatedUser.updated_at).getTime()).toBeGreaterThanOrEqual(
        new Date(createdUser.updated_at).getTime(),
      );
    });
  });
});
