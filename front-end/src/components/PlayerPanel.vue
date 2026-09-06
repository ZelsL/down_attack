<template>
  <div class="player-panel">
    <!-- Header -->
    <div
      class="panel-header"
      :class="playerNumber === 1 ? 'player1' : 'player2'"
    >
      {{ label }}
    </div>

    <!-- Class Search Dropdown -->
    <label> Preset: </label>
    <div
      class="dropdown mt-1"
      :class="{ 'is-active': presetDropdown }"
      ref="presetDropdownRef"
    >
      <div class="dropdown-trigger">
        <button
          class="button is-small is-fullwidth input-with-icon"
          @click="presetDropdown = !presetDropdown"
        >
          <span
            class="is-flex is-justify-content-space-between is-align-items-center"
            style="width: 100%"
          >
            <span>{{
              selectedPreset ? selectedPreset : "Select a preset"
            }}</span>
            <span class="icon is-small ml-2">
              <font-awesome-icon
                :icon="['fas', presetDropdown ? 'caret-up' : 'caret-down']"
              />
            </span>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <div class="dropdown-item p-2">
            <div class="control has-icons-right">
              <input
                class="input is-small"
                type="text"
                v-model="presetSearchQuery"
              />
              <span class="icon is-small is-right">
                <font-awesome-icon :icon="['fas', 'search']" />
              </span>
            </div>
          </div>

          <div class="dropdown-scroll-area">
            <div
              v-for="(groupPresets, className) in presetsByClass"
              :key="className"
            >
              <div
                class="dropdown-item has-text-weight-bold"
                style="cursor: default"
              >
                {{ className }}
              </div>

              <a
                v-for="preset in groupPresets"
                :key="preset.id"
                class="dropdown-item pl-5"
                @click="
                  applyPreset(preset.id);
                  presetDropdown = false;
                "
              >
                {{ preset.name || "Build Sem Nome" }}
              </a>
            </div>
          </div>

          <div
            v-if="Object.keys(presetsByClass).length === 0"
            class="dropdown-item is-italic has-text-grey"
          >
            No results found
          </div>
          <div ref="sentinel" class="sentinel">
            <div v-if="isLoading" class="dropdown-item has-text-centered">
              <progress class="progress is-small is-primary" max="100">
                50%
              </progress>
            </div>
          </div>
          <div v-if="filteredPresets.length === 0 && !isLoading"></div>
        </div>
      </div>
    </div>
    <label> Class: </label>
    <div
      class="dropdown mt-1 mb-1"
      :class="{ 'is-active': showDropdown }"
      ref="dropdownRef"
    >
      <div class="dropdown-trigger">
        <input
          class="input is-small input-with-icon"
          type="text"
          v-model="searchQuery"
          @focus="showDropdown = true"
          @input="showDropdown = true"
          placeholder="Search class..."
        />
      </div>
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a
            v-for="cls in filteredClasses"
            :key="cls"
            class="dropdown-item"
            :class="{ 'is-active': localPlayer.class === cls }"
            @click="selectClass(cls)"
          >
            {{ cls }}
          </a>
          <div v-if="filteredClasses.length === 0" class="dropdown-item">
            No results
          </div>
        </div>
      </div>
    </div>

    <!-- Offensive Stats -->
    <div class="section-title">Offensive</div>

    <!-- NOTE QUE AGORA USAMOS localPlayer AO INVÉS DE modelValue -->
    <div class="form-row">
      <div class="form-group">
        <label>Sheet AP</label>
        <input
          type="number"
          v-model.number="localPlayer.sheet_ap"
          min="0"
          max="9999"
          @input="validateLimit('sheet_ap')"
        />
      </div>
      <div class="form-group">
        <label>Sheet AAP</label>
        <input
          type="number"
          v-model.number="localPlayer.sheet_aap"
          min="0"
          max="9999"
          @input="validateLimit('sheet_aap')"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Total AP (PvP)</label>
        <input
          type="number"
          v-model.number="localPlayer.total_ap_pvp"
          min="0"
          max="9999"
          @input="validateLimit('total_ap_pvp')"
        />
      </div>
      <div class="form-group">
        <label>Total AAP (PvP)</label>
        <input
          type="number"
          v-model.number="localPlayer.total_aap_pvp"
          min="0"
          max="9999"
          @input="validateLimit('total_aap_pvp')"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Accuracy</label>
        <input
          type="number"
          v-model.number="localPlayer.accuracy"
          min="0"
          max="9999"
          @input="validateLimit('accuracy')"
        />
      </div>
      <div class="form-group">
        <label>Crit Hit Rate %</label>
        <input
          type="number"
          v-model.number="localPlayer.critical_hit_rate"
          step="0.1"
          min="0"
          max="100"
          @input="validateLimit('critical_hit_rate', 100)"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Critical %</label>
        <input
          type="number"
          v-model.number="localPlayer.critical"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('critical')"
        />
      </div>
      <div class="form-group" v-show="localPlayer.state === 'down_attack'">
        <label>Down Attack %</label>
        <input
          type="number"
          v-model.number="localPlayer.down_attack"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('down_attack')"
        />
      </div>
      <div class="form-group" v-show="localPlayer.state === 'air_attack'">
        <label>Air Attack %</label>
        <input
          type="number"
          v-model.number="localPlayer.air_attack"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('air_attack')"
        />
      </div>
      <div class="form-group" v-show="localPlayer.state === 'back_attack'">
        <label>Back Attack %</label>
        <input
          type="number"
          v-model.number="localPlayer.back_attack"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('back_attack')"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Skill Damage %</label>
        <div class="input-with-addon">
          <input
            type="number"
            v-model.number="localPlayer.skill_damage_percent"
            class="main-input"
            min="0"
            max="9999999"
            @input="validateLimit('skill_damage_percent', 9999999)"
          />
          <div class="hits-input-wrapper">
            <input
              type="number"
              v-model.number="localPlayer.skill_hits"
              class="addon-input"
              min="0"
              max="99"
              @input="validateLimit('skill_hits', 99)"
            />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Skill PvP Reduction %</label>
        <input
          type="number"
          v-model.number="localPlayer.skill_pvp_reduction_percent"
          step="0.01"
          min="0"
          max="100"
          @input="validateLimit('skill_pvp_reduction_percent', 100)"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Skill Spec</label>
        <select v-model="localPlayer.skill_spec">
          <option value="awakening">Awakening</option>
          <option value="succession">Succession</option>
          <option value="absolute">Absolute</option>
        </select>
      </div>
      <div class="form-group">
        <label>Attack State</label>
        <select v-model="localPlayer.state">
          <option value="normal">Normal</option>
          <option value="back_attack">Back Attack</option>
          <option value="down_attack">Down Attack</option>
          <option value="air_attack">Air Attack</option>
        </select>
      </div>
    </div>

    <!-- Defensive Stats -->
    <div class="section-title">Defensive</div>

    <div class="form-row">
      <div class="form-group">
        <label>Damage Reduction %</label>
        <input
          type="number"
          v-model.number="localPlayer.dr_percent"
          min="0"
          max="30"
          @input="validateLimit('dr_percent', 30)"
        />
      </div>
      <div class="form-group" v-if="damageTypeObject.melee">
        <label>Melee Damage Reduction</label>
        <input
          type="number"
          v-model.number="localPlayer.melee_dr"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('melee_dr')"
        />
      </div>
      <div class="form-group" v-if="damageTypeObject.ranged">
        <label>Ranged Damage Reduction</label>
        <input
          type="number"
          v-model.number="localPlayer.ranged_dr"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('ranged_dr')"
        />
      </div>
      <div class="form-group" v-if="damageTypeObject.magic">
        <label>Magic Damage Reduction</label>
        <input
          type="number"
          v-model.number="localPlayer.magic_dr"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('magic_dr')"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group" v-if="damageTypeObject.melee">
        <label>Melee Evasion</label>
        <input
          type="number"
          v-model.number="localPlayer.melee_evasion"
          min="0"
          max="9999"
          @input="validateLimit('melee_evasion')"
        />
      </div>
      <div class="form-group" v-if="damageTypeObject.ranged">
        <label>Ranged Evasion</label>
        <input
          type="number"
          v-model.number="localPlayer.ranged_evasion"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('ranged_evasion')"
        />
      </div>
      <div class="form-group" v-if="damageTypeObject.magic">
        <label>Magic Evasion</label>
        <input
          type="number"
          v-model.number="localPlayer.magic_evasion"
          step="0.1"
          min="0"
          max="9999"
          @input="validateLimit('magic_evasion')"
        />
      </div>
      <div class="form-group">
        <label>Health Points</label>
        <input
          type="number"
          v-model.number="localPlayer.hp"
          step="0.1"
          min="0"
          max="99999"
          @input="validateLimit('hp', 99999)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import apiClient from "../services/api.js";

export default {
  name: "PlayerPanel",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      default: "Player",
    },
    playerNumber: {
      type: Number,
      default: 1,
    },
    availableClasses: {
      type: Array,
      required: true,
    },
    damage_type: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const showDropdown = ref(false);
    const searchQuery = ref("");
    const dropdownRef = ref(null);
    const presetDropdown = ref(false);
    const presetDropdownRef = ref(null);
    const presetSearchQuery = ref("");
    const isLoading = ref(false);
    const sentinel = ref(null);
    const CalculatorPresets = ref([]);
    const presetPage = ref(1);
    const hasMorePresets = ref(true);
    const selectedPreset = ref(null);
    const damageTypeObject = ref({
      melee: false,
      ranged: false,
      magic: false,
    });

    const updateDamageTypeObject = () => {
      const configs = {
        melee: { melee: true, ranged: false, magic: false },
        ranged: { melee: false, ranged: true, magic: false },
        magic: { melee: false, ranged: false, magic: true },
        both: { melee: true, ranged: true, magic: true },
      };
      damageTypeObject.value = configs[props.damage_type] || configs["both"];
    };

    const presetsByClass = computed(() => {
      return filteredPresets.value.reduce((groups, preset) => {
        const className = preset.class_name + ` ${preset.class_spec}`;
        if (!groups[className]) {
          groups[className] = [];
        }
        groups[className].push(preset);

        return groups;
      }, {});
    });

    const filteredPresets = computed(() => {
      if (!presetSearchQuery.value) return CalculatorPresets.value;
      return CalculatorPresets.value.filter((preset) =>
        (preset.class_name || "")
          .toLowerCase()
          .includes(presetSearchQuery.value.toLowerCase()),
      );
    });

    const applyPreset = (id) => {
      const presetData = CalculatorPresets.value.find((p) => p.id === id);

      if (presetData) {
        const className = `${presetData.class_name} ${presetData.class_spec}`;
        const finalPlayer = {
          ...localPlayer.value,
          ...presetData,
          class: className,
          state: presetData.attacker_state.toLowerCase(),
          skill_spec: presetData.skill_spec.toLowerCase(),
        };

        const displayLabel = `${presetData.class_name} ${presetData.class_spec} (${presetData.name || "Custom Preset"})`;
        selectedPreset.value = displayLabel;
        presetDropdown.value = false;
        localPlayer.value = finalPlayer;
        searchQuery.value = className;
        showDropdown.value = false;
      }
    };

    const localPlayer = computed({
      get: () => {
        return new Proxy(props.modelValue, {
          get(target, key) {
            return target[key];
          },
          set(target, key, value) {
            emit("update:modelValue", { ...target, [key]: value });
            return true;
          },
        });
      },
      set: (newValue) => {
        emit("update:modelValue", newValue);
      },
    });

    watch(
      () => props.modelValue.class,
      (newVal) => {
        if (newVal && !searchQuery.value) {
          searchQuery.value = newVal;
        }
      },
      { immediate: true },
    );

    const filteredClasses = computed(() => {
      if (!searchQuery.value) return props.availableClasses;
      return props.availableClasses.filter((cls) =>
        cls.toLowerCase().includes(searchQuery.value.toLowerCase()),
      );
    });

    const selectClass = (className) => {
      localPlayer.value = { ...localPlayer.value, class: className };

      searchQuery.value = className;
      showDropdown.value = false;
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showDropdown.value = false;
      }
      if (
        presetDropdownRef.value &&
        !presetDropdownRef.value.contains(event.target)
      ) {
        presetDropdown.value = false;
      }
    };

    const validateLimit = (field, max = 9999) => {
      let value = localPlayer.value[field];

      if (value === "" || value === null) return;
      if (value < 0) {
        value = 0;
      } else if (value > max) {
        value = max;
      }

      if (value !== localPlayer.value[field]) {
        localPlayer.value = { ...localPlayer.value, [field]: value };
      }
    };

    const getPresets = async () => {
      try {
        isLoading.value = true;
        const response = await apiClient.get(
          `/pvp-calculator/presets?page=${presetPage.value}`,
        );
        CalculatorPresets.value.push(...response.data.presets);
        if (response.data.presets.length === 0) {
          hasMorePresets.value = false;
        }
        presetPage.value += 1;
      } catch (error) {
        if (error.response?.status === 404) {
          hasMorePresets.value = false;
          return;
        }
        console.error("Error fetching presets: " + error);
      } finally {
        isLoading.value = false;
      }
    };

    watch(
      () => props.damage_type,
      () => {
        updateDamageTypeObject();
      },
      { immediate: true },
    );

    onMounted(async () => {
      document.addEventListener("click", handleClickOutside);
      await getPresets();
      applyPreset(CalculatorPresets.value[0]?.id || null);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      showDropdown,
      searchQuery,
      dropdownRef,
      filteredClasses,
      selectClass,
      localPlayer,
      presetsByClass,
      filteredPresets,
      presetSearchQuery,
      presetDropdown,
      presetDropdownRef,
      applyPreset,
      validateLimit,
      isLoading,
      sentinel,
      selectedPreset,
      damageTypeObject,
    };
  },
};
</script>

<style scoped>
/* Copie aqui todo o CSS relacionado aos inputs, dropdowns e painéis que estava no arquivo original */
.player-panel {
  background-color: #14161a;
  border: 1px solid #3e4753;
  border-radius: 4px;
  padding: 8px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.player-panel::-webkit-scrollbar {
  width: 6px;
}
.player-panel::-webkit-scrollbar-track {
  background: #0e0f11;
}
.player-panel::-webkit-scrollbar-thumb {
  background: #3e4753;
  border-radius: 3px;
}

.panel-header {
  background-color: #12161b;
  border: 1px solid #3e4753;
  border-radius: 3px;
  padding: 4px 8px;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 10pt;
}

.panel-header.player1 {
  color: #5a7ff2;
  border-color: #5a7ff2;
}
.panel-header.player2 {
  color: #f56565;
  border-color: #f56565;
}

.section-title {
  background-color: #0e0f11;
  color: #a0aec0;
  padding: 4px 6px;
  margin: 8px 0 6px 0;
  font-size: 8pt;
  font-weight: 600;
  text-transform: uppercase;
  border-left: 3px solid #5a7ff2;
}

.form-group {
  margin-bottom: 6px;
}
.form-group label {
  display: block;
  color: #c1c9d4;
  font-size: 8pt;
  margin-bottom: 2px;
}
.form-group input,
.form-group select {
  width: 100%;
  background-color: #12161b;
  color: #e2e8f0;
  border: 1px solid #3e4753;
  border-radius: 2px;
  padding: 3px 5px;
  font-size: 9pt;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #5a7ff2;
  background-color: #0e0f11;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 6px;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
  width: 100%;
}
.dropdown-menu {
  position: absolute;
  width: 100%;
  z-index: 10;
}
.dropdown-content {
  background-color: #12161b;
  border: 1px solid #3e4753;
  overflow: hidden;
  padding-bottom: 0;
}
.dropdown-scroll-area {
  max-height: 250px;
  overflow-y: auto;
}

.dropdown-menu,
.dropdown-content {
  box-sizing: border-box;
  width: 100%;
}
.dropdown-item {
  display: block;
  padding: 4px 8px;
  color: #e2e8f0;
  font-size: 9pt;
  cursor: pointer;
}
.dropdown-item:hover {
  background-color: #1a1d23;
}
.dropdown-item.is-active {
  background-color: #5a7ff2;
  color: white;
}

.dropdown-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.dropdown-scroll-area::-webkit-scrollbar-track {
  background: #0e0f11;
}

.dropdown-scroll-area::-webkit-scrollbar-thumb {
  background: #5a7ff2;
  border-radius: 3px;
}

.dropdown-scroll-area::-webkit-scrollbar-thumb:hover {
  background: #4a6fd2;
}
/* Input Addon Styles */
.input-with-addon {
  display: flex;
  gap: 4px;
  align-items: center;
}
.hits-input-wrapper {
  position: relative;
  width: 17%;
  flex-shrink: 0;
}
.hits-input-wrapper::before {
  content: "x";
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-weight: bold;
  font-size: 9pt;
  pointer-events: none;
  z-index: 1;
}
.addon-input {
  padding-left: 18px !important;
  text-align: center;
}
.main-input {
  flex: 1;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
