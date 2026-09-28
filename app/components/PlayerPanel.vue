<template>
  <div class="flex flex-col gap-4">
    <h2 v-if="title" class="text-center font-bold text-lg text-[#d7ad70]">
      {{ title }}
    </h2>

    <div class="relative w-full">
      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 bg-[#16161a] border border-[#ffedd4]/30 rounded text-sm text-[#ffedd4] hover:border-[#d7ad70] transition-colors focus:outline-none focus:border-[#d7ad70]"
        @click="searchIsOpen = !searchIsOpen"
      >
        <span class="truncate font-medium text-xs text-[#ffedd4]">
          {{ selectedPresetTitle }}
        </span>

        <span
          class="text-xs text-[#d7ad70] transition-transform duration-200 inline-block"
          :class="{ 'rotate-180': searchIsOpen }"
        >
          ▼
        </span>
      </button>

      <!-- Dropdown -->

      <div
        v-if="searchIsOpen"
        class="absolute left-0 right-0 top-full mt-1.5 bg-[#18181b] border border-[#ffedd4]/20 rounded shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        <!-- Search -->

        <div class="p-2 border-b border-[#ffedd4]/10 bg-[#16161a]">
          <div class="relative flex items-center">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search class or preset..."
              class="w-full bg-[#18181b] border border-[#ffedd4]/30 rounded pl-8 pr-2.5 py-1.5 text-xs text-[#ffedd4] placeholder-[#947f60] focus:outline-none focus:border-[#d7ad70] transition-colors"
            />
            <svg
              class="w-3.5 h-3.5 text-[#6a5b49] absolute left-2.5 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Preset List -->
        <div class="max-h-60 overflow-y-auto">
          <div v-for="group in filterPresets" :key="group.label">
            <span class="px-3 py-1.5 text-[11px] font-bold text-[#d7ad70]">
              {{ group.label }}
            </span>
            <button
              v-for="preset in group.presets"
              :key="preset.id"
              type="button"
              class="w-full text-left pl-6 pr-3 py-1.5 text-xs text-[#ffedd4]/70 hover:bg-[#d7ad70]/15 hover:text-[#d7ad70] transition-colors truncate"
              @click="selectPreset(preset)"
            >
              {{ preset.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <!-- Defense & Health -->
      <div class="pt-2 border-t border-[#ffedd4]/20 flex flex-col gap-2">
        <span
          class="text-xs font-bold text-[#d7ad70]/70 uppercase tracking-wider"
        >
          Defense & Health
        </span>

        <div class="grid grid-cols-2 gap-2">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">HP</span>
            <input
              v-model.number="player.hp"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">
              Bonus DR %
            </span>
            <input
              v-model.number="player.bdrp"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>
        </div>

        <!-- Conditional DR based on opponent's class damage type -->
        <div v-if="opponentDmgType === 'melee'" class="grid grid-cols-2 gap-2">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">Melee DR</span>
            <input
              v-model.number="player.mldr"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border- [#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]"
              >Melee Evasion</span
            >
            <input
              v-model.number="player.meev"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border- [#d7ad70]"
            />
          </label>
        </div>

        <div
          v-else-if="opponentDmgType === 'magic'"
          class="grid grid-cols-2 gap-2"
        >
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">Magic DR</span>
            <input
              v-model.number="player.madr"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border- [#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]"
              >Magic Evasion</span
            >
            <input
              v-model.number="player.maev"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border- [#d7ad70]"
            />
          </label>
        </div>

        <div
          v-else-if="opponentDmgType === 'ranged'"
          class="grid grid-cols-2 gap-2"
        >
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">Ranged DR</span>
            <input
              v-model.number="player.radr"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border- [#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]"
              >Ranged Evasion</span
            >
            <input
              v-model.number="player.raev"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border- [#d7ad70]"
            />
          </label>
        </div>
      </div>

      <!-- Attack -->
      <div class="pt-2 border-t border-[#ffedd4]/20 flex flex-col gap-2">
        <span
          class="text-xs font-bold text-[#d7ad70]/70 uppercase tracking-wider"
        >
          Attack
        </span>

        <div class="grid grid-cols-2 gap-2">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]"> Total AP </span>
            <input
              v-model.number="player.adventureap"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">
              Total AAP
            </span>
            <input
              v-model.number="player.adventureaap"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]"> Sheet AP </span>
            <input
              v-model.number="player.ap"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">
              Sheet AAP
            </span>
            <input
              v-model.number="player.aap"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]"> Accuracy </span>
            <input
              v-model.number="player.acc"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>
        </div>
      </div>

      <!-- Damage Modifiers -->
      <div class="pt-2 border-t border-[#ffedd4]/20 flex flex-col gap-2">
        <span
          class="text-xs font-bold text-[#d7ad70]/70 uppercase tracking-wider"
        >
          Damage Modifiers
        </span>

        <div class="grid grid-cols-2 gap-2">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">
              Critical Rate %
            </span>
            <input
              v-model.number="player.chc"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">
              Critical Damage %
            </span>
            <input
              v-model.number="player.chrp"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">
              Down Attack %
            </span>
            <input
              v-model.number="player.adad"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">
              Back Attack %
            </span>
            <input
              v-model.number="player.abad"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-[#d7ad70]">
              Air Attack %
            </span>
            <input
              v-model.number="player.aaad"
              type="number"
              class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
            />
          </label>
        </div>
      </div>
      <div class="pt-2 border-t border-[#ffedd4]/20 flex flex-col gap-2">
        <ComboPanel
          v-model:combo="player.combo"
          :player="player"
          :opponent="opponent"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

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

const player = defineModel({
  type: Object,
  required: true,
});

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  opponent: {
    type: Object,
    required: true,
  },
  presets: {
    type: Array,
    default: () => [],
  },
});

const searchIsOpen = ref(false);
const searchQuery = ref("");

const opponentDmgType = computed(() => {
  const className = (props.opponent?.class_name || "").toLowerCase().trim();
  for (const [cls, dmgType] of Object.entries(CLASS_DAMAGE_TYPES)) {
    if (className.includes(cls)) {
      return dmgType;
    }
  }
  return "melee";
});

const groupedPresets = computed(() => {
  const output = {};

  for (const preset of props.presets || []) {
    const key = `${preset.class_name} ${preset.spec}`;

    if (!output[key]) {
      output[key] = {
        label: key,
        presets: [],
      };
    }

    output[key].presets.push(preset);
  }

  return Object.values(output);
});

const selectedPresetTitle = computed(() => {
  if (!player.value?.class_name) return "Select a Preset...";

  const classAndSpec =
    `${player.value.class_name} ${player.value.spec || ""}`.trim();

  if (player.value?.name) {
    return `${classAndSpec} (${player.value.name})`;
  }

  return classAndSpec;
});

const filterPresets = computed(() => {
  if (!groupedPresets.value) return [];

  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return groupedPresets.value;

  const terms = query.split(/\s+/).filter(Boolean);

  return groupedPresets.value.filter((preset) => {
    const className = preset.label?.toLowerCase() || "";
    const searchableText = `${className}`;

    return terms.every((term) => searchableText.includes(term));
  });
});

function selectPreset(preset) {
  if (!preset) return;

  for (const key of Object.keys(preset)) {
    if (key in player.value) {
      player.value[key] = preset[key];
    }
  }
  searchIsOpen.value = false;
  searchQuery.value = "";
  player.value.combo = preset.combo || [];
}
</script>
