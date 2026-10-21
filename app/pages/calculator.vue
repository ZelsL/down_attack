<template>
  <div
    class="min-h-[calc(100vh-4.5rem)] bg-[#222122] p-[5%] flex flex-col gap-3"
  >
    <!-- Outside the card: Showdown Damage lines directly over Player 1 and Player 2 -->
    <div class="w-full max-w-[1600px] mx-auto grid grid-cols-3">
      <!-- Directly above Player 1 -->
      <div class="px-[5%] min-w-0 flex flex-col gap-0.5">
        <div>
          <span class="text-xs font-semibold text-[#ffedd4]">
            {{ player1Object.class_name || "Player 1" }} vs.
            {{ effectivePlayer2.hp }} HP
            {{ player2Object.class_name || "Player 2" }}:
          </span>
          <strong class="text-xs font-bold text-[#d7ad70] ml-1">
            {{ calculateDamageP1toP2.toLocaleString() }} ({{
              p1DamagePercent
            }}%)
          </strong>
        </div>
        <div class="text-[11px] text-[#ffedd4]/75">
          <span>Hitrate: </span>
          <strong class="text-[#d7ad70]">{{ p1HitRate }}%</strong>
          <span class="text-[#ffedd4]/50 ml-1">
            (Effective: {{ p1EffectiveHitRate }}%)
          </span>
        </div>
      </div>

      <!-- Empty above Center Column (Buffs) -->
      <div />

      <!-- Directly above Player 2 -->
      <div class="px-[5%] min-w-0 flex flex-col gap-0.5">
        <div>
          <span class="text-xs font-semibold text-[#ffedd4]">
            {{ player2Object.class_name || "Player 2" }} vs.
            {{ effectivePlayer1.hp }} HP
            {{ player1Object.class_name || "Player 1" }}:
          </span>
          <strong class="text-xs font-bold text-[#d7ad70] ml-1">
            {{ calculateDamageP2toP1.toLocaleString() }} ({{
              p2DamagePercent
            }}%)
          </strong>
        </div>
        <div class="text-[11px] text-[#ffedd4]/75">
          <span>Hitrate: </span>
          <strong class="text-[#d7ad70]">{{ p2HitRate }}%</strong>
          <span class="text-[#ffedd4]/50 ml-1">
            (Effective: {{ p2EffectiveHitRate }}%)
          </span>
        </div>
      </div>
    </div>

    <!-- 3-Column Calculator Grid -->
    <div
      class="w-full max-w-[1600px] mx-auto flex-1 min-h-[500px] border border-[#ffedd4] grid grid-cols-3 divide-x divide-[#ffedd4]"
    >
      <!-- Player 1 Column -->
      <div class="p-[5%] min-w-0">
        <PlayerPanel
          v-model="player1Object"
          title="Player 1"
          :opponent="player2Object"
          :presets="presets"
        />
      </div>

      <!-- Center Column: Buffs (Showdown Field Card) -->
      <div class="p-[4%] min-w-0 flex flex-col justify-start">
        <BuffPanel
          v-model:p1-modifiers="p1Buffs"
          v-model:p2-modifiers="p2Buffs"
          v-model:p1-effects="p1Effects"
          v-model:p2-effects="p2Effects"
          :player1="player1Object"
          :player2="player2Object"
          :party-skills="partySkills"
        />

        <ImportExportPanel
          :player1="player1Object"
          :player2="player2Object"
          @add-preset="handleNewPreset"
        />
      </div>

      <!-- Player 2 Column -->
      <div class="p-[5%] min-w-0">
        <PlayerPanel
          v-model="player2Object"
          title="Player 2"
          :opponent="player1Object"
          :presets="presets"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const route = useRoute();

const { data: presets } = await useFetch("/api/v1/presets");

// Skills tagged as individual buffs (e_buff / z_buff) are not party buffs,
// even if they also carry the `party_buff` tag.
const { data: partySkills } = await useFetch("/api/v1/skills", {
  query: { tag: "party_buff" },
  default: () => [],
  transform: (skills) =>
    skills.filter(
      (skill) => !skill.tags?.some((t) => t === "z_buff" || t === "e_buff"),
    ),
});

// const CLASS_DAMAGE_TYPES = {
//   warrior: "melee",
//   ranger: "ranged",
//   sorceress: "magic",
//   berserker: "melee",
//   zerker: "melee",
//   tamer: "melee",
//   musa: "melee",
//   maehwa: "melee",
//   valkyrie: "melee",
//   valk: "melee",
//   kunoichi: "melee",
//   kuno: "melee",
//   ninja: "melee",
//   wizard: "magic",
//   wiz: "magic",
//   witch: "magic",
//   darkknight: "magic",
//   dk: "magic",
//   striker: "melee",
//   mystic: "melee",
//   lahn: "melee",
//   archer: "ranged",
//   shai: "melee",
//   guardian: "melee",
//   hashashin: "magic",
//   hash: "magic",
//   nova: "melee",
//   sage: "magic",
//   corsair: "melee",
//   drakania: "melee",
//   drak: "melee",
//   woosa: "magic",
//   maegu: "magic",
//   scholar: "melee",
//   "do-sa": "melee",
//   dosa: "melee",
// };

const player1Object = ref({
  name: "",
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
  combo: [],
  combos: [],
  availableCombos: [],
});

const player2Object = ref({
  name: "",
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
  combo: [],
  combos: [],
  availableCombos: [],
});

// Fixed modifiers (pre-buff addons, Rage Absorption...)
const p1Buffs = ref({});
const p2Buffs = ref({});

// Active skill effects (party, class and combo skills). Combo effects only
// apply from the skill that used them onward, see `calculateComboDamage`.
const p1Effects = ref([]);
const p2Effects = ref([]);

// Attacker/defender stats at the start of the combo (before any combo skill).
const p1Matchup = computed(() => buildMatchup(1, -1));
const p2Matchup = computed(() => buildMatchup(2, -1));

// Stats used for the header (HP) of each player, including all its effects.
const effectivePlayer1 = computed(() => p2Matchup.value.defender);
const effectivePlayer2 = computed(() => p1Matchup.value.defender);

function buildMatchup(attackerNumber, index) {
  const isFirst = attackerNumber === 1;
  const attackerObject = isFirst ? player1Object.value : player2Object.value;
  const defenderObject = isFirst ? player2Object.value : player1Object.value;
  const attackerBuffs = isFirst ? p1Buffs.value : p2Buffs.value;
  const defenderBuffs = isFirst ? p2Buffs.value : p1Buffs.value;
  const attackerEffects = isFirst ? p1Effects.value : p2Effects.value;
  const defenderEffects = isFirst ? p2Effects.value : p1Effects.value;

  const matchup = resolveMatchup(
    attackerEffects,
    defenderEffects,
    attackerObject.combo,
    index,
  );

  return {
    attacker: applyModifiers(
      attackerObject,
      sumMods(attackerBuffs, matchup.attackerMods),
    ),
    defender: applyModifiers(
      defenderObject,
      sumMods(defenderBuffs, matchup.defenderMods),
    ),
  };
}

function calculateDamage(attackerNumber) {
  const isFirst = attackerNumber === 1;
  const attackerObject = isFirst ? player1Object.value : player2Object.value;
  const defenderObject = isFirst ? player2Object.value : player1Object.value;

  if (!attackerObject.combo || attackerObject.combo.length === 0) {
    return 0;
  }

  return calculateComboDamage(
    attackerObject,
    defenderObject,
    attackerObject.combo,
    {
      attackerMods: isFirst ? p1Buffs.value : p2Buffs.value,
      defenderMods: isFirst ? p2Buffs.value : p1Buffs.value,
      attackerEffects: isFirst ? p1Effects.value : p2Effects.value,
      defenderEffects: isFirst ? p2Effects.value : p1Effects.value,
    },
  );
}

const p1Preset = route.query.p1
  ? presets.value?.find((p) => p.id === route.query.p1)
  : presets.value?.[0];
const p2Preset = route.query.p2
  ? presets.value?.find((p) => p.id === route.query.p2)
  : presets.value?.[0];

updatePlayer(player1Object.value, p1Preset);
updatePlayer(player2Object.value, p2Preset);

const p1HitRateRaw = computed(() => {
  const calc = new PvpCalculator({
    attacker: p1Matchup.value.attacker,
    defender: p1Matchup.value.defender,
  });
  return calc.calculateHitRate();
});

const p1HitRate = computed(() => (p1HitRateRaw.value * 100).toFixed(1));

const p1EffectiveHitRate = computed(() => {
  const h = p1HitRateRaw.value;
  return ((2 * h - h * h) * 100).toFixed(1);
});

const p2HitRateRaw = computed(() => {
  const calc = new PvpCalculator({
    attacker: p2Matchup.value.attacker,
    defender: p2Matchup.value.defender,
  });
  return calc.calculateHitRate();
});

const p2HitRate = computed(() => (p2HitRateRaw.value * 100).toFixed(1));

const p2EffectiveHitRate = computed(() => {
  const h = p2HitRateRaw.value;
  return ((2 * h - h * h) * 100).toFixed(1);
});

const calculateDamageP1toP2 = computed(() => calculateDamage(1));

const p1DamagePercent = computed(() => {
  const hp = Number(effectivePlayer2.value.hp) || 1;
  return Math.min(100, Math.round((calculateDamageP1toP2.value / hp) * 100));
});

const calculateDamageP2toP1 = computed(() => calculateDamage(2));

const p2DamagePercent = computed(() => {
  const hp = Number(effectivePlayer1.value.hp) || 1;
  return Math.min(100, Math.round((calculateDamageP2toP1.value / hp) * 100));
});

function updatePlayer(player, preset) {
  if (!player || !preset) return;

  const presetKeys = Object.keys(preset);

  for (const key of presetKeys) {
    if (key in player) {
      player[key] = preset[key];
    }
  }
}
function saveToLocal() {
  localStorage.setItem(
    "downattack:calculator-draf",
    JSON.stringify({
      player1Object: player1Object.value,
      player2Object: player2Object.value,
    }),
  );
}

function saveCustomPresetToLocal(preset) {
  try {
    const raw = localStorage.getItem("downattack:custom-presets");
    const customList = raw ? JSON.parse(raw) : [];
    customList.push(preset);
    localStorage.setItem(
      "downattack:custom-presets",
      JSON.stringify(customList),
    );
  } catch (error) {
    console.error("Failed to save custom preset to localStorage:", error);
  }
}

function loadLocal() {
  const calculatorDraf = localStorage.getItem("downattack:calculator-draf");
  if (calculatorDraf) {
    try {
      const parsedData = JSON.parse(calculatorDraf);
      if (parsedData.player1Object)
        player1Object.value = parsedData.player1Object;
      if (parsedData.player2Object)
        player2Object.value = parsedData.player2Object;
    } catch (error) {
      console.error("Failed to load draft from localStorage:", error);
    }
  }

  try {
    const rawCustom = localStorage.getItem("downattack:custom-presets");
    if (rawCustom) {
      const storedPresets = JSON.parse(rawCustom);
      if (Array.isArray(storedPresets) && storedPresets.length > 0) {
        // Evita duplicar se já existir por ID
        const existingIds = new Set((presets.value || []).map((p) => p.id));
        const newOnes = storedPresets.filter((p) => !existingIds.has(p.id));

        presets.value = [...(presets.value || []), ...newOnes];
      }
    }
  } catch (error) {
    console.error("Failed to load custom presets from localStorage:", error);
  }
}

function handleNewPreset(newBuild) {
  if (!newBuild) return;

  const presetToAdd = {
    ...newBuild,
    id: newBuild.id || crypto.randomUUID(),
  };

  presets.value = [...(presets.value || []), presetToAdd];

  saveCustomPresetToLocal(presetToAdd);
}

onMounted(() => {
  loadLocal();

  window.addEventListener("beforeunload", saveToLocal);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", saveToLocal);

  saveToLocal();
});

useHead({
  title: "Calculator",
});
</script>
