import classModifiers from "../data/classModifiers.js";
import { applyModifiers, resolveMatchup, sumMods } from "./skillEffects.js";

export const MIN_DAMAGE_RATIO = 0.07;

export class PvpCalculator {
  constructor({ attacker = {}, defender = {}, skill = {}, hit = {} }) {
    this.attacker = attacker;
    this.defender = defender;
    this.skill = skill;
    this.hit = hit;

    this.dr = 0;
    this.evasion = 0;
    this.damage_type = "melee";
    this.class_pvp_modifier = 0.8929;
    this.class_group = "";

    this.setupClassMatchup();
  }

  setupClassMatchup() {
    this.dr = Number(this.defender.mldr) || 0;
    this.evasion = Number(this.defender.meev) || 0;
    this.damage_type = "melee";

    const attackerName = (this.attacker.class_name || "").toLowerCase();
    const defenderName = (this.defender.class_name || "").toLowerCase();

    const attackerInfo = classModifiers[attackerName];
    const defenderInfo = classModifiers[defenderName];

    if (!attackerInfo || !defenderInfo) {
      return;
    }

    const attackerSpec = (this.attacker.spec || "awakening").toLowerCase();
    const defenderSpec = (this.defender.spec || "awakening").toLowerCase();

    const attackerSpecData =
      attackerInfo.specs[attackerSpec] || Object.values(attackerInfo.specs)[0];
    const defenderSpecData =
      defenderInfo.specs[defenderSpec] || Object.values(defenderInfo.specs)[0];

    if (!attackerSpecData || !defenderSpecData) {
      return;
    }

    const attackerGroup = attackerSpecData.group;
    const defenderGroup = defenderSpecData.group;
    const damageType = attackerSpecData.damage_type || "melee";
    this.damage_type = damageType;

    // Set DR and Evasion based on attacker's damage type (Melee / Ranged / Magic)
    if (damageType === "magic") {
      this.dr = Number(this.defender.madr) || 0;
      this.evasion = Number(this.defender.maev) || 0;
    } else if (damageType === "ranged") {
      this.dr = Number(this.defender.radr) || 0;
      this.evasion = Number(this.defender.raev) || 0;
    } else {
      this.dr = Number(this.defender.mldr) || 0;
      this.evasion = Number(this.defender.meev) || 0;
    }

    // Rock-paper-scissors matchup modifier (Vanguard > Skirmisher > Pulverizer > Vanguard)
    const groupAdvantageMap = {
      vanguard: "skirmisher",
      pulverizer: "vanguard",
      skirmisher: "pulverizer",
    };

    if (attackerGroup === groupAdvantageMap[defenderGroup]) {
      this.class_pvp_modifier *= 1.05;
    }

    this.class_group = attackerGroup;
  }

  calculateEffectiveAp() {
    const spec = (
      this.skill.skill_spec ||
      this.attacker.spec ||
      ""
    ).toLowerCase();

    const totalAap = Number(this.attacker.adventureaap) || 0;
    const totalAp = Number(this.attacker.adventureap) || 0;
    const sheetAp = Number(this.attacker.ap) || 0;
    const sheetAap = Number(this.attacker.aap) || 0;

    // 70/30 split formula corrected by gpw
    if (spec.includes("awakening")) {
      return totalAap + 0.3 * sheetAp - 0.3 * sheetAap - 2;
    }
    if (spec.includes("succession") || spec.includes("prime")) {
      return totalAp + 0.3 * sheetAap - 0.3 * sheetAp - 2;
    }
    return totalAp - 2;
  }

  calculateHitRate() {
    const accuracy = Number(this.attacker.acc) || 0;
    const evasion = Number(this.evasion) || 0;

    const hitRate = 0.67 + (accuracy - evasion) * 0.0025;
    return Math.min(1.0, Math.max(0.1, hitRate));
  }

  calculateBaseDamage() {
    const effectiveAp = this.calculateEffectiveAp();
    const minDamage = effectiveAp * MIN_DAMAGE_RATIO;
    const rawDamage = effectiveAp - this.dr;
    const hitRate = this.calculateHitRate();

    const hitDamage = Math.max(minDamage, rawDamage);
    const missDamage = Math.max(minDamage, hitDamage * hitRate);

    return hitDamage * hitRate + missDamage * (1 - hitRate);
  }

  calculateEffectiveHp({ dr = this.dr, evasion = this.evasion } = {}) {
    const effectiveAp = this.calculateEffectiveAp();
    const hp = Number(this.defender.hp) || 0;
    if (effectiveAp <= 0 || hp <= 0) {
      return 0;
    }

    const accuracy = Number(this.attacker.acc) || 0;
    const hitRate = Math.min(
      1.0,
      Math.max(0.1, 0.67 + (accuracy - Number(evasion)) * 0.0025),
    );
    const minDamage = effectiveAp * MIN_DAMAGE_RATIO;
    const hitDamage = Math.max(minDamage, effectiveAp - Number(dr));
    const missDamage = Math.max(minDamage, hitDamage * hitRate);
    const bdrPercent = Math.min(
      0.99,
      Math.max(0, (Number(this.defender.bdrp) || 0) / 100),
    );

    const mitigationFactor =
      ((hitRate * hitDamage + (1 - hitRate) * missDamage) / effectiveAp) *
      (1 - bdrPercent);

    return mitigationFactor > 0 ? hp / mitigationFactor : 0;
  }

  calculateEffectiveHpMetrics() {
    const effectiveAp = this.calculateEffectiveAp();
    const accuracy = Number(this.attacker.acc) || 0;
    const dr = Number(this.dr) || 0;
    const evasion = Number(this.evasion) || 0;
    const bdrp = Number(this.defender.bdrp) || 0;
    const bdrPercent = Math.min(0.99, Math.max(0, bdrp / 100));
    const hp = Number(this.defender.hp) || 0;
    const hitRate = this.calculateHitRate();
    const missRate = 1 - hitRate;

    const rawEffectiveHp = this.calculateEffectiveHp({ dr, evasion });
    const effectiveHp = Math.trunc(rawEffectiveHp);
    const multiplier = hp > 0 ? effectiveHp / hp : 0;
    const maxMultiplier = 1 / (MIN_DAMAGE_RATIO * (1 - bdrPercent));

    const drCheck = Math.round(effectiveAp * (1 - MIN_DAMAGE_RATIO));
    const drElbow = Math.round(effectiveAp * (1 - MIN_DAMAGE_RATIO / hitRate));

    const evasionCheck = Math.round(accuracy + (0.9 - 0.33) / 0.0025);
    const evasionStart = Math.round(accuracy - 0.33 / 0.0025);

    let evasionElbow = accuracy;
    if (effectiveAp > 0 && 1 - dr / effectiveAp > 0) {
      const missElbow = Math.min(
        1 - MIN_DAMAGE_RATIO / (1 - dr / effectiveAp),
        0.9,
      );
      evasionElbow = Math.round(accuracy + (missElbow - 0.33) / 0.0025);
    }

    return {
      effectiveAp,
      accuracy,
      dr,
      evasion,
      damageType: this.damage_type,
      bdrp,
      hp,
      hitRate,
      missRate,
      rawEffectiveHp,
      effectiveHp,
      multiplier,
      maxMultiplier,
      drCheck,
      drElbow,
      evasionStart,
      evasionElbow,
      evasionCheck,
    };
  }

  calculateDamageReduction() {
    const baseDamage = this.calculateBaseDamage();
    const bdrPercent = (Number(this.defender.bdrp) || 0) / 100;

    return baseDamage * (1 - bdrPercent);
  }

  calculateSpecialDamage(modifierType = "normal") {
    let damage = this.calculateDamageReduction();

    // Critical Hit Rate & Critical Hit Damage
    const totalCritRate = Math.min(
      1.0,
      ((Number(this.attacker.chc) || 0) +
        (Number(this.skill.crit_hit_rate) || 0)) /
        100,
    );
    const bonusCritDamage = (Number(this.attacker.chrp) || 0) / 100;
    damage *= 1 + (1 + bonusCritDamage) * totalCritRate;

    // Special Attack Multiplier (Down / Back / Air)
    if (modifierType === "down") {
      const bonusDown = (Number(this.attacker.adad) || 0) / 100;
      damage *= 1.2 + bonusDown;
    } else if (modifierType === "back") {
      const bonusBack = (Number(this.attacker.abad) || 0) / 100;
      damage *= 1.2 + bonusBack;
    } else if (modifierType === "air") {
      const bonusAir = (Number(this.attacker.aaad) || 0) / 100;
      damage *= 1.7 + bonusAir;
    }

    return damage;
  }

  calculateHpLoss(modifierType = "normal") {
    let damage = this.calculateSpecialDamage(modifierType);

    // Class vs Class modifier
    damage *= this.class_pvp_modifier;

    // Skill Damage % and Skill PvP Damage Reduction %
    const skillDamage = (Number(this.hit.damage_percent) || 0) / 100;
    const pvpReduction = (Number(this.skill.pvp_damage) || 100) / 100;
    damage *= skillDamage * pvpReduction;

    // Translate to HP Loss using BDO empirical constant
    const rawHpLoss = damage / 18.5546045699823;
    return Math.max(1, rawHpLoss);
  }

  calculateHitTotalHpLoss() {
    const normalCount = Number(this.hit.normal_hits) || 0;
    const downCount = Number(this.hit.down_hits) || 0;
    const backCount = Number(this.hit.back_hits) || 0;
    const airCount = Number(this.hit.air_hits) || 0;

    const normalLoss =
      normalCount > 0 ? this.calculateHpLoss("normal") * normalCount : 0;
    const downLoss =
      downCount > 0 ? this.calculateHpLoss("down") * downCount : 0;
    const backLoss =
      backCount > 0 ? this.calculateHpLoss("back") * backCount : 0;
    const airLoss = airCount > 0 ? this.calculateHpLoss("air") * airCount : 0;

    return normalLoss + downLoss + backLoss + airLoss;
  }
}

/**
 * Calculates total HP loss for an entire combo sequence.
 *
 * Optional `options`:
 * - `attackerMods` / `defenderMods`: fixed modifiers for the whole combo.
 * - `attackerEffects` / `defenderEffects`: skill effects (see skillEffects.js).
 *   The attacker's effects apply from the skill that used them onward, the
 *   defender's effects are active during the whole combo.
 */
export function calculateComboDamage(
  attacker,
  defender,
  combo = [],
  options = {},
) {
  if (!attacker || !defender || !Array.isArray(combo) || combo.length === 0) {
    return 0;
  }

  const {
    attackerMods = {},
    defenderMods = {},
    attackerEffects = [],
    defenderEffects = [],
  } = options;
  const useModifiers = Object.keys(options).length > 0;

  let totalHpLoss = 0;

  for (const [index, skill] of combo.entries()) {
    let skillAttacker = attacker;
    let skillDefender = defender;

    if (useModifiers) {
      const matchup = resolveMatchup(
        attackerEffects,
        defenderEffects,
        combo,
        index,
      );
      skillAttacker = applyModifiers(
        attacker,
        sumMods(attackerMods, matchup.attackerMods),
      );
      skillDefender = applyModifiers(
        defender,
        sumMods(defenderMods, matchup.defenderMods),
      );
    }

    for (const hit of skill.hits || []) {
      const calculator = new PvpCalculator({
        attacker: skillAttacker,
        defender: skillDefender,
        skill,
        hit,
      });

      totalHpLoss += calculator.calculateHitTotalHpLoss();
    }
  }

  return Math.round(totalHpLoss * 100) / 100;
}

export default PvpCalculator;
