<template>
  <!-- Showdown "Field" Card Container -->
  <div
    class="relative w-full h-full border border-white/20 rounded-md p-3.5 bg-[#18181b] flex flex-col justify-between shadow-lg"
  >
    <!-- Top Center Title on the Border -->
    <div
      class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#222122] px-3 flex items-center justify-center pointer-events-none"
    >
      <span
        class="text-xs font-bold text-[#d7ad70] uppercase tracking-wider select-none"
      >
        Buffs
      </span>
    </div>

    <!-- Card Body -->
    <div class="flex flex-col gap-3">
      <!-- Top Section: General Field / Consumables Buffs -->
      <div class="flex flex-col items-center gap-1.5 pt-1">
        <!-- Quick Actions -->
        <div class="flex items-center justify-center gap-1.5 w-full">
          <button
            type="button"
            class="px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all border border-[#4b515c] bg-gradient-to-b from-[#383d46] to-[#25282e] hover:from-[#434852] hover:to-[#2b2f36] text-[#e5e7eb] shadow-sm active:scale-95"
            @click="activateAllBuffs"
          >
            All Active
          </button>
          <button
            type="button"
            class="px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all border border-[#4b515c] bg-gradient-to-b from-[#383d46] to-[#25282e] hover:from-[#434852] hover:to-[#2b2f36] text-[#e5e7eb] shadow-sm active:scale-95"
            @click="clearAllBuffs"
          >
            Clear All
          </button>
        </div>

        <!-- Global Consumables (Food, Draught, Church, Villa) -->
        <div class="grid grid-cols-2 gap-1.5 w-full">
          <button
            v-for="buff in generalBuffsList"
            :key="buff.id"
            type="button"
            :title="buff.tooltip"
            :class="[
              'px-2 py-1 rounded text-xs font-medium transition-all duration-150 border flex items-center justify-between gap-1 shadow-sm select-none',
              isGeneralBuffActive(buff.id)
                ? 'bg-[#0c0d10] border-[#d7ad70] text-[#d7ad70] shadow-[0_0_8px_rgba(215,173,112,0.35)] ring-1 ring-[#d7ad70]/40'
                : 'bg-gradient-to-b from-[#383d46] to-[#25282e] hover:from-[#434852] hover:to-[#2b2f36] border-[#4b515c] text-[#e5e7eb]',
            ]"
            @click="toggleGeneralBuff(buff.id)"
          >
            <span class="truncate text-[11px] font-semibold">{{
              buff.name
            }}</span>
            <span
              class="text-[10px] font-mono shrink-0 px-1 py-0.2 rounded"
              :class="
                isGeneralBuffActive(buff.id)
                  ? 'bg-[#d7ad70]/20 text-[#d7ad70]'
                  : 'bg-black/40 text-[#ffedd4]/70'
              "
            >
              {{ buff.badge }}
            </span>
          </button>
        </div>
      </div>

      <!-- Divider line -->
      <div class="h-[1px] bg-white/15 w-full" />

      <!-- Symmetrical Columns for Player 1 and Player 2 Self Buffs -->
      <div class="grid grid-cols-2 gap-3 items-start">
        <!-- Player 1 Side -->
        <div class="flex flex-col gap-2">
          <!-- Player Header -->
          <div class="flex items-center justify-between px-0.5">
            <span
              class="text-[11px] font-bold text-[#d7ad70] uppercase tracking-wider truncate"
            >
              {{ player1?.class_name || "Player 1" }}
            </span>
            <span
              v-if="p1SkillTotalsSummary"
              class="text-[10px] font-mono text-[#d7ad70]/90 bg-[#d7ad70]/10 px-1.5 py-0.5 rounded border border-[#d7ad70]/20"
            >
              {{ p1SkillTotalsSummary }}
            </span>
          </div>

          <!-- Player 1 Skill Buttons -->
          <div class="flex flex-col gap-1.5">
            <button
              v-for="skill in p1Skills"
              :key="skill.id"
              type="button"
              :title="getSkillTooltip(skill)"
              :class="[
                'w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-all duration-150 border select-none',
                isP1SkillActive(skill.id)
                  ? 'bg-[#0c0d10] border-[#d7ad70] text-[#d7ad70] shadow-[0_0_8px_rgba(215,173,112,0.35)] ring-1 ring-[#d7ad70]/40'
                  : 'bg-gradient-to-b from-[#383d46] to-[#25282e] hover:from-[#434852] hover:to-[#2b2f36] border-[#4b515c] text-[#e5e7eb]',
              ]"
              @click="toggleP1Skill(skill.id)"
            >
              <div class="flex items-center gap-1.5 min-w-0 overflow-hidden">
                <img
                  :src="skill.icon"
                  :alt="skill.name"
                  class="w-5 h-5 rounded object-cover flex-shrink-0 bg-black/40"
                />
                <span class="truncate font-semibold text-[11px] text-left">
                  {{ skill.name }}
                </span>
              </div>
              <span
                class="text-[10px] font-mono shrink-0 px-1 py-0.5 rounded"
                :class="
                  isP1SkillActive(skill.id)
                    ? 'bg-[#d7ad70]/20 text-[#d7ad70]'
                    : 'bg-black/40 text-[#ffedd4]/70'
                "
              >
                {{ formatBuffBadge(skill.buffs) }}
              </span>
            </button>
          </div>

          <!-- Bottom Button: Clear P1 -->
          <button
            type="button"
            class="mt-1 w-full py-0.5 rounded text-[10px] font-medium border border-[#4b515c]/60 bg-black/20 hover:bg-black/40 text-[#ffedd4]/60 hover:text-[#ffedd4] transition-colors"
            @click="clearP1Skills"
          >
            Clear
          </button>
        </div>

        <!-- Player 2 Side -->
        <div class="flex flex-col gap-2">
          <!-- Player Header -->
          <div class="flex items-center justify-between px-0.5">
            <span
              class="text-[11px] font-bold text-[#d7ad70] uppercase tracking-wider truncate"
            >
              {{ player2?.class_name || "Player 2" }}
            </span>
            <span
              v-if="p2SkillTotalsSummary"
              class="text-[10px] font-mono text-[#d7ad70]/90 bg-[#d7ad70]/10 px-1.5 py-0.5 rounded border border-[#d7ad70]/20"
            >
              {{ p2SkillTotalsSummary }}
            </span>
          </div>

          <!-- Player 2 Skill Buttons -->
          <div class="flex flex-col gap-1.5">
            <button
              v-for="skill in p2Skills"
              :key="skill.id"
              type="button"
              :title="getSkillTooltip(skill)"
              :class="[
                'w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-all duration-150 border select-none',
                isP2SkillActive(skill.id)
                  ? 'bg-[#0c0d10] border-[#d7ad70] text-[#d7ad70] shadow-[0_0_8px_rgba(215,173,112,0.35)] ring-1 ring-[#d7ad70]/40'
                  : 'bg-gradient-to-b from-[#383d46] to-[#25282e] hover:from-[#434852] hover:to-[#2b2f36] border-[#4b515c] text-[#e5e7eb]',
              ]"
              @click="toggleP2Skill(skill.id)"
            >
              <div class="flex items-center gap-1.5 min-w-0 overflow-hidden">
                <img
                  :src="skill.icon"
                  :alt="skill.name"
                  class="w-5 h-5 rounded object-cover flex-shrink-0 bg-black/40"
                />
                <span class="truncate font-semibold text-[11px] text-left">
                  {{ skill.name }}
                </span>
              </div>
              <span
                class="text-[10px] font-mono shrink-0 px-1 py-0.5 rounded"
                :class="
                  isP2SkillActive(skill.id)
                    ? 'bg-[#d7ad70]/20 text-[#d7ad70]'
                    : 'bg-black/40 text-[#ffedd4]/70'
                "
              >
                {{ formatBuffBadge(skill.buffs) }}
              </span>
            </button>
          </div>

          <!-- Bottom Button: Clear P2 -->
          <button
            type="button"
            class="mt-1 w-full py-0.5 rounded text-[10px] font-medium border border-[#4b515c]/60 bg-black/20 hover:bg-black/40 text-[#ffedd4]/60 hover:text-[#ffedd4] transition-colors"
            @click="clearP2Skills"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Card Footer / Bottom helper note -->
    <div class="pt-2 mt-auto">
      <p class="text-[10px] text-center text-[#ffedd4]/40 italic">
        Toggle buffs to simulate active combat self-buffs
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { CLASS_BUFF_SKILLS } from "~~/app/data/classBuffSkills.js";

const props = defineProps({
  player1: {
    type: Object,
    default: () => ({ class_name: "Hashashin", spec: "Awakening" }),
  },
  player2: {
    type: Object,
    default: () => ({ class_name: "Warrior", spec: "Awakening" }),
  },
});

// Models for active buffs so calculator.vue can react to them
const activeP1Skills = defineModel("activeP1Skills", {
  type: Array,
  default: () => [],
});

const activeP2Skills = defineModel("activeP2Skills", {
  type: Array,
  default: () => [],
});

const activeGeneralBuffs = defineModel("activeGeneralBuffs", {
  type: Array,
  default: () => [],
});

// General Consumables List (Exquisite Cron, Church, Villa, Frenzy Draught)
const generalBuffsList = [
  {
    id: "cron",
    name: "Exquisite Cron",
    badge: "+30 AP",
    tooltip: "Exquisite Cron Meal: All AP +30, All DR +15, Max HP +5%",
    effects: { ap: 30, dr: 15 },
  },
  {
    id: "church",
    name: "Church Buff",
    badge: "+8 AP",
    tooltip: "Church Buff: All AP +8, All DR +8, Max HP +150",
    effects: { ap: 8, dr: 8 },
  },
  {
    id: "villa",
    name: "Villa Buff",
    badge: "+10 AP",
    tooltip: "Villa Buff (Body Enhancement): All AP +10, All DR +10",
    effects: { ap: 10, dr: 10 },
  },
  {
    id: "draught",
    name: "Frenzy Draught",
    badge: "+35 AP",
    tooltip: "Frenzy Draught: All AP +35, All DR -15, Crit Damage +3%",
    effects: { ap: 35, dr: -15 },
  },
];

// Fallback / Example skills for Hashashin Awakening
const DEFAULT_HASHASHIN_SKILLS = [
  {
    id: 5619,
    name: "Aal's Grace",
    spec: "Awakening",
    icon: "/skills/hashashin/5619.webp",
    buffs: {
      duration: 30,
      all_ap: 20,
      crit_hit_rate: 30,
      accuracy: 60,
      attack_speed: 20,
      crit_damage: 15,
    },
  },
  {
    id: 5649,
    name: "Crown Kick",
    spec: "Awakening",
    icon: "/skills/hashashin/5649.webp",
    buffs: { duration: 10, all_ap: 20 },
  },
  {
    id: 5617,
    name: "Flow: Sand Warp",
    spec: "Awakening",
    icon: "/skills/hashashin/5617.webp",
    buffs: { duration: 10, evasion: 60 },
  },
];

// Fallback / Example skills for Warrior Awakening
const DEFAULT_WARRIOR_SKILLS = [
  {
    id: 1764,
    name: "Executioner",
    spec: "Absolute",
    icon: "/skills/warrior/1764.webp",
    buffs: {
      duration: 30,
      all_ap: 45,
      attack_speed: 30,
      movement_speed: 40,
    },
  },
  {
    id: 1744,
    name: "Greatsword Defense",
    spec: "Awakening",
    icon: "/skills/warrior/1744.webp",
    buffs: { duration: 10, damage_reduction: 20, all_ap: 32 },
  },
  {
    id: 995,
    name: "War Cry III",
    spec: "Absolute",
    icon: "/skills/warrior/995.webp",
    buffs: { duration: 20, damage_reduction: 20 },
  },
];

function resolveClassSkills(className, spec) {
  const norm = (className || "").toLowerCase().replace(/[-_\s]/g, "");
  let classData = null;

  for (const [key, val] of Object.entries(CLASS_BUFF_SKILLS || {})) {
    const k = key.toLowerCase().replace(/[-_\s]/g, "");
    if (
      k === norm ||
      (norm.length >= 3 && (k.includes(norm) || norm.includes(k)))
    ) {
      classData = val;
      break;
    }
  }

  if (!classData) {
    if (norm.includes("hash")) return DEFAULT_HASHASHIN_SKILLS;
    if (norm.includes("warr")) return DEFAULT_WARRIOR_SKILLS;
    return DEFAULT_HASHASHIN_SKILLS;
  }

  const s = spec === "Succession" ? "Succession" : "Awakening";
  const primary = classData[s] || [];
  if (primary.length > 0) return primary.slice(0, 3);

  const fallback =
    classData.Awakening?.length > 0
      ? classData.Awakening
      : classData.Succession || [];
  return fallback.length > 0
    ? fallback.slice(0, 3)
    : norm.includes("warr")
      ? DEFAULT_WARRIOR_SKILLS
      : DEFAULT_HASHASHIN_SKILLS;
}

const p1Skills = computed(() => {
  return resolveClassSkills(props.player1?.class_name, props.player1?.spec);
});

const p2Skills = computed(() => {
  return resolveClassSkills(props.player2?.class_name, props.player2?.spec);
});

// Check active states
function isP1SkillActive(skillId) {
  return activeP1Skills.value.includes(skillId);
}

function isP2SkillActive(skillId) {
  return activeP2Skills.value.includes(skillId);
}

function isGeneralBuffActive(buffId) {
  return activeGeneralBuffs.value.includes(buffId);
}

// Toggles
function toggleP1Skill(skillId) {
  const list = [...activeP1Skills.value];
  const idx = list.indexOf(skillId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(skillId);
  }
  activeP1Skills.value = list;
}

function toggleP2Skill(skillId) {
  const list = [...activeP2Skills.value];
  const idx = list.indexOf(skillId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(skillId);
  }
  activeP2Skills.value = list;
}

function toggleGeneralBuff(buffId) {
  const list = [...activeGeneralBuffs.value];
  const idx = list.indexOf(buffId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(buffId);
  }
  activeGeneralBuffs.value = list;
}

function activateAllBuffs() {
  activeP1Skills.value = p1Skills.value.map((s) => s.id);
  activeP2Skills.value = p2Skills.value.map((s) => s.id);
  activeGeneralBuffs.value = generalBuffsList.map((b) => b.id);
}

function clearAllBuffs() {
  activeP1Skills.value = [];
  activeP2Skills.value = [];
  activeGeneralBuffs.value = [];
}

function clearP1Skills() {
  activeP1Skills.value = [];
}

function clearP2Skills() {
  activeP2Skills.value = [];
}

// Formatting helpers
function formatBuffBadge(buffs) {
  if (!buffs) return "";
  const parts = [];
  if (buffs.all_ap) parts.push(`+${buffs.all_ap} AP`);
  if (buffs.damage_reduction) parts.push(`+${buffs.damage_reduction} DR`);
  if (buffs.crit_hit_rate) parts.push(`+${buffs.crit_hit_rate}% Crit`);
  if (buffs.crit_damage) parts.push(`+${buffs.crit_damage}% CDmg`);
  if (buffs.accuracy) parts.push(`+${buffs.accuracy} Acc`);
  if (buffs.evasion) parts.push(`+${buffs.evasion} Eva`);
  if (buffs.attack_speed) parts.push(`+${buffs.attack_speed}% AS`);
  return parts.slice(0, 2).join(", ");
}

function getSkillTooltip(skill) {
  if (!skill?.buffs) return skill?.name || "";
  const parts = [];
  const b = skill.buffs;
  if (b.all_ap) parts.push(`All AP: +${b.all_ap}`);
  if (b.damage_reduction)
    parts.push(`Damage Reduction: +${b.damage_reduction}`);
  if (b.crit_hit_rate) parts.push(`Critical Rate: +${b.crit_hit_rate}%`);
  if (b.crit_damage) parts.push(`Critical Damage: +${b.crit_damage}%`);
  if (b.accuracy) parts.push(`Accuracy: +${b.accuracy}`);
  if (b.evasion) parts.push(`Evasion: +${b.evasion}`);
  if (b.attack_speed) parts.push(`Attack Speed: +${b.attack_speed}%`);
  if (b.movement_speed) parts.push(`Movement Speed: +${b.movement_speed}%`);
  if (b.duration) parts.push(`Duration: ${b.duration}s`);
  return `${skill.name} (${skill.spec})\n${parts.join("\n")}`;
}

const p1SkillTotalsSummary = computed(() => {
  let ap = 0;
  let dr = 0;
  p1Skills.value.forEach((s) => {
    if (activeP1Skills.value.includes(s.id)) {
      if (s.buffs?.all_ap) ap += s.buffs.all_ap;
      if (s.buffs?.damage_reduction) dr += s.buffs.damage_reduction;
    }
  });
  const parts = [];
  if (ap) parts.push(`+${ap} AP`);
  if (dr) parts.push(`+${dr} DR`);
  return parts.join(" ");
});

const p2SkillTotalsSummary = computed(() => {
  let ap = 0;
  let dr = 0;
  p2Skills.value.forEach((s) => {
    if (activeP2Skills.value.includes(s.id)) {
      if (s.buffs?.all_ap) ap += s.buffs.all_ap;
      if (s.buffs?.damage_reduction) dr += s.buffs.damage_reduction;
    }
  });
  const parts = [];
  if (ap) parts.push(`+${ap} AP`);
  if (dr) parts.push(`+${dr} DR`);
  return parts.join(" ");
});
</script>
