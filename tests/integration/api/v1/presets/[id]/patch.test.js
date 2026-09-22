import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/presets/[id]", () => {
  describe("Default user", () => {
    test("Trying to update your preset", async () => {
      const createdUser = await orchestrator.createUser();
      const createdPreset = await orchestrator.createPreset(
        undefined,
        createdUser,
      );
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${createdPreset.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            name: "AfterUpdate",
            hp: 10000,
            ap: 304,
            aap: 309,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...createdPreset,
        name: "AfterUpdate",
        updated_at: responseBody.updated_at,
        hp: 10000,
        ap: 304,
        aap: 309,
      });

      expect(
        Date.parse(responseBody.updated_at) >
          Date.parse(createdPreset.updated_at),
      ).toBe(true);
    });
    test("Trying to update another user's preset", async () => {
      const createdUserA = await orchestrator.createUser();
      const createdUserB = await orchestrator.createUser();
      const createdPresetB = await orchestrator.createPreset(
        undefined,
        createdUserB,
      );
      const sessionObjectA = await orchestrator.createSession(createdUserA);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${createdPresetB.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObjectA.token}`,
          },
          body: JSON.stringify({
            name: "ModifyUserBName",
            hp: 10000,
            ap: 304,
            aap: 309,
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: 'Verify if your user has the feature: "update:preset:others"',
        message: "You do not have permission to update this preset.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
    test("Trying to update with empty payload", async () => {
      const createdUser = await orchestrator.createUser();
      const createdPreset = await orchestrator.createPreset(
        undefined,
        createdUser,
      );
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${createdPreset.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({}),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Try again, with valid field to update",
        message: "No valid fields to update were provided.",
        name: "ValidationError",
        status_code: 400,
      });
    });
    test("Trying to update with invalid data", async () => {
      const createdUser = await orchestrator.createUser();
      const createdPreset = await orchestrator.createPreset(
        undefined,
        createdUser,
      );
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${createdPreset.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            hp: -10,
            is_public: "yes",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });
    test("Trying to update with non-existent UUID", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/00000000-0000-0000-0000-000000000000`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            name: "InvalidID",
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verify if you typed id correctly",
        message:
          'Preset with id "00000000-0000-0000-0000-000000000000" not found',
        name: "NotFoundError",
        status_code: 404,
      });
    });
    test("Trying to update with invalid UUID format", async () => {
      const createdUser = await orchestrator.createUser();
      const sessionObject = await orchestrator.createSession(createdUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/12345670`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            name: "InvalidID",
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verify if you typed id correctly",
        message: 'Preset with id "12345670" not found',
        name: "NotFoundError",
        status_code: 404,
      });
    });
  });
  describe("Privileged User", () => {
    test("With 'update:preset:others' updating another user's preset", async () => {
      const privilegedUser = await orchestrator.createUser();
      await orchestrator.addFeaturesToUser(privilegedUser, [
        "update:preset:others",
      ]);
      const createdUser = await orchestrator.createUser();
      const createdPreset = await orchestrator.createPreset(
        undefined,
        createdUser,
      );
      const privilegedUserSession =
        await orchestrator.createSession(privilegedUser);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${createdPreset.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${privilegedUserSession.token}`,
          },
          body: JSON.stringify({
            name: "ModifiedByPrivilegedUser",
            hp: 10000,
            ap: 304,
            aap: 309,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...createdPreset,
        name: "ModifiedByPrivilegedUser",
        updated_at: responseBody.updated_at,
        hp: 10000,
        ap: 304,
        aap: 309,
      });

      expect(
        Date.parse(responseBody.updated_at) >
          Date.parse(createdPreset.updated_at),
      ).toBe(true);
    });
  });
  describe("Anonymous user", () => {
    test("Trying to edit others presets", async () => {
      const publicPreset = await orchestrator.createPreset();

      const response = await fetch(
        `${webserver.origin}/api/v1/presets/${publicPreset.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "create:preset"',
        status_code: 403,
      });
    });
  });
});
