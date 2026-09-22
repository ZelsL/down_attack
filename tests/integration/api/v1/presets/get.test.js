import orchestrator from "tests/orchestrator.js";
import webserver from "~~/infra/webserver.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/presets", () => {
  describe("Anonymous user", () => {
    test("Without query parameters (returns official site presets, hides user presets)", async () => {
      // 1. Official site presets (user is null/undefined)
      const officialPreset1 = await orchestrator.createPreset({
        name: "Official Hashashin Starter",
        class_name: "Hashashin",
        spec: "Awakening",
        is_public: true,
        hp: 10500,
        ap: 300,
      });

      const officialPreset2 = await orchestrator.createPreset({
        name: "Official Warrior Starter",
        class_name: "Warrior",
        spec: "Succession",
        is_public: true,
        hp: 11000,
        ap: 310,
      });

      // 2. User presets (community and private)
      const someUser = await orchestrator.createUser();
      const communityPreset = await orchestrator.createPreset(
        {
          name: "User Public Hashashin Build",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: true,
        },
        someUser,
      );

      const privatePreset = await orchestrator.createPreset(
        {
          name: "User Secret Sorceress",
          class_name: "Sorceress",
          spec: "Awakening",
          is_public: false,
        },
        someUser,
      );

      const response = await fetch(`${webserver.origin}/api/v1/presets`);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toMatch(/json/);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);

      const returnedIds = responseBody.map((p) => p.id);

      // Must return official site presets
      expect(returnedIds).toContain(officialPreset1.id);
      expect(returnedIds).toContain(officialPreset2.id);

      // Must NOT return user presets in default view
      expect(returnedIds).not.toContain(communityPreset.id);
      expect(returnedIds).not.toContain(privatePreset.id);

      // Verify structure of an official preset item
      const item = responseBody.find((p) => p.id === officialPreset1.id);
      expect(uuidVersion(item.id)).toBe(4);
      expect(item.user_id).toBeNull();
      expect(item.name).toBe("Official Hashashin Starter");
      expect(item.class_name).toBe("Hashashin");
      expect(item.spec).toBe("Awakening");
      expect(typeof item.hp).toBe("number");
      expect(item.hp).toBe(10500);
      expect(typeof item.ap).toBe("number");
      expect(item.ap).toBe(300);
      expect(Array.isArray(item.combos)).toBe(true);
      expect(Date.parse(item.created_at)).not.toBeNaN();
      expect(Date.parse(item.updated_at)).not.toBeNaN();
    });

    test("With scope=community (returns user-created public presets, hides official and private presets)", async () => {
      const user = await orchestrator.createUser();

      const userPublicPreset = await orchestrator.createPreset(
        {
          name: "Community Musa Guide",
          class_name: "Musa",
          spec: "Awakening",
          is_public: true,
        },
        user,
      );

      const userPrivatePreset = await orchestrator.createPreset(
        {
          name: "Secret Musa Build",
          class_name: "Musa",
          spec: "Awakening",
          is_public: false,
        },
        user,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/presets?scope=community`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);

      const returnedIds = responseBody.map((p) => p.id);
      expect(returnedIds).toContain(userPublicPreset.id);
      expect(returnedIds).not.toContain(userPrivatePreset.id);

      // All returned items must be public user builds (user_id is not null)
      for (const p of responseBody) {
        expect(p.user_id).not.toBeNull();
        expect(p.is_public).toBe(true);
      }
    });

    test("With scope=official (returns only official site presets)", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets?scope=official`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThanOrEqual(1);

      for (const p of responseBody) {
        expect(p.user_id).toBeNull();
        expect(p.is_public).toBe(true);
      }
    });

    test("With scope=mine when anonymous (returns 401 UnauthorizedError)", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets?scope=mine`,
      );

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        status_code: 401,
        message: "User must be authenticated to view their own presets.",
        action: "Please log in to access your presets.",
      });
    });

    test("With invalid scope parameter (returns 400 ValidationError)", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets?scope=invalidScope`,
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
      expect(responseBody.message).toBe("Invalid scope: 'invalidScope'.");
    });

    test("With case-insensitive class_name filter", async () => {
      const officialHash = await orchestrator.createPreset({
        name: "Hash Filter Official",
        class_name: "Hashashin",
        spec: "Awakening",
        is_public: true,
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/presets?class_name=hAsHaShIn`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThanOrEqual(1);

      for (const presetItem of responseBody) {
        expect(presetItem.class_name.toLowerCase()).toBe("hashashin");
      }

      const returnedIds = responseBody.map((p) => p.id);
      expect(returnedIds).toContain(officialHash.id);
    });

    test("With camelCase className query parameter", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets?className=Hashashin`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);

      for (const presetItem of responseBody) {
        expect(presetItem.class_name.toLowerCase()).toBe("hashashin");
      }
    });

    test("With class_name and spec filter", async () => {
      const awkOfficial = await orchestrator.createPreset({
        name: "Hash Awakening Official",
        class_name: "Hashashin",
        spec: "Awakening",
        is_public: true,
      });

      const succOfficial = await orchestrator.createPreset({
        name: "Hash Succession Official",
        class_name: "Hashashin",
        spec: "Succession",
        is_public: true,
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/presets?class_name=Hashashin&spec=aWaKeNiNg`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);

      const returnedIds = responseBody.map((p) => p.id);
      expect(returnedIds).toContain(awkOfficial.id);
      expect(returnedIds).not.toContain(succOfficial.id);

      for (const presetItem of responseBody) {
        expect(presetItem.spec.toLowerCase()).toBe("awakening");
      }
    });

    test("With valid class_name that has no presets (returns empty array)", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets?class_name=Dosa`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(0);
    });

    test("With invalid class_name parameter", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets?class_name=InvalidClass`,
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });

    test("With invalid spec parameter", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/presets?class_name=Hashashin&spec=InvalidSpec`,
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("ValidationError");
      expect(responseBody.status_code).toBe(400);
    });
  });

  describe("Default user", () => {
    test("Default view (without scope): sees official site presets AND their own presets, but NOT other users' presets", async () => {
      const userA = await orchestrator.createUser();
      const sessionA = await orchestrator.createSession(userA);

      const userB = await orchestrator.createUser();

      // Official preset (user_id IS NULL)
      const officialPreset = await orchestrator.createPreset({
        name: "Standard Official Preset",
        class_name: "Hashashin",
        spec: "Awakening",
        is_public: true,
      });

      // User A's private preset
      const privatePresetFromA = await orchestrator.createPreset(
        {
          name: "User A Secret Build",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: false,
        },
        userA,
      );

      // User A's public preset
      const publicPresetFromA = await orchestrator.createPreset(
        {
          name: "User A Public Build",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: true,
        },
        userA,
      );

      // User B's public preset
      const publicPresetFromB = await orchestrator.createPreset(
        {
          name: "User B Public Preset",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: true,
        },
        userB,
      );

      // User B's private preset
      const privatePresetFromB = await orchestrator.createPreset(
        {
          name: "User B Secret Build",
          class_name: "Hashashin",
          spec: "Awakening",
          is_public: false,
        },
        userB,
      );

      // User A requests default presets
      const response = await fetch(`${webserver.origin}/api/v1/presets`, {
        headers: {
          Cookie: `session_id=${sessionA.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);

      const returnedIds = responseBody.map((p) => p.id);

      // User A MUST see:
      // 1. Official site presets
      expect(returnedIds).toContain(officialPreset.id);
      // 2. User A's own private preset
      expect(returnedIds).toContain(privatePresetFromA.id);
      // 3. User A's own public preset
      expect(returnedIds).toContain(publicPresetFromA.id);

      // User A MUST NOT see:
      // 4. User B's public preset (kept for community scope)
      expect(returnedIds).not.toContain(publicPresetFromB.id);
      // 5. User B's private preset
      expect(returnedIds).not.toContain(privatePresetFromB.id);
    });

    test("With scope=community: sees other users' public presets, but NOT private presets and NOT own presets", async () => {
      const userA = await orchestrator.createUser();
      const sessionA = await orchestrator.createSession(userA);

      const userB = await orchestrator.createUser();

      // User A's public preset
      const publicPresetFromA = await orchestrator.createPreset(
        {
          name: "User A Shared Preset",
          class_name: "Sorceress",
          spec: "Awakening",
          is_public: true,
        },
        userA,
      );

      // User B's public preset
      const publicPresetFromB = await orchestrator.createPreset(
        {
          name: "User B Shared Preset",
          class_name: "Sorceress",
          spec: "Awakening",
          is_public: true,
        },
        userB,
      );

      // User B's private preset
      const privatePresetFromB = await orchestrator.createPreset(
        {
          name: "User B Hidden Preset",
          class_name: "Sorceress",
          spec: "Awakening",
          is_public: false,
        },
        userB,
      );

      const response = await fetch(
        `${webserver.origin}/api/v1/presets?scope=community`,
        {
          headers: {
            Cookie: `session_id=${sessionA.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      const returnedIds = responseBody.map((p) => p.id);

      // Must contain User B's public preset
      expect(returnedIds).toContain(publicPresetFromB.id);

      // Must NOT contain User B's private preset
      expect(returnedIds).not.toContain(privatePresetFromB.id);

      // Must NOT contain User A's own preset (it's the community of OTHERS)
      expect(returnedIds).not.toContain(publicPresetFromA.id);
    });

    test("With scope=mine: sees ONLY their own presets (public and private), and NOT official or other users' presets", async () => {
      const userA = await orchestrator.createUser();
      const sessionA = await orchestrator.createSession(userA);

      const userB = await orchestrator.createUser();

      // User A presets
      const myPublic = await orchestrator.createPreset(
        {
          name: "My Public Build",
          class_name: "Guardian",
          spec: "Awakening",
          is_public: true,
        },
        userA,
      );

      const myPrivate = await orchestrator.createPreset(
        {
          name: "My Private Build",
          class_name: "Guardian",
          spec: "Awakening",
          is_public: false,
        },
        userA,
      );

      // User B preset
      const otherPreset = await orchestrator.createPreset(
        {
          name: "Other Player Build",
          class_name: "Guardian",
          spec: "Awakening",
          is_public: true,
        },
        userB,
      );

      // Official preset
      const officialPreset = await orchestrator.createPreset({
        name: "Official Guardian",
        class_name: "Guardian",
        spec: "Awakening",
        is_public: true,
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/presets?scope=mine`,
        {
          headers: {
            Cookie: `session_id=${sessionA.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      const returnedIds = responseBody.map((p) => p.id);

      expect(returnedIds).toContain(myPublic.id);
      expect(returnedIds).toContain(myPrivate.id);
      expect(returnedIds).not.toContain(otherPreset.id);
      expect(returnedIds).not.toContain(officialPreset.id);

      for (const p of responseBody) {
        expect(p.user_id).toBe(userA.id);
      }
    });

    test("With scope=official: sees only official presets created by the system", async () => {
      const user = await orchestrator.createUser();
      const session = await orchestrator.createSession(user);

      const response = await fetch(
        `${webserver.origin}/api/v1/presets?scope=official`,
        {
          headers: {
            Cookie: `session_id=${session.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);

      for (const p of responseBody) {
        expect(p.user_id).toBeNull();
        expect(p.is_public).toBe(true);
      }
    });
  });
});
