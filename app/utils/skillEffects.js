/**
 * Translates the `self_buffs` / `target_debuffs` stored in skills into the
 * modifier keys used by the calculator (see BuffPanel.vue / calculator.vue).
 *
 * Each skill effect key maps to one or more modifier keys. Keys that are not
 * listed here (duration, recover, movement_speed, attack_speed, bleeding...)
 * do not change the damage formula and are ignored.
 */
const EFFECT_STAT_MAP = {
  all_ap: { mods: ["all_ap"], label: "AP" },
  max_hp: { mods: ["max_hp"], label: "HP" },
  accuracy: { mods: ["acc"], label: "ACC" },
  crit_hit_rate: { mods: ["chc"], label: "% Crit Rate" },
  crit_damage: { mods: ["crit_damage"], label: "% Crit Dmg" },
  damage_reduction: { mods: ["mldr", "radr", "madr"], label: "DR" },
  damage_reduction_rate: { mods: ["bdrp"], label: "% DR Rate" },
  evasion: { mods: ["meev", "raev", "maev"], label: "EVA" },
  down_attack_damage: { mods: ["adad"], label: "% Down Atk" },
  back_attack_damage: { mods: ["abad"], label: "% Back Atk" },
  air_attack_damage: { mods: ["aaad"], label: "% Air Atk" },
  special_attack_damage: {
    mods: ["adad", "abad", "aaad"],
    label: "% Special Atk",
  },
};

function formatValue(value) {
  return `${value > 0 ? "+" : ""}${value}`;
}

/**
 * Converts a raw skill effects object (`{ all_ap: 20, duration: 10 }`) into
 * calculator modifiers (`{ all_ap: 20 }`) and human readable labels.
 */
function mapEffects(rawEffects) {
  const mods = {};
  const labels = [];

  for (const [key, rawValue] of Object.entries(rawEffects || {})) {
    const stat = EFFECT_STAT_MAP[key];
    const value = Number(rawValue);
    if (!stat || !Number.isFinite(value) || value === 0) continue;

    for (const mod of stat.mods) {
      mods[mod] = (mods[mod] || 0) + value;
    }
    labels.push(`${formatValue(value)} ${stat.label}`);
  }

  return { mods, labels };
}

/**
 * Builds a single effect option from a skill. Returns null when the skill has
 * nothing that affects the calculation.
 *
 * - `self`: modifiers applied to the player who uses the skill.
 * - `enemy`: modifiers (debuffs, negative values) applied to the opponent.
 */
export function skillToEffect(skill, source = "combo") {
  if (!skill || skill.id === undefined || skill.id === null) return null;

  const buffs = mapEffects(skill.self_buffs);
  const debuffs = mapEffects(skill.target_debuffs);

  if (
    Object.keys(buffs.mods).length === 0 &&
    Object.keys(debuffs.mods).length === 0
  ) {
    return null;
  }

  return {
    id: skill.id,
    name: skill.name,
    icon: skill.icon_path || skill.icon || "",
    source,
    duration: Number(skill.self_buffs?.duration) || 0,
    self: buffs.mods,
    enemy: debuffs.mods,
    selfLabels: buffs.labels,
    enemyLabels: debuffs.labels,
  };
}

/**
 * Lists the buff/debuff options present in a combo. A skill used more than
 * once in the combo is listed only once.
 */
export function collectSkillEffects(skills = [], source = "combo") {
  const effects = new Map();

  for (const skill of Array.isArray(skills) ? skills : []) {
    if (!skill || effects.has(skill.id)) continue;
    const effect = skillToEffect(skill, source);
    if (effect) effects.set(effect.id, effect);
  }

  return [...effects.values()];
}

/**
 * Merges a list of active effects into the final modifiers.
 *
 * Buffs from different skills are summed. Debuffs on the opponent do not
 * stack: for each stat only the strongest one is applied.
 */
export function resolveEffects(effects = []) {
  const self = {};
  const enemy = {};

  for (const effect of effects) {
    for (const [mod, value] of Object.entries(effect.self || {})) {
      self[mod] = (self[mod] || 0) + value;
    }
    for (const [mod, value] of Object.entries(effect.enemy || {})) {
      enemy[mod] =
        mod in enemy
          ? value < 0
            ? Math.min(enemy[mod], value)
            : Math.max(enemy[mod], value)
          : value;
    }
  }

  return { self, enemy };
}

/**
 * Sums several modifier objects (`{ all_ap: 20 }`) into a new one.
 */
export function sumMods(...modsList) {
  const total = {};

  for (const mods of modsList) {
    for (const [mod, value] of Object.entries(mods || {})) {
      total[mod] = (total[mod] || 0) + (Number(value) || 0);
    }
  }

  return total;
}

/**
 * Returns a copy of the player with the modifiers applied to its stats.
 */
export function applyModifiers(player, mods = {}) {
  const p = player || {};
  const b = mods || {};
  const add = (key, bonus = 0) => (Number(p[key]) || 0) + (bonus || 0);
  const addMin0 = (key, bonus = 0) => Math.max(0, add(key, bonus));

  return {
    ...p,
    hp: add("hp", b.max_hp),
    ap: add("ap", b.all_ap),
    aap: add("aap", b.all_ap),
    adventureap: add("adventureap", b.all_ap),
    adventureaap: add("adventureaap", b.all_ap),
    acc: add("acc", b.acc),
    mldr: addMin0("mldr", b.mldr),
    radr: addMin0("radr", b.radr),
    madr: addMin0("madr", b.madr),
    meev: addMin0("meev", b.meev),
    raev: addMin0("raev", b.raev),
    maev: addMin0("maev", b.maev),
    bdrp: add("bdrp", b.bdrp),
    chc: add("chc", b.chc),
    chrp: add("chrp", b.crit_damage),
    abad: add("abad", b.abad),
    adad: add("adad", b.adad),
    aaad: add("aaad", b.aaad),
  };
}

/**
 * Position in the combo from which an effect is active. Effects of skills used
 * in the combo start at the first use of the skill (and last until the end of
 * the combo). Pre-buffs (party / class) are active before the first skill (-1).
 */
export function getEffectStartIndex(effect, combo = []) {
  if (effect.source !== "combo") return -1;

  const index = (combo || []).findIndex((skill) => skill.id === effect.id);
  return index === -1 ? 0 : index;
}

/**
 * Resolves the effects that are active when the skill at `index` is used.
 */
export function resolveEffectsAt(effects = [], combo = [], index = -1) {
  return resolveEffects(
    effects.filter((effect) => getEffectStartIndex(effect, combo) <= index),
  );
}

/**
 * Modifiers of an attacker and a defender when the attacker uses the skill at
 * `index` of its combo.
 *
 * - The attacker's effects apply from the skill that used them onward: buffs
 *   on the attacker and debuffs on the defender.
 * - The defender's effects do not have a shared timeline with the attacker's
 *   combo, so they are considered active during the whole combo: buffs on the
 *   defender and debuffs on the attacker.
 */
export function resolveMatchup(
  attackerEffects = [],
  defenderEffects = [],
  attackerCombo = [],
  index = -1,
) {
  const own = resolveEffectsAt(attackerEffects, attackerCombo, index);
  const opponent = resolveEffects(defenderEffects);

  return {
    attackerMods: sumMods(own.self, opponent.enemy),
    defenderMods: sumMods(opponent.self, own.enemy),
  };
}

export default {
  skillToEffect,
  collectSkillEffects,
  resolveEffects,
  sumMods,
  applyModifiers,
  getEffectStartIndex,
  resolveEffectsAt,
  resolveMatchup,
};
