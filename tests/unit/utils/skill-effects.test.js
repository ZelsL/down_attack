import {
  skillToEffect,
  collectSkillEffects,
  resolveEffects,
  applyModifiers,
  getEffectStartIndex,
  resolveMatchup,
} from "~/app/utils/skillEffects.js";
import { calculateComboDamage } from "~/app/utils/PvpCalculator.js";

describe("skillEffects", () => {
  const apBuffSkill = {
    id: 1,
    name: "Executioner",
    icon_path: "/skills/warrior/1764.webp",
    self_buffs: { duration: 30, all_ap: 45, attack_speed: 30 },
    target_debuffs: {},
  };

  const drDebuffSkill = {
    id: 2,
    name: "Shatter",
    self_buffs: {},
    target_debuffs: { duration: 10, damage_reduction: -20, bleeding: 3 },
  };

  describe("skillToEffect", () => {
    it("maps self buffs to calculator modifiers and ignores irrelevant keys", () => {
      const effect = skillToEffect(apBuffSkill);

      expect(effect.id).toBe(1);
      expect(effect.icon).toBe("/skills/warrior/1764.webp");
      expect(effect.self).toEqual({ all_ap: 45 });
      expect(effect.enemy).toEqual({});
      expect(effect.selfLabels).toEqual(["+45 AP"]);
    });

    it("maps target debuffs to the opponent, expanding damage_reduction to all DR types", () => {
      const effect = skillToEffect(drDebuffSkill);

      expect(effect.self).toEqual({});
      expect(effect.enemy).toEqual({ mldr: -20, radr: -20, madr: -20 });
      expect(effect.enemyLabels).toEqual(["-20 DR"]);
    });

    it("maps special attack damage to down, back and air attack", () => {
      const effect = skillToEffect({
        id: 3,
        name: "Do it Better!",
        self_buffs: { special_attack_damage: 2.5 },
      });

      expect(effect.self).toEqual({ adad: 2.5, abad: 2.5, aaad: 2.5 });
    });

    it("maps damage_reduction_rate to bdrp", () => {
      const effect = skillToEffect({
        id: 2219,
        name: "Protected Area V",
        self_buffs: { duration: 8, damage_reduction_rate: 50 },
      });

      expect(effect.self).toEqual({ bdrp: 50 });
      expect(effect.selfLabels).toEqual(["+50 % DR Rate"]);
    });

    it("returns null for skills with no relevant effect", () => {
      expect(
        skillToEffect({
          id: 4,
          name: "Plain",
          self_buffs: { duration: 5, recover: 100 },
          target_debuffs: { movement_speed: -10 },
        }),
      ).toBeNull();
      expect(skillToEffect({ name: "No id", self_buffs: { all_ap: 1 } })).toBe(
        null,
      );
    });
  });

  describe("collectSkillEffects", () => {
    it("lists each skill once, even if used multiple times in the combo", () => {
      const effects = collectSkillEffects([
        { ...apBuffSkill, instanceId: "a" },
        drDebuffSkill,
        { ...apBuffSkill, instanceId: "b" },
        { id: 9, name: "Plain", self_buffs: {} },
      ]);

      expect(effects.map((e) => e.id)).toEqual([1, 2]);
    });

    it("handles missing combos", () => {
      expect(collectSkillEffects(undefined)).toEqual([]);
      expect(collectSkillEffects(null)).toEqual([]);
    });
  });

  describe("resolveEffects", () => {
    it("sums buffs from different skills", () => {
      const effects = collectSkillEffects([
        apBuffSkill,
        { id: 5, name: "Other", self_buffs: { all_ap: 20, accuracy: 60 } },
      ]);

      expect(resolveEffects(effects).self).toEqual({ all_ap: 65, acc: 60 });
    });

    it("does not stack debuffs of the same stat, applying the strongest", () => {
      const effects = collectSkillEffects([
        drDebuffSkill,
        {
          id: 6,
          name: "Stronger",
          target_debuffs: { damage_reduction: -25, evasion: -12 },
        },
        {
          id: 7,
          name: "Weaker",
          target_debuffs: { damage_reduction: -10 },
        },
      ]);

      expect(resolveEffects(effects).enemy).toEqual({
        mldr: -25,
        radr: -25,
        madr: -25,
        meev: -12,
        raev: -12,
        maev: -12,
      });
    });
  });

  describe("effects applied from the skill that used them onward", () => {
    const attacker = {
      class_name: "Warrior",
      spec: "Awakening",
      ap: 300,
      aap: 300,
      adventureap: 1000,
      adventureaap: 1000,
      acc: 1200,
      chc: 0,
    };
    const defender = {
      class_name: "Sorceress",
      spec: "Awakening",
      mldr: 800,
      meev: 700,
      bdrp: 0,
    };
    const hit = { damage_percent: 1000, normal_hits: 1 };
    const plain = (id) => ({ id, name: `plain ${id}`, hits: [hit] });
    const debuffer = {
      id: 50,
      name: "Debuffer",
      hits: [hit],
      self_buffs: {},
      target_debuffs: { damage_reduction: -100 },
    };

    it("applyModifiers adds bonuses and does not let DR/evasion go below zero", () => {
      const result = applyModifiers(
        { ap: 100, mldr: 10, meev: 5 },
        { all_ap: 20, mldr: -50, meev: 3 },
      );

      expect(result.ap).toBe(120);
      expect(result.mldr).toBe(0);
      expect(result.meev).toBe(8);
    });

    it("pre-buffs start before the combo and combo effects at their first use", () => {
      const combo = [plain(1), plain(2), debuffer, debuffer];
      const comboEffect = skillToEffect(debuffer, "combo");
      const partyEffect = skillToEffect(debuffer, "party");

      expect(getEffectStartIndex(comboEffect, combo)).toBe(2);
      expect(getEffectStartIndex(partyEffect, combo)).toBe(-1);
    });

    it("a debuff only affects the skills from the one that applied it", () => {
      const combo = [plain(1), plain(2), debuffer];
      const effects = [skillToEffect(debuffer, "combo")];

      const beforeIndex = resolveMatchup(effects, [], combo, 1);
      const atIndex = resolveMatchup(effects, [], combo, 2);

      expect(beforeIndex.defenderMods).toEqual({});
      expect(atIndex.defenderMods).toEqual({
        mldr: -100,
        radr: -100,
        madr: -100,
      });
    });

    it("calculates the combo damage with the debuff only after its skill", () => {
      const combo = [plain(1), plain(2), debuffer];
      const options = { attackerEffects: [skillToEffect(debuffer, "combo")] };
      const debuffedDefender = applyModifiers(defender, { mldr: -100 });

      const expected =
        calculateComboDamage(attacker, defender, [plain(1), plain(2)]) +
        calculateComboDamage(attacker, debuffedDefender, [debuffer]);
      const sequential = calculateComboDamage(
        attacker,
        defender,
        combo,
        options,
      );
      const withoutDebuff = calculateComboDamage(attacker, defender, combo);
      const debuffOnAllSkills = calculateComboDamage(
        attacker,
        debuffedDefender,
        combo,
      );

      expect(sequential).toBeCloseTo(expected, 1);
      expect(sequential).toBeGreaterThan(withoutDebuff);
      expect(sequential).toBeLessThan(debuffOnAllSkills);
    });

    it("the defender's effects are active during the whole combo", () => {
      const combo = [plain(1), plain(2)];
      const drBuff = skillToEffect(
        { id: 70, name: "Guard", self_buffs: { damage_reduction: 100 } },
        "combo",
      );

      const withBuff = calculateComboDamage(attacker, defender, combo, {
        defenderEffects: [drBuff],
      });
      const buffedDefender = applyModifiers(defender, { mldr: 100 });

      expect(withBuff).toBeCloseTo(
        calculateComboDamage(attacker, buffedDefender, combo),
        1,
      );
    });
  });
});
