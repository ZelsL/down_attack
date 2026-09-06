export function validateSkillSpecMiddleware(req, res, next) {
  const { skill_spec } = req.body;
  const spec_map = ["Awakening", "Succession", "Absolute"];

  if (!skill_spec) {
    return res.status(400).json({
      success: false,
      error: "To save a preset, you need to choose a skill spec",
    });
  }

  if (!spec_map.includes(skill_spec)) {
    return res.status(400).json({
      success: false,
      error: "Invalid skill_spec. Valid options: " + spec_map.join(", "),
    });
  }

  next();
}

export function validateClassSpecMiddleware(req, res, next) {
  const { class_spec } = req.body;
  const spec_map = ["Awakening", "Succession", "Ascension"];

  if (!class_spec) {
    return res.status(400).json({
      success: false,
      error: "To save a preset, you need to choose a class",
    });
  }

  if (!spec_map.includes(class_spec)) {
    return res.status(400).json({
      success: false,
      error: "Invalid class_spec. Valid options: " + spec_map.join(", "),
    });
  }
  next();
}
export function validateAttackStateMiddleware(req, res, next) {
  const { attacker_state } = req.body;
  const attacker_map = ["Normal", "Back_Attack", "Down_Attack", "Air Attack"];

  if (!attacker_map.includes(attacker_state)) {
    return res.status(400).json({
      success: false,
      error:
        "Invalid attacker_state. Valid options: " + attacker_map.join(", "),
    });
  }
  next();
}

export function validateStatusMiddleware(req, res, next) {
  const {
    total_ap_pvp,
    total_aap_pvp,
    sheet_ap,
    sheet_aap,
    melee_dr,
    ranged_dr,
    magic_dr,
    accuracy,
    melee_evasion,
    ranged_evasion,
    magic_evasion,
    dr_percent,
    critical,
    back_attack,
    down_attack,
    air_attack,
    skill_damage_percent,
    skill_pvp_reduction_percent,
    critical_hit_rate,
    hp,
  } = req.body;

  const int_status = {
    total_ap_pvp: total_ap_pvp,
    total_aap_pvp: total_aap_pvp,
    sheet_ap: sheet_ap,
    sheet_aap: sheet_aap,
    melee_dr: melee_dr,
    ranged_dr: ranged_dr,
    magic_dr: magic_dr,
    accuracy: accuracy,
    melee_evasion: melee_evasion,
    ranged_evasion: ranged_evasion,
    magic_evasion: magic_evasion,
    hp: hp,
  };
  const float_status = {
    dr_percent,
    critical,
    back_attack,
    air_attack,
    down_attack,
    critical_hit_rate,
    skill_damage_percent,
    skill_pvp_reduction_percent,
  };

  for (let status in int_status) {
    if (!Number.isInteger(int_status[status]) || int_status[status] < 0) {
      return res.status(400).json({
        success: false,
        error: `${status} is invalid. It has to be positive integer`,
      });
    }
  }

  for (let status in float_status) {
    if (float_status[status] < 0) {
      return res.status(400).json({
        success: false,
        error: `${status} is invalid. It has to be a positive`,
      });
    }
  }

  if (skill_pvp_reduction_percent >= 100) {
    return res.status(400).json({
      success: false,
      error:
        "skill_pvp_reduction_percent cannot be greater than or equal to 100",
    });
  }

  next();
}
