<template>
  <div
    class="min-h-[calc(100vh-4.5rem)] bg-[#222122] p-[5%] flex flex-col gap-3"
  >
    <!-- Result UI: Dual Result Focused Card (4 combos in 4 buttons per player) -->
    <div
      class="w-full max-w-[1600px] mx-auto border border-[#ffedd4] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#ffedd4]"
    >
      <!-- Left Column: Player 1 -->
      <div class="p-[2.5%] min-w-0 flex flex-col gap-2.5">
        <!-- Player 1 Header & Stats -->
        <div class="pb-2 border-b border-[#ffedd4]/20">
          <div class="flex items-baseline justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
              <span
                class="text-xs font-bold tracking-wide text-[#ffedd4] uppercase truncate"
              >
                {{ player1Object.class_name || "Player 1" }}
              </span>
              <span
                class="font-mono text-[10px] text-[#d7ad70] border border-[#ffedd4]/30 px-1.5 py-0.5 rounded-[2px] bg-[#16161a] shrink-0"
              >
                {{ formatSpecBadge(player1Object.spec) }}
              </span>
            </div>
            <span class="text-[11px] font-mono text-[#ffedd4]/60 shrink-0">
              AP
              <span class="text-[#ffedd4] font-semibold">
                {{ getDisplaySheetAp(effectivePlayer1) }}
              </span>
              | Acc
              <span class="text-[#ffedd4] font-semibold">
                {{ effectivePlayer1.acc }}
              </span>
            </span>
          </div>
          <div
            class="flex items-center justify-between mt-1 text-[11px] font-mono text-[#ffedd4]/60"
          >
            <span>
              HP:
              <span class="text-[#ffedd4] font-semibold">
                {{ (Number(effectivePlayer1.hp) || 0).toLocaleString() }}
              </span>
            </span>
            <span>
              Hitrate:
              <span class="text-[#d7ad70] font-semibold">
                {{ p1HitRate }}%
              </span>
              <span class="text-[#ffedd4]/40 text-[10px] ml-0.5">
                ({{ p1EffectiveHitRate }}%)
              </span>
            </span>
          </div>
        </div>

        <!-- Combos List Header -->
        <div
          class="flex justify-between items-center text-[10px] text-[#d7ad70]/70 font-bold tracking-wider uppercase font-mono px-0.5"
        >
          <span>Combos</span>
          <span>Est. Dmg</span>
        </div>

        <!-- 4 Combo Buttons -->
        <div class="flex flex-col gap-1.5">
          <div
            v-for="(slot, idx) in p1ComboSlots"
            :key="slot.id || idx"
            class="flex items-center gap-2"
          >
            <button
              type="button"
              :disabled="slot.isEmpty"
              class="flex-1 text-left px-2.5 py-1.5 rounded-sm border text-[11px] transition-all min-w-0"
              :class="[
                slot.isSelected
                  ? 'bg-[#4f433c] border-[#857062] text-[#d2b996] font-semibold cursor-pointer'
                  : slot.isEmpty
                    ? 'bg-[#16161a]/50 border-[#ffedd4]/15 text-[#ffedd4]/30 cursor-default'
                    : 'bg-[#16161a] border-[#ffedd4]/30 text-[#ffedd4] hover:border-[#d7ad70] cursor-pointer',
              ]"
              @click="selectPlayerComboSlot(1, idx)"
            >
              <span class="truncate block">
                {{ idx + 1 }}. {{ slot.label }}
              </span>
            </button>
            <span
              class="font-mono text-[11px] w-16 text-right shrink-0"
              :class="
                slot.isSelected
                  ? 'text-[#d7ad70] font-bold'
                  : slot.damage > 0
                    ? 'text-[#ffedd4]/80'
                    : 'text-[#ffedd4]/35'
              "
            >
              {{ slot.percent }}%
            </span>
          </div>
        </div>

        <!-- Player 1 Output Box -->
        <div class="mt-auto pt-1">
          <div
            class="bg-[#16161a] border border-[#ffedd4]/30 p-2.5 rounded flex flex-col gap-1"
          >
            <div
              class="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider border-b border-[#ffedd4]/20 pb-1"
            >
              <span class="text-[#d7ad70] font-bold">
                Attack Output vs {{ player2Object.class_name || "Player 2" }}
              </span>
              <span class="text-[#ffedd4]/50">
                {{ p1ActiveResult.ttkLabel }}
              </span>
            </div>
            <div class="text-[11px] font-mono text-[#ffedd4]/60 truncate">
              Selected:
              <span class="text-[#ffedd4] font-medium">
                {{ p1ActiveResult.label }}
              </span>
            </div>
            <div class="flex items-baseline justify-between font-mono pt-0.5">
              <span class="text-xs text-[#ffedd4] font-bold tracking-tight">
                {{ Math.round(p1ActiveResult.damage).toLocaleString() }} HP
              </span>
              <span class="text-xs text-[#d7ad70] font-bold">
                {{ p1ActiveResult.percent }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Player 2 -->
      <div class="p-[2.5%] min-w-0 flex flex-col gap-2.5">
        <!-- Player 2 Header & Stats -->
        <div class="pb-2 border-b border-[#ffedd4]/20">
          <div class="flex items-baseline justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
              <span
                class="text-xs font-bold tracking-wide text-[#ffedd4] uppercase truncate"
              >
                {{ player2Object.class_name || "Player 2" }}
              </span>
              <span
                class="font-mono text-[10px] text-[#d7ad70] border border-[#ffedd4]/30 px-1.5 py-0.5 rounded-[2px] bg-[#16161a] shrink-0"
              >
                {{ formatSpecBadge(player2Object.spec) }}
              </span>
            </div>
            <span class="text-[11px] font-mono text-[#ffedd4]/60 shrink-0">
              AP
              <span class="text-[#ffedd4] font-semibold">
                {{ getDisplaySheetAp(effectivePlayer2) }}
              </span>
              | Acc
              <span class="text-[#ffedd4] font-semibold">
                {{ effectivePlayer2.acc }}
              </span>
            </span>
          </div>
          <div
            class="flex items-center justify-between mt-1 text-[11px] font-mono text-[#ffedd4]/60"
          >
            <span>
              HP:
              <span class="text-[#ffedd4] font-semibold">
                {{ (Number(effectivePlayer2.hp) || 0).toLocaleString() }}
              </span>
            </span>
            <span>
              Hitrate:
              <span class="text-[#d7ad70] font-semibold">
                {{ p2HitRate }}%
              </span>
              <span class="text-[#ffedd4]/40 text-[10px] ml-0.5">
                ({{ p2EffectiveHitRate }}%)
              </span>
            </span>
          </div>
        </div>

        <!-- Combos List Header -->
        <div
          class="flex justify-between items-center text-[10px] text-[#d7ad70]/70 font-bold tracking-wider uppercase font-mono px-0.5"
        >
          <span>Combos</span>
          <span>Est. Dmg</span>
        </div>

        <!-- 4 Combo Buttons -->
        <div class="flex flex-col gap-1.5">
          <div
            v-for="(slot, idx) in p2ComboSlots"
            :key="slot.id || idx"
            class="flex items-center gap-2"
          >
            <button
              type="button"
              :disabled="slot.isEmpty"
              class="flex-1 text-left px-2.5 py-1.5 rounded-sm border text-[11px] transition-all min-w-0"
              :class="[
                slot.isSelected
                  ? 'bg-[#4f433c] border-[#857062] text-[#d2b996] font-semibold cursor-pointer'
                  : slot.isEmpty
                    ? 'bg-[#16161a]/50 border-[#ffedd4]/15 text-[#ffedd4]/30 cursor-default'
                    : 'bg-[#16161a] border-[#ffedd4]/30 text-[#ffedd4] hover:border-[#d7ad70] cursor-pointer',
              ]"
              @click="selectPlayerComboSlot(2, idx)"
            >
              <span class="truncate block">
                {{ idx + 1 }}. {{ slot.label }}
              </span>
            </button>
            <span
              class="font-mono text-[11px] w-16 text-right shrink-0"
              :class="
                slot.isSelected
                  ? 'text-[#d7ad70] font-bold'
                  : slot.damage > 0
                    ? 'text-[#ffedd4]/80'
                    : 'text-[#ffedd4]/35'
              "
            >
              {{ slot.percent }}%
            </span>
          </div>
        </div>

        <!-- Player 2 Output Box -->
        <div class="mt-auto pt-1">
          <div
            class="bg-[#16161a] border border-[#ffedd4]/30 p-2.5 rounded flex flex-col gap-1"
          >
            <div
              class="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider border-b border-[#ffedd4]/20 pb-1"
            >
              <span class="text-[#d7ad70] font-bold">
                Attack Output vs {{ player1Object.class_name || "Player 1" }}
              </span>
              <span class="text-[#ffedd4]/50">
                {{ p2ActiveResult.ttkLabel }}
              </span>
            </div>
            <div class="text-[11px] font-mono text-[#ffedd4]/60 truncate">
              Selected:
              <span class="text-[#ffedd4] font-medium">
                {{ p2ActiveResult.label }}
              </span>
            </div>
            <div class="flex items-baseline justify-between font-mono pt-0.5">
              <span class="text-xs text-[#ffedd4] font-bold tracking-tight">
                {{ Math.round(p2ActiveResult.damage).toLocaleString() }} HP
              </span>
              <span class="text-xs text-[#d7ad70] font-bold">
                {{ p2ActiveResult.percent }}%
              </span>
            </div>
          </div>
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
import {
  PvpCalculator,
  calculateComboDamage,
} from "~~/app/utils/PvpCalculator.js";
import {
  applyModifiers,
  collectSkillEffects,
  resolveMatchup,
  sumMods,
} from "~~/app/utils/skillEffects.js";

const route = useRoute();

const { data: presets } = await useFetch("/api/v1/presets");

// Skills tagged as individual buffs (e_buff / z_buff) are not party buffs,
// even if they also carry the `party_buff` tag.
const { data: partySkills, refresh: refreshPartySkills } = await useFetch(
  "/api/v1/skills",
  {
    query: { tag: "party_buff" },
    default: () => [],
    transform: (skills) =>
      skills.filter(
        (skill) => !skill.tags?.some((t) => t === "z_buff" || t === "e_buff"),
      ),
  },
);

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
  selectedComboId: null,
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
  selectedComboId: null,
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

function calculateDamageForSkills(attackerNumber, skills) {
  const isFirst = attackerNumber === 1;
  const attackerObject = isFirst ? player1Object.value : player2Object.value;
  const defenderObject = isFirst ? player2Object.value : player1Object.value;

  if (!skills || skills.length === 0) {
    return 0;
  }

  const baseEffects = isFirst ? p1Effects.value : p2Effects.value;
  const nonComboEffects = baseEffects.filter((e) => e.source !== "combo");
  const comboEffects = collectSkillEffects(skills, "combo");
  const attackerEffects = [
    ...nonComboEffects,
    ...comboEffects.filter(
      (ce) => !nonComboEffects.some((ne) => ne.id === ce.id),
    ),
  ];

  return calculateComboDamage(attackerObject, defenderObject, skills, {
    attackerMods: isFirst ? p1Buffs.value : p2Buffs.value,
    defenderMods: isFirst ? p2Buffs.value : p1Buffs.value,
    attackerEffects,
    defenderEffects: isFirst ? p2Effects.value : p1Effects.value,
  });
}

function formatSpecBadge(spec) {
  const s = (spec || "Awakening").toLowerCase();
  if (s.includes("succ")) return "Succ";
  if (s.includes("asc")) return "Asc";
  return "Awak";
}

function getDisplaySheetAp(player) {
  const s = (player?.spec || "Awakening").toLowerCase();
  return s.includes("awak") ? player?.aap || 0 : player?.ap || 0;
}

function getComboEntries(player) {
  const available = Array.isArray(player?.availableCombos)
    ? player.availableCombos
    : [];
  const activeSkills = Array.isArray(player?.combo) ? player.combo : [];
  const selectedId = player?.selectedComboId;

  if (available.length > 0) {
    if (!selectedId && activeSkills.length > 0) {
      return [
        {
          id: "unsaved-current",
          name: "New Combo",
          skills: activeSkills,
          isCurrentUnsaved: true,
        },
        ...available.slice(0, 3),
      ];
    }

    const topFour = available.slice(0, 4);
    if (selectedId && !topFour.some((c) => c.id === selectedId)) {
      const selectedEntry = available.find((c) => c.id === selectedId);
      if (selectedEntry) {
        return [...available.slice(0, 3), selectedEntry];
      }
    }

    return topFour;
  }

  if (activeSkills.length > 0) {
    return [
      {
        id: "unsaved-current",
        name: "New Combo",
        skills: activeSkills,
        isCurrentUnsaved: true,
      },
    ];
  }

  return [];
}

function buildComboSlots(attackerNumber) {
  const isFirst = attackerNumber === 1;
  const attacker = isFirst ? player1Object.value : player2Object.value;
  const defenderHp =
    Number(isFirst ? effectivePlayer2.value.hp : effectivePlayer1.value.hp) ||
    1;
  const entries = getComboEntries(attacker);
  const activeSkills = Array.isArray(attacker.combo) ? attacker.combo : [];
  const selectedId = attacker.selectedComboId;

  let selectedIdx = -1;
  if (selectedId) {
    selectedIdx = entries.findIndex((e) => e.id === selectedId);
  } else if (activeSkills.length > 0) {
    selectedIdx = entries.findIndex((e) => e.id === "unsaved-current");
  }

  return Array.from({ length: 4 }, (_, idx) => {
    const entry = entries[idx];
    if (!entry) {
      return {
        id: `empty-${idx}`,
        label: "Empty Slot",
        skills: [],
        damage: 0,
        percent: "0.0",
        ttkLabel: "N/A",
        isEmpty: true,
        isSelected: false,
      };
    }

    const skills = entry.skills || [];
    const isCurrentSelected = idx === selectedIdx;
    const damage = isCurrentSelected
      ? calculateComboDamage(
          attacker,
          isFirst ? player2Object.value : player1Object.value,
          skills,
          {
            attackerMods: isFirst ? p1Buffs.value : p2Buffs.value,
            defenderMods: isFirst ? p2Buffs.value : p1Buffs.value,
            attackerEffects: isFirst ? p1Effects.value : p2Effects.value,
            defenderEffects: isFirst ? p2Effects.value : p1Effects.value,
          },
        )
      : calculateDamageForSkills(attackerNumber, skills);

    const rawPct = (damage / defenderHp) * 100;
    const percent = damage > 0 ? Math.min(100, rawPct).toFixed(1) : "0.0";
    const ttk = damage > 0 ? Math.ceil(defenderHp / damage) : 0;
    const ttkLabel =
      ttk <= 0
        ? "N/A (0 Dmg)"
        : ttk === 1
          ? "1 Combo to Kill"
          : `${ttk} Combos to Kill`;

    const defaultLabel =
      skills.length > 0
        ? skills.map((s) => s.name).join(" → ")
        : `Combo #${idx + 1}`;

    return {
      id: entry.id || `combo-${idx}`,
      label: entry.name || defaultLabel,
      skills,
      damage,
      percent,
      ttkLabel,
      isEmpty: false,
      isSelected: isCurrentSelected,
    };
  });
}

const p1ComboSlots = computed(() => buildComboSlots(1));
const p2ComboSlots = computed(() => buildComboSlots(2));

const p1ActiveResult = computed(
  () =>
    p1ComboSlots.value.find((s) => s.isSelected) || {
      label: "None",
      damage: 0,
      percent: "0.0",
      ttkLabel: "N/A (0 Dmg)",
    },
);

const p2ActiveResult = computed(
  () =>
    p2ComboSlots.value.find((s) => s.isSelected) || {
      label: "None",
      damage: 0,
      percent: "0.0",
      ttkLabel: "N/A (0 Dmg)",
    },
);

function selectPlayerComboSlot(playerNumber, index) {
  const isFirst = playerNumber === 1;
  const slots = isFirst ? p1ComboSlots.value : p2ComboSlots.value;
  const slot = slots[index];
  if (!slot || slot.isEmpty) return;

  if (isFirst) {
    player1Object.value.selectedComboId =
      slot.id === "unsaved-current" ? null : slot.id;
  } else {
    player2Object.value.selectedComboId =
      slot.id === "unsaved-current" ? null : slot.id;
  }
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
      if (parsedData.player1Object) {
        Object.assign(player1Object.value, parsedData.player1Object);
      }
      if (parsedData.player2Object) {
        Object.assign(player2Object.value, parsedData.player2Object);
      }
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

onBeforeMount(() => {
  loadLocal();
});

onMounted(() => {
  refreshPartySkills();

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
