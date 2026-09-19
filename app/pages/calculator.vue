<template>
  <div
    class="min-h-[calc(100vh-4.5rem)] bg-[#222122] p-[5%] flex flex-col gap-3"
  >
    <!-- Outside the card: Showdown Damage lines directly over Player 1 and Player 2 -->
    <div class="w-full grid grid-cols-3">
      <!-- Directly above Player 1 -->
      <div class="px-[5%]">
        <span class="text-xs font-semibold text-[#ffedd4]">
          {{ player1Object.class_name || "Player 1" }} vs.
          {{ player2Object.hp }} HP
          {{ player2Object.class_name || "Player 2" }}:
        </span>
        <strong class="text-xs font-bold text-[#d7ad70] ml-1">
          {{ simulatedDamageP1toP2.toLocaleString() }} ({{ p1DamagePercent }}%)
        </strong>
      </div>

      <!-- Empty above Center Column (Buffs) -->
      <div />

      <!-- Directly above Player 2 -->
      <div class="px-[5%]">
        <span class="text-xs font-semibold text-[#ffedd4]">
          {{ player2Object.class_name || "Player 2" }} vs.
          {{ player1Object.hp }} HP
          {{ player1Object.class_name || "Player 1" }}:
        </span>
        <strong class="text-xs font-bold text-[#d7ad70] ml-1">
          {{ simulatedDamageP2toP1.toLocaleString() }} ({{ p2DamagePercent }}%)
        </strong>
      </div>
    </div>

    <!-- 3-Column Calculator Grid -->
    <div
      class="w-full flex-1 min-h-[500px] border border-[#ffedd4] grid grid-cols-3 divide-x divide-[#ffedd4]"
    >
      <!-- Player 1 Column -->
      <div class="p-[5%]">
        <PlayerPanel
          v-model="player1Object"
          title="Player 1"
          :opponent="player2Object"
        />
      </div>

      <!-- Center Column: Buffs (Showdown Field Card) -->
      <div class="p-[4%] flex flex-col justify-start">
        <BuffPanel
          v-model:active-p1-skills="activeP1Skills"
          v-model:active-p2-skills="activeP2Skills"
          v-model:active-general-buffs="activeGeneralBuffs"
          :player1="player1Object"
          :player2="player2Object"
        />
      </div>

      <!-- Player 2 Column -->
      <div class="p-[5%]">
        <PlayerPanel
          v-model="player2Object"
          title="Player 2"
          :opponent="player1Object"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const CLASS_DAMAGE_TYPES = {
  warrior: "melee",
  ranger: "ranged",
  sorceress: "magic",
  berserker: "melee",
  zerker: "melee",
  tamer: "melee",
  musa: "melee",
  maehwa: "melee",
  valkyrie: "melee",
  valk: "melee",
  kunoichi: "melee",
  kuno: "melee",
  ninja: "melee",
  wizard: "magic",
  wiz: "magic",
  witch: "magic",
  darkknight: "magic",
  dk: "magic",
  striker: "melee",
  mystic: "melee",
  lahn: "melee",
  archer: "ranged",
  shai: "melee",
  guardian: "melee",
  hashashin: "magic",
  hash: "magic",
  nova: "melee",
  sage: "magic",
  corsair: "melee",
  drakania: "melee",
  drak: "melee",
  woosa: "magic",
  maegu: "magic",
  scholar: "melee",
  "do-sa": "melee",
  dosa: "melee",
};

function getDamageType(className) {
  const name = (className || "").toLowerCase().trim();
  for (const [cls, type] of Object.entries(CLASS_DAMAGE_TYPES)) {
    if (name.includes(cls)) return type;
  }
  return "melee";
}

function getRelevantDr(player, attackerDamageType) {
  if (attackerDamageType === "magic") return Number(player.madr) || 0;
  if (attackerDamageType === "ranged") return Number(player.radr) || 0;
  return Number(player.mldr) || 0;
}

const player1Object = ref({
  class_name: "Hashashin",
  spec: "Awakening",

  hp: 10000,

  // AP
  ap: 320,
  aap: 322,
  adventureap: 1050,
  adventureaap: 1060,

  // DR
  mldr: 850,
  radr: 850,
  madr: 850,

  // Accuracy & Evasion
  acc: 1050,
  meev: 750,
  raev: 750,
  maev: 750,

  // Reductions & Modifiers
  bdrp: 5,
  chrp: 0,
  chc: 100,

  abad: 0,
  adad: 0,
  aaad: 0,
});

const player2Object = ref({
  class_name: "Warrior",
  spec: "Awakening",

  hp: 10000,

  // AP
  ap: 320,
  aap: 322,
  adventureap: 1050,
  adventureaap: 1060,

  // DR
  mldr: 850,
  radr: 850,
  madr: 850,

  // Accuracy & Evasion
  acc: 1050,
  meev: 750,
  raev: 750,
  maev: 750,

  // Reductions & Modifiers
  bdrp: 5,
  chrp: 0,
  chc: 100,

  abad: 0,
  adad: 0,
  aaad: 0,
});

const activeP1Skills = ref([]);
const activeP2Skills = ref([]);
const activeGeneralBuffs = ref([]);

const GENERAL_BUFF_VALUES = {
  cron: { ap: 30, dr: 15 },
  church: { ap: 8, dr: 8 },
  villa: { ap: 10, dr: 10 },
  draught: { ap: 35, dr: -15 },
};

const SKILL_BUFF_STATS = {
  5619: { ap: 20, dr: 0 }, // Aal's Grace
  5649: { ap: 20, dr: 0 }, // Crown Kick
  5617: { ap: 0, dr: 0 }, // Flow: Sand Warp
  1764: { ap: 45, dr: 0 }, // Executioner
  1744: { ap: 32, dr: 20 }, // Greatsword Defense
  995: { ap: 0, dr: 20 }, // War Cry III
};

const p1BuffsTotal = computed(() => {
  let ap = 0;
  let dr = 0;
  for (const bId of activeGeneralBuffs.value) {
    if (GENERAL_BUFF_VALUES[bId]) {
      ap += GENERAL_BUFF_VALUES[bId].ap;
      dr += GENERAL_BUFF_VALUES[bId].dr;
    }
  }
  for (const sId of activeP1Skills.value) {
    if (SKILL_BUFF_STATS[sId]) {
      ap += SKILL_BUFF_STATS[sId].ap;
      dr += SKILL_BUFF_STATS[sId].dr;
    }
  }
  return { ap, dr };
});

const p2BuffsTotal = computed(() => {
  let ap = 0;
  let dr = 0;
  for (const bId of activeGeneralBuffs.value) {
    if (GENERAL_BUFF_VALUES[bId]) {
      ap += GENERAL_BUFF_VALUES[bId].ap;
      dr += GENERAL_BUFF_VALUES[bId].dr;
    }
  }
  for (const sId of activeP2Skills.value) {
    if (SKILL_BUFF_STATS[sId]) {
      ap += SKILL_BUFF_STATS[sId].ap;
      dr += SKILL_BUFF_STATS[sId].dr;
    }
  }
  return { ap, dr };
});

const simulatedDamageP1toP2 = computed(() => {
  const ap =
    (Number(player1Object.value.adventureap) || 0) + p1BuffsTotal.value.ap;
  const p1DmgType = getDamageType(player1Object.value.class_name);
  const dr =
    getRelevantDr(player2Object.value, p1DmgType) + p2BuffsTotal.value.dr;
  const raw = Math.max(0, (ap - dr * 0.75) * 4);
  return Math.round(raw);
});

const p1DamagePercent = computed(() => {
  const hp = Number(player2Object.value.hp) || 1;
  return Math.min(100, Math.round((simulatedDamageP1toP2.value / hp) * 100));
});

const simulatedDamageP2toP1 = computed(() => {
  const ap =
    (Number(player2Object.value.adventureap) || 0) + p2BuffsTotal.value.ap;
  const p2DmgType = getDamageType(player2Object.value.class_name);
  const dr =
    getRelevantDr(player1Object.value, p2DmgType) + p1BuffsTotal.value.dr;
  const raw = Math.max(0, (ap - dr * 0.75) * 4);
  return Math.round(raw);
});

const p2DamagePercent = computed(() => {
  const hp = Number(player1Object.value.hp) || 1;
  return Math.min(100, Math.round((simulatedDamageP2toP1.value / hp) * 100));
});

useHead({
  title: "Calculator",
});
</script>
