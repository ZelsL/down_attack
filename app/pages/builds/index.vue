<template>
  <div class="min-h-[calc(100vh-4.5rem)] bg-[#222122]">
    <!-- Under Construction (shown when user does not have admin permissions) -->
    <div
      v-if="!hasAdminAccess"
      class="min-h-[calc(100vh-4.5rem)] p-4 flex items-center justify-center text-[#ffedd4]"
    >
      <div
        class="bg-[#18181b] border border-[#ffedd4]/20 rounded-[2px] p-8 max-w-md w-full flex flex-col items-center text-center gap-4 shadow-2xl"
      >
        <div
          class="w-14 h-14 rounded-full bg-[#3c3b3f] border border-[#ffedd4]/20 flex items-center justify-center text-2xl text-[#d7ad70]"
        >
          <span class="leading-none">🛠️</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <h1 class="text-lg font-bold text-[#d7ad70]">Under Construction</h1>
          <p class="text-xs text-[#ffedd4]/60 leading-relaxed">
            This section is currently under development. Stay tuned for future
            updates!
          </p>
        </div>

        <NuxtLink
          to="/"
          class="mt-2 px-4 py-1.5 text-xs font-medium rounded-[2px] border border-[#414043] bg-[#3c3b3f] text-[#feecd3] hover:border-[#665246] hover:bg-[#544840] hover:text-[#fdebd3] transition-colors duration-150 cursor-pointer"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>

    <!-- Administrative Preset Manager (accessible by users with update:preset:others) -->
    <div v-else class="p-4 md:p-6 lg:p-8 flex flex-col gap-5 text-[#ffedd4]">
      <!-- Top: Title and Action Buttons -->
      <header
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ffedd4]/20"
      >
        <div>
          <h1 class="text-xl font-bold text-[#d7ad70]">Preset Manager</h1>
          <p class="text-xs text-[#ffedd4]/60 mt-0.5">
            Administrative dashboard to register and manage official and
            community presets.
          </p>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            class="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium rounded-[2px] border border-[#d7ad70]/60 bg-[#2d2926] text-[#feecd3] hover:border-[#d7ad70] hover:bg-[#3c352e] hover:text-[#fdebd3] transition-colors duration-150 cursor-pointer focus:outline-none"
            @click="openImportModal"
          >
            <span class="text-sm leading-none">📥</span>
            <span>Import Preset</span>
          </button>

          <button
            type="button"
            class="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium rounded-[2px] border border-[#414043] bg-[#3c3b3f] text-[#feecd3] hover:border-[#665246] hover:bg-[#544840] hover:text-[#fdebd3] transition-colors duration-150 cursor-pointer focus:outline-none"
            @click="openCreateModal"
          >
            <span class="text-base font-light leading-none">+</span>
            <span>New Preset</span>
          </button>
        </div>
      </header>

      <!-- Filter Bar -->
      <section
        class="bg-[#18181b] border border-[#ffedd4]/20 rounded-[2px] p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div class="flex items-center flex-wrap gap-2">
          <!-- Scope Filter -->
          <select
            v-model="filterScope"
            class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70] cursor-pointer"
          >
            <option value="official">Official Only</option>
            <option value="community">Community</option>
            <option value="mine">My Presets</option>
          </select>

          <!-- Class Filter -->
          <select
            v-model="filterClass"
            class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70] cursor-pointer"
          >
            <option value="">All Classes</option>
            <option
              v-for="cls in classesList"
              :key="cls"
              :value="cls"
              class="bg-[#18181b]"
            >
              {{ capitalize(cls) }}
            </option>
          </select>

          <!-- Tier Filter -->
          <select
            v-model="filterTier"
            class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70] cursor-pointer"
          >
            <option value="">All Tiers</option>
            <option v-for="t in tiersList" :key="t" :value="t">
              Tier: {{ t }}
            </option>
          </select>
        </div>

        <!-- Search by Name -->
        <div class="flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name..."
            class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] placeholder-[#ffedd4]/40 focus:outline-none focus:border-[#d7ad70]"
          />
          <span class="text-xs text-[#ffedd4]/60 font-mono">
            ({{ filteredPresets.length }})
          </span>
        </div>
      </section>

      <!-- Loading State -->
      <div
        v-if="status === 'pending'"
        class="py-12 text-center text-xs text-[#d7ad70]"
      >
        Loading presets...
      </div>

      <!-- Presets Table -->
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
                <th class="p-3">Name</th>
                <th class="p-3">Class & Spec</th>
                <th class="p-3">Tier</th>
                <th class="p-3 text-center">Official?</th>
                <th class="p-3">AP / AAP</th>
                <th class="p-3">DR / Eva / HP</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#ffedd4]/10">
              <tr
                v-for="preset in filteredPresets"
                :key="preset.id"
                class="hover:bg-[#ffedd4]/5 transition-colors"
              >
                <td class="p-3 font-semibold text-[#ffedd4]">
                  {{ preset.name }}
                </td>
                <td class="p-3 text-[#ffedd4]/80">
                  {{ preset.class_name }}
                  <span class="text-[#ffedd4]/50">({{ preset.spec }})</span>
                </td>
                <td class="p-3">
                  <span
                    v-if="preset.tier"
                    class="px-1.5 py-0.5 rounded-[2px] bg-[#d7ad70]/15 text-[#d7ad70] border border-[#d7ad70]/30 font-mono text-[11px]"
                  >
                    {{ preset.tier }}
                  </span>
                  <span v-else class="text-[#ffedd4]/30">-</span>
                </td>
                <td class="p-3 text-center">
                  <span
                    v-if="preset.is_official"
                    class="px-2 py-0.5 rounded-[2px] bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold"
                  >
                    Official
                  </span>
                  <span v-else class="text-[#ffedd4]/30 text-[11px]"> No </span>
                </td>
                <td class="p-3 font-mono text-[#ffedd4]/90">
                  {{ preset.ap }} / {{ preset.aap }}
                  <span
                    v-if="preset.adventureap"
                    class="text-[10px] text-[#ffedd4]/40"
                  >
                    (Tot: {{ preset.adventureap }})
                  </span>
                </td>
                <td class="p-3 font-mono text-[#ffedd4]/90">
                  DR: {{ preset.mldr }} | Eva: {{ preset.meev }} | HP:
                  {{ preset.hp }}
                </td>
                <td class="p-3 text-right space-x-2">
                  <NuxtLink
                    :to="`/calculator?p1=${preset.id}`"
                    class="text-[#d7ad70]/80 hover:text-[#d7ad70] hover:underline cursor-pointer"
                    title="Load this preset into calculator"
                  >
                    Calc
                  </NuxtLink>
                  <button
                    type="button"
                    class="text-[#d7ad70] hover:underline cursor-pointer"
                    @click="openEditModal(preset)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="text-red-400 hover:underline cursor-pointer"
                    @click="deletePreset(preset.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>

              <tr v-if="filteredPresets.length === 0">
                <td colspan="7" class="p-8 text-center text-[#ffedd4]/50">
                  No presets found matching current filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Import Preset Modal -->
      <div
        v-if="showImportModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      >
        <div
          class="bg-[#18181b] border border-[#d7ad70]/60 rounded-[2px] w-full max-w-lg p-5 flex flex-col gap-4 shadow-2xl"
        >
          <div
            class="flex items-center justify-between pb-2 border-b border-[#ffedd4]/15"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg leading-none">📥</span>
              <h2 class="text-base font-bold text-[#d7ad70]">Import Preset</h2>
            </div>
            <button
              type="button"
              class="text-[#ffedd4]/60 hover:text-[#ffedd4] text-base leading-none cursor-pointer"
              @click="closeImportModal"
            >
              ✕
            </button>
          </div>

          <div class="flex flex-col gap-3">
            <!-- Input for Garmoth URL/ID or DownAttack Text -->
            <label class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-[#d7ad70]">
                Garmoth URL / ID or DownAttack Text *
              </span>
              <textarea
                v-model="importInput"
                rows="5"
                placeholder="Paste Garmoth URL (e.g. garmoth.com/character/...) or ID, or paste DownAttack preset text here..."
                class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] p-2.5 text-xs font-mono text-[#ffedd4] placeholder-[#ffedd4]/40 focus:outline-none focus:border-[#d7ad70] resize-none"
              />
            </label>

            <!-- Optional Title override -->
            <label class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-[#d7ad70]">
                Preset Name (Optional)
              </span>
              <input
                v-model="importTitle"
                type="text"
                placeholder="Leave blank to use detected name"
                class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-xs text-[#ffedd4] placeholder-[#ffedd4]/40 focus:outline-none focus:border-[#d7ad70]"
              />
            </label>

            <!-- Tier Selection and Checkboxes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-[#d7ad70]">Tier</span>
                <select
                  v-model="importTier"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70] cursor-pointer"
                >
                  <option value="">None</option>
                  <option v-for="t in tiersList" :key="t" :value="t">
                    {{ t }}
                  </option>
                </select>
              </label>

              <div class="flex flex-col justify-end gap-1.5 pb-1">
                <label class="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    v-model="importIsOfficial"
                    type="checkbox"
                    class="rounded accent-[#d7ad70] cursor-pointer"
                  />
                  <span class="font-semibold text-amber-300">★ Official</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    v-model="importIsPublic"
                    type="checkbox"
                    class="rounded accent-[#d7ad70] cursor-pointer"
                  />
                  <span>Public</span>
                </label>
              </div>
            </div>

            <!-- Feedback / Status message -->
            <div
              v-if="importStatus.message"
              class="text-xs px-2.5 py-1.5 rounded-[2px] text-center"
              :class="
                importStatus.type === 'error'
                  ? 'bg-red-950/60 border border-red-500/40 text-red-300'
                  : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              "
            >
              {{ importStatus.message }}
            </div>

            <!-- Modal Action Buttons -->
            <div
              class="flex items-center justify-end gap-2 pt-3 border-t border-[#ffedd4]/15 mt-1"
            >
              <button
                type="button"
                class="px-3 py-1.5 text-xs text-[#ffedd4]/70 hover:text-[#ffedd4] cursor-pointer"
                @click="closeImportModal"
              >
                Cancel
              </button>

              <button
                type="button"
                :disabled="isImporting"
                class="px-3 py-1.5 text-xs font-medium rounded-[2px] border border-[#d7ad70]/50 bg-[#2d2926] text-[#feecd3] hover:border-[#d7ad70] hover:bg-[#3c352e] transition-colors cursor-pointer disabled:opacity-50"
                @click="handleImportToEditor"
              >
                Review in Editor
              </button>

              <button
                type="button"
                :disabled="isImporting"
                class="px-4 py-1.5 text-xs font-medium rounded-[2px] border border-[#414043] bg-[#3c3b3f] text-[#feecd3] hover:border-[#665246] hover:bg-[#544840] hover:text-[#fdebd3] transition-colors cursor-pointer disabled:opacity-50"
                @click="handleImportAndSave"
              >
                {{ isImporting ? "Importing..." : "Import & Save" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create / Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      >
        <div
          class="bg-[#18181b] border border-[#d7ad70]/60 rounded-[2px] w-full max-w-2xl p-5 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="flex items-center justify-between pb-2 border-b border-[#ffedd4]/15"
          >
            <h2 class="text-base font-bold text-[#d7ad70]">
              {{ isEditing ? "Edit Preset" : "New Preset" }}
            </h2>
            <button
              type="button"
              class="text-[#ffedd4]/60 hover:text-[#ffedd4] text-base leading-none cursor-pointer"
              @click="closeModal"
            >
              ✕
            </button>
          </div>

          <!-- Quick Auto-fill bar inside modal -->
          <div
            class="p-2.5 bg-[#141416] border border-[#d7ad70]/30 rounded-[2px] flex flex-col gap-2"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-semibold text-[#d7ad70] flex items-center gap-1.5"
              >
                <span>📥</span> Quick Import (Garmoth URL/ID or Text)
              </span>
              <span class="text-[10px] text-[#ffedd4]/40"
                >Auto-fills all form stats below</span
              >
            </div>
            <div class="flex gap-2">
              <input
                v-model="modalQuickImportText"
                type="text"
                placeholder="Paste Garmoth URL/ID or DownAttack text snippet..."
                class="flex-1 bg-[#18181b] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1 text-xs text-[#ffedd4] placeholder-[#ffedd4]/40 focus:outline-none focus:border-[#d7ad70]"
              />
              <button
                type="button"
                :disabled="isQuickImporting"
                class="px-3 py-1 text-xs font-medium rounded-[2px] border border-[#d7ad70]/50 bg-[#2d2926] text-[#feecd3] hover:border-[#d7ad70] hover:bg-[#3c352e] transition-colors cursor-pointer disabled:opacity-50"
                @click="handleModalQuickImport"
              >
                {{ isQuickImporting ? "Loading..." : "Auto-fill" }}
              </button>
            </div>
            <div
              v-if="modalQuickImportFeedback.message"
              class="text-[11px] px-2 py-0.5 rounded text-center"
              :class="
                modalQuickImportFeedback.type === 'error'
                  ? 'text-red-400'
                  : 'text-emerald-400'
              "
            >
              {{ modalQuickImportFeedback.message }}
            </div>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="savePreset">
            <!-- Block 1: Basic Identification -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label class="flex flex-col gap-1 sm:col-span-2">
                <span class="text-xs font-semibold text-[#d7ad70]"
                  >Preset Name *</span
                >
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g. Hashashin Solare DR Meta"
                  required
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                />
              </label>

              <label class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-[#d7ad70]">Tier</span>
                <select
                  v-model="form.tier"
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                >
                  <option value="">None</option>
                  <option v-for="t in tiersList" :key="t" :value="t">
                    {{ t }}
                  </option>
                </select>
              </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-[#d7ad70]"
                  >Class *</span
                >
                <select
                  v-model="form.class_name"
                  required
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
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
                <span class="text-xs font-semibold text-[#d7ad70]"
                  >Specialization (Spec) *</span
                >
                <select
                  v-model="form.spec"
                  required
                  class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2.5 py-1.5 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                >
                  <option value="Awakening">Awakening</option>
                  <option value="Succession">Succession</option>
                </select>
              </label>
            </div>

            <!-- Block 2: Permissions and Visibility -->
            <div
              class="flex items-center gap-6 p-2 bg-[#141416] border border-[#ffedd4]/10 rounded-[2px]"
            >
              <label class="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  v-model="form.is_official"
                  type="checkbox"
                  class="rounded accent-[#d7ad70] cursor-pointer"
                />
                <span class="font-semibold text-amber-300"
                  >★ Mark as Official</span
                >
              </label>

              <label class="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  v-model="form.is_public"
                  type="checkbox"
                  class="rounded accent-[#d7ad70] cursor-pointer"
                />
                <span>Public (visible to community)</span>
              </label>
            </div>

            <!-- Block 3: Attack Attributes -->
            <div class="border-t border-[#ffedd4]/10 pt-3 flex flex-col gap-2">
              <span class="text-xs font-bold text-[#d7ad70] uppercase">
                Attack & Accuracy
              </span>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Sheet AP</span>
                  <input
                    v-model.number="form.ap"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Sheet AAP</span>
                  <input
                    v-model.number="form.aap"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Total AP</span>
                  <input
                    v-model.number="form.adventureap"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Total AAP</span>
                  <input
                    v-model.number="form.adventureaap"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Accuracy (Acc)</span>
                  <input
                    v-model.number="form.acc"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
              </div>
            </div>

            <!-- Block 4: Damage Reduction (DR) & HP -->
            <div class="border-t border-[#ffedd4]/10 pt-3 flex flex-col gap-2">
              <span class="text-xs font-bold text-[#d7ad70] uppercase">
                Damage Reduction (DR) & HP
              </span>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Total HP</span>
                  <input
                    v-model.number="form.hp"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Melee DR</span>
                  <input
                    v-model.number="form.mldr"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Ranged DR</span>
                  <input
                    v-model.number="form.radr"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Magic DR</span>
                  <input
                    v-model.number="form.madr"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Bonus DR %</span>
                  <input
                    v-model.number="form.bdrp"
                    type="number"
                    step="0.1"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
              </div>
            </div>

            <!-- Block 5: Evasion -->
            <div class="border-t border-[#ffedd4]/10 pt-3 flex flex-col gap-2">
              <span class="text-xs font-bold text-[#d7ad70] uppercase">
                Evasion
              </span>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Melee Evasion</span>
                  <input
                    v-model.number="form.meev"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Ranged Evasion</span>
                  <input
                    v-model.number="form.raev"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Magic Evasion</span>
                  <input
                    v-model.number="form.maev"
                    type="number"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
              </div>
            </div>

            <!-- Block 6: Critical & Special Attack Modifiers -->
            <div class="border-t border-[#ffedd4]/10 pt-3 flex flex-col gap-2">
              <span class="text-xs font-bold text-[#d7ad70] uppercase">
                Critical & Special Attack Modifiers
              </span>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Critical Rate %</span>
                  <input
                    v-model.number="form.chc"
                    type="number"
                    step="0.1"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Critical Damage %</span>
                  <input
                    v-model.number="form.chrp"
                    type="number"
                    step="0.1"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Down Attack %</span>
                  <input
                    v-model.number="form.adad"
                    type="number"
                    step="0.1"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Back Attack %</span>
                  <input
                    v-model.number="form.abad"
                    type="number"
                    step="0.1"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[#ffedd4]/70">Air Attack %</span>
                  <input
                    v-model.number="form.aaad"
                    type="number"
                    step="0.1"
                    class="bg-[#141416] border border-[#ffedd4]/30 rounded-[2px] px-2 py-1 text-xs text-[#ffedd4] focus:outline-none focus:border-[#d7ad70]"
                  />
                </label>
              </div>
            </div>

            <!-- Modal Buttons -->
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
                {{ isEditing ? "Save Changes" : "Create Preset" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Permission & Auth Check
const { data: currentUser } = await useFetch("/api/v1/user");

const hasAdminAccess = computed(() => {
  return Boolean(currentUser.value?.features?.includes("update:preset:others"));
});

useHead({
  title: computed(() =>
    hasAdminAccess.value ? "Preset Manager" : "Under Construction",
  ),
});

const tiersList = ["AOS", "T1", "T2", "T3", "AG", "A4", "SEASON"];

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
  "darkknight",
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
];

// Filters
const filterScope = ref("official");
const filterClass = ref("");
const filterTier = ref("");
const searchQuery = ref("");

// Main CRUD Modal & Form State
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

// Import Modal State
const showImportModal = ref(false);
const importInput = ref("");
const importTitle = ref("");
const importTier = ref("AOS");
const importIsOfficial = ref(true);
const importIsPublic = ref(true);
const isImporting = ref(false);
const importStatus = ref({ type: "", message: "" });

// Quick Import inside main form modal
const modalQuickImportText = ref("");
const isQuickImporting = ref(false);
const modalQuickImportFeedback = ref({ type: "", message: "" });

const defaultForm = () => ({
  name: "",
  class_name: "Hashashin",
  spec: "Awakening",
  tier: "AOS",
  is_official: true,
  is_public: true,
  hp: 10000,
  ap: 320,
  aap: 322,
  adventureap: 1050,
  adventureaap: 1060,
  acc: 1050,
  mldr: 850,
  radr: 850,
  madr: 850,
  meev: 750,
  raev: 750,
  maev: 750,
  bdrp: 5,
  chrp: 0,
  chc: 100,
  abad: 0,
  adad: 0,
  aaad: 0,
});

const form = ref(defaultForm());

// Fetch data from API (only if user has admin access)
const {
  data: presets,
  refresh,
  status,
} = await useFetch("/api/v1/presets", {
  query: computed(() => ({
    scope: filterScope.value,
    class_name: filterClass.value || undefined,
    tier: filterTier.value || undefined,
  })),
  immediate: hasAdminAccess.value,
});

// In-memory text search
const filteredPresets = computed(() => {
  const list = presets.value || [];
  if (!searchQuery.value.trim()) return list;

  const q = searchQuery.value.toLowerCase().trim();
  return list.filter((p) => p.name?.toLowerCase().includes(q));
});

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Extraction and parsing utilities
function extractGarmothId(input) {
  if (!input) return "";
  const trimmed = input.trim();
  const match = trimmed.match(/character\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed.replace(/[^a-zA-Z0-9_-]/g, "");
}

function detectInputType(content) {
  const trimmed = content.trim();
  if (!trimmed) return "empty";

  const firstLine = trimmed.split("\n")[0];
  if (
    firstLine.includes("@") ||
    (trimmed.includes("HP:") && trimmed.includes("DR:"))
  ) {
    return "downattack_text";
  }

  if (
    trimmed.includes("garmoth.com") ||
    (!trimmed.includes("\n") && trimmed.length < 50)
  ) {
    return "garmoth";
  }

  return "unknown";
}

async function fetchGarmothBuild(text) {
  const characterId = extractGarmothId(text);
  if (!characterId) {
    throw new Error("Please enter a valid Garmoth URL or character ID.");
  }

  const response = await $fetch("/api/v1/presets/import", {
    method: "POST",
    body: {
      provider: "garmoth",
      character_id: characterId,
      position: 0,
    },
  });

  const build = Array.isArray(response) ? response[0] : response;
  if (!build) {
    throw new Error("No combat build found in this character.");
  }

  return build;
}

function parseDownattackText(text, fallbackTitle = "") {
  const firstLine = text.trim().split("\n")[0];
  const titleRegex = firstLine.match(
    /^(.+?)\s+(Awakening|Succession|Ascension)(?:\s*@\s*(.*))?$/i,
  );
  const className = titleRegex?.[1]?.trim();
  const spec = titleRegex?.[2]?.trim();
  const title = titleRegex?.[3]?.trim();
  const presetName = fallbackTitle || title || "Imported Preset";

  const hp = Number(text.match(/HP:\s*(\d+)/i)?.[1]) || 0;
  const ap = Number(text.match(/(?<!Total\s)\bAP:\s*(\d+)/i)?.[1]) || 0;
  const aap = Number(text.match(/(?<!Total\s)\bAAP:\s*(\d+)/i)?.[1]) || 0;
  const acc = Number(text.match(/Accuracy:\s*(\d+)/i)?.[1]) || 0;
  const mldr = Number(text.match(/DR:.*Melee\s*(\d+)/i)?.[1]) || 0;
  const madr = Number(text.match(/DR:.*Magic\s*(\d+)/i)?.[1]) || 0;
  const radr = Number(text.match(/DR:.*Ranged\s*(\d+)/i)?.[1]) || 0;
  const meev = Number(text.match(/Evasion:.*Melee\s*(\d+)/i)?.[1]) || 0;
  const raev = Number(text.match(/Evasion:.*Ranged\s*(\d+)/i)?.[1]) || 0;
  const maev = Number(text.match(/Evasion:.*Magic\s*(\d+)/i)?.[1]) || 0;
  const chrp = Number(text.match(/Crit Dmg\s*(\d+(?:\.\d+)?)\s*%/i)?.[1]) || 0;
  const abad = Number(text.match(/Back\s*(\d+(?:\.\d+)?)\s*%/i)?.[1]) || 0;
  const adad = Number(text.match(/Down\s*(\d+(?:\.\d+)?)\s*%/i)?.[1]) || 0;
  const aaad = Number(text.match(/Air\s*(\d+(?:\.\d+)?)\s*%/i)?.[1]) || 0;
  const adventureap = Number(text.match(/Total AP:\s*(\d+)/i)?.[1]) || 0;
  const adventureaap = Number(text.match(/Total AAP:\s*(\d+)/i)?.[1]) || 0;

  const hasValidStats =
    hp > 0 ||
    ap > 0 ||
    aap > 0 ||
    acc > 0 ||
    mldr > 0 ||
    madr > 0 ||
    radr > 0 ||
    meev > 0 ||
    raev > 0 ||
    maev > 0;

  if (!className || !spec || !hasValidStats) {
    throw new Error(
      "Could not parse preset stats. Please check the text formatting.",
    );
  }

  return {
    name: presetName,
    class_name: className,
    spec: spec,
    hp: hp || 10000,
    ap,
    aap,
    adventureap,
    adventureaap,
    acc,
    mldr,
    madr,
    radr,
    meev,
    raev,
    maev,
    chrp,
    abad,
    adad,
    aaad,
    bdrp: 5,
    chc: 100,
  };
}

function normalizeImportedBuild(build, overrideName = "") {
  let normalizedClass = "Hashashin";
  if (build.class_name) {
    const cleaned = build.class_name.toLowerCase().replace(/[\s_-]+/g, "");
    const found = classesList.find((c) => c.toLowerCase() === cleaned);
    normalizedClass = found ? capitalize(found) : capitalize(build.class_name);
  }

  let normalizedSpec = "Awakening";
  if (build.spec) {
    const s = build.spec.toLowerCase();
    if (s.includes("succ")) normalizedSpec = "Succession";
    else if (s.includes("asc")) normalizedSpec = "Ascension";
    else normalizedSpec = "Awakening";
  }

  return {
    name: overrideName.trim() || build.name || `${normalizedClass} Preset`,
    class_name: normalizedClass,
    spec: normalizedSpec,
    hp: Number(build.hp) || 10000,
    ap: Number(build.ap) || 0,
    aap: Number(build.aap) || 0,
    adventureap: Number(build.adventureap) || 0,
    adventureaap: Number(build.adventureaap) || 0,
    acc: Number(build.acc) || 0,
    mldr: Number(build.mldr) || 0,
    radr: Number(build.radr) || 0,
    madr: Number(build.madr) || 0,
    meev: Number(build.meev) || 0,
    raev: Number(build.raev) || 0,
    maev: Number(build.maev) || 0,
    bdrp: Number(build.bdrp) || 5,
    chrp: Number(build.chrp) || 0,
    chc:
      build.chc !== undefined && build.chc !== null ? Number(build.chc) : 100,
    abad: Number(build.abad) || 0,
    adad: Number(build.adad) || 0,
    aaad: Number(build.aaad) || 0,
  };
}

async function parseOrFetchBuild(input, overrideName = "") {
  const type = detectInputType(input);
  if (type === "empty") {
    throw new Error("Please enter a Garmoth URL/ID or DownAttack preset text.");
  }

  let rawBuild;
  if (type === "garmoth") {
    rawBuild = await fetchGarmothBuild(input);
  } else if (type === "downattack_text") {
    rawBuild = parseDownattackText(input, overrideName);
  } else {
    throw new Error(
      "Unrecognized format. Please provide a valid Garmoth URL/ID or DownAttack preset text.",
    );
  }

  return normalizeImportedBuild(rawBuild, overrideName);
}

// Modal open/close handlers
function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  form.value = defaultForm();
  modalQuickImportText.value = "";
  modalQuickImportFeedback.value = { type: "", message: "" };
  showModal.value = true;
}

function openEditModal(preset) {
  isEditing.value = true;
  editingId.value = preset.id;
  form.value = {
    ...defaultForm(),
    ...preset,
    tier: preset.tier || "",
    is_official: Boolean(preset.is_official),
    is_public: Boolean(preset.is_public),
  };
  modalQuickImportText.value = "";
  modalQuickImportFeedback.value = { type: "", message: "" };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingId.value = null;
  modalQuickImportText.value = "";
  modalQuickImportFeedback.value = { type: "", message: "" };
}

function openImportModal() {
  importInput.value = "";
  importTitle.value = "";
  importTier.value = "AOS";
  importIsOfficial.value = true;
  importIsPublic.value = true;
  importStatus.value = { type: "", message: "" };
  showImportModal.value = true;
}

function closeImportModal() {
  showImportModal.value = false;
  importStatus.value = { type: "", message: "" };
}

async function handleImportToEditor() {
  importStatus.value = { type: "", message: "" };
  isImporting.value = true;
  try {
    const imported = await parseOrFetchBuild(
      importInput.value,
      importTitle.value,
    );
    form.value = {
      ...defaultForm(),
      ...imported,
      tier: importTier.value || "",
      is_official: Boolean(importIsOfficial.value),
      is_public: Boolean(importIsPublic.value),
    };
    isEditing.value = false;
    editingId.value = null;
    closeImportModal();
    showModal.value = true;
  } catch (err) {
    importStatus.value = {
      type: "error",
      message: err?.data?.message || err.message || "Failed to import preset.",
    };
  } finally {
    isImporting.value = false;
  }
}

async function handleImportAndSave() {
  importStatus.value = { type: "", message: "" };
  isImporting.value = true;
  try {
    const imported = await parseOrFetchBuild(
      importInput.value,
      importTitle.value,
    );
    const payload = {
      ...imported,
      tier: importTier.value || null,
      is_official: Boolean(importIsOfficial.value),
      is_public: Boolean(importIsPublic.value),
    };

    await $fetch("/api/v1/presets", {
      method: "POST",
      body: payload,
    });

    closeImportModal();
    await refresh();
  } catch (err) {
    importStatus.value = {
      type: "error",
      message: err?.data?.message || err.message || "Failed to import preset.",
    };
  } finally {
    isImporting.value = false;
  }
}

async function handleModalQuickImport() {
  if (!modalQuickImportText.value.trim()) return;
  modalQuickImportFeedback.value = { type: "", message: "" };
  isQuickImporting.value = true;
  try {
    const imported = await parseOrFetchBuild(modalQuickImportText.value);
    form.value = {
      ...form.value,
      ...imported,
    };
    modalQuickImportFeedback.value = {
      type: "success",
      message: `Loaded stats for "${imported.name}"!`,
    };
    modalQuickImportText.value = "";
  } catch (err) {
    modalQuickImportFeedback.value = {
      type: "error",
      message:
        err?.data?.message || err.message || "Failed to load preset data.",
    };
  } finally {
    isQuickImporting.value = false;
  }
}

async function savePreset() {
  try {
    const payload = { ...form.value };
    if (!payload.tier) payload.tier = null;

    if (isEditing.value) {
      await $fetch(`/api/v1/presets/${editingId.value}`, {
        method: "PATCH",
        body: payload,
      });
    } else {
      await $fetch("/api/v1/presets", {
        method: "POST",
        body: payload,
      });
    }

    closeModal();
    await refresh();
  } catch (err) {
    alert("Error saving preset: " + (err?.data?.message || err.message));
  }
}

async function deletePreset(id) {
  if (!confirm("Are you sure you want to delete this preset?")) return;
  try {
    await $fetch(`/api/v1/presets/${id}`, { method: "DELETE" });
    await refresh();
  } catch (err) {
    alert("Error deleting preset: " + (err?.data?.message || err.message));
  }
}
</script>
