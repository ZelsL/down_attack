<template>
  <div
    class="min-h-[calc(100vh-4.5rem)] bg-[#1e1d1e] text-[#cfd2dc] font-sans antialiased selection:bg-[#d7ad70]/20 selection:text-[#ffedd4] relative overflow-hidden py-10 sm:py-14"
  >
    <!-- Ambient Background Lighting -->
    <div class="absolute inset-0 hero-glow pointer-events-none" />

    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12"
    >
      <!-- ========================================== -->
      <!-- AREA 1: COMPACT HERO HEADER                -->
      <!-- ========================================== -->
      <header class="text-center space-y-2 pt-2 pb-2">
        <h1
          class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#ffedd4]"
        >
          Down Attack
        </h1>
        <p
          class="text-xs sm:text-sm md:text-base text-[#848895] font-normal tracking-wide"
        >
          Black Desert Online PvP Damage Calculator &amp; Arena of Solare Stream
          Overlay.
        </p>
      </header>

      <!-- ========================================== -->
      <!-- AREA 2: TOOLS SHOWCASE (2-Column Grid)     -->
      <!-- ========================================== -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <!-- Left Card: PvP Damage Calculator -->
        <div
          class="group relative rounded-lg border border-[#2e2a26] hover:border-[#d7ad70]/50 bg-[#18181b] p-6 flex flex-col justify-between transition-all duration-300 shadow-xl"
        >
          <div
            class="bdo-corner-tl opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <div
            class="bdo-corner-tr opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <div
            class="bdo-corner-bl opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <div
            class="bdo-corner-br opacity-0 group-hover:opacity-100 transition-opacity"
          />

          <div class="space-y-4">
            <!-- Badge & Route -->
            <div class="flex items-center justify-between">
              <span
                class="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold tracking-wider uppercase bg-[#201d1a] border border-[#362f27] text-[#d7ad70]"
              >
                TOOLKIT
              </span>
              <span class="text-xs font-mono text-[#848895]">/calculator</span>
            </div>

            <!-- Title & Description -->
            <div>
              <h2
                class="font-serif text-2xl font-bold uppercase tracking-wide text-[#ffedd4] group-hover:text-[#ffedd4] transition-colors"
              >
                PvP Damage Calculator
              </h2>
              <p class="text-xs sm:text-sm text-[#848895] leading-relaxed mt-2">
                Compare Player 1 vs. Player 2 side-by-side, test up to 4 skill
                combos, inspect Hit Rate and Effective HP (HPE) curves (DR vs.
                Evasion), and import gear from Garmoth.
              </p>
            </div>

            <!-- Visual Pills -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span
                class="px-2 py-1 rounded bg-[#201d1a] border border-[#2e2a26] text-[11px] font-mono text-[#cfd2dc]"
              >
                Combo Builder
              </span>
              <span
                class="px-2 py-1 rounded bg-[#201d1a] border border-[#2e2a26] text-[11px] font-mono text-[#cfd2dc]"
              >
                Effective HP Curves
              </span>
              <span
                class="px-2 py-1 rounded bg-[#201d1a] border border-[#2e2a26] text-[11px] font-mono text-[#cfd2dc]"
              >
                Class Modifiers &amp; Buffs
              </span>
            </div>

            <!-- Real Calculator Component Preview (@gpw Spreadsheet Benchmarks) -->
            <div
              class="rounded border border-[#ffedd4]/60 bg-[#222122] p-3.5 my-3 shadow-inner flex flex-col gap-2.5"
              data-purpose="calculator-live-benchmark"
            >
              <!-- Attacker & Defender Header (Exact Calculator UI) -->
              <div class="pb-2 border-b border-[#ffedd4]/20">
                <div class="flex items-baseline justify-between gap-2">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span
                      class="text-xs font-bold tracking-wide text-[#ffedd4] uppercase truncate"
                    >
                      {{ activeBenchmark.attacker.class_name }}
                    </span>
                    <span
                      class="font-mono text-[10px] text-[#d7ad70] border border-[#ffedd4]/30 px-1.5 py-0.5 rounded-[2px] bg-[#16161a] shrink-0"
                    >
                      Awk
                    </span>
                    <span
                      class="font-mono text-[10px] text-[#ffedd4]/50 truncate hidden sm:inline"
                    >
                      ({{ activeBenchmark.attackerLabel }})
                    </span>
                  </div>
                  <span
                    class="text-[11px] font-mono text-[#ffedd4]/60 shrink-0"
                  >
                    AP
                    <span class="text-[#ffedd4] font-semibold">
                      {{ activeBenchmark.attacker.aap }} ({{
                        activeBenchmark.attacker.adventureaap
                      }})
                    </span>
                    | Acc
                    <span class="text-[#ffedd4] font-semibold">
                      {{ activeBenchmark.attacker.acc }}
                    </span>
                  </span>
                </div>

                <div
                  class="flex flex-wrap items-center justify-between gap-2 mt-1 text-[11px] font-mono text-[#ffedd4]/60"
                >
                  <div class="flex items-center gap-2">
                    <span>
                      Target HP:
                      <span class="text-[#ffedd4] font-semibold">
                        {{ activeBenchmark.defender.hp.toLocaleString() }}
                      </span>
                    </span>
                    <span class="text-[#ffedd4]/25">|</span>
                    <span>
                      HPE:
                      <span class="text-[#d7ad70] font-semibold">
                        {{ activeBenchmark.ehp.effectiveHp.toLocaleString() }}
                      </span>
                      <span class="text-[#ffedd4]/40 text-[10px] ml-0.5">
                        ({{ activeBenchmark.ehp.multiplier.toFixed(2) }}x)
                      </span>
                    </span>
                  </div>
                  <span>
                    Hitrate:
                    <span class="text-[#d7ad70] font-semibold">
                      {{ activeBenchmark.hitRate }}%
                    </span>
                    <span class="text-[#ffedd4]/40 text-[10px] ml-0.5">
                      ({{ activeBenchmark.effectiveHitRate }}%)
                    </span>
                  </span>
                </div>
              </div>

              <!-- Active Skill Row (Real ComboPanel Skill Chip Style) -->
              <div
                class="flex items-center justify-between gap-2 bg-[#131215] border border-[#ffedd4]/15 rounded px-2.5 py-1.5"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <img
                    src="/skills/sorceress/1796.webp"
                    alt="Grim Reaper's Judgment IV"
                    class="w-7 h-7 rounded object-cover bg-black/40 border border-[#d7ad70]/40 shrink-0"
                  />
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs font-bold text-[#ffedd4] truncate">
                      Grim Reaper's Judgment IV
                    </span>
                    <span class="text-[10px] font-mono text-[#d7ad70]/80">
                      LMB + RMB • 10607% × 3 Hits (PvP -71.87%)
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0 font-mono">
                  <span
                    class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444]"
                  >
                    100% Crit
                  </span>
                  <span
                    class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981]"
                  >
                    Down Atk
                  </span>
                </div>
              </div>

              <!-- 4 Benchmark Scenarios Header -->
              <div
                class="flex justify-between items-center text-[10px] text-[#d7ad70]/70 font-bold tracking-wider uppercase font-mono px-0.5"
              >
                <span>@gpw Spreadsheet Benchmarks (Click to Compare)</span>
                <span>Est. Dmg</span>
              </div>

              <!-- 4 Combo / Benchmark Buttons (Exact Calculator Slot UI) -->
              <div class="flex flex-col gap-1.5">
                <div
                  v-for="(item, idx) in benchmarkResults"
                  :key="item.id"
                  class="flex items-center gap-2"
                >
                  <button
                    type="button"
                    class="flex-1 text-left px-2.5 py-1.5 rounded-sm border text-[11px] font-mono transition-all min-w-0 cursor-pointer"
                    :class="
                      selectedBenchmarkIndex === idx
                        ? 'bg-[#4f433c] border-[#857062] text-[#d2b996] font-semibold'
                        : 'bg-[#16161a] border-[#ffedd4]/30 text-[#ffedd4] hover:border-[#d7ad70]'
                    "
                    @click="selectedBenchmarkIndex = idx"
                  >
                    <span class="truncate block">
                      {{ idx + 1 }}. {{ item.label }}
                    </span>
                  </button>
                  <span
                    class="font-mono text-[11px] w-14 text-right shrink-0"
                    :class="
                      selectedBenchmarkIndex === idx
                        ? 'text-[#d7ad70] font-bold'
                        : 'text-[#ffedd4]/80'
                    "
                  >
                    {{ item.percent }}%
                  </span>
                </div>
              </div>

              <!-- Calculator Output Box (Exact Calculator Output UI) -->
              <div class="pt-0.5">
                <div
                  class="bg-[#16161a] border border-[#ffedd4]/30 p-2.5 rounded flex flex-col gap-1"
                >
                  <div
                    class="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider border-b border-[#ffedd4]/20 pb-1"
                  >
                    <span class="text-[#d7ad70] font-bold">
                      Attack Output vs {{ activeBenchmark.defenderLabel }}
                    </span>
                    <span class="text-[#ffedd4]/50">
                      {{ activeBenchmark.ttkLabel }}
                    </span>
                  </div>
                  <div class="text-[11px] font-mono text-[#ffedd4]/60 truncate">
                    Target Defense:
                    <span class="text-[#ffedd4] font-medium">
                      {{ activeBenchmark.defender.madr }} DR ({{
                        activeBenchmark.defender.bdrp
                      }}% Base) • {{ activeBenchmark.defender.maev }} Eva
                    </span>
                  </div>
                  <div
                    class="flex items-baseline justify-between font-mono pt-0.5"
                  >
                    <span
                      class="text-xs text-[#ffedd4] font-bold tracking-tight"
                    >
                      {{ activeBenchmark.damageFormatted }} HP
                    </span>
                    <span class="text-xs text-[#d7ad70] font-bold">
                      {{ activeBenchmark.percent }}% HP Loss
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action -->
          <div
            class="pt-5 mt-4 border-t border-[#27231f] flex items-center justify-between"
          >
            <span class="text-xs font-mono text-[#848895]">
              Formulas by <strong class="text-[#d7ad70]">@gpw</strong> • Garmoth
              Import
            </span>
            <NuxtLink
              to="/calculator"
              class="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-b from-[#dfb97d] to-[#c59a53] text-[#1a1714] font-serif font-bold text-xs tracking-wider uppercase shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>Open Calculator</span>
              <span class="font-mono text-xs">→</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Right Card: Arena of Solare Overlay -->
        <div
          class="group relative rounded-lg border border-[#2e2a26] hover:border-[#d7ad70]/50 bg-[#18181b] p-6 flex flex-col justify-between transition-all duration-300 shadow-xl"
        >
          <div
            class="bdo-corner-tl opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <div
            class="bdo-corner-tr opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <div
            class="bdo-corner-bl opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <div
            class="bdo-corner-br opacity-0 group-hover:opacity-100 transition-opacity"
          />

          <div class="space-y-4 flex-1 flex flex-col">
            <!-- Badge & Route -->
            <div class="flex items-center justify-between">
              <span
                class="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold tracking-wider uppercase bg-[#201d1a] border border-[#362f27] text-[#d7ad70]"
              >
                LIVE OBS WIDGET
              </span>
              <span class="text-xs font-mono text-[#848895]">/solare</span>
            </div>

            <!-- Title & Description -->
            <div>
              <h2
                class="font-serif text-2xl font-bold uppercase tracking-wide text-[#ffedd4] group-hover:text-[#ffedd4] transition-colors"
              >
                Arena of Solare Overlay
              </h2>
              <p class="text-xs sm:text-sm text-[#848895] leading-relaxed mt-2">
                Real-time OBS Studio browser widget for ranked Solare across all
                regions (SA, NA, EU, KR, JP, RU, TR, TW). Tracks your tier
                crest, Solare rating (PTS), win streak bonuses, and live session
                stats.
              </p>
            </div>

            <!-- Visual Pills -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span
                class="px-2 py-1 rounded bg-[#201d1a] border border-[#2e2a26] text-[11px] font-mono text-[#cfd2dc]"
              >
                OBS Browser Source
              </span>
              <span
                class="px-2 py-1 rounded bg-[#201d1a] border border-[#2e2a26] text-[11px] font-mono text-[#cfd2dc]"
              >
                Vertical &amp; Horizontal Layouts
              </span>
              <span
                class="px-2 py-1 rounded bg-[#201d1a] border border-[#2e2a26] text-[11px] font-mono text-[#cfd2dc]"
              >
                Win Streak &amp; Rating Delta
              </span>
            </div>

            <!-- Real SolareCard Component Preview Stage -->
            <div
              ref="solareStageRef"
              class="rounded border border-[#2e2a26] bg-checkerboard px-4 py-6 my-3 shadow-inner flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[280px]"
              data-purpose="solare-live-component-stage"
            >
              <div
                class="w-full flex-1 flex items-center justify-center"
                :style="{ minHeight: `${Math.round(256 * solareScale)}px` }"
              >
                <div
                  class="origin-center transition-transform duration-150 shrink-0"
                  :style="{ transform: `scale(${solareScale})` }"
                >
                  <SolareCard :data="demoOverlayData" layout="horizontal" />
                </div>
              </div>

              <span
                class="mt-4 text-[10px] font-mono text-[#848895] text-center"
              >
                Interactive Component — Click the right panel on the card to
                toggle
                <strong class="text-[#dfcaa2]">Live Session</strong> &amp;
                <strong class="text-[#dfcaa2]">Combat Averages</strong>
              </span>
            </div>
          </div>

          <!-- Bottom Action -->
          <div
            class="pt-5 mt-4 border-t border-[#27231f] flex items-center justify-between"
          >
            <span class="text-xs font-mono text-[#848895]">
              Auto-Refreshing OBS Overlay URL
            </span>
            <NuxtLink
              to="/solare"
              class="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#483d2e] bg-[#22201e] hover:bg-[#2c2722] text-[#ffedd4] hover:border-[#d7ad70]/70 font-serif font-bold text-xs tracking-wider uppercase transition-all active:scale-[0.98]"
            >
              <span>Configure Overlay</span>
              <span class="font-mono text-xs">→</span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { PvpCalculator, calculateComboDamage } from "~/utils/PvpCalculator.js";

useSeoMeta({
  title:
    "Down Attack — BDO PvP Damage Calculator & Arena of Solare Stream Overlay",
  description:
    "Free Black Desert Online (BDO) PvP Damage & Combo Calculator with Effective HP (HPE) curves, Hit Rate simulation, Garmoth build import, and live Arena of Solare OBS stream overlay. Calculadora de dano PvP e overlay de Solare para BDO.",
  keywords:
    "BDO PvP Calculator, Black Desert Online Damage Calculator, Calculadora BDO, Calculadora de Dano BDO, BDO Arena of Solare Overlay, Overlay Solare BDO, BDO OBS Overlay, BDO Effective HP, BDO Combo Builder, Garmoth Import, Down Attack",
  ogTitle:
    "Down Attack — BDO PvP Damage Calculator & Arena of Solare Stream Overlay",
  ogDescription:
    "Compare BDO PvP skill combos side-by-side, inspect DR & Evasion Effective HP curves, and track live Arena of Solare rating in OBS Studio.",
  twitterTitle:
    "Down Attack — BDO PvP Damage Calculator & Arena of Solare Stream Overlay",
  twitterDescription:
    "Compare BDO PvP skill combos side-by-side, inspect DR & Evasion Effective HP curves, and track live Arena of Solare rating in OBS Studio.",
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Down Attack",
        alternateName: [
          "BDO PvP Damage Calculator",
          "Calculadora de Dano BDO",
          "BDO Arena of Solare Overlay",
        ],
        applicationCategory: "GameApplication",
        operatingSystem: "Web",
        description:
          "Black Desert Online (BDO) PvP Damage & Combo Calculator with Effective HP (HPE) survival curves and real-time Arena of Solare OBS stream overlay.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }),
    },
  ],
});

// ============================================================================
// 1. REAL PVP CALCULATOR BENCHMARKS (FROM @gpw SPREADSHEET & UNIT TESTS)
// ============================================================================
const attacker1 = {
  class_name: "Sorceress",
  spec: "Awakening",
  ap: 383,
  aap: 385,
  adventureap: 986,
  adventureaap: 988,
  chrp: 67.5,
  adad: 35.5,
  abad: 34.5,
  aaad: 29.5,
  acc: 1301,
  chc: 100,
};

const attacker2 = {
  class_name: "Sorceress",
  spec: "Awakening",
  ap: 383,
  aap: 385,
  adventureap: 974,
  adventureaap: 976,
  chrp: 67.0,
  adad: 29.0,
  abad: 34.0,
  aaad: 29.0,
  acc: 1266,
  chc: 100,
};

const defender1 = {
  class_name: "Sorceress",
  spec: "Awakening",
  hp: 12163,
  bdrp: 30,
  mldr: 661,
  radr: 661,
  madr: 661,
  meev: 1159,
  raev: 1152,
  maev: 1152,
};

const defender2 = {
  class_name: "Sorceress",
  spec: "Awakening",
  hp: 12498,
  bdrp: 30,
  mldr: 642,
  radr: 642,
  madr: 642,
  meev: 1309,
  raev: 1302,
  maev: 1302,
};

const grimReaperSkill = {
  skill_spec: "Awakening",
  crit_hit_rate: 100,
  pvp_damage: 28.13,
  hits: [
    {
      damage_percent: 10607,
      down_hits: 3,
    },
  ],
};

const benchmarkScenarios = [
  {
    id: "ex1",
    label: "Attacker #1 (988 AP / 1301 Acc) vs Def #1 (661 DR / 1152 Eva)",
    attackerLabel: "Attacker #1",
    defenderLabel: "Defender #1 (DR Build)",
    attacker: attacker1,
    defender: defender1,
  },
  {
    id: "ex2",
    label: "Attacker #2 (976 AP / 1266 Acc) vs Def #1 (661 DR / 1152 Eva)",
    attackerLabel: "Attacker #2",
    defenderLabel: "Defender #1 (DR Build)",
    attacker: attacker2,
    defender: defender1,
  },
  {
    id: "ex3",
    label: "Attacker #1 (988 AP / 1301 Acc) vs Def #2 (642 DR / 1302 Eva)",
    attackerLabel: "Attacker #1",
    defenderLabel: "Defender #2 (Eva Hybrid)",
    attacker: attacker1,
    defender: defender2,
  },
  {
    id: "ex4",
    label: "Attacker #2 (976 AP / 1266 Acc) vs Def #2 (642 DR / 1302 Eva)",
    attackerLabel: "Attacker #2",
    defenderLabel: "Defender #2 (Eva Hybrid)",
    attacker: attacker2,
    defender: defender2,
  },
];

const selectedBenchmarkIndex = ref(0);

const benchmarkResults = computed(() =>
  benchmarkScenarios.map((scenario) => {
    const calc = new PvpCalculator({
      attacker: scenario.attacker,
      defender: scenario.defender,
      skill: grimReaperSkill,
      hit: grimReaperSkill.hits[0],
    });

    const hitRate = calc.calculateHitRate();
    const effectiveHitRate = 2 * hitRate - hitRate * hitRate;
    const damage = calculateComboDamage(scenario.attacker, scenario.defender, [
      grimReaperSkill,
    ]);
    const percentNum = (damage / scenario.defender.hp) * 100;
    const ehp = calc.calculateEffectiveHpMetrics();
    const castsToKill = Math.ceil(scenario.defender.hp / damage);

    return {
      ...scenario,
      hitRate: (hitRate * 100).toFixed(1),
      effectiveHitRate: (effectiveHitRate * 100).toFixed(1),
      damage,
      damageFormatted: damage.toFixed(1),
      percent: percentNum.toFixed(1),
      ehp,
      ttkLabel: `~${castsToKill} Casts to Kill`,
    };
  }),
);

const activeBenchmark = computed(
  () => benchmarkResults.value[selectedBenchmarkIndex.value],
);

// ============================================================================
// 2. REAL SOLARE CARD COMPONENT DEMO DATA & RESPONSIVE SCALING
// ============================================================================
const demoOverlayData = {
  region: "SA",
  user_nickname: "Okazaki",
  user_no: "777001",
  current_ranking: 65,
  class_type: 20,
  skill_branch_type: 2,
  rating: 2080,
  latest_record_no: 930004,
  overall: {
    wins: 79,
    losses: 50,
    draws: 0,
    total_games: 129,
    winrate: 61.25,
  },
  averages: {
    damage_done: 185000,
    damage_taken: 145000,
    cc: 9.8,
    recovery: 103000,
    kills: 3.7,
    deaths: 2.3,
  },
  session: {
    anchor_rating: 1996,
    anchor_record_no: 930000,
    session_start_record_no: 930000,
    wins: 4,
    losses: 2,
    draws: 0,
    total_games: 6,
    winrate: 66.7,
    net_pdl: 84,
    recent_deltas: [28, 32, -26, 31, 19],
  },
};

const solareStageRef = ref(null);
const solareScale = ref(0.68);
let resizeObserver = null;

function updateSolareScale() {
  if (!solareStageRef.value) return;
  const availableWidth = solareStageRef.value.clientWidth - 40;
  if (availableWidth > 0) {
    solareScale.value = Math.min(1, Math.max(0.35, availableWidth / 790));
  }
}

onMounted(() => {
  updateSolareScale();
  if (typeof ResizeObserver !== "undefined" && solareStageRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateSolareScale();
    });
    resizeObserver.observe(solareStageRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
.hero-glow {
  background: radial-gradient(
    circle at 50% 10%,
    rgba(215, 173, 112, 0.08) 0%,
    rgba(30, 29, 30, 0) 65%
  );
}

.bdo-corner-tl {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 10px;
  height: 10px;
  border-top: 2px solid #d7ad70;
  border-left: 2px solid #d7ad70;
  pointer-events: none;
}

.bdo-corner-tr {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-top: 2px solid #d7ad70;
  border-right: 2px solid #d7ad70;
  pointer-events: none;
}

.bdo-corner-bl {
  position: absolute;
  bottom: -1px;
  left: -1px;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #d7ad70;
  border-left: 2px solid #d7ad70;
  pointer-events: none;
}

.bdo-corner-br {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #d7ad70;
  border-right: 2px solid #d7ad70;
  pointer-events: none;
}

.bg-checkerboard {
  background-color: #141312;
  background-image:
    linear-gradient(45deg, #1b1918 25%, transparent 25%),
    linear-gradient(-45deg, #1b1918 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1b1918 75%),
    linear-gradient(-45deg, transparent 75%, #1b1918 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
}
</style>
