import orchestrator from "~/tests/orchestrator.js";
import webserver from "~/infra/webserver";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/skills", () => {
  describe("Anonymous user", () => {
    test("With case-insensitive class and spec", async () => {
      const createdSkill1 = await orchestrator.createSkill({
        id: 101,
        name: "Glaive Skill",
        class_name: "Hashashin",
        skill_spec: "Awakening",
      });

      const createdSkill2 = await orchestrator.createSkill({
        id: 102,
        name: "Prime: Shamshir Slash",
        class_name: "Hashashin",
        skill_spec: "Prime",
      });

      const createdSkill3 = await orchestrator.createSkill({
        id: 103,
        name: "Absolute: Haladie Throw",
        class_name: "Hashashin",
        skill_spec: "Absolute",
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/skills?className=Hashashin&spec=AWAKENING`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(2);
      expect(response.headers.get("content-type")).toMatch(/json/);
      expect(Date.parse(responseBody[0].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[0].updated_at)).not.toBeNaN();
      expect(Array.isArray(responseBody[0].hits)).toBe(true);

      for (const skillObject of responseBody) {
        expect(skillObject.id).not.toBe(createdSkill2.id);
      }

      expect(responseBody).toEqual([createdSkill1, createdSkill3]);
      const allowedSpecs = [
        "Awakening",
        "Absolute",
        "Secondary Skills",
        "Magnus",
      ];

      for (const skill of responseBody) {
        expect(allowedSpecs).toContain(skill.skill_spec);
        expect(skill.skill_spec).not.toBe("Prime");
      }
    });

    test("With existent class and spec", async () => {
      const createdSkill1 = await orchestrator.createSkill({
        id: 101,
        name: "Glaive Skill",
        class_name: "Hashashin",
        skill_spec: "Awakening",
      });

      const createdSkill2 = await orchestrator.createSkill({
        id: 102,
        name: "Prime: Shamshir Slash",
        class_name: "Hashashin",
        skill_spec: "Prime",
      });

      const createdSkill3 = await orchestrator.createSkill({
        id: 103,
        name: "Absolute: Haladie Throw",
        class_name: "Hashashin",
        skill_spec: "Absolute",
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/skills?className=Hashashin&spec=awakening`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(2);
      expect(response.headers.get("content-type")).toMatch(/json/);
      expect(Date.parse(responseBody[0].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[0].updated_at)).not.toBeNaN();
      expect(Array.isArray(responseBody[0].hits)).toBe(true);

      for (const skillObject of responseBody) {
        expect(skillObject.id).not.toBe(createdSkill2.id);
      }

      expect(responseBody).toEqual([createdSkill1, createdSkill3]);
      const allowedSpecs = [
        "Awakening",
        "Absolute",
        "Secondary Skills",
        "Magnus",
      ];

      for (const skill of responseBody) {
        expect(allowedSpecs).toContain(skill.skill_spec);
        expect(skill.skill_spec).not.toBe("Prime");
      }
    });

    test("With existent class only (without spec)", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/skills?className=Hashashin`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThanOrEqual(3);
    });

    test("With nonexistent spec", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/skills?className=scholar&spec=awakening`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Spec 'awakening' not found for class 'scholar'.",
        action: "Please check if the spec is typed correctly.",
        status_code: 404,
      });
    });

    test("Without className query parameter", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/skills`);

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"className" query parameter is required.',
        action:
          'Please provide a "className" query parameter, e.g. /api/v1/skills?className=Hashashin',
        status_code: 400,
      });
    });

    test("With nonexistent class", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/skills?className=nonexistentClass`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Class not found.",
        action: "Please check if the class is typed correctly.",
        status_code: 404,
      });
    });

    test("With tag query parameter only (global filter across classes)", async () => {
      const shaiPartyBuff = await orchestrator.createSkill({
        id: 4624,
        name: "Shout to the Sky III",
        class_name: "Shai",
        skill_spec: "Ascension",
        self_buffs: { max_hp: 1500 },
        tags: ["party_buff"],
      });

      const wizardPartyBuff = await orchestrator.createSkill({
        id: 3100,
        name: "Speed Spell",
        class_name: "Wizard",
        skill_spec: "Absolute",
        self_buffs: { attack_speed: 20, casting_speed: 20 },
        tags: ["party_buff", "pre_buff"],
      });

      await orchestrator.createSkill({
        id: 5619,
        name: "Aal's Grace",
        class_name: "Hashashin",
        skill_spec: "Awakening",
        tags: ["e_buff"],
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/skills?tag=party_buff`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toEqual([wizardPartyBuff, shaiPartyBuff]);
    });

    test("With className and tag query parameters", async () => {
      const hashashinEBuff = await orchestrator.createSkill({
        id: 5619,
        name: "Aal's Grace",
        class_name: "Hashashin",
        skill_spec: "Awakening",
        tags: ["e_buff"],
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/skills?className=Hashashin&tag=e_buff`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toEqual([hashashinEBuff]);
    });

    test("With className, spec, and tag query parameters", async () => {
      const hashashinAwakEBuff = await orchestrator.createSkill({
        id: 5619,
        name: "Aal's Grace",
        class_name: "Hashashin",
        skill_spec: "Awakening",
        tags: ["e_buff"],
      });

      await orchestrator.createSkill({
        id: 5658,
        name: "Prime: Blade's Pact",
        class_name: "Hashashin",
        skill_spec: "Prime",
        tags: ["e_buff"],
      });

      const response = await fetch(
        `${webserver.origin}/api/v1/skills?className=Hashashin&spec=awakening&tag=e_buff`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toEqual([hashashinAwakEBuff]);
    });

    test("With nonexistent tag", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/skills?tag=nonexistent_tag`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([]);
    });
  });
});
