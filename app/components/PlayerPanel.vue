<template>
  <div class="flex flex-col gap-4">
    <h2 v-if="title" class="text-center font-bold text-lg text-[#d7ad70]">
      {{ title }}
    </h2>

    <div class="flex flex-col gap-3">
      <!-- Character Info -->
      <div class="grid grid-cols-2 gap-2">
        <label class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-[#d7ad70]">Class</span>
          <input
            v-model="player.class_name"
            type="text"
            placeholder="e.g. Hashashin"
            class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
          />
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-[#d7ad70]">Spec</span>
          <select
            v-model="player.spec"
            class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
          >
            <option value="Awakening">Awakening</option>
            <option value="Succession">Succession</option>
          </select>
        </label>
      </div>

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
        <label v-if="opponentDmgType === 'melee'" class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-[#d7ad70]"> Melee DR </span>
          <input
            v-model.number="player.mldr"
            type="number"
            class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
          />
        </label>

        <label
          v-else-if="opponentDmgType === 'magic'"
          class="flex flex-col gap-1"
        >
          <span class="text-xs font-semibold text-[#d7ad70]"> Magic DR </span>
          <input
            v-model.number="player.madr"
            type="number"
            class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
          />
        </label>

        <label
          v-else-if="opponentDmgType === 'ranged'"
          class="flex flex-col gap-1"
        >
          <span class="text-xs font-semibold text-[#d7ad70]"> Ranged DR </span>
          <input
            v-model.number="player.radr"
            type="number"
            class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
          />
        </label>
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
        </div>

        <label class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-[#d7ad70]"> Accuracy </span>
          <input
            v-model.number="player.acc"
            type="number"
            class="bg-[#16161a] border border-[#ffedd4]/30 rounded px-2.5 py-1.5 text-sm text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
          />
        </label>
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
        </div>

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
});

const opponentDmgType = computed(() => {
  const className = (props.opponent?.class_name || "").toLowerCase().trim();
  for (const [cls, dmgType] of Object.entries(CLASS_DAMAGE_TYPES)) {
    if (className.includes(cls)) {
      return dmgType;
    }
  }
  return "melee";
});
</script>
