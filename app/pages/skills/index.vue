<template>
  <div
    v-if="hasSkillsAccess"
    class="min-h-[calc(100vh-4.5rem)] bg-[#222122] p-4 md:p-6 lg:p-8 flex flex-col gap-5 text-[#ffedd4]"
  >
    <!-- Top: Title and Action Buttons -->
    <header
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ffedd4]/20"
    >
      <div>
        <h1 class="text-xl font-bold text-[#d7ad70]">Skill Manager</h1>
        <p class="text-xs text-[#ffedd4]/60 mt-0.5">
          Administrative dashboard to manage class skills, tags, party buffs,
          buffs/debuffs, and hit multipliers.
        </p>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <button
          v-if="canCreateSkill"
          type="button"
          class="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium rounded-[2px] border border-[#414043] bg-[#3c3b3f] text-[#feecd3] hover:border-[#665246] hover:bg-[#544840] hover:text-[#fdebd3] transition-colors duration-150 cursor-pointer focus:outline-none"
          @click="openCreateModal"
        >
          <span class="text-base font-light leading-none">+</span>
          <span>New Skill</span>
        </button>
      </div>
    </header>

    <!-- Filter Bar -->
    <section
      class="bg-[#18181b] border border-[#ffedd4]/20 rounded-[2px] p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
    >
      <div class="flex items-center flex-wrap gap-2">
        <!-- Class Filter -->
        <select
          v-model="filterClass"
          class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70] cursor-pointer"
        >
          <option v-if="filterTag" value="">All Classes (by Tag)</option>
          <option
            v-for="cls in classesList"
            :key="cls"
            :value="cls"
            class="bg-[#18181b]"
          >
            {{ capitalize(cls) }}
          </option>
        </select>

        <!-- Spec Filter -->
        <select
          v-model="filterSpec"
          :disabled="!filterClass"
          class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70] cursor-pointer disabled:opacity-50"
        >
          <option value="">All Specs</option>
          <option v-for="spec in specsList" :key="spec" :value="spec">
            {{ spec }}
          </option>
        </select>

        <!-- Tag Filter -->
        <select
          v-model="filterTag"
          class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70] cursor-pointer"
        >
          <option value="">All Tags</option>
          <option v-for="t in availableTags" :key="t" :value="t">
            Tag: {{ t }}
          </option>
        </select>
      </div>

      <!-- Search by Name / ID / Command -->
      <div class="flex items-center gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, ID or command..."
          class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] placeholder-[#ffedd4]/40 focus:outline-none focus:border-[#d7ad70]"
        />
        <span class="text-xs text-[#ffedd4]/60 font-mono">
          ({{ filteredSkills.length }})
        </span>
      </div>
    </section>

    <!-- Loading State -->
    <div
      v-if="status === 'pending'"
      class="py-12 text-center text-xs text-[#d7ad70]"
    >
      Loading skills...
    </div>

    <!-- Skills Table -->
    <section
      v-else
      class="bg-[#18181b] border border-[#ffedd4]/20 rounded-[2px] overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              class="bg-[#141416] border-b border-[#ffedd4]/20 text-[#d7ad70] font-semibold"
            >
              <th class="p-3">Skill</th>
              <th class="p-3">Class & Spec</th>
              <th class="p-3">Command</th>
              <th class="p-3">Tags</th>
              <th class="p-3">Protections & Effects</th>
              <th class="p-3">CD / Crit / PvP Red. / Hits</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#ffedd4]/10">
            <tr
              v-for="skill in filteredSkills"
              :key="skill.id"
              class="hover:bg-[#ffedd4]/5 transition-colors"
            >
              <td class="p-3">
                <div class="flex items-center gap-2.5">
                  <img
                    :src="skill.icon_path || '/icons/default_skill.webp'"
                    :alt="skill.name"
                    class="w-7 h-7 rounded-sm object-cover bg-black/40 border border-[#ffedd4]/20 shrink-0"
                  />
                  <div class="flex flex-col">
                    <span class="font-semibold text-[#ffedd4]">
                      {{ skill.name }}
                    </span>
                    <span class="text-[10px] font-mono text-[#ffedd4]/40">
                      #{{ skill.id }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="p-3 text-[#ffedd4]/80">
                {{ skill.class_name }}
                <span class="text-[#ffedd4]/50">({{ skill.skill_spec }})</span>
              </td>

              <td class="p-3 font-mono text-[#ffedd4]/80">
                {{ skill.command || "-" }}
              </td>

              <td class="p-3">
                <div class="flex flex-wrap items-center gap-1">
                  <span
                    v-for="tag in skill.tags || []"
                    :key="tag"
                    class="px-1.5 py-0.5 rounded-[2px] font-mono text-[10px] border"
                    :class="
                      tag === 'party_buff'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-[#d7ad70]/15 text-[#d7ad70] border-[#d7ad70]/30'
                    "
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="!skill.tags || skill.tags.length === 0"
                    class="text-[#ffedd4]/30"
                  >
                    -
                  </span>
                </div>
              </td>

              <td class="p-3">
                <div class="flex flex-wrap items-center gap-1">
                  <span
                    v-if="skill.is_sa"
                    class="px-1.5 py-0.5 rounded-[2px] bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono"
                  >
                    SA
                  </span>
                  <span
                    v-if="skill.is_fg"
                    class="px-1.5 py-0.5 rounded-[2px] bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono"
                  >
                    FG
                  </span>
                  <span
                    v-if="skill.is_if"
                    class="px-1.5 py-0.5 rounded-[2px] bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono"
                  >
                    IF
                  </span>
                  <span
                    v-if="hasObjectKeys(skill.self_buffs)"
                    class="px-1.5 py-0.5 rounded-[2px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono"
                  >
                    Buffs ({{ countObjectKeys(skill.self_buffs) }})
                  </span>
                  <span
                    v-if="hasObjectKeys(skill.target_debuffs)"
                    class="px-1.5 py-0.5 rounded-[2px] bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-mono"
                  >
                    Debuffs ({{ countObjectKeys(skill.target_debuffs) }})
                  </span>
                  <span
                    v-if="
                      !skill.is_sa &&
                      !skill.is_fg &&
                      !skill.is_if &&
                      !hasObjectKeys(skill.self_buffs) &&
                      !hasObjectKeys(skill.target_debuffs)
                    "
                    class="text-[#ffedd4]/30"
                  >
                    -
                  </span>
                </div>
              </td>

              <td class="p-3 font-mono text-[#ffedd4]/80">
                {{ skill.cooldown }}s | {{ skill.crit_hit_rate }}% |
                {{ skill.pvp_damage }}% |
                <span class="text-[#d7ad70]">
                  {{ skill.hits?.length || 0 }} hits
                </span>
              </td>

              <td class="p-3 text-right space-x-2 whitespace-nowrap">
                <button
                  v-if="canUpdateSkill"
                  type="button"
                  class="text-[#d7ad70] hover:underline cursor-pointer"
                  @click="openEditModal(skill)"
                >
                  Edit
                </button>
                <button
                  v-if="canDeleteSkill"
                  type="button"
                  class="text-red-400 hover:underline cursor-pointer"
                  @click="deleteSkill(skill.id)"
                >
                  Delete
                </button>
              </td>
            </tr>

            <tr v-if="filteredSkills.length === 0">
              <td colspan="7" class="p-8 text-center text-[#ffedd4]/50">
                No skills found matching current filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Full Create / Edit Skill Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
    >
      <div
        class="bg-[#18181b] border border-[#d7ad70]/60 rounded-[2px] w-full max-w-4xl p-5 flex flex-col gap-4 shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between pb-2 border-b border-[#ffedd4]/15"
        >
          <div class="flex items-center gap-2.5">
            <img
              :src="form.icon_path || '/icons/default_skill.webp'"
              alt="Skill Icon"
              class="w-7 h-7 rounded-sm object-cover bg-black/40 border border-[#ffedd4]/20"
            />
            <h2 class="text-base font-bold text-[#d7ad70]">
              {{
                isEditing
                  ? `Edit Skill #${form.id} — ${form.name}`
                  : "New Skill"
              }}
            </h2>
          </div>
          <button
            type="button"
            class="text-[#ffedd4]/60 hover:text-[#ffedd4] text-base leading-none cursor-pointer"
            @click="closeModal"
          >
            ✕
          </button>
        </div>

        <!-- Modal Tabs -->
        <div class="flex flex-wrap gap-1.5 border-b border-[#ffedd4]/15 pb-2">
          <button
            v-for="tab in modalTabs"
            :key="tab.id"
            type="button"
            class="px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors cursor-pointer"
            :class="
              activeModalTab === tab.id
                ? 'bg-[#2d2926] border-[#d7ad70] text-[#d7ad70]'
                : 'bg-[#141416] border-[#ffedd4]/20 text-[#ffedd4]/70 hover:text-[#ffedd4]'
            "
            @click="activeModalTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <form class="flex flex-col gap-4 text-xs" @submit.prevent="saveSkill">
          <!-- ================= TAB 1: GENERAL & TAGS ================= -->
          <div
            v-show="activeModalTab === 'general'"
            class="flex flex-col gap-4"
          >
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label class="flex flex-col gap-1">
                <span class="font-semibold text-[#d7ad70]">Skill ID *</span>
                <input
                  v-model.number="form.id"
                  type="number"
                  min="1"
                  required
                  :disabled="isEditing"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] focus:outline-none focus:border-[#d7ad70] disabled:opacity-50"
                />
              </label>

              <label class="flex flex-col gap-1 sm:col-span-2">
                <span class="font-semibold text-[#d7ad70]">Name *</span>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                />
              </label>

              <label class="flex flex-col gap-1">
                <span class="font-semibold text-[#d7ad70]">Command</span>
                <input
                  v-model="form.command"
                  type="text"
                  placeholder="e.g. SHIFT + Q"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                />
              </label>

              <label class="flex flex-col gap-1">
                <span class="font-semibold text-[#d7ad70]">Class *</span>
                <select
                  v-model="form.class_name"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                >
                  <option
                    v-for="cls in classesList"
                    :key="cls"
                    :value="capitalize(cls)"
                  >
                    {{ capitalize(cls) }}
                  </option>
                </select>
              </label>

              <label class="flex flex-col gap-1">
                <span class="font-semibold text-[#d7ad70]">Spec *</span>
                <select
                  v-model="form.skill_spec"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                >
                  <option v-for="spec in specsList" :key="spec" :value="spec">
                    {{ spec }}
                  </option>
                </select>
              </label>

              <label class="flex flex-col gap-1 sm:col-span-2">
                <span class="font-semibold text-[#d7ad70]">Icon Path</span>
                <input
                  v-model="form.icon_path"
                  type="text"
                  placeholder="/skills/hashashin/5619.webp"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] font-mono focus:outline-none focus:border-[#d7ad70]"
                />
              </label>

              <label class="flex flex-col gap-1">
                <span class="font-semibold text-[#d7ad70]">Cooldown (s)</span>
                <input
                  v-model.number="form.cooldown"
                  type="number"
                  step="any"
                  min="0"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                />
              </label>

              <label class="flex flex-col gap-1">
                <span class="font-semibold text-[#d7ad70]"
                  >Crit Hit Rate (%)</span
                >
                <input
                  v-model.number="form.crit_hit_rate"
                  type="number"
                  step="any"
                  min="0"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                />
              </label>

              <label class="flex flex-col gap-1">
                <span class="font-semibold text-[#d7ad70]"
                  >PvP Damage Reduction (%)</span
                >
                <input
                  v-model.number="form.pvp_damage"
                  type="number"
                  step="any"
                  min="0"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                />
              </label>
            </div>

            <!-- Tags Section -->
            <div
              class="p-3 bg-[#141416] border border-[#ffedd4]/15 rounded-[2px] flex flex-col gap-2.5"
            >
              <span class="font-semibold text-[#d7ad70]">
                Semantic Tags (Click to toggle)
              </span>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="presetTag in availableTags"
                  :key="presetTag"
                  type="button"
                  class="px-2.5 py-1 rounded-[2px] border font-mono text-xs transition-colors cursor-pointer"
                  :class="
                    form.tags.includes(presetTag)
                      ? 'bg-[#4f433c] border-[#d7ad70] text-[#ffedd4] font-semibold'
                      : 'bg-[#18181b] border-[#ffedd4]/20 text-[#ffedd4]/50 hover:border-[#ffedd4]/40'
                  "
                  @click="toggleTag(presetTag)"
                >
                  {{ form.tags.includes(presetTag) ? "✓ " : "+ "
                  }}{{ presetTag }}
                </button>
              </div>

              <!-- Custom Tag Input -->
              <div class="flex items-center gap-2 pt-1">
                <input
                  v-model="customTagInput"
                  type="text"
                  placeholder="Add custom tag..."
                  class="bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  @keydown.enter.prevent="addCustomTag"
                />
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-[2px] border border-[#414043] bg-[#3c3b3f] text-[#feecd3] hover:bg-[#544840] cursor-pointer"
                  @click="addCustomTag"
                >
                  Add Tag
                </button>
              </div>

              <div
                v-if="form.tags.length > 0"
                class="flex flex-wrap items-center gap-1.5 pt-1"
              >
                <span class="text-[#ffedd4]/50 text-[11px]">Active tags:</span>
                <span
                  v-for="tag in form.tags"
                  :key="tag"
                  class="px-2 py-0.5 rounded-[2px] bg-[#d7ad70]/20 border border-[#d7ad70]/40 text-[#d7ad70] font-mono text-[11px] flex items-center gap-1.5"
                >
                  {{ tag }}
                  <button
                    type="button"
                    class="text-[#ffedd4]/60 hover:text-red-400 cursor-pointer"
                    @click="toggleTag(tag)"
                  >
                    ✕
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- ================= TAB 2: PROTECTIONS, MODIFIERS & CCS ================= -->
          <div v-show="activeModalTab === 'flags'" class="flex flex-col gap-4">
            <!-- Protections -->
            <div
              class="p-3 bg-[#141416] border border-[#ffedd4]/15 rounded-[2px] flex flex-col gap-2"
            >
              <span class="font-semibold text-[#d7ad70]">Protections</span>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label
                  v-for="flag in protectionFlags"
                  :key="flag.key"
                  class="flex items-center gap-2 p-2 rounded-[2px] border cursor-pointer select-none transition-colors"
                  :class="
                    form[flag.key]
                      ? 'bg-[#2d2926] border-[#d7ad70] text-[#ffedd4]'
                      : 'bg-[#18181b] border-[#ffedd4]/15 text-[#ffedd4]/60'
                  "
                >
                  <input
                    v-model="form[flag.key]"
                    type="checkbox"
                    class="accent-[#d7ad70] cursor-pointer"
                  />
                  <span>{{ flag.label }}</span>
                </label>
              </div>
            </div>

            <!-- Attack Modifiers -->
            <div
              class="p-3 bg-[#141416] border border-[#ffedd4]/15 rounded-[2px] flex flex-col gap-2"
            >
              <span class="font-semibold text-[#d7ad70]">Attack Modifiers</span>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label
                  v-for="flag in modifierFlags"
                  :key="flag.key"
                  class="flex items-center gap-2 p-2 rounded-[2px] border cursor-pointer select-none transition-colors"
                  :class="
                    form[flag.key]
                      ? 'bg-[#2d2926] border-[#d7ad70] text-[#ffedd4]'
                      : 'bg-[#18181b] border-[#ffedd4]/15 text-[#ffedd4]/60'
                  "
                >
                  <input
                    v-model="form[flag.key]"
                    type="checkbox"
                    class="accent-[#d7ad70] cursor-pointer"
                  />
                  <span>{{ flag.label }}</span>
                </label>
              </div>
            </div>

            <!-- Crowd Controls -->
            <div
              class="p-3 bg-[#141416] border border-[#ffedd4]/15 rounded-[2px] flex flex-col gap-2"
            >
              <span class="font-semibold text-[#d7ad70]"
                >Crowd Control (CC)</span
              >
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label
                  v-for="flag in ccFlags"
                  :key="flag.key"
                  class="flex items-center gap-2 p-2 rounded-[2px] border cursor-pointer select-none transition-colors"
                  :class="
                    form[flag.key]
                      ? 'bg-[#2d2926] border-[#d7ad70] text-[#ffedd4]'
                      : 'bg-[#18181b] border-[#ffedd4]/15 text-[#ffedd4]/60'
                  "
                >
                  <input
                    v-model="form[flag.key]"
                    type="checkbox"
                    class="accent-[#d7ad70] cursor-pointer"
                  />
                  <span>{{ flag.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- ================= TAB 3: BUFFS & DEBUFFS ================= -->
          <div
            v-show="activeModalTab === 'buffs'"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <!-- Self Buffs Editor -->
            <div
              class="min-w-0 p-3 bg-[#141416] border border-[#ffedd4]/15 rounded-[2px] flex flex-col gap-3"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-emerald-300 truncate">
                  Self / Party Buffs
                </span>
                <button
                  type="button"
                  class="px-2 py-1 text-[11px] rounded-[2px] border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 cursor-pointer shrink-0"
                  @click="addBuffEntry"
                >
                  + Add Buff Stat
                </button>
              </div>

              <div
                v-if="selfBuffEntries.length === 0"
                class="text-[#ffedd4]/40 text-center py-4"
              >
                No self/party buffs configured.
              </div>

              <div
                v-for="(entry, idx) in selfBuffEntries"
                :key="idx"
                class="flex items-center gap-2 min-w-0"
              >
                <select
                  v-model="entry.key"
                  class="flex-1 min-w-0 bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                >
                  <option
                    v-for="stat in knownBuffStats"
                    :key="stat.key"
                    :value="stat.key"
                  >
                    {{ stat.label }}
                  </option>
                </select>
                <input
                  v-model.number="entry.value"
                  type="number"
                  step="any"
                  placeholder="Value"
                  class="w-20 shrink-0 bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] font-mono focus:outline-none focus:border-[#d7ad70]"
                />
                <button
                  type="button"
                  class="text-red-400 hover:text-red-300 px-1 shrink-0 cursor-pointer"
                  title="Remove stat"
                  @click="selfBuffEntries.splice(idx, 1)"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Target Debuffs Editor -->
            <div
              class="min-w-0 p-3 bg-[#141416] border border-[#ffedd4]/15 rounded-[2px] flex flex-col gap-3"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-rose-300 truncate">
                  Target Debuffs
                </span>
                <button
                  type="button"
                  class="px-2 py-1 text-[11px] rounded-[2px] border border-rose-500/40 bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 cursor-pointer shrink-0"
                  @click="addDebuffEntry"
                >
                  + Add Debuff Stat
                </button>
              </div>

              <div
                v-if="targetDebuffEntries.length === 0"
                class="text-[#ffedd4]/40 text-center py-4"
              >
                No target debuffs configured.
              </div>

              <div
                v-for="(entry, idx) in targetDebuffEntries"
                :key="idx"
                class="flex items-center gap-2 min-w-0"
              >
                <select
                  v-model="entry.key"
                  class="flex-1 min-w-0 bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                >
                  <option
                    v-for="stat in knownDebuffStats"
                    :key="stat.key"
                    :value="stat.key"
                  >
                    {{ stat.label }}
                  </option>
                </select>
                <input
                  v-model.number="entry.value"
                  type="number"
                  step="any"
                  placeholder="Value"
                  class="w-20 shrink-0 bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] font-mono focus:outline-none focus:border-[#d7ad70]"
                />
                <button
                  type="button"
                  class="text-red-400 hover:text-red-300 px-1 shrink-0 cursor-pointer"
                  title="Remove stat"
                  @click="targetDebuffEntries.splice(idx, 1)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- ================= TAB 4: HITS MANAGER ================= -->
          <div v-show="activeModalTab === 'hits'" class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-[#d7ad70]">
                Skill Hits ({{ form.hits.length }})
              </span>
              <button
                type="button"
                class="px-3 py-1 text-xs font-medium rounded-[2px] border border-[#d7ad70]/50 bg-[#2d2926] text-[#feecd3] hover:border-[#d7ad70] cursor-pointer"
                @click="addHit"
              >
                + Add Hit
              </button>
            </div>

            <div
              v-if="form.hits.length === 0"
              class="p-6 bg-[#141416] border border-[#ffedd4]/15 rounded-[2px] text-center text-[#ffedd4]/40"
            >
              No hits configured for this skill.
            </div>

            <div
              v-else
              class="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1"
            >
              <div
                v-for="(hit, index) in form.hits"
                :key="index"
                class="p-2.5 bg-[#141416] border border-[#ffedd4]/20 rounded-[2px] flex flex-col gap-2"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[11px] text-[#d7ad70] font-bold">
                    Hit #{{ index + 1 }}
                  </span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="text-[11px] text-[#ffedd4]/60 hover:text-[#d7ad70] cursor-pointer"
                      @click="duplicateHit(index)"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      class="text-[11px] text-red-400 hover:underline cursor-pointer"
                      @click="removeHit(index)"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div class="flex flex-wrap sm:flex-nowrap items-end gap-2">
                  <label class="flex flex-col gap-1 flex-1 min-w-0">
                    <span class="text-[#ffedd4]/70 text-[11px]"
                      >Description</span
                    >
                    <input
                      v-model="hit.description"
                      type="text"
                      placeholder="e.g. Attack 1 damage 2896% x2"
                      class="w-full bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                    />
                  </label>

                  <label class="flex flex-col gap-1 w-28 shrink-0">
                    <span class="text-[#ffedd4]/70 text-[11px]">Damage %</span>
                    <input
                      v-model.number="hit.damage_percent"
                      type="number"
                      step="any"
                      min="0"
                      class="w-full bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] font-mono focus:outline-none focus:border-[#d7ad70]"
                    />
                  </label>

                  <label class="flex flex-col gap-1 w-24 shrink-0">
                    <span class="text-[#ffedd4]/70 text-[11px]">Hit Count</span>
                    <input
                      v-model.number="hit.hit_count"
                      type="number"
                      min="1"
                      class="w-full bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] font-mono focus:outline-none focus:border-[#d7ad70]"
                    />
                  </label>
                </div>

                <!-- Per-hit boolean flags -->
                <div class="flex flex-wrap gap-1 pt-0.5">
                  <button
                    v-for="flag in allSkillFlags"
                    :key="flag.key"
                    type="button"
                    class="px-2 py-0.5 rounded-[2px] border text-[10px] font-mono transition-colors cursor-pointer"
                    :class="
                      hit[flag.key]
                        ? 'bg-[#4f433c] border-[#d7ad70] text-[#ffedd4]'
                        : 'bg-[#18181b] border-[#ffedd4]/15 text-[#ffedd4]/40 hover:text-[#ffedd4]/70'
                    "
                    @click="hit[flag.key] = !hit[flag.key]"
                  >
                    {{ flag.shortLabel || flag.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div
            class="flex items-center justify-end gap-2 pt-3 border-t border-[#ffedd4]/15 mt-2"
          >
            <button
              type="button"
              class="px-3 py-1.5 text-xs text-[#ffedd4]/70 hover:text-[#ffedd4] cursor-pointer"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 text-xs font-medium rounded-[2px] border border-[#414043] bg-[#3c3b3f] text-[#feecd3] hover:border-[#665246] hover:bg-[#544840] hover:text-[#fdebd3] transition-colors cursor-pointer"
            >
              {{ isEditing ? "Save Changes" : "Create Skill" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Permission & Auth Check
const { data: currentUser } = await useFetch("/api/v1/user");

const userFeatures = computed(() => currentUser.value?.features || []);

const canCreateSkill = computed(() =>
  userFeatures.value.includes("create:skill"),
);
const canUpdateSkill = computed(() =>
  userFeatures.value.includes("update:skill"),
);
const canDeleteSkill = computed(() =>
  userFeatures.value.includes("delete:skill"),
);

const hasSkillsAccess = computed(
  () => canCreateSkill.value || canUpdateSkill.value || canDeleteSkill.value,
);

if (!hasSkillsAccess.value) {
  await navigateTo("/");
}

useHead({
  title: "Skill Manager",
});

const classesList = [
  "warrior",
  "ranger",
  "sorceress",
  "berserker",
  "tamer",
  "musa",
  "maehwa",
  "valkyrie",
  "kunoichi",
  "ninja",
  "wizard",
  "witch",
  "dark knight",
  "striker",
  "mystic",
  "lahn",
  "archer",
  "shai",
  "guardian",
  "hashashin",
  "nova",
  "sage",
  "corsair",
  "drakania",
  "woosa",
  "maegu",
  "scholar",
  "dosa",
  "deadeye",
  "wukong",
  "seraph",
];

const specsList = [
  "Awakening",
  "Prime",
  "Absolute",
  "Ascension",
  "Secondary Skills",
  "Magnus",
];

const availableTags = [
  "party_buff",
  "e_buff",
  "z_buff",
  "pre_buff",
  "magnus",
  "rabam",
];

const protectionFlags = [
  { key: "is_sa", label: "Super Armor (SA)", shortLabel: "SA" },
  { key: "is_fg", label: "Forward Guard (FG)", shortLabel: "FG" },
  { key: "is_if", label: "Invincibility (IF)", shortLabel: "IF" },
];

const modifierFlags = [
  { key: "is_down_attack", label: "Down Attack", shortLabel: "Down Atk" },
  { key: "is_air_attack", label: "Air Attack", shortLabel: "Air Atk" },
  { key: "is_down_smash", label: "Down Smash", shortLabel: "Down Smash" },
  { key: "is_air_smash", label: "Air Smash", shortLabel: "Air Smash" },
];

const ccFlags = [
  { key: "is_knockdown", label: "Knockdown", shortLabel: "KD" },
  { key: "is_floating", label: "Floating", shortLabel: "Float" },
  { key: "is_bound", label: "Bound", shortLabel: "Bound" },
  { key: "is_stun", label: "Stun", shortLabel: "Stun" },
  { key: "is_stiffness", label: "Stiffness", shortLabel: "Stiff" },
  { key: "is_knockback", label: "Knockback", shortLabel: "KB" },
  { key: "is_grapple", label: "Grapple", shortLabel: "Grab" },
  { key: "is_freezing", label: "Freezing", shortLabel: "Freeze" },
];

const allSkillFlags = [...protectionFlags, ...modifierFlags, ...ccFlags];

const knownBuffStats = [
  { key: "duration", label: "Duration (s)" },
  { key: "all_ap", label: "All AP" },
  { key: "max_hp", label: "Max HP" },
  { key: "accuracy", label: "Accuracy" },
  { key: "evasion", label: "All Evasion" },
  { key: "damage_reduction", label: "All DR" },
  { key: "damage_reduction_rate", label: "Bonus DR %" },
  { key: "crit_hit_rate", label: "Critical Hit Rate %" },
  { key: "crit_damage", label: "Critical Hit Damage %" },
  { key: "down_attack_damage", label: "Down Attack Damage %" },
  { key: "back_attack_damage", label: "Back Attack Damage %" },
  { key: "air_attack_damage", label: "Air Attack Damage %" },
  { key: "special_attack_damage", label: "All Special Attack Damage %" },
  { key: "attack_speed", label: "Attack Speed %" },
  { key: "casting_speed", label: "Casting Speed %" },
  { key: "movement_speed", label: "Movement Speed %" },
];

const knownDebuffStats = [
  { key: "duration", label: "Duration (s)" },
  { key: "damage_reduction", label: "All DR" },
  { key: "damage_reduction_rate", label: "Bonus DR %" },
  { key: "evasion", label: "All Evasion" },
  { key: "all_ap", label: "All AP" },
  { key: "accuracy", label: "Accuracy" },
  { key: "attack_speed", label: "Attack Speed %" },
  { key: "casting_speed", label: "Casting Speed %" },
  { key: "movement_speed", label: "Movement Speed %" },
];

// Filters
const filterClass = ref("hashashin");
const filterSpec = ref("");
const filterTag = ref("");
const searchQuery = ref("");

watch(filterTag, (newTag) => {
  if (!newTag && !filterClass.value) {
    filterClass.value = "hashashin";
  }
});

// Modal & Tabs State
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const activeModalTab = ref("general");
const customTagInput = ref("");

const selfBuffEntries = ref([]);
const targetDebuffEntries = ref([]);

const modalTabs = computed(() => [
  { id: "general", label: "1. General & Tags" },
  { id: "flags", label: "2. Protections & CCs" },
  {
    id: "buffs",
    label: `3. Buffs (${selfBuffEntries.value.length}) & Debuffs (${targetDebuffEntries.value.length})`,
  },
  { id: "hits", label: `4. Hits (${form.value.hits.length})` },
]);

const defaultHit = () => ({
  description: "",
  damage_percent: 0,
  hit_count: 1,
  is_sa: false,
  is_fg: false,
  is_if: false,
  is_down_attack: false,
  is_air_attack: false,
  is_down_smash: false,
  is_air_smash: false,
  is_knockback: false,
  is_stun: false,
  is_knockdown: false,
  is_floating: false,
  is_stiffness: false,
  is_bound: false,
  is_grapple: false,
  is_freezing: false,
});

const defaultForm = () => ({
  id: null,
  name: "",
  command: "",
  class_name: "Hashashin",
  skill_spec: "Awakening",
  cooldown: 0,
  crit_hit_rate: 0,
  pvp_damage: 0,
  icon_path: "/icons/default_skill.webp",
  is_sa: false,
  is_fg: false,
  is_if: false,
  is_down_attack: false,
  is_air_attack: false,
  is_down_smash: false,
  is_air_smash: false,
  is_knockback: false,
  is_stun: false,
  is_knockdown: false,
  is_floating: false,
  is_stiffness: false,
  is_bound: false,
  is_grapple: false,
  is_freezing: false,
  tags: [],
  self_buffs: {},
  target_debuffs: {},
  hits: [],
});

const form = ref(defaultForm());

const {
  data: skillsList,
  refresh,
  status,
} = await useFetch("/api/v1/skills", {
  query: computed(() => ({
    className: filterClass.value || undefined,
    spec: filterClass.value && filterSpec.value ? filterSpec.value : undefined,
    tag: filterTag.value || undefined,
  })),
  immediate: hasSkillsAccess.value,
});

const filteredSkills = computed(() => {
  const list = skillsList.value || [];
  if (!searchQuery.value.trim()) return list;

  const q = searchQuery.value.toLowerCase().trim();
  return list.filter(
    (s) =>
      s.name?.toLowerCase().includes(q) ||
      String(s.id).includes(q) ||
      s.command?.toLowerCase().includes(q),
  );
});

function capitalize(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function hasObjectKeys(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  return Object.keys(obj).length > 0;
}

function countObjectKeys(obj) {
  if (!hasObjectKeys(obj)) return 0;
  return Object.keys(obj).length;
}

function objectToEntries(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
  return Object.entries(obj).map(([key, value]) => ({
    key,
    value: Number(value) || 0,
  }));
}

function entriesToObject(entries) {
  const result = {};
  for (const item of entries) {
    if (item.key && item.key.trim() !== "") {
      result[item.key.trim()] = Number(item.value) || 0;
    }
  }
  return result;
}

function toggleTag(tag) {
  const idx = form.value.tags.indexOf(tag);
  if (idx === -1) {
    form.value.tags.push(tag);
  } else {
    form.value.tags.splice(idx, 1);
  }
}

function addCustomTag() {
  const cleaned = customTagInput.value.trim().toLowerCase();
  if (cleaned && !form.value.tags.includes(cleaned)) {
    form.value.tags.push(cleaned);
  }
  customTagInput.value = "";
}

function addBuffEntry() {
  selfBuffEntries.value.push({ key: "all_ap", value: 0 });
}

function addDebuffEntry() {
  targetDebuffEntries.value.push({ key: "damage_reduction", value: 0 });
}

function addHit() {
  form.value.hits.push(defaultHit());
}

function duplicateHit(index) {
  const source = form.value.hits[index];
  form.value.hits.splice(index + 1, 0, { ...source });
}

function removeHit(index) {
  form.value.hits.splice(index, 1);
}

function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  activeModalTab.value = "general";
  customTagInput.value = "";
  form.value = defaultForm();
  if (filterClass.value) {
    form.value.class_name = capitalize(filterClass.value);
  }
  selfBuffEntries.value = [];
  targetDebuffEntries.value = [];
  showModal.value = true;
}

function openEditModal(skill) {
  isEditing.value = true;
  editingId.value = skill.id;
  activeModalTab.value = "general";
  customTagInput.value = "";

  form.value = {
    ...defaultForm(),
    ...skill,
    cooldown: Number(skill.cooldown) || 0,
    crit_hit_rate: Number(skill.crit_hit_rate) || 0,
    pvp_damage: Number(skill.pvp_damage) || 0,
    is_sa: Boolean(skill.is_sa),
    is_fg: Boolean(skill.is_fg),
    is_if: Boolean(skill.is_if),
    is_down_attack: Boolean(skill.is_down_attack),
    is_air_attack: Boolean(skill.is_air_attack),
    is_down_smash: Boolean(skill.is_down_smash),
    is_air_smash: Boolean(skill.is_air_smash),
    is_knockback: Boolean(skill.is_knockback),
    is_stun: Boolean(skill.is_stun),
    is_knockdown: Boolean(skill.is_knockdown),
    is_floating: Boolean(skill.is_floating),
    is_stiffness: Boolean(skill.is_stiffness),
    is_bound: Boolean(skill.is_bound),
    is_grapple: Boolean(skill.is_grapple),
    is_freezing: Boolean(skill.is_freezing),
    tags: Array.isArray(skill.tags) ? [...skill.tags] : [],
    hits: Array.isArray(skill.hits)
      ? skill.hits.map((h) => ({
          ...defaultHit(),
          ...h,
          damage_percent: Number(h.damage_percent) || 0,
          hit_count: Number(h.hit_count) || 1,
          is_sa: Boolean(h.is_sa),
          is_fg: Boolean(h.is_fg),
          is_if: Boolean(h.is_if),
          is_down_attack: Boolean(h.is_down_attack),
          is_air_attack: Boolean(h.is_air_attack),
          is_down_smash: Boolean(h.is_down_smash),
          is_air_smash: Boolean(h.is_air_smash),
          is_knockback: Boolean(h.is_knockback),
          is_stun: Boolean(h.is_stun),
          is_knockdown: Boolean(h.is_knockdown),
          is_floating: Boolean(h.is_floating),
          is_stiffness: Boolean(h.is_stiffness),
          is_bound: Boolean(h.is_bound),
          is_grapple: Boolean(h.is_grapple),
          is_freezing: Boolean(h.is_freezing),
        }))
      : [],
  };

  selfBuffEntries.value = objectToEntries(skill.self_buffs);
  targetDebuffEntries.value = objectToEntries(skill.target_debuffs);
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingId.value = null;
}

async function saveSkill() {
  try {
    const payload = {
      ...form.value,
      cooldown: Number(form.value.cooldown) || 0,
      crit_hit_rate: Number(form.value.crit_hit_rate) || 0,
      pvp_damage: Number(form.value.pvp_damage) || 0,
      self_buffs: entriesToObject(selfBuffEntries.value),
      target_debuffs: entriesToObject(targetDebuffEntries.value),
      hits: form.value.hits.map((h) => ({
        description: h.description || null,
        damage_percent: Number(h.damage_percent) || 0,
        hit_count: Number(h.hit_count) || 1,
        is_sa: Boolean(h.is_sa),
        is_fg: Boolean(h.is_fg),
        is_if: Boolean(h.is_if),
        is_down_attack: Boolean(h.is_down_attack),
        is_air_attack: Boolean(h.is_air_attack),
        is_down_smash: Boolean(h.is_down_smash),
        is_air_smash: Boolean(h.is_air_smash),
        is_knockback: Boolean(h.is_knockback),
        is_stun: Boolean(h.is_stun),
        is_knockdown: Boolean(h.is_knockdown),
        is_floating: Boolean(h.is_floating),
        is_stiffness: Boolean(h.is_stiffness),
        is_bound: Boolean(h.is_bound),
        is_grapple: Boolean(h.is_grapple),
        is_freezing: Boolean(h.is_freezing),
      })),
    };

    if (isEditing.value) {
      await $fetch(`/api/v1/skills/${editingId.value}`, {
        method: "PATCH",
        body: payload,
      });
    } else {
      await $fetch("/api/v1/skills", {
        method: "POST",
        body: payload,
      });
    }

    closeModal();
    await refresh();
  } catch (err) {
    alert("Error saving skill: " + (err?.data?.message || err.message));
  }
}

async function deleteSkill(id) {
  if (!confirm(`Are you sure you want to delete skill #${id}?`)) return;
  try {
    await $fetch(`/api/v1/skills/${id}`, { method: "DELETE" });
    await refresh();
  } catch (err) {
    alert("Error deleting skill: " + (err?.data?.message || err.message));
  }
}
</script>
