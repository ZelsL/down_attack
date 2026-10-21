<template>
  <div class="pt-2 flex flex-col gap-2">
    <span class="text-xs font-bold text-[#d7ad70]/70 uppercase tracking-wider">
      Combo Sequence
    </span>
    <div class="flex-row items-center gap-2">
      <div
        class="w-full bg-[#745b39] px-2 h-8 flex items-center justify-between"
      >
        <span class="text-xs font-bold text-[#ffedd4] tracking-wide">
          {{ selectedCombo?.name || "New Combo" }}
        </span>
        <TooltipButton label="Save" class="ml-auto" @click="handleSaveCombo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="#ffd99d"
            class="w-4 h-4 shrink-0"
          >
            <path
              d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
            />
          </svg>
        </TooltipButton>
      </div>
      <div class="w-full p-2 bg-[#131215] flex flex-col gap-2">
        <div class="relative w-full">
          <div
            v-if="isOpen"
            class="fixed inset-0 z-40 cursor-default"
            @click="isOpen = false"
          />
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 bg-[#16161a] border border-[#ffedd4]/30 rounded text-xs font-medium text-[#ffedd4] hover:border-[#d7ad70] transition-colors focus:outline-none focus:border-[#d7ad70] cursor-pointer"
            @click="isOpen = !isOpen"
          >
            <span class="truncate">
              {{ selectedCombo?.name || "No Combo Selected." }}
            </span>
            <span
              class="text-xs text-[#d7ad70] transition-transform duration-200 inline-block"
              :class="{ 'rotate-180': isOpen }"
            >
              ▼
            </span>
          </button>

          <div
            v-if="isOpen"
            class="absolute left-0 right-0 top-full mt-1 bg-[#18181b] border border-[#ffedd4]/20 rounded shadow-2xl z-50 flex flex-col"
          >
            <div
              v-if="comboIsLoading"
              class="flex items-center justify-between gap-2 px-3 py-2 animate-pulse"
            >
              <div class="h-3.5 w-28 bg-[#ffedd4]/15 rounded" />
              <div class="flex items-center gap-2 shrink-0">
                <div class="h-3.5 w-3.5 bg-[#ffedd4]/15 rounded" />
                <div class="h-3.5 w-3.5 bg-[#ffedd4]/15 rounded" />
              </div>
            </div>

            <div v-else class="flex flex-col">
              <div
                v-for="(combo, index) in combos"
                :key="combo.id"
                :draggable="editingComboId !== combo.id"
                class="flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-[#ffedd4]/80 hover:bg-[#d7ad70]/15 hover:text-[#d7ad70] transition-all cursor-grab active:cursor-grabbing select-none"
                :class="[
                  draggedComboIndex === index ? 'opacity-40' : '',
                  dragOverComboIndex === index
                    ? 'bg-[#d7ad70]/25 border-y border-[#d7ad70]/60'
                    : '',
                ]"
                @dragstart="onComboDragStart(index, $event)"
                @dragover.prevent="onComboDragOver(index)"
                @dragenter.prevent="onComboDragOver(index)"
                @dragleave="onComboDragLeave(index)"
                @drop.prevent="onComboDrop(index)"
                @dragend="onComboDragEnd"
                @click="selectCombo(combo)"
              >
                <input
                  v-if="editingComboId === combo.id"
                  v-model="editingComboName"
                  type="text"
                  class="flex-1 min-w-0 bg-[#131215] border border-[#d7ad70] rounded px-1.5 py-0.5 text-xs text-[#ffedd4] focus:outline-none"
                  autofocus
                  @click.stop
                  @keydown.enter.prevent="confirmEditComboName(combo)"
                  @keydown.esc.prevent="cancelEditComboName"
                  @blur="confirmEditComboName(combo)"
                />
                <span v-else class="truncate flex items-center gap-1.5">
                  <span class="truncate">{{ combo.name }}</span>
                  <span
                    v-if="combo.isImported"
                    class="text-[10px] text-[#d7ad70]/70 italic shrink-0"
                  >
                    (Imported)
                  </span>
                </span>

                <div class="flex items-center gap-2 shrink-0">
                  <TooltipButton
                    label="Edit"
                    @click.stop="startEditComboName(combo)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="#ffd99d"
                      class="w-3.5 h-3.5 shrink-0"
                    >
                      <path
                        d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                      />
                    </svg>
                  </TooltipButton>

                  <TooltipButton
                    label="Delete"
                    @click.stop="handleDeleteCombo(combo.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      fill="#ffd99d"
                      class="w-3.5 h-3.5 shrink-0"
                    >
                      <path
                        d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                      />
                    </svg>
                  </TooltipButton>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="w-full text-left px-3 py-2 bg-[#16161a] border-t border-[#ffedd4]/10 text-xs font-semibold text-[#d7ad70] hover:bg-[#d7ad70]/15 transition-colors cursor-pointer"
              @click="handleNewCombo"
            >
              + New Combo
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 pt-1">
          <template
            v-for="(skill, index) in comboSkills"
            :key="skill.instanceId"
          >
            <div
              draggable="true"
              class="relative flex items-center gap-2 bg-[#16161a] border rounded-lg p-2 transition-all cursor-grab active:cursor-grabbing group select-none text-left max-w-[calc(50%-0.25rem)]"
              :class="[
                draggedSkillIndex === index
                  ? 'opacity-40 border-[#d7ad70]'
                  : dragOverSkillIndex === index
                    ? 'border-[#d7ad70] bg-[#d7ad70]/15 scale-[1.02]'
                    : 'border-[#ffedd4]/20 hover:border-[#d7ad70]',
              ]"
              @dragstart="onSkillDragStart(index, $event)"
              @dragover.prevent="onSkillDragOver(index)"
              @dragenter.prevent="onSkillDragOver(index)"
              @dragleave="onSkillDragLeave(index)"
              @drop.prevent="onSkillDrop(index)"
              @dragend="onSkillDragEnd"
              @contextmenu.prevent="removeSkillFromCombo(skill.instanceId)"
              @click="openHitsModal(skill)"
            >
              <SkillLink :skill-id="skill.id">
                <img
                  :src="skill.icon_path"
                  :alt="skill.name"
                  draggable="false"
                  class="w-7 h-7 rounded object-cover bg-black/40 flex-shrink-0 pointer-events-none"
                />
              </SkillLink>
              <div
                class="hidden sm:flex flex-col min-w-0"
                :title="`${skill.name}\n• Drag: Reorder\n• Left Button: Configure hits\n• Right Button: Remove`"
              >
                <span
                  class="text-xs font-bold text-[#ffedd4] group-hover:text-[#d7ad70] transition-colors leading-tight truncate max-w-[95px]"
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
                title="Remove"
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
            <TooltipButton
              label="Add Skill"
              :hide-tooltip="isAddingSkill"
              class="w-8 h-8 border border-dashed border-[#ffedd4]/30 hover:border-[#d7ad70] rounded-lg bg-[#16161a]/60 hover:bg-[#d7ad70]/10 text-xs font-semibold text-[#d7ad70] transition-all"
              @click="isAddingSkill = !isAddingSkill"
            >
              <span class="text-sm font-bold text-[#ffd99d] leading-none"
                >+</span
              >
            </TooltipButton>

            <!-- Search Dropdown (v-if="isAddingSkill") -->
            <div
              v-if="isAddingSkill"
              ref="skillDropdownRef"
              :style="{ maxHeight: `${dropdownMaxHeight}px` }"
              class="absolute left-0 top-full mt-2 z-50 w-64 bg-[#16161a] border border-[#d7ad70]/50 rounded-lg shadow-2xl flex flex-col overflow-hidden"
            >
              <div
                class="p-2 border-b border-[#ffedd4]/10 bg-[#1f1f23] shrink-0"
              >
                <input
                  ref="skillSearchInput"
                  v-model="skillSearch"
                  type="text"
                  placeholder="Search for name or command (e.g SHIFT + LMB)"
                  class="w-full bg-[#16161a] border border-[#ffedd4]/20 rounded px-2.5 py-1.5 text-xs text-[#ffedd4] placeholder-[#ffedd4]/40 focus:outline-none focus:border-[#d7ad70]"
                />
              </div>

              <div
                class="overflow-y-auto p-1 flex flex-col gap-1 flex-1 min-h-0"
              >
                <button
                  v-for="skill in filteredAvailableSkills"
                  :key="skill.id"
                  type="button"
                  class="flex items-center gap-2 p-1.5 rounded hover:bg-[#d7ad70]/10 transition-colors text-left group"
                  @click="addSkillToCombo(skill)"
                >
                  <SkillLink :skill-id="skill.id">
                    <img
                      :src="skill.icon_path"
                      :alt="skill.name"
                      class="w-6 h-6 rounded object-cover flex-shrink-0"
                    />
                  </SkillLink>
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
              :class="[
                !hit.is_down_attack
                  ? 'opacity-40 border-[#ffedd4]/5 cursor-not-allowed'
                  : hit.down_hits > 0
                    ? 'border-[#d7ad70]/60 bg-[#d7ad70]/10'
                    : 'border-[#ffedd4]/10',
              ]"
              :title="
                !hit.is_down_attack
                  ? 'This skill does not possess Down Attack property'
                  : ''
              "
            >
              <div class="flex items-center gap-1.5">
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
                <!-- Indicador N/A opcional para deixar claro -->
                <span
                  v-if="!hit.is_down_attack"
                  class="text-[9px] text-[#ffedd4]/40 italic"
                >
                  (N/A)
                </span>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  :disabled="!hit.is_down_attack"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                  :disabled="!hit.is_down_attack"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
              :class="[
                !hit.is_air_attack
                  ? 'opacity-40 border-[#ffedd4]/5 cursor-not-allowed'
                  : hit.air_hits > 0
                    ? 'border-[#d7ad70]/60 bg-[#d7ad70]/10'
                    : 'border-[#ffedd4]/10',
              ]"
              :title="
                !hit.is_air_attack
                  ? 'This skill does not possess Air Attack property'
                  : ''
              "
            >
              <div class="flex items-center gap-1.5">
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
                <span
                  v-if="!hit.is_air_attack"
                  class="text-[9px] text-[#ffedd4]/40 italic"
                >
                  (N/A)
                </span>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  :disabled="!hit.is_air_attack"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  @click="adjustHitCount(hit, 'air', -1, $event)"
                >
                  -
                </button>
                <span
                  class="w-5 text-center text-xs font-bold font-mono"
                  :class="
                    hit.air_hits > 0 ? 'text-[#d7ad70]' : 'text-[#ffedd4]'
                  "
                >
                  {{ hit.air_hits }}
                </span>
                <button
                  type="button"
                  :disabled="!hit.is_air_attack"
                  class="w-5 h-5 flex items-center justify-center text-xs bg-[#141417] hover:bg-[#ffedd4]/10 border border-[#ffedd4]/20 rounded text-[#ffedd4] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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

  <ErrorCard :message="comboError" @close="comboError = null" />
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

const presetCombos = defineModel("combos", {
  type: Array,
  default: () => [],
});

const availableCombos = defineModel("availableCombos", {
  type: Array,
  default: () => [],
});

const selectedComboId = defineModel("selectedComboId", {
  type: [String, Number],
  default: null,
});

const isAddingSkill = ref(false);
const skillSearch = ref("");
const skillSearchInput = ref(null);
const skillDropdownRef = ref(null);
const dropdownMaxHeight = ref(240);

watch(isAddingSkill, async (open) => {
  if (open) {
    await nextTick();
    if (skillDropdownRef.value) {
      const rect = skillDropdownRef.value.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.top - 16;
      dropdownMaxHeight.value = Math.max(100, Math.min(288, spaceBelow));
    }
    skillSearchInput.value?.focus();
  }
});

const { data: availableSkills, refresh: refreshAvailableSkills } = useFetch(
  () => {
    if (!props.player?.class_name || !props.player?.spec) return null;
    return `/api/v1/skills?class_name=${props.player.class_name}&spec=${props.player.spec}`;
  },
  { default: () => [] },
);

const DIRECTION_MAP = {
  w: "↑",
  s: "↓",
  a: "←",
  d: "→",
};

const filteredAvailableSkills = computed(() => {
  if (!availableSkills.value) return [];

  const query = skillSearch.value.trim().toLowerCase();
  if (!query) return availableSkills.value;

  const rawTerms = query.split(/\s+/).filter(Boolean);
  const terms = rawTerms.map((term) =>
    rawTerms.length > 1 && DIRECTION_MAP[term] ? DIRECTION_MAP[term] : term,
  );

  return availableSkills.value.filter((skill) => {
    const skillName = skill.name?.toLowerCase() || "";
    const skillCommand = skill.command?.toLowerCase() || "";
    const searchableText = `${skillName} ${skillCommand}`;

    return terms.every((term) => searchableText.includes(term));
  });
});

function addSkillToCombo(skill) {
  const newSkillinstance = {
    ...skill,
    instanceId: crypto.randomUUID(),
    id: skill.id,
    name: skill.name,
    command: skill.command,
    icon_path: skill.icon_path,
    hits: (skill.hits || []).map((hit) => {
      const count = Number(hit.hit_count) || 1;
      return {
        ...hit,
        id: hit.id,
        description: hit.description,
        damage_percent: Number(hit.damage_percent) || 0,
        hit_count: count,
        normal_hits: count,
        down_hits: 0,
        back_hits: 0,
        air_hits: 0,
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

  if (delta > 0) {
    if (type === "down" && !selectSkill.value?.is_down_attack) return;
    if (type === "air" && !selectSkill.value?.is_air_attack) return;
  }

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

const {
  combos,
  getCombos,
  saveCombos,
  updateCombos,
  deleteCombos,
  reorderCombos,
  comboIsLoading,
  comboError,
} = useCombos(() => props.player, comboSkills);

const draggedSkillIndex = ref(null);
const dragOverSkillIndex = ref(null);

function onSkillDragStart(index, event) {
  draggedSkillIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
}

function onSkillDragOver(index) {
  if (draggedSkillIndex.value === null || draggedSkillIndex.value === index)
    return;
  dragOverSkillIndex.value = index;
}

function onSkillDragLeave(index) {
  if (dragOverSkillIndex.value === index) {
    dragOverSkillIndex.value = null;
  }
}

function onSkillDrop(targetIndex) {
  const fromIndex = draggedSkillIndex.value;
  if (fromIndex !== null && fromIndex !== targetIndex) {
    const updated = [...comboSkills.value];
    const [movedSkill] = updated.splice(fromIndex, 1);
    updated.splice(targetIndex, 0, movedSkill);
    comboSkills.value = updated;
  }
  draggedSkillIndex.value = null;
  dragOverSkillIndex.value = null;
}

function onSkillDragEnd() {
  draggedSkillIndex.value = null;
  dragOverSkillIndex.value = null;
}

const draggedComboIndex = ref(null);
const dragOverComboIndex = ref(null);

function onComboDragStart(index, event) {
  if (editingComboId.value !== null) {
    event.preventDefault();
    return;
  }
  draggedComboIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
}

function onComboDragOver(index) {
  if (draggedComboIndex.value === null || draggedComboIndex.value === index)
    return;
  dragOverComboIndex.value = index;
}

function onComboDragLeave(index) {
  if (dragOverComboIndex.value === index) {
    dragOverComboIndex.value = null;
  }
}

function onComboDrop(targetIndex) {
  const fromIndex = draggedComboIndex.value;
  if (fromIndex !== null && fromIndex !== targetIndex) {
    reorderCombos(fromIndex, targetIndex);
  }
  draggedComboIndex.value = null;
  dragOverComboIndex.value = null;
}

function onComboDragEnd() {
  draggedComboIndex.value = null;
  dragOverComboIndex.value = null;
}

const isOpen = ref(false);
const editingComboId = ref(null);
const editingComboName = ref("");

const selectedCombo = computed(
  () =>
    (selectedComboId.value &&
      combos.value.find((c) => c.id === selectedComboId.value)) ||
    null,
);

function cloneSkills(skills) {
  if (!Array.isArray(skills)) return [];
  return JSON.parse(JSON.stringify(skills));
}

function selectCombo(combo) {
  const nextId = combo?.id || null;
  if (selectedComboId.value === nextId) {
    comboSkills.value = cloneSkills(combo?.skills || []);
  } else {
    selectedComboId.value = nextId;
  }
  isOpen.value = false;
}

function startEditComboName(combo) {
  const nextId = combo?.id || null;
  if (selectedComboId.value === nextId) {
    comboSkills.value = cloneSkills(combo?.skills || []);
  } else {
    selectedComboId.value = nextId;
  }
  editingComboId.value = combo.id;
  editingComboName.value = combo.name || "";
}

async function confirmEditComboName(combo) {
  if (editingComboId.value !== combo.id) return;

  const trimmedName = editingComboName.value.trim();
  editingComboId.value = null;

  if (!trimmedName || trimmedName === combo.name) return;

  if (combo.isImported) {
    combo.name = trimmedName;
  } else {
    await updateCombos(combo.id, trimmedName);
  }
}

function cancelEditComboName() {
  editingComboId.value = null;
  editingComboName.value = "";
}

async function handleDeleteCombo(id) {
  const wasSelected = selectedComboId.value === id;
  const target = combos.value.find((c) => c.id === id);
  if (target?.isImported) {
    combos.value = combos.value.filter((c) => c.id !== id);
    if (Array.isArray(presetCombos.value)) {
      presetCombos.value = presetCombos.value.filter((c) => c.id !== id);
    }
  } else {
    await deleteCombos(id);
  }

  if (wasSelected) {
    if (combos.value.length > 0) {
      selectedComboId.value = combos.value[0].id;
      comboSkills.value = cloneSkills(combos.value[0].skills || []);
    } else {
      selectedComboId.value = null;
      comboSkills.value = [];
    }
  }
}

function handleNewCombo() {
  selectedComboId.value = null;
  comboSkills.value = [];
  isOpen.value = false;
  isAddingSkill.value = true;
}

async function handleSaveCombo() {
  if (selectedCombo.value && !selectedCombo.value.isImported) {
    await updateCombos(selectedCombo.value.id);
  } else {
    const importedId = selectedCombo.value?.id;
    const customName = selectedCombo.value?.name;
    const newCombo = await saveCombos(customName);
    if (importedId) {
      combos.value = combos.value.filter((c) => c.id !== importedId);
      if (Array.isArray(presetCombos.value)) {
        presetCombos.value = presetCombos.value.filter(
          (c) => c.id !== importedId,
        );
      }
    }
    selectedComboId.value = newCombo?.id || null;
  }
}

function getSkillsSignature(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return "";
  return skills.map((s) => `${s.instanceId || ""}:${s.id || ""}`).join("|");
}

function hydrateSkillsWithLatestData(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return [];
  const latestList = Array.isArray(availableSkills.value)
    ? availableSkills.value
    : [];
  if (latestList.length === 0) return skills;

  const latestById = new Map(latestList.map((s) => [s.id, s]));

  return skills.map((skill) => {
    const latest = latestById.get(skill.id);
    if (!latest) return skill;

    const latestHits = Array.isArray(latest.hits) ? latest.hits : [];
    const currentHits = Array.isArray(skill.hits) ? skill.hits : [];

    const mergedHits =
      latestHits.length > 0
        ? latestHits.map((latestHit, idx) => {
            const existingHit =
              currentHits.find((h) => h.id && h.id === latestHit.id) ||
              currentHits[idx];
            const count = Number(latestHit.hit_count) || 1;

            if (!existingHit) {
              return {
                ...latestHit,
                damage_percent: Number(latestHit.damage_percent) || 0,
                hit_count: count,
                normal_hits: count,
                down_hits: 0,
                back_hits: 0,
                air_hits: 0,
              };
            }

            return {
              ...existingHit,
              ...latestHit,
              damage_percent: Number(latestHit.damage_percent) || 0,
              hit_count: count,
              normal_hits: Number(existingHit.normal_hits) || 0,
              down_hits: latestHit.is_down_attack
                ? Number(existingHit.down_hits) || 0
                : 0,
              back_hits: Number(existingHit.back_hits) || 0,
              air_hits: latestHit.is_air_attack
                ? Number(existingHit.air_hits) || 0
                : 0,
            };
          })
        : currentHits;

    return {
      ...skill,
      name: latest.name ?? skill.name,
      command: latest.command ?? skill.command,
      icon_path: latest.icon_path ?? skill.icon_path,
      skill_spec: latest.skill_spec ?? skill.skill_spec,
      crit_hit_rate: latest.crit_hit_rate ?? skill.crit_hit_rate,
      pvp_damage: latest.pvp_damage ?? skill.pvp_damage,
      is_down_attack: latest.is_down_attack ?? skill.is_down_attack,
      is_air_attack: latest.is_air_attack ?? skill.is_air_attack,
      self_buffs: latest.self_buffs ?? skill.self_buffs,
      target_debuffs: latest.target_debuffs ?? skill.target_debuffs,
      tags: latest.tags ?? skill.tags,
      hits: mergedHits,
    };
  });
}

function mergePresetCombos() {
  const incomingCombos = Array.isArray(presetCombos.value)
    ? presetCombos.value
    : [];
  const savedOnly = combos.value
    .filter((c) => !c.isImported)
    .map((c) => ({
      ...c,
      skills: hydrateSkillsWithLatestData(cloneSkills(c.skills || [])),
    }));

  if (incomingCombos.length > 0) {
    const importedItems = incomingCombos.map((c, idx) => ({
      ...c,
      id: c.id || crypto.randomUUID(),
      name: c.name || `Combo #${idx + 1}`,
      skills: hydrateSkillsWithLatestData(cloneSkills(c.skills || [])),
      isImported: true,
    }));
    combos.value = [...importedItems, ...savedOnly];
  } else {
    combos.value = savedOnly;
  }

  const currentSig = getSkillsSignature(comboSkills.value);
  const matchingCombo =
    (selectedComboId.value &&
      combos.value.find((c) => c.id === selectedComboId.value)) ||
    (currentSig &&
      combos.value.find((c) => getSkillsSignature(c.skills) === currentSig)) ||
    null;

  if (matchingCombo) {
    selectedComboId.value = matchingCombo.id;
    comboSkills.value = cloneSkills(matchingCombo.skills || []);
  } else if (combos.value.length > 0 && comboSkills.value.length === 0) {
    selectedComboId.value = combos.value[0].id;
    comboSkills.value = cloneSkills(combos.value[0].skills || []);
  } else if (comboSkills.value.length > 0) {
    selectedComboId.value = null;
    comboSkills.value = hydrateSkillsWithLatestData(
      cloneSkills(comboSkills.value),
    );
  } else {
    selectedComboId.value = null;
  }
}

async function loadCombosForPlayer() {
  await getCombos();
  mergePresetCombos();
}

watch(availableSkills, () => {
  if (
    Array.isArray(availableSkills.value) &&
    availableSkills.value.length > 0
  ) {
    combos.value = combos.value.map((c) => ({
      ...c,
      skills: hydrateSkillsWithLatestData(cloneSkills(c.skills || [])),
    }));
    if (comboSkills.value.length > 0) {
      comboSkills.value = hydrateSkillsWithLatestData(
        cloneSkills(comboSkills.value),
      );
    }
  }
});

watch(
  selectedComboId,
  (newId, oldId) => {
    if (!newId || newId === oldId) return;
    const target = combos.value.find((c) => c.id === newId);
    if (target) {
      comboSkills.value = cloneSkills(target.skills || []);
    }
  },
  { flush: "sync" },
);

watch(
  [combos, selectedComboId, comboSkills],
  () => {
    if (
      selectedCombo.value &&
      selectedCombo.value.skills !== comboSkills.value
    ) {
      selectedCombo.value.skills = comboSkills.value;
    }
    availableCombos.value = combos.value.map((c) =>
      c.id === selectedComboId.value ? { ...c, skills: comboSkills.value } : c,
    );
  },
  { deep: true, immediate: true },
);

const { isAuthenticated } = useAuth();

onMounted(async () => {
  await refreshAvailableSkills();
  await loadCombosForPlayer();
});

watch(isAuthenticated, () => {
  loadCombosForPlayer();
});

watch(
  () => [props.player?.class_name, props.player?.spec],
  (newVal, oldVal) => {
    if (oldVal && (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1])) {
      selectedComboId.value = null;
      comboSkills.value = [];
    }
    loadCombosForPlayer();
  },
);

watch(presetCombos, () => {
  mergePresetCombos();
});
</script>
