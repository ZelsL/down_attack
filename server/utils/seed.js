const HIT_BOOLEAN_FLAGS = [
  "is_sa",
  "is_fg",
  "is_if",
  "is_down_attack",
  "is_air_attack",
  "is_down_smash",
  "is_air_smash",
  "is_knockback",
  "is_knockdown",
  "is_stun",
  "is_floating",
  "is_stiffness",
  "is_bound",
  "is_grapple",
  "is_freezing",
];

function formatHitForSeed(hit) {
  const formatted = {
    description: hit.description || null,
    damage_percent: Number(hit.damage_percent) || 0,
    hit_count: Number(hit.hit_count) || 1,
  };

  for (const flag of HIT_BOOLEAN_FLAGS) {
    if (hit[flag] === true) {
      formatted[flag] = true;
    }
  }

  return formatted;
}

function formatSkillForSeed(row) {
  const selfBuffs =
    row.self_buffs &&
    typeof row.self_buffs === "object" &&
    !Array.isArray(row.self_buffs)
      ? row.self_buffs
      : {};

  const targetDebuffs =
    row.target_debuffs &&
    typeof row.target_debuffs === "object" &&
    !Array.isArray(row.target_debuffs)
      ? row.target_debuffs
      : {};

  return {
    id: Number(row.id),
    name: row.name,
    command: row.command || null,
    class_name: row.class_name,
    skill_spec: row.skill_spec,
    cooldown: Number(row.cooldown) || 0,
    crit_hit_rate: Number(row.crit_hit_rate) || 0,
    pvp_damage: Number(row.pvp_damage) || 0,
    icon_path: row.icon_path || "/icons/default_skill.webp",
    is_sa: Boolean(row.is_sa),
    is_fg: Boolean(row.is_fg),
    is_if: Boolean(row.is_if),
    is_down_attack: Boolean(row.is_down_attack),
    is_air_attack: Boolean(row.is_air_attack),
    is_down_smash: Boolean(row.is_down_smash),
    is_air_smash: Boolean(row.is_air_smash),
    is_knockback: Boolean(row.is_knockback),
    is_knockdown: Boolean(row.is_knockdown),
    is_stun: Boolean(row.is_stun),
    is_floating: Boolean(row.is_floating),
    is_stiffness: Boolean(row.is_stiffness),
    is_bound: Boolean(row.is_bound),
    is_grapple: Boolean(row.is_grapple),
    is_freezing: Boolean(row.is_freezing),
    self_buffs: selfBuffs,
    target_debuffs: targetDebuffs,
    tags: Array.isArray(row.tags) ? row.tags : [],
    hits: Array.isArray(row.hits) ? row.hits.map(formatHitForSeed) : [],
  };
}

const seed = {
  formatHitForSeed,
  formatSkillForSeed,
};

export default seed;
