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
          {{ calculateDamageP1toP2.toLocaleString() }} ({{ p1DamagePercent }}%)
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
          {{ calculateDamageP2toP1.toLocaleString() }} ({{ p2DamagePercent }}%)
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
          :presets="presets"
        />
      </div>

      <!-- Center Column: Buffs (Showdown Field Card) -->
      <div class="p-[4%] flex flex-col justify-start">
        <BuffPanel
          v-model:p1-modifiers="p1Buffs"
          v-model:p2-modifiers="p2Buffs"
          :player1="player1Object"
          :player2="player2Object"
        />

        <ImportExportPanel
          :player1="player1Object"
          :player2="player2Object"
          @add-preset="handleNewPreset"
        />
      </div>

      <!-- Player 2 Column -->
      <div class="p-[5%]">
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

const { data: presets } = await useFetch("/api/v1/presets");

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
});

const p1Buffs = ref({});
const p2Buffs = ref({});

const effectivePlayer1 = computed(() => {
  const p = player1Object.value;
  const b = p1Buffs.value || {};

  return {
    ...p,
    hp: (Number(p.hp) || 0) + (b.max_hp || 0),
    ap: (Number(p.ap) || 0) + (b.all_ap || 0),
    aap: (Number(p.aap) || 0) + (b.all_ap || 0),
    adventureap: (Number(p.adventureap) || 0) + (b.all_ap || 0),
    adventureaap: (Number(p.adventureaap) || 0) + (b.all_ap || 0),
    acc: (Number(p.acc) || 0) + (b.acc || 0),
    mldr: Math.max(0, (Number(p.mldr) || 0) + (b.mldr || 0)),
    radr: Math.max(0, (Number(p.radr) || 0) + (b.radr || 0)),
    madr: Math.max(0, (Number(p.madr) || 0) + (b.madr || 0)),
    meev: Math.max(0, (Number(p.meev) || 0) + (b.meev || 0)),
    raev: Math.max(0, (Number(p.raev) || 0) + (b.raev || 0)),
    maev: Math.max(0, (Number(p.maev) || 0) + (b.maev || 0)),
    chc: (Number(p.chc) || 0) + (b.chc || 0),
    chrp: (Number(p.chrp) || 0) + (b.crit_damage || 0),
    abad: (Number(p.abad) || 0) + (b.abad || 0),
    adad: (Number(p.adad) || 0) + (b.adad || 0),
    aaad: (Number(p.aaad) || 0) + (b.aaad || 0),
  };
});

const effectivePlayer2 = computed(() => {
  const p = player2Object.value;
  const b = p2Buffs.value || {};

  return {
    ...p,
    hp: (Number(p.hp) || 0) + (b.max_hp || 0),
    ap: (Number(p.ap) || 0) + (b.all_ap || 0),
    aap: (Number(p.aap) || 0) + (b.all_ap || 0),
    adventureap: (Number(p.adventureap) || 0) + (b.all_ap || 0),
    adventureaap: (Number(p.adventureaap) || 0) + (b.all_ap || 0),
    acc: (Number(p.acc) || 0) + (b.acc || 0),
    mldr: Math.max(0, (Number(p.mldr) || 0) + (b.mldr || 0)),
    radr: Math.max(0, (Number(p.radr) || 0) + (b.radr || 0)),
    madr: Math.max(0, (Number(p.madr) || 0) + (b.madr || 0)),
    meev: Math.max(0, (Number(p.meev) || 0) + (b.meev || 0)),
    raev: Math.max(0, (Number(p.raev) || 0) + (b.raev || 0)),
    maev: Math.max(0, (Number(p.maev) || 0) + (b.maev || 0)),
    chc: (Number(p.chc) || 0) + (b.chc || 0),
    chrp: (Number(p.chrp) || 0) + (b.crit_damage || 0),
    abad: (Number(p.abad) || 0) + (b.abad || 0),
    adad: (Number(p.adad) || 0) + (b.adad || 0),
    aaad: (Number(p.aaad) || 0) + (b.aaad || 0),
  };
});

updatePlayer(player1Object.value, presets.value[0]);
updatePlayer(player2Object.value, presets.value[0]);

const calculateDamageP1toP2 = computed(() => {
  if (
    !effectivePlayer1.value.combo ||
    effectivePlayer1.value.combo.length === 0
  ) {
    return 0;
  }
  return calculateComboDamage(
    effectivePlayer1.value,
    effectivePlayer2.value,
    effectivePlayer1.value.combo,
  );
});

const p1DamagePercent = computed(() => {
  const hp = Number(effectivePlayer2.value.hp) || 1;
  return Math.min(100, Math.round((calculateDamageP1toP2.value / hp) * 100));
});

const calculateDamageP2toP1 = computed(() => {
  if (
    !effectivePlayer2.value.combo ||
    effectivePlayer2.value.combo.length === 0
  ) {
    return 0;
  }
  return calculateComboDamage(
    effectivePlayer2.value,
    effectivePlayer1.value,
    effectivePlayer2.value.combo,
  );
});

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
