import classModifiers from "~/data/classModifiers";

export class PvpCalculator {
  constructor({ attacker = {}, defender = {}, skill = {}, hit = {} }) {
    this.attacker = attacker;
    this.defender = defender;
    this.skill = skill;
    this.hit = hit;

    this.dr = 0;
    this.evasion = 0;
    this.class_pvp_modifier = 0.8929;
    this.class_group = "";

    this.setupClassMatchup();
  }

  setupClassMatchup() {
    this.dr = Number(this.defender.mldr) || 0;
    this.evasion = Number(this.defender.meev) || 0;

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
    const minDamage = effectiveAp * 0.05;
    const rawDamage = effectiveAp - this.dr;
    const hitRate = this.calculateHitRate();

    const damage = rawDamage * (2 * hitRate - hitRate * hitRate);
    return Math.max(minDamage, damage);
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
    const hpLoss = Math.max(1, Math.round(rawHpLoss * 100) / 100);
    return hpLoss;
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
 */
export function calculateComboDamage(attacker, defender, combo = []) {
  if (!attacker || !defender || !Array.isArray(combo) || combo.length === 0) {
    return 0;
  }

  let totalHpLoss = 0;

  for (const skill of combo) {
    for (const hit of skill.hits || []) {
      const calculator = new PvpCalculator({
        attacker,
        defender,
        skill,
        hit,
      });

      totalHpLoss += calculator.calculateHitTotalHpLoss();
    }
  }

  return totalHpLoss;
}

export default PvpCalculator;
