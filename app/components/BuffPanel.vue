<template>
  <h2 class="text-center font-bold text-lg text-[#d7ad70]">Pre-Buffs</h2>
  <div class="w-full flex flex-col gap-3">
    <!-- ================= 1. PARTY BUFFS ================= -->
    <div class="flex flex-col gap-1.5">
      <!-- Divisor com título centralizado -->
      <div class="relative flex items-center justify-center my-1">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#ffedd4]/20" />
        </div>
        <span
          class="relative bg-[#222122] px-3 text-[11px] font-bold text-[#d7ad70]/80 uppercase tracking-widest select-none"
        >
          Party Buffs
        </span>
      </div>

      <div v-if="partyEffects.length" class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1.5">
          <EffectToggle
            v-for="effect in partyEffects"
            :key="effect.id"
            :active="activeP1Party.includes(effect.id)"
            :skill-id="effect.id"
            :name="effect.name"
            :icon="effect.icon"
            :duration="effect.duration"
            :self-labels="effect.selfLabels"
            :enemy-labels="effect.enemyLabels"
            @click="toggleId(activeP1Party, effect.id)"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <EffectToggle
            v-for="effect in partyEffects"
            :key="effect.id"
            :active="activeP2Party.includes(effect.id)"
            :skill-id="effect.id"
            :name="effect.name"
            :icon="effect.icon"
            :duration="effect.duration"
            :self-labels="effect.selfLabels"
            :enemy-labels="effect.enemyLabels"
            @click="toggleId(activeP2Party, effect.id)"
          />
        </div>
      </div>
      <p v-else class="text-center text-[11px] text-[#ffedd4]/40 select-none">
        No party buffs available.
      </p>
    </div>

    <!-- ================= 2. Class Buff / Rage Absorption ================= -->
    <div class="flex flex-col gap-1.5">
      <div class="relative flex items-center justify-center my-1">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#ffedd4]/20" />
        </div>
        <span
          class="relative bg-[#222122] px-3 text-[11px] font-bold text-[#d7ad70]/80 uppercase tracking-widest select-none"
        >
          Class Buffs
        </span>
      </div>

      <!-- Grid 2 columns -->
      <div class="grid grid-cols-2 gap-2">
        <!-- P1: Rage Absorption + class buffs (e_buff) and class debuffs -->
        <div class="flex flex-col gap-1.5">
          <EffectToggle
            :skill-id="3459"
            name="Rage Absorption"
            icon="/skills/warrior/3459.webp"
            :active="isP1AbsorptionActive"
            :self-labels="RAGE_ABSORPTION_LABELS"
            @click="isP1AbsorptionActive = !isP1AbsorptionActive"
          />
          <EffectToggle
            v-for="effect in p1ClassEffects"
            :key="effect.id"
            :active="activeP1ClassEffects.includes(effect.id)"
            :skill-id="effect.id"
            :name="effect.name"
            :icon="effect.icon"
            :duration="effect.duration"
            :self-labels="effect.selfLabels"
            :enemy-labels="effect.enemyLabels"
            @click="toggleId(activeP1ClassEffects, effect.id)"
          />
        </div>

        <!-- P2: Rage Absorption + class buffs (e_buff) and class debuffs -->
        <div class="flex flex-col gap-1.5">
          <EffectToggle
            :skill-id="3459"
            name="Rage Absorption"
            icon="/skills/warrior/3459.webp"
            :active="isP2AbsorptionActive"
            :self-labels="RAGE_ABSORPTION_LABELS"
            @click="isP2AbsorptionActive = !isP2AbsorptionActive"
          />
          <EffectToggle
            v-for="effect in p2ClassEffects"
            :key="effect.id"
            :active="activeP2ClassEffects.includes(effect.id)"
            :skill-id="effect.id"
            :name="effect.name"
            :icon="effect.icon"
            :duration="effect.duration"
            :self-labels="effect.selfLabels"
            :enemy-labels="effect.enemyLabels"
            @click="toggleId(activeP2ClassEffects, effect.id)"
          />
        </div>
      </div>
    </div>

    <!-- ================= 2.5 SKILL EFFECTS (from combo) ================= -->
    <div class="flex flex-col gap-1.5">
      <div class="relative flex items-center justify-center my-1">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#ffedd4]/20" />
        </div>
        <span
          class="relative bg-[#222122] px-3 text-[11px] font-bold text-[#d7ad70]/80 uppercase tracking-widest select-none"
        >
          Combo Skill Effects
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1.5">
          <EffectToggle
            v-for="effect in p1ComboEffects"
            :key="effect.id"
            :active="!disabledP1Effects.includes(effect.id)"
            :skill-id="effect.id"
            :name="effect.name"
            :icon="effect.icon"
            :duration="effect.duration"
            :self-labels="effect.selfLabels"
            :enemy-labels="effect.enemyLabels"
            @click="toggleId(disabledP1Effects, effect.id)"
          />
          <p
            v-if="!p1ComboEffects.length"
            class="text-center text-[11px] text-[#ffedd4]/40 select-none"
          >
            No buffs/debuffs in combo.
          </p>
        </div>

        <div class="flex flex-col gap-1.5">
          <EffectToggle
            v-for="effect in p2ComboEffects"
            :key="effect.id"
            :active="!disabledP2Effects.includes(effect.id)"
            :skill-id="effect.id"
            :name="effect.name"
            :icon="effect.icon"
            :duration="effect.duration"
            :self-labels="effect.selfLabels"
            :enemy-labels="effect.enemyLabels"
            @click="toggleId(disabledP2Effects, effect.id)"
          />
          <p
            v-if="!p2ComboEffects.length"
            class="text-center text-[11px] text-[#ffedd4]/40 select-none"
          >
            No buffs/debuffs in combo.
          </p>
        </div>
      </div>
    </div>

    <!-- ================= 3. ADDONS ================= -->
    <div class="flex flex-col gap-1.5">
      <div class="relative flex items-center justify-center my-1">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#ffedd4]/20" />
        </div>
        <span
          class="relative bg-[#222122] px-3 text-[11px] font-bold text-[#d7ad70]/80 uppercase tracking-widest select-none"
        >
          Addons
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <!-- P1 Addon -->
        <div class="flex flex-col gap-1.5">
          <button
            v-for="addon in AVAILABLE_ADDONS"
            :key="addon.id"
            type="button"
            :class="[
              'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer select-none',
              activeP1Addons.includes(addon.id)
                ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
                : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
            ]"
            @click="toggleP1Addon(addon.id)"
          >
            <span
              :class="[
                'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
                activeP1Addons.includes(addon.id)
                  ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
                  : 'bg-[#292929] border-black/80',
              ]"
            />
            <span class="truncate flex-1 text-left">
              {{ addon.label }}
            </span>
          </button>
        </div>

        <!-- P2 Addon -->
        <div class="flex flex-col gap-1.5">
          <button
            v-for="addon in AVAILABLE_ADDONS"
            :key="addon.id"
            type="button"
            :class="[
              'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer select-none',
              activeP2Addons.includes(addon.id)
                ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
                : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
            ]"
            @click="toggleP2Addon(addon.id)"
          >
            <span
              :class="[
                'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
                activeP2Addons.includes(addon.id)
                  ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
                  : 'bg-[#292929] border-black/80',
              ]"
            />
            <span class="truncate flex-1 text-left">
              {{ addon.label }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, toRef, onMounted } from "vue";
import { collectSkillEffects } from "~~/app/utils/skillEffects.js";

const props = defineProps({
  player1: {
    type: Object,
    required: true,
  },
  player2: {
    type: Object,
    required: true,
  },
  // Skills tagged as `party_buff`, offered as optional pre-buffs.
  partySkills: {
    type: Array,
    default: () => [],
  },
});

// Modelos emitidos para o calculator.vue
const p1Modifiers = defineModel("p1Modifiers", {
  type: Object,
  default: () => ({ all_ap: 0, all_dr: 0, max_hp: 0, crit_damage: 0 }),
});

const p2Modifiers = defineModel("p2Modifiers", {
  type: Object,
  default: () => ({ all_ap: 0, all_dr: 0, max_hp: 0, crit_damage: 0 }),
});

// Active skill effects (party, class and combo skills) of each player. They
// are not folded into the modifiers because combo effects only apply from the
// skill that used them onward (see calculateComboDamage).
const p1Effects = defineModel("p1Effects", {
  type: Array,
  default: () => [],
});

const p2Effects = defineModel("p2Effects", {
  type: Array,
  default: () => [],
});

// Generic Rage Absorption pre-buff (not tied to a class skill).
const RAGE_ABSORPTION_LABELS = ["+30 AP", "+30% Crit Rate"];

const isP1AbsorptionActive = ref(false);
const isP2AbsorptionActive = ref(false);

// Party buffs (skills tagged `party_buff`), off by default.
const partyEffects = computed(() =>
  collectSkillEffects(props.partySkills, "party"),
);
const activeP1Party = ref([]);
const activeP2Party = ref([]);

// Buffs/debuffs found in the skills of each player's combo. They are on by
// default, the user can disable the ones that should not be considered.
const p1ComboEffects = computed(() =>
  collectSkillEffects(props.player1?.combo, "combo"),
);
const p2ComboEffects = computed(() =>
  collectSkillEffects(props.player2?.combo, "combo"),
);
const disabledP1Effects = ref([]);
const disabledP2Effects = ref([]);

// Class buffs (skills tagged `e_buff`) and debuff skills of each player's
// class/spec, available as pre-buffs even if they are not used in the combo
// (off by default). Skills already listed in "Combo Skill Effects" are left
// out to avoid duplicated options.
function useClassSkills(player) {
  return useFetch(
    () => {
      if (!player.value?.class_name || !player.value?.spec) return null;
      return `/api/v1/skills?class_name=${player.value.class_name}&spec=${player.value.spec}`;
    },
    { default: () => [] },
  );
}

function getClassEffects(skills, combo) {
  const inCombo = new Set((combo || []).map((skill) => skill.id));
  const hasTag = (skill, tag) => skill.tags?.includes(tag);
  const isSelectableClassSkill = (skill) =>
    (skill?.command || "").trim().toLowerCase() !== "passive" &&
    !(skill?.name || "").startsWith("(Not in Use)");

  const activeSkills = (skills || []).filter(isSelectableClassSkill);

  const classBuffs = collectSkillEffects(
    activeSkills.filter((skill) => hasTag(skill, "e_buff")),
    "class",
  );
  const otherClassEffects = collectSkillEffects(
    activeSkills.filter((skill) => !hasTag(skill, "e_buff")),
    "class",
  );

  return [...classBuffs, ...otherClassEffects].filter(
    (effect) => !inCombo.has(effect.id),
  );
}

const { data: p1ClassSkills, refresh: refreshP1ClassSkills } = useClassSkills(
  toRef(props, "player1"),
);
const { data: p2ClassSkills, refresh: refreshP2ClassSkills } = useClassSkills(
  toRef(props, "player2"),
);

onMounted(() => {
  refreshP1ClassSkills();
  refreshP2ClassSkills();
});

const p1ClassEffects = computed(() =>
  getClassEffects(p1ClassSkills.value, props.player1?.combo),
);
const p2ClassEffects = computed(() =>
  getClassEffects(p2ClassSkills.value, props.player2?.combo),
);
const activeP1ClassEffects = ref([]);
const activeP2ClassEffects = ref([]);

// Class buff/debuff selections belong to a class/spec, reset them when it changes.
watch(
  () => `${props.player1?.class_name}|${props.player1?.spec}`,
  () => (activeP1ClassEffects.value = []),
);
watch(
  () => `${props.player2?.class_name}|${props.player2?.spec}`,
  () => (activeP2ClassEffects.value = []),
);

function toggleId(list, id) {
  const index = list.indexOf(id);
  if (index === -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }
}

// Active party + class + combo effects of a player. The same skill is counted
// once.
function getActiveEffects({
  partyEffectList,
  activePartyIds,
  classEffectList,
  activeClassIds,
  comboEffectList,
  disabledIds,
}) {
  const active = new Map();

  for (const effect of partyEffectList) {
    if (activePartyIds.includes(effect.id)) active.set(effect.id, effect);
  }
  for (const effect of classEffectList) {
    if (activeClassIds.includes(effect.id)) active.set(effect.id, effect);
  }
  // A pre-buff (party/class) of the same skill starts before the combo, so it
  // is kept instead of the combo one.
  for (const effect of comboEffectList) {
    if (!disabledIds.includes(effect.id) && !active.has(effect.id)) {
      active.set(effect.id, effect);
    }
  }

  return active;
}

const AVAILABLE_ADDONS = [
  { id: "crit_dmg", label: "+ 5% Crit Dmg", buffs: { crit_damage: 5 } },
  { id: "back_dmg", label: "+ 5% Back Attack", buffs: { abad: 5 } },
  { id: "down_dmg", label: "+ 5% Down Attack", buffs: { adad: 5 } },
  { id: "air_dmg", label: "+ 5% Air Attack", buffs: { aaad: 5 } },
  { id: "crit_rate", label: "+ 30% Crit Rate", buffs: { chc: 30 } },
  { id: "acc", label: "+ 20 Accuracy", buffs: { acc: 20 } },

  { id: "dp_buff", label: "+ 20 DR", buffs: { mldr: 20, radr: 20, madr: 20 } },
  {
    id: "eva_buff",
    label: "+ 20 Evasion",
    buffs: { meev: 20, raev: 20, maev: 20 },
  },

  {
    id: "dp_debuff",
    label: "- 20 Enemy DR",
    debuffs: { mldr: -20, radr: -20, madr: -20 },
  },
  {
    id: "eva_debuff",
    label: "- 20 Enemy Evasion",
    debuffs: { meev: -20, raev: -20, maev: -20 },
  },
];

const activeP1Addons = ref([]);
const activeP2Addons = ref([]);

function toggleP1Addon(addonId) {
  const index = activeP1Addons.value.indexOf(addonId);
  if (index === -1) {
    activeP1Addons.value.push(addonId);
  } else {
    activeP1Addons.value.splice(index, 1);
  }
}

function toggleP2Addon(addonId) {
  const index = activeP2Addons.value.indexOf(addonId);
  if (index === -1) {
    activeP2Addons.value.push(addonId);
  } else {
    activeP2Addons.value.splice(index, 1);
  }
}

function calculateModifiers({
  isAbsorptionActive,
  activeAddons,
  opponentAddons,
}) {
  const mods = {
    all_ap: 0,
    max_hp: 0,
    acc: 0,
    mldr: 0,
    radr: 0,
    madr: 0,
    meev: 0,
    raev: 0,
    maev: 0,
    chc: 0,
    crit_damage: 0,
    abad: 0,
    adad: 0,
    aaad: 0,
  };

  if (isAbsorptionActive) {
    mods.all_ap += 30;
    mods.chc += 30;
  }

  for (const addonId of activeAddons) {
    const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    if (addon?.buffs) {
      for (const [k, v] of Object.entries(addon.buffs)) {
        if (k in mods) mods[k] += v;
      }
    }
  }
  for (const addonId of opponentAddons) {
    const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    if (addon?.debuffs) {
      for (const [k, v] of Object.entries(addon.debuffs)) {
        if (k in mods) mods[k] += v;
      }
    }
  }

  return mods;
}

watchEffect(() => {
  const p1Active = getActiveEffects({
    partyEffectList: partyEffects.value,
    activePartyIds: activeP1Party.value,
    classEffectList: p1ClassEffects.value,
    activeClassIds: activeP1ClassEffects.value,
    comboEffectList: p1ComboEffects.value,
    disabledIds: disabledP1Effects.value,
  });
  const p2Active = getActiveEffects({
    partyEffectList: partyEffects.value,
    activePartyIds: activeP2Party.value,
    classEffectList: p2ClassEffects.value,
    activeClassIds: activeP2ClassEffects.value,
    comboEffectList: p2ComboEffects.value,
    disabledIds: disabledP2Effects.value,
  });

  p1Effects.value = [...p1Active.values()];
  p2Effects.value = [...p2Active.values()];

  p1Modifiers.value = calculateModifiers({
    isAbsorptionActive: isP1AbsorptionActive.value,
    activeAddons: activeP1Addons.value,
    opponentAddons: activeP2Addons.value,
  });

  p2Modifiers.value = calculateModifiers({
    isAbsorptionActive: isP2AbsorptionActive.value,
    activeAddons: activeP2Addons.value,
    opponentAddons: activeP1Addons.value,
  });
});
</script>
