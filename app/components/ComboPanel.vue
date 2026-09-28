<template>
  <div class="pt-2 flex flex-col gap-2">
    <span class="text-xs font-bold text-[#d7ad70]/70 uppercase tracking-wider">
      Combo Sequence
    </span>
    <div class="flex flex-wrap items-center gap-2">
      <template v-for="skill in comboSkills" :key="skill.instanceId">
        <div
          class="relative flex items-center gap-2 bg-[#16161a] border border-[#ffedd4]/20 hover:border-[#d7ad70] rounded-lg p-2 transition- all cursor-pointer group select-none text-left"
          :title="`${skill.name}\n• Left Button: Configure hits\n• Right Button: Remove`"
          @contextmenu.prevent="removeSkillFromCombo(skill.instanceId)"
          @click="openHitsModal(skill)"
        >
          <img
            :src="skill.icon_path"
            :alt="skill.name"
            class="w-7 h-7 rounded object-cover bg-black/40 flex-shrink-0"
          />
          <div class="hidden sm:flex flex-col min-w-0">
            <span
              class="text-xs font-bold text-[#ffedd4] group-hover:text-[#d7ad70] transition-colors leading-tight truncate max-w-[110px]"
              :title="skill.name"
            >
              {{ skill.name }}
            </span>
            <span
              v-if="skill.command"
              class="text-[10px] font-mono text-[#d7ad70]/80"
            >
              {{ skill.command }}
            </span>
          </div>

          <button
            type="button"
            class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-900/90 hover:bg-red-600 border border-red-500/50 text-[#ffedd4] text-[10px] flex items-center justify-center font-bold cursor-pointer"
            title="Remover do combo"
            @click.stop="removeSkillFromCombo(skill.instanceId)"
          >
            ✕
          </button>
        </div>
      </template>
      <div class="relative">
        <!-- Botão de abrir/fechar o seletor -->
        <div
          v-if="isAddingSkill"
          class="fixed inset-0 z-40 cursor-default"
          @click="isAddingSkill = false"
        />
        <button
          type="button"
          class="h-11 px-3 border border-dashed border-[#ffedd4]/30 hover:border-[#d7ad70] rounded-lg bg-[#16161a]/60 hover:bg-[#d7ad70]/10 text- │ xs font-semibold text-[#d7ad70] flex items-center justify-center gap-1 transition-all cursor-pointer"
          title="add skill to combo sequence"
          @click="isAddingSkill = !isAddingSkill"
        >
          <span class="text-base font-bold">+</span>
        </button>

        <!-- Search Dropdown (v-if="isAddingSkill") -->
        <div
          v-if="isAddingSkill"
          class="absolute left-0 bottom-full mb-2 z-50 w-64 max-h-72 bg-[#16161a] border border-[#d7ad70]/50 rounded-lg shadow-2xl flex flex-col overflow-hidden"
        >
          <div class="p-2 border-b border-[#ffedd4]/10 bg-[#1f1f23]">
            <input
              v-model="skillSearch"
              type="text"
              placeholder="Search for name or command (e.g SHIFT + LMB)"
              class="w-full bg-[#16161a] border border-[#ffedd4]/20 rounded px-2.5 py-1.5 text-xs text-[#ffedd4] placeholder-[#ffedd4]/40 focus:outline-none focus:border-[#d7ad70]"
              autofocus
            />
          </div>

          <div class="overflow-y-auto p-1 flex flex-col gap-1 max-h-56">
            <button
              v-for="skill in filteredAvailableSkills"
              :key="skill.id"
              type="button"
              class="flex items-center gap-2 p-1.5 rounded hover:bg-[#d7ad70]/10 transition-colors text-left group"
              @click="addSkillToCombo(skill)"
            >
              <img
                :src="skill.icon_path"
                :alt="skill.name"
                class="w-6 h-6 rounded object-cover flex-shrink-0"
              />
              <div class="flex flex-col min-w-0">
                <span
                  class="text-xs text-[#ffedd4] group-hover:text-[#d7ad70] truncate font-semibold"
                >
                  {{ skill.name }}
                </span>
                <span
                  v-if="skill.command"
                  class="text-[10px] text-[#d7ad70]/70 font-mono"
                >
                  {{ skill.command }}
                </span>
              </div>
            </button>

            <span
              v-if="filteredAvailableSkills.length === 0"
              class="text-xs text-[#ffedd4]/40 p-2 text-center"
            >
              No skills found
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="isHitsModalOpen && selectSkill"
    class="fixed top-1/2 left-1/2 z-50 w-[540px] max-w-[95vw] bg-[#131215] border border-[#7d6345]/70 rounded-sm shadow- [0_12px_40px_rgba(0,0,0,0.85)] flex flex-col select-none overflow-hidden"
    :style="{
      transform: `translate(calc(-50% + ${hitsModalPos.x}px), calc(-50% + ${hitsModalPos.y}px))`,
    }"
  >
    <div
      class="h-9 px-3 bg-gradient-to-r from-[#4d3b28] via-[#5c4632] to-[#423121] border-b border-[#7d6345]/50 flex items-center justify-between cursor-grab active:cursor-grabbing"
      @mousedown="startDrag"
    >
      <div class="flex items-center gap-2 pointer-events-none">
        <img
          :src="selectSkill.icon_path"
          :alt="selectSkill.name"
          class="w-5 h-5 rounded-sm object-cover border border-[#d7ad70]/40"
        />
        <span class="text-xs font-bold text-[#f5ebd9] tracking-wide">
          {{ selectSkill.name }}
        </span>
        <span
          v-if="selectSkill.command"
          class="text-[10px] font-mono text-[#d7ad70] ml-1"
        >
          [{{ selectSkill.command }}]
        </span>
      </div>
      <button
        type="button"
        class="text-[#f5ebd9]/70 hover:text-[#d7ad70] text-sm font-bold w-6 h-6 flex items-center justify-center transition-colors cursor-pointer"
        title="Close"
        @click="closeHitsModal"
      >
        ✕
      </button>
    </div>
    <div class="p-4 max-h-[60vh] overflow-y-auto flex flex-col gap-3">
      <div
        v-for="(hit, index) in selectSkill.hits"
        :key="hit.id || index"
        class="bg-[#18181c] border border-[#ffedd4]/10 rounded overflow-hidden transition-all"
      >
        <!-- Card Header (Clickable to Expand / Collapse) -->
        <div
          class="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#ffedd4]/5 select-none transition-colors"
          @click="toggleExpandHit(index)"
        >
          <div class="flex items-center gap-2">
            <!-- Animated Arrow Indicator -->
            <span
              class="text-[10px] text-[#d7ad70] transition-transform duration-200 inline-block"
              :class="{ 'rotate-180': expandedHitIndex === index }"
            >
              ▼
            </span>
            <span class="text-xs font-semibold text-[#ffedd4]">
              {{ hit.description || `Hit ${index + 1}` }}
            </span>
          </div>

          <!-- Header Summary: Damage % & Total Landed -->
          <div class="flex items-center gap-2 text-xs">
            <span class="font-bold text-[#d7ad70]">
              {{ hit.damage_percent }}%
            </span>
            <span class="text-[11px] font-mono text-[#ffedd4]/50">
              ({{ getLandedHits(hit) }}/{{ hit.hit_count }})
            </span>
          </div>
        </div>

        <!-- Expandable Content: Hit Distribution Breakdown -->
        <div
          v-if="expandedHitIndex === index"
          class="p-3 pt-2 border-t border-[#ffedd4]/10 bg-[#141417] flex flex-col gap-2.5"
        >
          <!-- Steppers Grid: Normal, Down, Back, Air -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Normal Hits -->
            <div
              class="flex items-center justify-between bg-[#18181c] border rounded px-2.5 py-1.5 transition-colors"
              :class="
                hit.normal_hits > 0
                  ? 'border-[#d7ad70]/60 bg-[#d7ad70]/10'
                  : 'border-[#ffedd4]/10'
              "
            >
              <span
                class="text-[11px] font-medium"
                :class="
                  hit.normal_hits > 0
                    ? 'text-[#d7ad70] font-bold'
                    : 'text-[#ffedd4]'
                "
              >
                Normal
              </span>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] cursor-pointer"
                  @click="adjustHitCount(hit, 'normal', -1, $event)"
                >
                  -
                </button>
                <span
                  class="w-5 text-center text-xs font-bold font-mono"
                  :class="
                    hit.normal_hits > 0 ? 'text-[#d7ad70]' : 'text-[#ffedd4]'
                  "
                >
                  {{ hit.normal_hits }}
                </span>
                <button
                  type="button"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] cursor-pointer"
                  @click="adjustHitCount(hit, 'normal', 1, $event)"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Down Attack Hits -->
            <div
              class="flex items-center justify-between bg-[#18181c] border rounded px-2.5 py-1.5 transition-colors"
              :class="
                hit.down_hits > 0
                  ? 'border-[#d7ad70]/60 bg-[#d7ad70]/10'
                  : 'border-[#ffedd4]/10'
              "
            >
              <span
                class="text-[11px] font-medium"
                :class="
                  hit.down_hits > 0
                    ? 'text-[#d7ad70] font-bold'
                    : 'text-[#ffedd4]'
                "
              >
                Down Attack
              </span>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] cursor-pointer"
                  @click="adjustHitCount(hit, 'down', -1, $event)"
                >
                  -
                </button>
                <span
                  class="w-5 text-center text-xs font-bold font-mono"
                  :class="
                    hit.down_hits > 0 ? 'text-[#d7ad70]' : 'text-[#ffedd4]'
                  "
                >
                  {{ hit.down_hits }}
                </span>
                <button
                  type="button"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] cursor-pointer"
                  @click="adjustHitCount(hit, 'down', 1, $event)"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Back Attack Hits -->
            <div
              class="flex items-center justify-between bg-[#18181c] border rounded px-2.5 py-1.5 transition-colors"
              :class="
                hit.back_hits > 0
                  ? 'border-[#d7ad70]/60 bg-[#d7ad70]/10'
                  : 'border-[#ffedd4]/10'
              "
            >
              <span
                class="text-[11px] font-medium"
                :class="
                  hit.back_hits > 0
                    ? 'text-[#d7ad70] font-bold'
                    : 'text-[#ffedd4]'
                "
              >
                Back Attack
              </span>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] cursor-pointer"
                  @click="adjustHitCount(hit, 'back', -1, $event)"
                >
                  -
                </button>
                <span
                  class="w-5 text-center text-xs font-bold font-mono"
                  :class="
                    hit.back_hits > 0
                      ? 'text-[#d7ad70] font-bold'
                      : 'text-[#ffedd4]'
                  "
                >
                  {{ hit.back_hits }}
                </span>
                <button
                  type="button"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] cursor-pointer"
                  @click="adjustHitCount(hit, 'back', 1, $event)"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Air Attack Hits -->
            <div
              class="flex items-center justify-between bg-[#18181c] border rounded px-2.5 py-1.5 transition-colors"
              :class="
                hit.air_hits > 0
                  ? 'border-[#d7ad70]/60 bg-[#d7ad70]/10'
                  : 'border-[#ffedd4]/10'
              "
            >
              <span
                class="text-[11px] font-medium"
                :class="
                  hit.air_hits > 0
                    ? 'text-[#d7ad70] font-bold'
                    : 'text-[#ffedd4]'
                "
              >
                Air Attack
              </span>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] cursor-pointer"
                  @click="adjustHitCount(hit, 'air', -1, $event)"
                >
                  -
                </button>
                <span
                  class="w-5 text-center text-xs font-bold font-mono"
                  :class="
                    hit.air_hits > 0
                      ? 'text-[#d7ad70] font-bold'
                      : 'text-[#ffedd4]'
                  "
                >
                  {{ hit.air_hits }}
                </span>
                <button
                  type="button"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] cursor-pointer"
                  @click="adjustHitCount(hit, 'air', 1, $event)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
  opponent: {
    type: Object,
    required: true,
  },
});

const comboSkills = defineModel("combo", {
  type: Array,
  default: () => [],
});

const isAddingSkill = ref(false);
const skillSearch = ref("");

const { data: availableSkills } = await useFetch(() => {
  if (!props.player?.class_name || !props.player?.spec) return null;
  return `/api/v1/skills?class_name=${props.player.class_name}&spec=${props.player.spec}`;
});

const filteredAvailableSkills = computed(() => {
  if (!availableSkills.value) return [];

  const query = skillSearch.value.trim().toLowerCase();
  if (!query) return availableSkills.value;

  const terms = query.split(/\s+/).filter(Boolean);

  return availableSkills.value.filter((skill) => {
    const skillName = skill.name?.toLowerCase() || "";
    const skillCommand = skill.command?.toLowerCase() || "";
    const searchableText = `${skillName} ${skillCommand}`;

    return terms.every((term) => searchableText.includes(term));
  });
});

function addSkillToCombo(skill) {
  const newSkillinstance = {
    instanceId: crypto.randomUUID(),
    id: skill.id,
    name: skill.name,
    command: skill.command,
    icon_path: skill.icon_path,
    hits: (skill.hits || []).map((hit) => {
      const count = Number(hit.hit_count) || 1;
      return {
        id: hit.id,
        description: hit.description,
        damage_percent: Number(hit.damage_percent) || 0,
        hit_count: count,
        normal_hits: count,
        down_hits: 0,
        back_hits: 0,
        air_hits: 0,
        has_down_attack: Boolean(hit.is_down_attack),
        has_air_attack: Boolean(hit.is_air_attack),
      };
    }),
  };
  comboSkills.value.push(newSkillinstance);

  isAddingSkill.value = false;
  skillSearch.value = "";
}

function removeSkillFromCombo(instanceId) {
  comboSkills.value = comboSkills.value.filter(
    (skill) => skill.instanceId !== instanceId,
  );
}

const isHitsModalOpen = ref(false);
const selectSkill = ref(null);
const hitsModalPos = ref({ x: 0, y: 0 });

function openHitsModal(skill) {
  isHitsModalOpen.value = true;
  selectSkill.value = skill;
  hitsModalPos.value = { x: 0, y: 0 };
  expandedHitIndex.value = 0;
}

function closeHitsModal() {
  isHitsModalOpen.value = false;
  selectSkill.value = null;
}

let isDragging = false;
let dragStart = { x: 0, y: 0 };
let initialPos = { x: 0, y: 0 };

function startDrag(e) {
  isDragging = true;
  dragStart = { x: e.clientX, y: e.clientY };
  initialPos = { x: hitsModalPos.value.x, y: hitsModalPos.value.y };

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDrag);
}

function onDrag(e) {
  if (!isDragging) return;

  hitsModalPos.value = {
    x: initialPos.x + (e.clientX - dragStart.x),
    y: initialPos.y + (e.clientY - dragStart.y),
  };
}

function stopDrag() {
  isDragging = false;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
}

// function setAllHitsModifier(modifier) {
//   if (!selectSkill.value?.hits) return;

//   for (const hit of selectSkill.value.hits) {
//     const total = hit.hit_count;
//     hit.normal_hits = modifier === "normal" ? total : 0;
//     hit.down_hits = modifier === "down" ? total : 0;
//     hit.back_hits = modifier === "back" ? total : 0;
//     hit.air_hits = modifier === "air" ? total : 0;
//   }
// }

function getLandedHits(hit) {
  return (
    (hit.normal_hits || 0) +
    (hit.down_hits || 0) +
    (hit.back_hits || 0) +
    (hit.air_hits || 0)
  );
}

function adjustHitCount(hit, type, delta, event) {
  const isShift = Boolean(event?.shiftKey);
  const key = `${type}_hits`;
  const currentVal = hit[key] || 0;

  if (delta < 0) {
    hit[key] = isShift ? 0 : Math.max(0, currentVal - 1);
    return;
  }

  if (isShift) {
    if (type === "normal") {
      hit.normal_hits = hit.hit_count;
      hit.down_hits = 0;
      hit.back_hits = 0;
      hit.air_hits = 0;
    } else {
      const unassigned = Math.max(0, hit.hit_count - getLandedHits(hit));
      const availableFromNormal = hit.normal_hits || 0;

      hit.normal_hits = 0;
      hit[key] = currentVal + unassigned + availableFromNormal;
    }
    return;
  }

  const totalLanded = getLandedHits(hit);

  if (totalLanded < hit.hit_count) {
    hit[key] = currentVal + 1;
  } else if (type !== "normal" && hit.normal_hits > 0) {
    hit.normal_hits -= 1;
    hit[key] = currentVal + 1;
  }
}

const expandedHitIndex = ref(0);

function toggleExpandHit(index) {
  expandedHitIndex.value = expandedHitIndex.value === index ? null : index;
}
</script>
