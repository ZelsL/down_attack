import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/solare/session", () => {
  describe("Anonymous User", () => {
    test("With missing nick", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            region: "SA",
            rating: 1850,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          '"nick" is required and must be a string between 1 and 64 characters.',
        action: "Please provide a valid Family Name.",
        status_code: 400,
      });
    });

    test("With invalid region", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "Shxtey",
            region: "INVALID_REGION",
            rating: 1850,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Invalid region: 'INVALID_REGION'.",
        action: "Valid regions are: SA, NA, EU, KR, JP, RU, TR, TW.",
        status_code: 400,
      });
    });

    test("With missing rating when starting a new session", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "Shxtey",
            region: "SA",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"rating" is required when starting a new session.',
        action: "Please provide your current Solare rating.",
        status_code: 400,
      });
    });

    test("With invalid rating out of bounds", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "Shxtey",
            region: "SA",
            rating: 9999,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"rating" must be an integer between 0 and 5000.',
        action: "Please provide a valid Solare rating.",
        status_code: 400,
      });
    });

    test("With nonexistent player in database", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "GhostPlayer999",
            region: "SA",
            rating: 1500,
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Player 'GhostPlayer999' was not found in region 'SA'.",
        action: "Check if the Family Name and region are spelled correctly.",
        status_code: 404,
      });
    });

    test("With valid data when starting a new session and resetting after new matches", async () => {
      await orchestrator.createSolarePlayer();
      await orchestrator.createSolareMatch({
        record_no: 920906,
        user_nickname: "Shxtey",
        is_winner: false,
        vary_rank_rating: -27,
      });

      const createResponse = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "shxtey",
            region: "sa",
            rating: 1945,
          }),
        },
      );

      expect(createResponse.status).toBe(201);

      const createdSession = await createResponse.json();

      expect(uuidVersion(createdSession.id)).toBe(4);
      expect(typeof createdSession.token).toBe("string");
      expect(createdSession.token.length).toBe(48);
      expect(createdSession.region).toBe("SA");
      expect(createdSession.user_nickname).toBe("Shxtey");
      expect(createdSession.user_no).toBe("49934");
      expect(createdSession.anchor_rating).toBe(1945);
      expect(createdSession.anchor_record_no).toBe("920906");
      expect(createdSession.session_start_record_no).toBe("920906");
      expect(Date.parse(createdSession.started_at)).not.toBeNaN();
      expect(Date.parse(createdSession.created_at)).not.toBeNaN();
      expect(Date.parse(createdSession.updated_at)).not.toBeNaN();

      // Test nonexistent token error
      const nonexistentTokenResponse = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "Shxtey",
            region: "SA",
            token: "000000000000000000000000000000000000000000000000",
          }),
        },
      );

      expect(nonexistentTokenResponse.status).toBe(404);

      const nonexistentTokenBody = await nonexistentTokenResponse.json();
      expect(nonexistentTokenBody).toEqual({
        name: "NotFoundError",
        message: "Overlay session not found.",
        action: "Verify if the session token is valid or start a new session.",
        status_code: 404,
      });

      // Test token belonging to a different player (Dislaik exists in match 920906)
      const forbiddenTokenResponse = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "Dislaik",
            region: "SA",
            token: createdSession.token,
          }),
        },
      );

      expect(forbiddenTokenResponse.status).toBe(403);

      const forbiddenTokenBody = await forbiddenTokenResponse.json();
      expect(forbiddenTokenBody).toEqual({
        name: "ForbiddenError",
        message: "This session token belongs to a different player or region.",
        action: "Create a new session for this player instead.",
        status_code: 403,
      });

      // Play 2 new matches after 920906: +28 and -15 (net +13 -> 1958)
      await orchestrator.createSolareMatch({
        record_no: 920907,
        user_nickname: "Shxtey",
        is_winner: true,
        vary_rank_rating: 28,
      });

      await orchestrator.createSolareMatch({
        record_no: 920908,
        user_nickname: "Shxtey",
        is_winner: false,
        vary_rank_rating: -15,
      });

      // Reset session using existing token without specifying rating (auto-consolidates rating)
      const resetResponse = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "Shxtey",
            region: "SA",
            token: createdSession.token,
          }),
        },
      );

      expect(resetResponse.status).toBe(200);

      const resetSession = await resetResponse.json();

      expect(resetSession.id).toBe(createdSession.id);
      expect(resetSession.token).toBe(createdSession.token);
      expect(resetSession.anchor_rating).toBe(1958);
      expect(resetSession.anchor_record_no).toBe("920908");
      expect(resetSession.session_start_record_no).toBe("920908");

      // Play 4 consecutive wins after 920908 (PA vary_rank_rating already includes streak bonus):
      // 920909: Win 1 (+25)
      // 920910: Win 2 (+27)
      // 920911: Win 3 (+28)
      // 920912: Win 4 (+32)
      // Total delta = 112 -> 1958 + 112 = 2070
      await orchestrator.createSolareMatch({
        record_no: 920909,
        user_nickname: "Shxtey",
        is_winner: true,
        vary_rank_rating: 25,
      });
      await orchestrator.createSolareMatch({
        record_no: 920910,
        user_nickname: "Shxtey",
        is_winner: true,
        vary_rank_rating: 27,
      });
      await orchestrator.createSolareMatch({
        record_no: 920911,
        user_nickname: "Shxtey",
        is_winner: true,
        vary_rank_rating: 28,
      });
      await orchestrator.createSolareMatch({
        record_no: 920912,
        user_nickname: "Shxtey",
        is_winner: true,
        vary_rank_rating: 32,
      });

      const streakResetResponse = await fetch(
        `${webserver.origin}/api/v1/solare/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: "Shxtey",
            region: "SA",
            token: createdSession.token,
          }),
        },
      );

      expect(streakResetResponse.status).toBe(200);
      const streakResetSession = await streakResetResponse.json();

      expect(streakResetSession.anchor_rating).toBe(2070);
      expect(streakResetSession.anchor_record_no).toBe("920912");
      expect(streakResetSession.session_start_record_no).toBe("920912");
    });
  });
});
