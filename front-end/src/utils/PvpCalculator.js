import class_modifiers from "../data/classModifiers";

class PvpCalculator {
  constructor({
    attacker_class = "",
    defender_class = "",
    defender_class_spec = "",
    attacker_class_spec = "",
    skill_spec = "",
    total_ap_pvp = 0,
    total_aap_pvp = 0,
    sheet_ap = 0,
    sheet_aap = 0,
    melee_dr = 0,
    ranged_dr = 0,
    magic_dr = 0,
    accuracy = 0,
    melee_evasion = 0,
    ranged_evasion = 0,
    magic_evasion = 0,
    dr_percent = 0,
    critical = 0,
    back_attack = 0,
    down_attack = 0,
    air_attack = 0,
    skill_damage_percent = 0,
    skill_pvp_reduction_percent = 0,
    critical_hit_rate = 0,
  }) {
    this.attacker_class = attacker_class;
    this.defender_class = defender_class;
    this.defender_class_spec = defender_class_spec;
    this.attacker_class_spec = attacker_class_spec;
    this.spec = skill_spec;
    this.total_ap_pvp = total_ap_pvp;
    this.total_aap_pvp = total_aap_pvp;
    this.sheet_ap = sheet_ap;
    this.sheet_aap = sheet_aap;
    this.dr = 0;
    this.melee_dr = melee_dr;
    this.ranged_dr = ranged_dr;
    this.magic_dr = magic_dr;
    this.accuracy = accuracy;
    this.evasion = 0;
    this.melee_evasion = melee_evasion;
    this.ranged_evasion = ranged_evasion;
    this.magic_evasion = magic_evasion;
    this.dr_percent = dr_percent;
    this.critical = critical;
    this.back_attack = back_attack;
    this.down_attack = down_attack;
    this.air_attack = air_attack;
    this.class_pvp_modifier = 0.8929;
    this.skill_damage_percent = skill_damage_percent;
    this.critical_hit_rate = critical_hit_rate;
    this.skill_pvp_reduction_percent = skill_pvp_reduction_percent;
    this.class_group = "";
    this.damage_type = "";

    this.normalizeInputs();
    // Set DR and Evasion based on class and spec
    this.setClassAndSpecModifiers();
  }
  setClassAndSpecModifiers() {
    const attackerInfo = class_modifiers[this.attacker_class.toLowerCase()];
    const defenderInfo = class_modifiers[this.defender_class.toLowerCase()];
    if (!defenderInfo) {
      throw new Error(`Invalid class name: ${this.defender_class}`);
    }
    if (!attackerInfo) {
      throw new Error(`Invalid class name: ${this.attacker_class}`);
    }
    const attacker_group =
      attackerInfo.specs[this.attacker_class_spec.toLowerCase()].group;
    const defender_group =
      defenderInfo.specs[this.defender_class_spec.toLowerCase()].group;
    const defender_type =
      attackerInfo.specs[this.attacker_class_spec.toLowerCase()].damage_type;
    const damage_type_map = {
      melee: {
        dr: this.melee_dr,
        evasion: this.melee_evasion,
      },
      ranged: {
        dr: this.ranged_dr,
        evasion: this.ranged_evasion,
      },
      magic: {
        dr: this.magic_dr,
        evasion: this.magic_evasion,
      },
    };
    this.dr = damage_type_map[defender_type]["dr"];
    this.evasion = damage_type_map[defender_type]["evasion"];

    const group_map = {
      vanguard: "skirmisher",
      pulverizer: "vanguard",
      skirmisher: "pulverizer",
    };
    if (attacker_group === group_map[defender_group]) {
      this.class_pvp_modifier = this.class_pvp_modifier * 1.05;
    }

    this.class_group = attacker_group;
  }

  normalizeInputs() {
    this.validateSpec();

    this.validateNumber(this.total_ap_pvp, "total_ap_pvp");
    this.validateNumber(this.total_aap_pvp, "total_aap_pvp");
    this.validateNumber(this.sheet_ap, "sheet_ap");
    this.validateNumber(this.sheet_aap, "sheet_aap");
    this.validateNumber(this.melee_dr, "dr");
    this.validateNumber(this.ranged_dr, "dr");
    this.validateNumber(this.magic_dr, "dr");
    this.validateNumber(this.accuracy, "accuracy");
    this.validateNumber(this.melee_evasion, "evasion");
    this.validateNumber(this.ranged_evasion, "evasion");
    this.validateNumber(this.magic_evasion, "evasion");

    this.critical = this.normalizePercentage(this.critical, "critical");
    this.back_attack = this.normalizePercentage(
      this.back_attack,
      "back_attack",
    );
    this.down_attack = this.normalizePercentage(
      this.down_attack,
      "down_attack",
    );
    this.air_attack = this.normalizePercentage(this.air_attack, "air_attack");
    this.dr_percent = this.normalizePercentage(this.dr_percent, "dr_percent");
    this.skill_damage_percent = this.normalizePercentage(
      this.skill_damage_percent,
      "skill_damage_percent",
      100,
    );
    this.skill_pvp_reduction_percent = this.normalizePercentage(
      this.skill_pvp_reduction_percent,
      "skill_pvp_reduction_percent",
      1,
    );
    this.critical_hit_rate = this.normalizePercentage(
      this.critical_hit_rate,
      "critical_hit_rate",
      1,
    );
    this.validateRanges();
  }

  validateRanges() {
    if (this.dr_percent < 0 || this.dr_percent > 1) {
      throw new Error(
        "dr_percent must be between 0 (inclusive) and 1 (exclusive)",
      );
    }
    if (this.critical_hit_rate < 0 || this.critical_hit_rate > 1) {
      throw new Error("critical_hit_rate must be between 0 and 1");
    }
  }
  validateSpec() {
    const validSpecs = ["awakening", "succession", "ascension"];

    if (
      typeof this.attacker_class_spec === "string" &&
      typeof this.defender_class_spec === "string" &&
      typeof this.spec === "string"
    ) {
      this.attacker_class_spec = this.attacker_class_spec.toLowerCase();
      this.defender_class_spec = this.defender_class_spec.toLowerCase();
      this.spec = this.spec.toLowerCase();

      if (!validSpecs.includes(this.defender_class_spec)) {
        throw new Error(
          `Invalid spec: ${this.defender_class_spec}. Valid options are: ${validSpecs.join(", ")}`,
        );
      }
      if (!validSpecs.includes(this.attacker_class_spec)) {
        throw new Error(
          `Invalid spec: ${this.attacker_class_spec}. Valid options are: ${validSpecs.join(", ")}`,
        );
      }
      if (!validSpecs.includes(this.spec)) {
        throw new Error(
          `Invalid spec: ${this.spec}. Valid options are: ${validSpecs.join(", ")}`,
        );
      }
    } else {
      throw new Error(
        `Spec must be a string. Received type: ${typeof this.attacker_class_spec}`,
      );
    }
  }

  normalizePercentage(value, name, threshold = 1) {
    this.validateNumber(value, name);
    if (value >= threshold) {
      return value / 100;
    }
    return value;
  }

  validateNumber(value, name) {
    if (typeof value !== "number" || isNaN(value) || value < 0) {
      throw new Error(`${name} must be a valid number. Received: ${value}`);
    }
  }

  effectiveApCalculator() {
    let ap = 0;
    if (this.spec === "awakening") {
      ap =
        this.total_aap_pvp +
        0.3 * this.sheet_ap +
        0.7 * this.sheet_aap -
        2 -
        this.sheet_aap;
    } else if (this.spec === "succession" || this.spec === "prime") {
      ap =
        this.total_ap_pvp +
        0.3 * this.sheet_aap +
        0.7 * this.sheet_ap -
        2 -
        this.sheet_ap;
    } else {
      ap = this.total_ap_pvp - 2;
    }
    return ap;
  }

  hitrateCalculator() {
    let hitrate = 0.67 + (this.accuracy - this.evasion) * 0.0025;
    if (hitrate < 0.1) {
      hitrate = 0.1;
    } else if (hitrate > 1.0) {
      hitrate = 1.0;
    }
    return hitrate;
  }

  baseDamageCalculator() {
    let effectiveAp = this.effectiveApCalculator();
    let min_damage = effectiveAp * 0.05;
    let damage = effectiveAp - this.dr;
    let hitrate = this.hitrateCalculator();
    damage = damage * (2 * hitrate - hitrate * hitrate);
    if (min_damage > damage) {
      damage = min_damage;
    }
    return damage;
  }

  dmgReductionPercentageCalculator() {
    let damage = this.baseDamageCalculator();

    damage = damage * (1 - this.dr_percent);

    return damage;
  }

  specialMultipliersCalculator(state) {
    let damage = this.dmgReductionPercentageCalculator();

    let crit_rate = Math.min(this.critical_hit_rate, 1.0);
    damage = damage * (1 + (1 + this.critical) * crit_rate);
    if (state === "back_attack") {
      damage = damage * (1.2 + this.back_attack);
    } else if (state === "down_attack") {
      damage = damage * (1.2 + this.down_attack);
    } else if (state === "air_attack") {
      damage = damage * (1.7 + this.air_attack);
    }

    return damage;
  }

  classPvpModifierCalculator(state) {
    let damage = this.specialMultipliersCalculator(state);
    damage = damage * this.class_pvp_modifier;
    damage =
      damage * this.skill_damage_percent * this.skill_pvp_reduction_percent;
    return damage;
  }

  hpLossCalculator(state) {
    let damage = this.classPvpModifierCalculator(state);
    let hp_loss = damage / 18.5546045699823;
    if (hp_loss < 0) {
      hp_loss = 1;
    }
    let hitrate = this.hitrateCalculator();

    return {
      hp_loss,
      hitrate,
      class_group: this.class_group,
    };
  }
}
export default PvpCalculator;
