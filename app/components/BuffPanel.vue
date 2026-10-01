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

      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          :class="[
            'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer select-none',
            isP1ShaiActive
              ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
              : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
          ]"
          @click="isP1ShaiActive = !isP1ShaiActive"
        >
          <span
            :class="[
              'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
              isP1ShaiActive
                ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
                : 'bg-[#292929] border-black/80',
            ]"
          />

          <img
            src="/skills/shai/4624.webp"
            alt="Shout to the Sky III"
            class="w-5 h-5 rounded-sm object-cover shrink-0 bg-black/40 border border-black/50"
          />

          <span class="truncate flex-1 text-left"> Shout to the Sky III </span>
        </button>

        <button
          type="button"
          :class="[
            'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer select-none',
            isP2ShaiActive
              ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
              : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
          ]"
          @click="isP2ShaiActive = !isP2ShaiActive"
        >
          <span
            :class="[
              'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
              isP2ShaiActive
                ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
                : 'bg-[#292929] border-black/80',
            ]"
          />

          <img
            src="/skills/shai/4624.webp"
            alt="Shout to the Sky III"
            class="w-5 h-5 rounded-sm object-cover shrink-0 bg-black/40 border border-black/50"
          />

          <span class="truncate flex-1 text-left"> Shout to the Sky III </span>
        </button>
      </div>
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
        <!-- P1: E-Buff e Z-Buff -->
        <div class="flex flex-col gap-1.5">
          <button
            type="button"
            :class="[
              'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer select-none',
              isP1AbsorptionActive
                ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
                : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
            ]"
            @click="isP1AbsorptionActive = !isP1AbsorptionActive"
          >
            <span
              :class="[
                'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
                isP1AbsorptionActive
                  ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
                  : 'bg-[#292929] border-black/80',
              ]"
            />

            <img
              src="/skills/warrior/3459.webp"
              alt="Rage Absorption"
              class="w-5 h-5 rounded-sm object-cover shrink-0 bg-black/40 border border-black/50"
            />

            <span class="truncate flex-1 text-left"> Rage Absorption </span>
          </button>
          <button
            v-if="p1EBuff"
            type="button"
            :class="[
              'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer select-none',
              isP1EBuffActive
                ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
                : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
            ]"
            @click="isP1EBuffActive = !isP1EBuffActive"
          >
            <span
              :class="[
                'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
                isP1EBuffActive
                  ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
                  : 'bg-[#292929] border-black/80',
              ]"
            />

            <img
              :src="p1EBuff.icon"
              :alt="p1EBuff.name"
              class="w-5 h-5 rounded-sm object-cover shrink-0 bg-black/40 border border-black/50"
            />

            <span class="truncate flex-1 text-left">
              {{ p1EBuff.name }}
            </span>

            <span
              v-if="p1EBuff.buffs?.all_ap"
              class="text-[10px] font-mono shrink-0 px-1 py-0.5 rounded text-[#ffedd4]/60 bg-black/20"
            >
              +{{ p1EBuff.buffs.all_ap }} AP
            </span>
          </button>
        </div>

        <!-- P2: E-Buff and Z-Buff -->
        <div class="flex flex-col gap-1.5">
          <button
            type="button"
            :class="[
              'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer select-none',
              isP2AbsorptionActive
                ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
                : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
            ]"
            @click="isP2AbsorptionActive = !isP2AbsorptionActive"
          >
            <span
              :class="[
                'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
                isP2AbsorptionActive
                  ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
                  : 'bg-[#292929] border-black/80',
              ]"
            />

            <img
              src="/skills/warrior/3459.webp"
              alt="Rage Absorption"
              class="w-5 h-5 rounded-sm object-cover shrink-0 bg-black/40 border border-black/50"
            />

            <span class="truncate flex-1 text-left"> Rage Absorption </span>
          </button>
          <button
            v-if="p2EBuff"
            type="button"
            :class="[
              'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer select-none',
              isP2EBuffActive
                ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
                : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
            ]"
            @click="isP2EBuffActive = !isP2EBuffActive"
          >
            <span
              :class="[
                'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
                isP2EBuffActive
                  ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
                  : 'bg-[#292929] border-black/80',
              ]"
            />

            <img
              :src="p2EBuff.icon"
              :alt="p2EBuff.name"
              class="w-5 h-5 rounded-sm object-cover shrink-0 bg-black/40 border border-black/50"
            />

            <span class="truncate flex-1 text-left">
              {{ p2EBuff.name }}
            </span>

            <span
              v-if="p2EBuff.buffs?.all_ap"
              class="text-[10px] font-mono shrink-0 px-1 py-0.5 rounded text-[#ffedd4]/60 bg-black/20"
            >
              +{{ p2EBuff.buffs.all_ap }} AP
            </span>
          </button>
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
import { ref, computed, watchEffect } from "vue";
import { CLASS_BUFF_SKILLS } from "~~/app/data/classBuffSkills.js";

const props = defineProps({
  player1: {
    type: Object,
    required: true,
  },
  player2: {
    type: Object,
    required: true,
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

const p1EBuff = computed(() => {
  const className = (props.player1?.class_name || "").toLowerCase().trim();
  const spec =
    props.player1?.spec === "Succession" ? "Succession" : "Awakening";
  const classSkills = CLASS_BUFF_SKILLS[className]?.[spec] || [];
  return classSkills[0] || null;
});

const p2EBuff = computed(() => {
  const className = (props.player2?.class_name || "").toLowerCase().trim();
  const spec =
    props.player2?.spec === "Succession" ? "Succession" : "Awakening";
  const classSkills = CLASS_BUFF_SKILLS[className]?.[spec] || [];
  return classSkills[0] || null;
});

const isP1EBuffActive = ref(false);
const isP2EBuffActive = ref(false);
const isP1ShaiActive = ref(false);
const isP2ShaiActive = ref(false);
const isP1AbsorptionActive = ref(false);
const isP2AbsorptionActive = ref(false);

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

function calculateModifiers(
  isShaiActive,
  isAbsorptionActive,
  isEBuffActive,
  eBuff,
  activeAddons,
  opponentAddons,
) {
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

  if (isShaiActive) mods.max_hp += 1500;

  if (isAbsorptionActive) {
    mods.all_ap += 30;
    mods.chc += 30;
  }

  if (isEBuffActive && eBuff?.buffs) {
    if (eBuff.buffs.all_ap) mods.all_ap += eBuff.buffs.all_ap;
    if (eBuff.buffs.crit_damage) mods.crit_damage += eBuff.buffs.crit_damage;
    if (eBuff.buffs.accuracy) mods.acc += eBuff.buffs.accuracy;
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
  p1Modifiers.value = calculateModifiers(
    isP1ShaiActive.value,
    isP1AbsorptionActive.value,
    isP1EBuffActive.value,
    p1EBuff.value,
    activeP1Addons.value,
    activeP2Addons.value,
  );

  p2Modifiers.value = calculateModifiers(
    isP2ShaiActive.value,
    isP2AbsorptionActive.value,
    isP2EBuffActive.value,
    p2EBuff.value,
    activeP2Addons.value,
    activeP1Addons.value,
  );
});
</script>
