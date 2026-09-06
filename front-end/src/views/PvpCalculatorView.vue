<template>
  <div class="damage-calculator-page">
    <div class="calculator-layout">
      <!-- Header -->
      <div class="page-header">
        <h4 class="title">Black Desert Damage Calculator</h4>
        <div class="header-buttons">
          <button
            class="button is-info is-dark"
            :class="{ 'is-active': mode === 'pvp' }"
            @click="mode = 'pvp'"
          >
            One vs One
          </button>
          <button
            class="button is-warning"
            :class="{ 'is-active': mode === 'solare' }"
            @click="mode = 'solare'"
          >
            Solare
          </button>
        </div>
      </div>

      <!-- NOVA SEÇÃO: TOP RESULTS (Estilo Showdown) -->
      <div class="top-results-bar">
        <!-- Resultado P1 -> P2 -->
        <div class="result-card p1-attacker">
          <div class="result-header">
            <span class="attacker-name">Player 1</span> attacking
            <span class="defender-name">Player 2</span>
          </div>
          <div class="result-body">
            <div class="damage-text">
              {{ damage1to2.hp_loss }}
              <span class="percent"
                >({{ damage1to2.hp_loss_percentage }}%)</span
              >
            </div>
            <div class="hit-chance">
              Hit Chance:
              <span :class="getHitColor(hitChance1to2)"
                >{{ hitChance1to2 }}%</span
              >
            </div>
          </div>
          <div class="result-desc">
            {{ player1.class }} ({{ player1.state }}) vs {{ player2.class }}
          </div>
        </div>

        <!-- Resultado P2 -> P1 -->
        <div class="result-card p2-attacker">
          <div class="result-header">
            <span class="attacker-name">Player 2</span> attacking
            <span class="defender-name">Player 1</span>
          </div>
          <div class="result-body">
            <div class="damage-text">
              {{ damage2to1.hp_loss }}
              <span class="percent"
                >({{ damage2to1.hp_loss_percentage }}%)</span
              >
            </div>
            <div class="hit-chance">
              Hit Chance:
              <span :class="getHitColor(hitChance2to1)"
                >{{ hitChance2to1 }}%</span
              >
            </div>
          </div>
          <div class="result-desc">
            {{ player2.class }} ({{ player2.state }}) vs {{ player1.class }}
          </div>
        </div>
      </div>

      <!-- MAIN GRID (3 Colunas: P1 | Options | P2) -->
      <div class="main-grid">
        <!-- Player 1 Panel -->
        <PlayerPanel
          v-model="player1"
          label="Player 1"
          :playerNumber="1"
          :availableClasses="classes"
          :damage_type="getClassData(player2.class).damage_type"
          @attackerState="(p1state) => (player1.state = p1state)"
        />

        <!-- NEW MIDDLE COLUMN: BUFFS -->
        <div class="options-panel">
          <div class="panel-header">Buffs</div>

          <div class="scrollable-content">
            <!-- Main Container (2-Column Grid) -->
            <div class="showdown-grid">
              <!-- LEFT COLUMN (PLAYER 1) -->
              <div class="showdown-column">
                <div class="column-title p1-title">Player 1</div>
                <div class="column-title p1-sub-title">Pre Addons</div>

                <!-- Group: Skill Addons -->
                <div class="button-group">
                  <!-- Buttons P1 -->
                  <button
                    class="showdown-btn"
                    :class="{ active: p1Buffs.dr }"
                    @click="toggleBuff('p1', 'dr')"
                  >
                    +20 DP
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p1Buffs.evasion }"
                    @click="toggleBuff('p1', 'evasion')"
                  >
                    +20 Evasion
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p1Buffs.accuracy }"
                    @click="toggleBuff('p1', 'accuracy')"
                  >
                    +20 Accuracy
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p1Buffs.critical_hit_rate }"
                    @click="toggleBuff('p1', 'critical_hit_rate')"
                  >
                    +30% Crit Rate
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p1Buffs.critical }"
                    @click="toggleBuff('p1', 'critical')"
                  >
                    +5% Crit Dmg
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p1Buffs.air_attack }"
                    v-show="player1.state === 'air_attack'"
                    @click="toggleBuff('p1', 'air_attack')"
                  >
                    +5% Air Attack
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p1Buffs.back_attack }"
                    v-show="player1.state === 'back_attack'"
                    @click="toggleBuff('p1', 'back_attack')"
                  >
                    +5% Back Attack
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p1Buffs.down_attack }"
                    v-show="player1.state === 'down_attack'"
                    @click="toggleBuff('p1', 'down_attack')"
                  >
                    +5% Down Attack
                  </button>
                </div>

                <!-- Group: Debuffs (Applied TO ENEMY) -->
                <div class="column-title p1-sub-title">
                  Pre Debuffs Addons on Enemy
                </div>
                <div class="button-group">
                  <button
                    class="showdown-btn debuff"
                    :class="{ active: p1Debuff.minusDp }"
                    @click="toggleDebuff('p1', 'minusDp')"
                  >
                    -20 DP
                  </button>
                  <button
                    class="showdown-btn debuff"
                    :class="{ active: p1Debuff.minusEvasion }"
                    @click="toggleDebuff('p1', 'minusEvasion')"
                  >
                    -20 Evasion
                  </button>
                  <button
                    class="showdown-btn debuff"
                    :class="{ active: p1Debuff.minusAccuracy }"
                    @click="toggleDebuff('p1', 'minusAccuracy')"
                  >
                    -20 Accuracy
                  </button>
                </div>
              </div>

              <!-- RIGHT COLUMN (PLAYER 2) -->
              <div class="showdown-column">
                <div class="column-title p2-title">Player 2</div>
                <div class="column-title p2-sub-title">Pre Addons</div>

                <!-- Group: Skill Addons -->
                <div class="button-group">
                  <!-- Buttons P2 -->
                  <button
                    class="showdown-btn"
                    :class="{ active: p2Buffs.dr }"
                    @click="toggleBuff('p2', 'dr')"
                  >
                    +20 DP
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p2Buffs.evasion }"
                    @click="toggleBuff('p2', 'evasion')"
                  >
                    +20 Evasion
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p2Buffs.accuracy }"
                    @click="toggleBuff('p2', 'accuracy')"
                  >
                    +20 Accuracy
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p2Buffs.critical_hit_rate }"
                    @click="toggleBuff('p2', 'critical_hit_rate')"
                  >
                    +30% Crit Rate
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p2Buffs.critical }"
                    @click="toggleBuff('p2', 'critical')"
                  >
                    +5% Crit Dmg
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p2Buffs.air_attack }"
                    v-show="player2.state === 'air_attack'"
                    @click="toggleBuff('p2', 'air_attack')"
                  >
                    +5% Air Attack
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p2Buffs.back_attack }"
                    v-show="player2.state === 'back_attack'"
                    @click="toggleBuff('p2', 'back_attack')"
                  >
                    +5% Back Attack
                  </button>
                  <button
                    class="showdown-btn"
                    :class="{ active: p2Buffs.down_attack }"
                    v-show="player2.state === 'down_attack'"
                    @click="toggleBuff('p2', 'down_attack')"
                  >
                    +5% Down Attack
                  </button>
                </div>
                <div class="column-title p2-sub-title">
                  Pre Debuffs Addons on Enemy
                </div>
                <!-- Group: Debuffs -->
                <div class="button-group">
                  <button
                    class="showdown-btn debuff"
                    :class="{ active: p2Debuff.minusDp }"
                    @click="toggleDebuff('p2', 'minusDp')"
                  >
                    -20 DP
                  </button>
                  <button
                    class="showdown-btn debuff"
                    :class="{ active: p2Debuff.minusEvasion }"
                    @click="toggleDebuff('p2', 'minusEvasion')"
                  >
                    -20 Evasion
                  </button>
                  <button
                    class="showdown-btn debuff"
                    :class="{ active: p2Debuff.minusAccuracy }"
                    @click="toggleDebuff('p2', 'minusAccuracy')"
                  >
                    -20 Accuracy
                  </button>
                </div>
              </div>
            </div>
            <!-- End of Grid -->
          </div>
        </div>

        <!-- Player 2 Panel -->
        <PlayerPanel
          v-model="player2"
          label="Player 2"
          :playerNumber="2"
          :availableClasses="classes"
          :damage_type="getClassData(player1.class).damage_type"
          @attackerState="(p2state) => (player2.state = p2state)"
        />
        <div class="import-preset">
          <div class="options-panel">
            <div class="panel-header">Import / Export</div>
            <div class="scrollable-content">
              <input
                class="input is-small mb-2"
                type="text"
                placeholder="Preset Name"
              />
              <textarea class="textarea is-large"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { watchDebounced } from "@vueuse/core";
import PlayerPanel from "@/components/PlayerPanel.vue";
import { useDamageCalculator } from "@/composables/useDamageCalculator.js";
import classModifiers from "@/data/classModifiers.js";

export default {
  name: "DamageCalculator",
  components: {
    PlayerPanel,
  },
  setup() {
    const mode = ref("pvp");

    let classes = ref([
      "Warrior Succession",
      "Warrior Awakening",
      "Sorceress Succession",
      "Sorceress Awakening",
      "Ranger Succession",
      "Ranger Awakening",
      "Berserker Succession",
      "Berserker Awakening",
      "Tamer Succession",
      "Tamer Awakening",
      "Musa Succession",
      "Musa Awakening",
      "Maehwa Succession",
      "Maehwa Awakening",
      "Valkyrie Succession",
      "Valkyrie Awakening",
      "Wizard Succession",
      "Wizard Awakening",
      "Witch Succession",
      "Witch Awakening",
      "Ninja Succession",
      "Ninja Awakening",
      "Kunoichi Succession",
      "Kunoichi Awakening",
      "Dark Knight Succession",
      "Dark Knight Awakening",
      "Striker Succession",
      "Striker Awakening",
      "Mystic Succession",
      "Mystic Awakening",
      "Lahn Succession",
      "Lahn Awakening",
      "Archer Awakening",
      "Corsair Succession",
      "Corsair Awakening",
      "Drakania Succession",
      "Drakania Awakening",
      "Woosa Succession",
      "Woosa Awakening",
      "Maegu Succession",
      "Maegu Awakening",
      "Scholar Awakening",
      "Hashashin Succession",
      "Hashashin Awakening",
      "Deadeye Awakening",
      "Wukong Awakening",
      "Shai Succession",
    ]);

    // Player 1 - Complete stats
    const player1 = ref({
      class: "Warrior Succession",
      skill_spec: "awakening",
      total_ap_pvp: 986,
      total_aap_pvp: 988,
      sheet_ap: 383,
      sheet_aap: 385,
      accuracy: 1301,
      critical: 67.5,
      back_attack: 34.5,
      down_attack: 35.5,
      air_attack: 29.5,
      skill_damage_percent: 31821,
      skill_hits: 1,
      critical_hit_rate: 50,
      state: "down_attack",
      melee_dr: 661,
      ranged_dr: 661,
      magic_dr: 661,
      melee_evasion: 1152,
      ranged_evasion: 1152,
      magic_evasion: 1152,
      dr_percent: 30,
      class_pvp_modifier: 0.8929,
      skill_pvp_reduction_percent: 28.13,
      hp: 12163,
    });

    // Player 2 - Complete stats
    const player2 = ref({
      class: "Sorceress Awakening",
      spec: "awakening",
      total_ap_pvp: 950,
      total_aap_pvp: 952,
      sheet_ap: 370,
      sheet_aap: 372,
      accuracy: 1250,
      critical: 65.0,
      back_attack: 32.0,
      down_attack: 33.0,
      air_attack: 28.0,
      skill_damage_percent: 30000,
      skill_hits: 1,
      critical_hit_rate: 48,
      state: "normal",
      melee_dr: 650,
      ranged_dr: 650,
      magic_dr: 650,
      melee_evasion: 1100,
      ranged_evasion: 1100,
      magic_evasion: 1100,
      dr_percent: 28,
      class_pvp_modifier: 0.85,
      skill_pvp_reduction_percent: 26.0,
      hp: 12498,
    });
    const p1Buffs = ref({
      dr: false,
      evasion: false,
      accuracy: false,
      critical_hit_rate: false,
      critical: false,
      down_attack: false,
      back_attack: false,
      air_attack: false,
    });
    const p2Buffs = ref({
      dr: false,
      evasion: false,
      accuracy: false,
      critical_hit_rate: false,
      critical: false,
      down_attack: false,
      back_attack: false,
      air_attack: false,
    });
    const p1Debuff = ref({
      minusDp: false,
      minusEvasion: false,
      minusAccuracy: false,
    });
    const p2Debuff = ref({
      minusDp: false,
      minusEvasion: false,
      minusAccuracy: false,
    });

    const toggleDebuff = (player, debuffName) => {
      if (player === "p1") {
        p1Debuff.value[debuffName] = !p1Debuff.value[debuffName];
      } else {
        p2Debuff.value[debuffName] = !p2Debuff.value[debuffName];
      }
      calculateDamage();
    };

    const toggleBuff = (player, buffName) => {
      if (player === "p1") {
        p1Buffs.value[buffName] = !p1Buffs.value[buffName];
      } else {
        p2Buffs.value[buffName] = !p2Buffs.value[buffName];
      }
      calculateDamage();
    };

    const apiResult1to2 = ref(null);
    const apiResult2to1 = ref(null);
    const isCalculating = ref(false);
    const calculationError = ref(null);

    // Computed properties para resultados
    const damage1to2 = computed(() => {
      if (apiResult1to2.value) {
        const hp_loss = apiResult1to2.value.result.hp_loss;
        const hp_loss_percentage = (100 * hp_loss) / player2.value.hp;
        const damage_type = apiResult1to2.value.result.damage_type;
        return {
          hp_loss: hp_loss.toFixed(2),
          hp_loss_percentage: hp_loss_percentage.toFixed(2),
          damage_type: damage_type,
        };
      }
      return { hp_loss: "---", hp_loss_percentage: "---" };
    });

    const hitChance1to2 = computed(() => {
      if (apiResult1to2.value) {
        return (apiResult1to2.value.result.hitrate * 100).toFixed(1);
      }
      return "---";
    });

    const damage2to1 = computed(() => {
      if (apiResult2to1.value) {
        const hp_loss = apiResult2to1.value.result.hp_loss;
        const hp_loss_percentage = (100 * hp_loss) / player1.value.hp;
        const damage_type = apiResult2to1.value.result.damage_type;
        return {
          hp_loss: hp_loss.toFixed(2),
          hp_loss_percentage: hp_loss_percentage.toFixed(2),
          damage_type: damage_type,
        };
      }
      return { hp_loss: "---", hp_loss_percentage: "---" };
    });

    const hitChance2to1 = computed(() => {
      if (apiResult2to1.value) {
        return (apiResult2to1.value.result.hitrate * 100).toFixed(1);
      }
      return "---";
    });

    const parseClassAndSpec = (fullClassName) => {
      const parts = fullClassName.split(" ");
      const noSpecClass = ["Archer", "Deadeye", "Wukong", "Scholar"];
      if (noSpecClass.includes(fullClassName)) {
        return { className: fullClassName, spec: "absolute" };
      }

      const spec = parts[parts.length - 1].toLowerCase();
      const className = parts.slice(0, parts.length - 1).join(" ");
      return { className, spec };
    };
    const getHitColor = (chance) => {
      const value = parseFloat(chance);
      if (!value && value !== 0) return ""; // Trata nulos/undefined

      if (value >= 100) return "text-green";
      if (value >= 85) return "text-yellow";
      if (value >= 50) return "text-orange";
      return "text-red";
    };

    const getClassData = (fullClassName) => {
      if (!fullClassName) return { damage_type: null, class_group: null };

      const { className, spec } = parseClassAndSpec(fullClassName);

      const classKey = className.toLowerCase();
      const specKey = spec.toLowerCase();

      if (classModifiers[classKey] && classModifiers[classKey].specs[specKey]) {
        return {
          damage_type: classModifiers[classKey].specs[specKey].damage_type,
          class_group: classModifiers[classKey].specs[specKey].group,
        };
      }

      return { damage_type: "Melee", class_group: null };
    };

    const calculateDamage = () => {
      isCalculating.value = true;
      calculationError.value = null;

      try {
        const player1Data = parseClassAndSpec(player1.value.class);
        const player2Data = parseClassAndSpec(player2.value.class);
        const p1_melee_dr =
          player1.value.melee_dr +
          (p1Buffs.value.dr ? 20 : 0) -
          (p2Debuff.value.minusDp ? 20 : 0);
        const p2_melee_dr =
          player2.value.melee_dr +
          (p2Buffs.value.dr ? 20 : 0) -
          (p1Debuff.value.minusDp ? 20 : 0);
        const p1_ranged_dr =
          player1.value.ranged_dr +
          (p1Buffs.value.dr ? 20 : 0) -
          (p2Debuff.value.minusDp ? 20 : 0);
        const p2_ranged_dr =
          player2.value.ranged_dr +
          (p2Buffs.value.dr ? 20 : 0) -
          (p1Debuff.value.minusDp ? 20 : 0);
        const p1_magic_dr =
          player1.value.magic_dr +
          (p1Buffs.value.dr ? 20 : 0) -
          (p2Debuff.value.minusDp ? 20 : 0);
        const p2_magic_dr =
          player2.value.magic_dr +
          (p2Buffs.value.dr ? 20 : 0) -
          (p1Debuff.value.minusDp ? 20 : 0);
        const p1_melee_evasion =
          player1.value.melee_evasion +
          (p1Buffs.value.evasion ? 20 : 0) -
          (p2Debuff.value.minusEvasion ? 20 : 0);
        const p2_melee_evasion =
          player2.value.melee_evasion +
          (p2Buffs.value.evasion ? 20 : 0) -
          (p1Debuff.value.minusEvasion ? 20 : 0);
        const p1_ranged_evasion =
          player1.value.ranged_evasion +
          (p1Buffs.value.evasion ? 20 : 0) -
          (p2Debuff.value.minusEvasion ? 20 : 0);
        const p2_ranged_evasion =
          player2.value.ranged_evasion +
          (p2Buffs.value.evasion ? 20 : 0) -
          (p1Debuff.value.minusEvasion ? 20 : 0);
        const p1_magic_evasion =
          player1.value.magic_evasion +
          (p1Buffs.value.evasion ? 20 : 0) -
          (p2Debuff.value.minusEvasion ? 20 : 0);
        const p2_magic_evasion =
          player2.value.magic_evasion +
          (p2Buffs.value.evasion ? 20 : 0) -
          (p1Debuff.value.minusEvasion ? 20 : 0);
        const p1_accuracy =
          player1.value.accuracy +
          (p1Buffs.value.accuracy ? 20 : 0) -
          (p2Debuff.value.minusAccuracy ? 20 : 0);
        const p2_accuracy =
          player2.value.accuracy +
          (p2Buffs.value.accuracy ? 20 : 0) -
          (p1Debuff.value.minusAccuracy ? 20 : 0);
        const p1_critical_hit_rate =
          player1.value.critical_hit_rate +
          (p1Buffs.value.critical_hit_rate ? 30 : 0);
        const p2_critical_hit_rate =
          player2.value.critical_hit_rate +
          (p2Buffs.value.critical_hit_rate ? 30 : 0);
        const p1_critical =
          player1.value.critical + (p1Buffs.value.critical ? 5 : 0);
        const p2_critical =
          player2.value.critical + (p2Buffs.value.critical ? 5 : 0);
        const p1_back_attack =
          player1.value.back_attack + (p1Buffs.value.back_attack ? 5 : 0);
        const p2_back_attack =
          player2.value.back_attack + (p2Buffs.value.back_attack ? 5 : 0);
        const p1_down_attack =
          player1.value.down_attack + (p1Buffs.value.down_attack ? 5 : 0);
        const p2_down_attack =
          player2.value.down_attack + (p2Buffs.value.down_attack ? 5 : 0);
        const p1_air_attack =
          player1.value.air_attack + (p1Buffs.value.air_attack ? 5 : 0);
        const p2_air_attack =
          player2.value.air_attack + (p2Buffs.value.air_attack ? 5 : 0);
        // Player 1 ataca Player 2
        const player1To2 = {
          attacker_class: player1Data.className,
          defender_class: player2Data.className,
          attacker_class_spec: player1Data.spec,
          defender_class_spec: player2Data.spec,
          skill_spec: player1Data.spec,
          total_ap_pvp: player1.value.total_ap_pvp,
          total_aap_pvp: player1.value.total_aap_pvp,
          sheet_ap: player1.value.sheet_ap,
          sheet_aap: player1.value.sheet_aap,
          melee_dr: p2_melee_dr,
          ranged_dr: p2_ranged_dr,
          magic_dr: p2_magic_dr,
          accuracy: p1_accuracy,
          melee_evasion: p2_melee_evasion,
          ranged_evasion: p2_ranged_evasion,
          magic_evasion: p2_magic_evasion,
          dr_percent: player2.value.dr_percent || 0,
          critical: p1_critical,
          back_attack: p1_back_attack,
          down_attack: p1_down_attack,
          air_attack: p1_air_attack,
          skill_damage_percent:
            player1.value.skill_damage_percent * player1.value.skill_hits,
          skill_pvp_reduction_percent:
            player1.value.skill_pvp_reduction_percent,
          critical_hit_rate: p1_critical_hit_rate,
          state: player1.value.state,
        };

        // Player 2 ataca Player 1
        const player2To1 = {
          attacker_class: player2Data.className,
          defender_class: player1Data.className,
          attacker_class_spec: player2Data.spec,
          defender_class_spec: player1Data.spec,
          skill_spec: player2Data.spec,
          total_ap_pvp: player2.value.total_ap_pvp,
          total_aap_pvp: player2.value.total_aap_pvp,
          sheet_ap: player2.value.sheet_ap,
          sheet_aap: player2.value.sheet_aap,
          melee_dr: p1_melee_dr,
          ranged_dr: p1_ranged_dr,
          magic_dr: p1_magic_dr,
          accuracy: p2_accuracy,
          melee_evasion: p1_melee_evasion,
          ranged_evasion: p1_ranged_evasion,
          magic_evasion: p1_magic_evasion,
          dr_percent: player1.value.dr_percent || 0,
          critical: p2_critical,
          back_attack: p2_back_attack,
          down_attack: p2_down_attack,
          air_attack: p2_air_attack,
          skill_damage_percent:
            player2.value.skill_damage_percent * player2.value.skill_hits,
          skill_pvp_reduction_percent:
            player2.value.skill_pvp_reduction_percent,
          critical_hit_rate: p2_critical_hit_rate,
          state: player2.value.state,
        };

        apiResult1to2.value = useDamageCalculator(player1To2);
        apiResult2to1.value = useDamageCalculator(player2To1);
      } catch (error) {
        calculationError.value = error || "Failed to calculate damage";
        console.error("Error during damage calculation:", error);
      } finally {
        isCalculating.value = false;
      }
    };
    watchDebounced(
      [player1, player2],
      () => {
        calculateDamage();
      },
      { debounce: 500, maxWait: 1000, deep: true },
    );

    onMounted(() => {
      classes.value.sort();
      calculateDamage();
    });

    return {
      mode,
      classes,
      player1,
      player2,
      damage1to2,
      hitChance1to2,
      damage2to1,
      hitChance2to1,
      calculateDamage,
      isCalculating,
      calculationError,
      getHitColor,
      toggleBuff,
      toggleDebuff,
      p1Buffs,
      p2Buffs,
      p1Debuff,
      p2Debuff,
      getClassData,
    };
  },
};
</script>

<style scoped>
/* ... (Keep the base styles .damage-calculator-page and .calculator-layout the same as before) ... */

.damage-calculator-page {
  background-color: #0e0f11;
  color: #e2e8f0;
  min-height: 100vh;
  padding-top: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 10pt;
}

.calculator-layout {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* --- STYLES OF THE RESULTS BAR (NEW) --- */
.top-results-bar {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Divide into 2 equal results */
  gap: 8px;
  background-color: #14161a;
  border: 1px solid #3e4753;
  border-radius: 4px;
  padding: 10px;
}

.header-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 8px;
  color: #e2e8f0;
}
.result-card {
  background-color: #0e0f11;
  border: 1px solid #3e4753;
  border-radius: 3px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-card.p1-attacker {
  border-left: 3px solid #5a7ff2;
}
.result-card.p2-attacker {
  border-left: 3px solid #f56565;
}

.result-header {
  font-size: 9pt;
  color: #a0aec0;
  margin-bottom: 4px;
}
.attacker-name {
  font-weight: bold;
  color: #e2e8f0;
}
.defender-name {
  font-weight: bold;
  color: #e2e8f0;
}

.result-body {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.damage-text {
  font-size: 16pt;
  font-weight: bold;
  color: #e2e8f0;
}
.damage-text .percent {
  font-size: 12pt;
  color: #a0aec0;
  font-weight: normal;
}

.hit-chance {
  font-size: 9pt;
  color: #718096;
}
.hit-chance span {
  font-weight: bold;
  color: #ecc94b;
}
.text-green {
  color: #48bb78 !important;
} /* Green Success */
.text-yellow {
  color: #ecc94b !important;
} /* Yellow Alert */
.text-orange {
  color: darkorange !important;
}
.text-red {
  color: #f56565 !important;
} /* Red Danger */

.result-desc {
  font-size: 8pt;
  color: #4a5568;
  font-style: italic;
}

/* --- STYLES OF THE MAIN GRID --- */
.main-grid {
  display: grid;
  grid-template-columns: 33fr 29fr 33fr;
  gap: 0.5%;
  width: 100%;
}

/* --- STYLES OF THE MIDDLE PANEL (B) --- */
/* Panel Container */
.options-panel {
  background-color: #14161a;
  border: 1px solid #3e4753;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 100%; /* Occupies total available height */
  overflow: hidden;
}

.panel-header {
  background-color: #12161b;
  color: #e2e8f0;
  padding: 8px;
  font-weight: 600;
  border-bottom: 1px solid #3e4753;
  text-align: center;
}

.scrollable-content {
  padding: 10px;
  overflow-y: auto;
  flex: 1;
}

/* --- LAYOUT SHOWDOWN --- */

/* 1. The Grid that divides P1 and P2 */
.showdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  gap: 12px; /* Space between columns */
}

/* 2. The Individual Column */
.showdown-column {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers buttons horizontally */
}

/* Titles (Player 1 / Player 2) */
.column-title {
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.p1-title {
  color: #5a7ff2;
}
.p2-title {
  color: #f56565;
}

/* Group of Buttons (Addons, Debuffs, etc) */
.button-group {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr !important; /* Stacks buttons vertically */
  gap: 4px; /* Small vertical space between buttons (Showdown is quite tight) */
  margin-bottom: 12px; /* Space between groups */
}

.group-label {
  font-size: 0.7rem;
  color: #718096;
  text-align: center;
  margin-bottom: 4px;
  text-transform: uppercase;
  border-bottom: 1px solid #2d3748;
  line-height: 0.1em;
  margin: 10px 0 5px;
}
.group-label span {
  background: #14161a;
  padding: 0 5px;
}

/* --- THE SHOWDOWN BUTTON (FROM SCRATCH) --- */
.showdown-btn {
  /* Reset básico */
  appearance: none;
  outline: none;

  /* Dimensões e Forma */
  width: 100%;
  padding: 6px 0; /* Um pouco mais de altura para clique */
  border-radius: 4px; /* Cantos levemente arredondados (quase quadrados) */

  /* Fonte */
  font-family: inherit;
  font-size: 0.6rem;
  font-weight: 500;
  text-align: center;

  /* Cores Inativas (Flat Dark) */
  background-color: #1a1d23; /* Fundo escuro e fosco */
  color: #718096; /* Texto cinza suave */
  border: 1px solid #3e4753; /* Borda sutil para definição */

  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.showdown-btn:hover {
  background-color: #252a33;
  color: #e2e8f0;
  border-color: #5a6b85;
}

/* --- ACTIVE STATE (ON) --- */
.showdown-btn.active {
  background-color: #5a7ff2; /* Azul sólido (Cor do Player 1) */
  color: #ffffff; /* Texto branco puro */
  border-color: #5a7ff2;
  font-weight: 600;
  box-shadow: none; /* Sem brilho neon */
}

/* Active Debuff (Red) */
.showdown-btn.debuff.active {
  background-color: #f56565; /* Vermelho sólido (Cor do Player 2/Perigo) */
  border-color: #f56565;
  color: white;
  box-shadow: none;
}
.import-preset {
  margin-top: 1%;
  grid-column: 2 / 3;
  margin-bottom: 5%;
}
/* Responsividade */
@media (max-width: 1024px) {
  .top-results-bar {
    grid-template-columns: 1fr;
  }
  .main-grid {
    grid-template-columns: 1fr;
  }
  .options-panel {
    order: -1;
    height: auto;
  } /* On mobile, options are above the players */
}
</style>
