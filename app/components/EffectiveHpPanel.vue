<template>
  <div
    class="w-full max-w-[1600px] mx-auto border border-[#ffedd4] bg-[#222122] p-[2%]"
  >
    <!-- Top Header & Player Selector -->
    <div
      class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#ffedd4]/20"
    >
      <div class="flex items-center gap-2">
        <span
          class="text-xs font-bold uppercase tracking-wider text-[#d7ad70] font-mono"
        >
          Effective HP Analysis (DR & Evasion Curves)
        </span>
        <span
          class="text-[10px] font-mono text-[#ffedd4]/60 border border-[#ffedd4]/20 bg-[#16161a] px-1.5 py-0.5 rounded-[2px] uppercase"
        >
          vs {{ activeMetrics.damageType }} Damage
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="px-2.5 py-1 rounded-sm border text-[11px] font-mono transition-all cursor-pointer"
          :class="
            selectedPlayer === 1
              ? 'bg-[#4f433c] border-[#857062] text-[#d2b996] font-semibold'
              : 'bg-[#16161a] border-[#ffedd4]/30 text-[#ffedd4]/70 hover:border-[#d7ad70]'
          "
          @click="selectedPlayer = 1"
        >
          P1 Defense ({{ player1Name }})
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-sm border text-[11px] font-mono transition-all cursor-pointer"
          :class="
            selectedPlayer === 2
              ? 'bg-[#4f433c] border-[#857062] text-[#d2b996] font-semibold'
              : 'bg-[#16161a] border-[#ffedd4]/30 text-[#ffedd4]/70 hover:border-[#d7ad70]'
          "
          @click="selectedPlayer = 2"
        >
          P2 Defense ({{ player2Name }})
        </button>
      </div>
    </div>

    <!-- Summary Metrics Bar (Equivalent to HP_efetivo.py suptitle + marginal gain) -->
    <div
      class="mt-2.5 bg-[#16161a] border border-[#ffedd4]/25 rounded p-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]"
    >
      <div
        class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#ffedd4]/70"
      >
        <span>
          Enemy Effective AP:
          <strong class="text-[#ffedd4]">{{
            Math.round(activeMetrics.effectiveAp)
          }}</strong>
        </span>
        <span class="text-[#ffedd4]/25">|</span>
        <span>
          Enemy Acc:
          <strong class="text-[#ffedd4]">{{ activeMetrics.accuracy }}</strong>
        </span>
        <span class="text-[#ffedd4]/25">|</span>
        <span>
          DR:
          <strong class="text-[#ffedd4]">{{ activeMetrics.dr }}</strong>
        </span>
        <span class="text-[#ffedd4]/25">|</span>
        <span>
          Evasion:
          <strong class="text-[#ffedd4]">{{ activeMetrics.evasion }}</strong>
        </span>
        <span class="text-[#ffedd4]/25">|</span>
        <span>
          DR%:
          <strong class="text-[#ffedd4]">{{ activeMetrics.bdrp }}%</strong>
        </span>
        <span class="text-[#ffedd4]/25">|</span>
        <span>
          HP:
          <strong class="text-[#ffedd4]">{{
            activeMetrics.hp.toLocaleString()
          }}</strong>
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div
          class="text-[10px] text-[#ffedd4]/60 border border-[#ffedd4]/15 px-2 py-0.5 rounded bg-[#222122]"
        >
          +10 DR:
          <span class="text-[#2a78d6] font-bold"
            >+{{ marginalGain.dr10 }}%</span
          >
          <span class="mx-1.5 text-[#ffedd4]/25">|</span>
          +10 Eva:
          <span class="text-[#2f9e6e] font-bold"
            >+{{ marginalGain.eva10 }}%</span
          >
        </div>

        <div class="text-xs">
          <span class="text-[#d7ad70] font-bold">
            HPE: {{ activeMetrics.effectiveHp.toLocaleString() }}
          </span>
          <span class="text-[#ffedd4]/60 text-[11px] ml-1">
            ({{ activeMetrics.multiplier.toFixed(2) }}x / Max
            {{ activeMetrics.maxMultiplier.toFixed(2) }}x)
          </span>
        </div>
      </div>
    </div>

    <!-- Dual Interactive SVG Charts -->
    <div class="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
      <!-- Chart 1: HPE vs DR -->
      <div
        class="bg-[#16161a] border border-[#ffedd4]/25 rounded p-3 flex flex-col gap-2"
      >
        <div
          class="flex flex-wrap items-center justify-between gap-1 font-mono"
        >
          <span class="text-xs font-bold text-[#ffedd4]">
            HPE with DR
            <span class="text-[10px] font-normal text-[#ffedd4]/50">
              (Fixed Evasion: {{ activeMetrics.evasion }})
            </span>
          </span>
          <div class="flex items-center gap-2 text-[10px] text-[#ffedd4]/70">
            <span>
              Elbow:
              <strong class="text-[#d7ad70]">{{
                activeMetrics.drElbow
              }}</strong>
            </span>
            <span>|</span>
            <span>
              DR Check:
              <strong class="text-[#d7ad70]">{{
                activeMetrics.drCheck
              }}</strong>
            </span>
          </div>
        </div>

        <div class="relative w-full select-none">
          <svg
            ref="drSvgRef"
            :viewBox="`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`"
            class="w-full h-auto overflow-visible cursor-crosshair"
            @mousemove="onDrMouseMove"
            @mouseleave="drHover = null"
          >
            <!-- Grid lines -->
            <g
              v-for="tick in drChart.yTicks"
              :key="`dr-y-${tick.value}`"
              class="text-[#ffedd4]/20"
            >
              <line
                :x1="PAD.left"
                :x2="SVG_WIDTH - PAD.right"
                :y1="tick.y"
                :y2="tick.y"
                stroke="currentColor"
                stroke-dasharray="3 3"
                stroke-width="1"
              />
              <text
                :x="PAD.left - 6"
                :y="tick.y + 3"
                text-anchor="end"
                class="fill-[#ffedd4]/50 font-mono text-[9px]"
              >
                {{ formatCompact(tick.value) }}
              </text>
            </g>

            <g
              v-for="tick in drChart.xTicks"
              :key="`dr-x-${tick.value}`"
              class="text-[#ffedd4]/20"
            >
              <line
                :x1="tick.x"
                :x2="tick.x"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="currentColor"
                stroke-dasharray="3 3"
                stroke-width="1"
              />
              <text
                :x="tick.x"
                :y="SVG_HEIGHT - PAD.bottom + 14"
                text-anchor="middle"
                class="fill-[#ffedd4]/50 font-mono text-[9px]"
              >
                {{ tick.value }}
              </text>
            </g>

            <!-- Axes -->
            <line
              :x1="PAD.left"
              :x2="SVG_WIDTH - PAD.right"
              :y1="SVG_HEIGHT - PAD.bottom"
              :y2="SVG_HEIGHT - PAD.bottom"
              stroke="#ffedd4"
              stroke-opacity="0.3"
            />
            <line
              :x1="PAD.left"
              :x2="PAD.left"
              :y1="PAD.top"
              :y2="SVG_HEIGHT - PAD.bottom"
              stroke="#ffedd4"
              stroke-opacity="0.3"
            />

            <!-- Elbow Vertical Marker -->
            <g v-if="drChart.elbowX !== null">
              <line
                :x1="drChart.elbowX"
                :x2="drChart.elbowX"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="#9e9ea7"
                stroke-width="1.3"
                stroke-dasharray="2 3"
              />
              <text
                :x="drChart.elbowX - 4"
                :y="PAD.top + 10"
                text-anchor="end"
                class="fill-[#ffedd4]/60 font-mono text-[9px]"
              >
                Elbow ({{ activeMetrics.drElbow }})
              </text>
            </g>

            <!-- DR Check Vertical Marker -->
            <g v-if="drChart.checkX !== null">
              <line
                :x1="drChart.checkX"
                :x2="drChart.checkX"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="#d7ad70"
                stroke-opacity="0.6"
                stroke-width="1"
                stroke-dasharray="4 3"
              />
            </g>

            <!-- HPE vs DR Polyline -->
            <path
              :d="drChart.path"
              fill="none"
              stroke="#2a78d6"
              stroke-width="2.2"
            />

            <!-- Current Build Point -->
            <circle
              :cx="drChart.currentX"
              :cy="drChart.currentY"
              r="4.5"
              fill="#eb6834"
              stroke="#16161a"
              stroke-width="1.5"
            />

            <!-- Hover Cursor & Tooltip -->
            <g v-if="drHover">
              <line
                :x1="drHover.px"
                :x2="drHover.px"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="#ffedd4"
                stroke-opacity="0.35"
                stroke-dasharray="2 2"
              />
              <circle
                :cx="drHover.px"
                :cy="drHover.py"
                r="4"
                fill="#ffedd4"
                stroke="#2a78d6"
                stroke-width="2"
              />
              <g
                :transform="`translate(${drHover.tooltipX}, ${drHover.tooltipY})`"
              >
                <rect
                  x="0"
                  y="0"
                  width="148"
                  height="38"
                  rx="3"
                  fill="#222122"
                  stroke="#d7ad70"
                  stroke-opacity="0.8"
                />
                <text
                  x="7"
                  y="14"
                  class="fill-[#ffedd4] font-mono text-[10px] font-semibold"
                >
                  DR: {{ drHover.x }}
                </text>
                <text
                  x="7"
                  y="29"
                  class="fill-[#d7ad70] font-mono text-[10px] font-bold"
                >
                  HPE: {{ Math.trunc(drHover.y).toLocaleString() }} ({{
                    drHover.deltaLabel
                  }})
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Legend -->
        <div
          class="flex flex-wrap items-center gap-3 text-[10px] font-mono text-[#ffedd4]/60 pt-1 border-t border-[#ffedd4]/10"
        >
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-0.5 bg-[#2a78d6] inline-block" />
            HPE Curve
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#eb6834] inline-block" />
            Current Build (DR={{ activeMetrics.dr }} vs AP={{
              Math.round(activeMetrics.effectiveAp)
            }})
          </span>
          <span class="flex items-center gap-1.5">
            <span
              class="w-3 border-t border-dashed border-[#9e9ea7] inline-block"
            />
            Elbow: {{ activeMetrics.drElbow }} | DR Check:
            {{ activeMetrics.drCheck }}
          </span>
        </div>
      </div>

      <!-- Chart 2: HPE vs Evasion -->
      <div
        class="bg-[#16161a] border border-[#ffedd4]/25 rounded p-3 flex flex-col gap-2"
      >
        <div
          class="flex flex-wrap items-center justify-between gap-1 font-mono"
        >
          <span class="text-xs font-bold text-[#ffedd4]">
            HPE with Evasion
            <span class="text-[10px] font-normal text-[#ffedd4]/50">
              (Fixed DR: {{ activeMetrics.dr }}, Miss:
              {{ (activeMetrics.missRate * 100).toFixed(1) }}%)
            </span>
          </span>
          <div class="flex items-center gap-2 text-[10px] text-[#ffedd4]/70">
            <span>
              Start:
              <strong class="text-[#ffedd4]">{{
                activeMetrics.evasionStart
              }}</strong>
            </span>
            <span>|</span>
            <span>
              Elbow:
              <strong class="text-[#d7ad70]">{{
                activeMetrics.evasionElbow
              }}</strong>
            </span>
            <span>|</span>
            <span>
              Evasion Check:
              <strong class="text-[#d7ad70]">{{
                activeMetrics.evasionCheck
              }}</strong>
            </span>
          </div>
        </div>

        <div class="relative w-full select-none">
          <svg
            ref="evaSvgRef"
            :viewBox="`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`"
            class="w-full h-auto overflow-visible cursor-crosshair"
            @mousemove="onEvaMouseMove"
            @mouseleave="evaHover = null"
          >
            <!-- Grid lines -->
            <g
              v-for="tick in evaChart.yTicks"
              :key="`eva-y-${tick.value}`"
              class="text-[#ffedd4]/20"
            >
              <line
                :x1="PAD.left"
                :x2="SVG_WIDTH - PAD.right"
                :y1="tick.y"
                :y2="tick.y"
                stroke="currentColor"
                stroke-dasharray="3 3"
                stroke-width="1"
              />
              <text
                :x="PAD.left - 6"
                :y="tick.y + 3"
                text-anchor="end"
                class="fill-[#ffedd4]/50 font-mono text-[9px]"
              >
                {{ formatCompact(tick.value) }}
              </text>
            </g>

            <g
              v-for="tick in evaChart.xTicks"
              :key="`eva-x-${tick.value}`"
              class="text-[#ffedd4]/20"
            >
              <line
                :x1="tick.x"
                :x2="tick.x"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="currentColor"
                stroke-dasharray="3 3"
                stroke-width="1"
              />
              <text
                :x="tick.x"
                :y="SVG_HEIGHT - PAD.bottom + 14"
                text-anchor="middle"
                class="fill-[#ffedd4]/50 font-mono text-[9px]"
              >
                {{ tick.value }}
              </text>
            </g>

            <!-- Axes -->
            <line
              :x1="PAD.left"
              :x2="SVG_WIDTH - PAD.right"
              :y1="SVG_HEIGHT - PAD.bottom"
              :y2="SVG_HEIGHT - PAD.bottom"
              stroke="#ffedd4"
              stroke-opacity="0.3"
            />
            <line
              :x1="PAD.left"
              :x2="PAD.left"
              :y1="PAD.top"
              :y2="SVG_HEIGHT - PAD.bottom"
              stroke="#ffedd4"
              stroke-opacity="0.3"
            />

            <!-- Evasion Start Vertical Marker -->
            <g v-if="evaChart.startX !== null">
              <line
                :x1="evaChart.startX"
                :x2="evaChart.startX"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="#9e9ea7"
                stroke-opacity="0.65"
                stroke-width="1"
                stroke-dasharray="4 4"
              />
              <text
                :x="evaChart.startX + 4"
                :y="PAD.top + 10"
                text-anchor="start"
                class="fill-[#ffedd4]/50 font-mono text-[9px]"
              >
                Start ({{ activeMetrics.evasionStart }})
              </text>
            </g>

            <!-- Evasion Elbow Vertical Marker -->
            <g v-if="evaChart.elbowX !== null">
              <line
                :x1="evaChart.elbowX"
                :x2="evaChart.elbowX"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="#9e9ea7"
                stroke-width="1.3"
                stroke-dasharray="2 3"
              />
              <text
                :x="evaChart.elbowX - 4"
                :y="PAD.top + 22"
                text-anchor="end"
                class="fill-[#ffedd4]/60 font-mono text-[9px]"
              >
                Elbow ({{ activeMetrics.evasionElbow }})
              </text>
            </g>

            <!-- Evasion Check Vertical Marker -->
            <g v-if="evaChart.checkX !== null">
              <line
                :x1="evaChart.checkX"
                :x2="evaChart.checkX"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="#d7ad70"
                stroke-opacity="0.6"
                stroke-width="1"
                stroke-dasharray="4 3"
              />
            </g>

            <!-- HPE vs Evasion Polyline -->
            <path
              :d="evaChart.path"
              fill="none"
              stroke="#2f9e6e"
              stroke-width="2.2"
            />

            <!-- Current Build Point -->
            <circle
              :cx="evaChart.currentX"
              :cy="evaChart.currentY"
              r="4.5"
              fill="#eb6834"
              stroke="#16161a"
              stroke-width="1.5"
            />

            <!-- Hover Cursor & Tooltip -->
            <g v-if="evaHover">
              <line
                :x1="evaHover.px"
                :x2="evaHover.px"
                :y1="PAD.top"
                :y2="SVG_HEIGHT - PAD.bottom"
                stroke="#ffedd4"
                stroke-opacity="0.35"
                stroke-dasharray="2 2"
              />
              <circle
                :cx="evaHover.px"
                :cy="evaHover.py"
                r="4"
                fill="#ffedd4"
                stroke="#2f9e6e"
                stroke-width="2"
              />
              <g
                :transform="`translate(${evaHover.tooltipX}, ${evaHover.tooltipY})`"
              >
                <rect
                  x="0"
                  y="0"
                  width="148"
                  height="38"
                  rx="3"
                  fill="#222122"
                  stroke="#d7ad70"
                  stroke-opacity="0.8"
                />
                <text
                  x="7"
                  y="14"
                  class="fill-[#ffedd4] font-mono text-[10px] font-semibold"
                >
                  Evasion: {{ evaHover.x }}
                </text>
                <text
                  x="7"
                  y="29"
                  class="fill-[#d7ad70] font-mono text-[10px] font-bold"
                >
                  HPE: {{ Math.trunc(evaHover.y).toLocaleString() }} ({{
                    evaHover.deltaLabel
                  }})
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Legend -->
        <div
          class="flex flex-wrap items-center gap-3 text-[10px] font-mono text-[#ffedd4]/60 pt-1 border-t border-[#ffedd4]/10"
        >
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-0.5 bg-[#2f9e6e] inline-block" />
            HPE Curve
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#eb6834] inline-block" />
            Current Build (Eva={{ activeMetrics.evasion }} vs Acc={{
              activeMetrics.accuracy
            }})
          </span>
          <span class="flex items-center gap-1.5">
            <span
              class="w-3 border-t border-dashed border-[#9e9ea7] inline-block"
            />
            Start: {{ activeMetrics.evasionStart }} | Elbow:
            {{ activeMetrics.evasionElbow }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { PvpCalculator } from "~~/app/utils/PvpCalculator.js";

const props = defineProps({
  p1Attacker: {
    type: Object,
    required: true,
  },
  p1Defender: {
    type: Object,
    required: true,
  },
  p2Attacker: {
    type: Object,
    required: true,
  },
  p2Defender: {
    type: Object,
    required: true,
  },
  player1Name: {
    type: String,
    default: "Player 1",
  },
  player2Name: {
    type: String,
    default: "Player 2",
  },
});

const selectedPlayer = defineModel("selectedPlayer", {
  type: Number,
  default: 1,
});

const SVG_WIDTH = 560;
const SVG_HEIGHT = 230;
const PAD = {
  top: 14,
  right: 18,
  bottom: 24,
  left: 48,
};

const drSvgRef = ref(null);
const evaSvgRef = ref(null);
const drHover = ref(null);
const evaHover = ref(null);

watch(selectedPlayer, () => {
  drHover.value = null;
  evaHover.value = null;
});

// When selectedPlayer === 1, we evaluate Player 1's defense against Player 2's attack.
const activeCalculator = computed(() => {
  if (selectedPlayer.value === 1) {
    return new PvpCalculator({
      attacker: props.p2Attacker,
      defender: props.p1Defender,
    });
  }
  return new PvpCalculator({
    attacker: props.p1Attacker,
    defender: props.p2Defender,
  });
});

const activeMetrics = computed(() =>
  activeCalculator.value.calculateEffectiveHpMetrics(),
);

const marginalGain = computed(() => {
  const calc = activeCalculator.value;
  const base = activeMetrics.value.rawEffectiveHp || 1;
  const plus10Dr = calc.calculateEffectiveHp({
    dr: activeMetrics.value.dr + 10,
    evasion: activeMetrics.value.evasion,
  });
  const plus10Eva = calc.calculateEffectiveHp({
    dr: activeMetrics.value.dr,
    evasion: activeMetrics.value.evasion + 10,
  });

  return {
    dr10: (((plus10Dr - base) / base) * 100).toFixed(1),
    eva10: (((plus10Eva - base) / base) * 100).toFixed(1),
  };
});

function buildChartGeometry(points, currentXVal, currentYVal, markers = {}) {
  const plotW = SVG_WIDTH - PAD.left - PAD.right;
  const plotH = SVG_HEIGHT - PAD.top - PAD.bottom;

  const maxX = points.length > 0 ? points[points.length - 1].x : 1;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const pt of points) {
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }
  if (!Number.isFinite(minY)) minY = 0;
  if (!Number.isFinite(maxY) || maxY <= minY) maxY = minY + 1000;

  const ySpan = maxY - minY;
  const yLow = Math.max(0, minY - ySpan * 0.06);
  const yHigh = maxY + ySpan * 0.08;

  const toX = (x) => PAD.left + (Math.max(0, Math.min(maxX, x)) / maxX) * plotW;
  const toY = (y) =>
    PAD.top + plotH - ((y - yLow) / Math.max(1, yHigh - yLow)) * plotH;

  const path = points
    .map(
      (pt, i) =>
        `${i === 0 ? "M" : "L"}${toX(pt.x).toFixed(1)},${toY(pt.y).toFixed(1)}`,
    )
    .join(" ");

  const xTicks = Array.from({ length: 6 }, (_, i) => {
    const val = Math.round((maxX / 5) * i);
    return { value: val, x: toX(val) };
  });

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = Math.round(yLow + ((yHigh - yLow) / 4) * i);
    return { value: val, y: toY(val) };
  });

  const mapMarker = (val) =>
    val !== undefined && val >= 0 && val <= maxX ? toX(val) : null;

  return {
    points,
    maxX,
    toX,
    toY,
    path,
    xTicks,
    yTicks,
    currentX: toX(currentXVal),
    currentY: toY(currentYVal),
    startX: mapMarker(markers.start),
    elbowX: mapMarker(markers.elbow),
    checkX: mapMarker(markers.check),
  };
}

const drChart = computed(() => {
  const m = activeMetrics.value;
  const calc = activeCalculator.value;
  const maxDr = Math.max(
    100,
    Math.ceil(Math.max(m.effectiveAp, m.dr, m.drCheck) * 1.05),
  );
  const step = Math.max(1, Math.floor(maxDr / 350));
  const points = [];

  for (let dr = 0; dr <= maxDr; dr += step) {
    points.push({
      x: dr,
      y: calc.calculateEffectiveHp({ dr, evasion: m.evasion }),
    });
  }
  if (points[points.length - 1]?.x !== maxDr) {
    points.push({
      x: maxDr,
      y: calc.calculateEffectiveHp({ dr: maxDr, evasion: m.evasion }),
    });
  }

  return buildChartGeometry(points, m.dr, m.rawEffectiveHp, {
    elbow: m.drElbow,
    check: m.drCheck,
  });
});

const evaChart = computed(() => {
  const m = activeMetrics.value;
  const calc = activeCalculator.value;
  const maxEva = Math.max(
    100,
    Math.ceil(Math.max(m.accuracy, m.evasion, m.evasionCheck) * 1.05),
  );
  const step = Math.max(1, Math.floor(maxEva / 350));
  const points = [];

  for (let ev = 0; ev <= maxEva; ev += step) {
    points.push({
      x: ev,
      y: calc.calculateEffectiveHp({ dr: m.dr, evasion: ev }),
    });
  }
  if (points[points.length - 1]?.x !== maxEva) {
    points.push({
      x: maxEva,
      y: calc.calculateEffectiveHp({ dr: m.dr, evasion: maxEva }),
    });
  }

  return buildChartGeometry(points, m.evasion, m.rawEffectiveHp, {
    start: m.evasionStart,
    elbow: m.evasionElbow,
    check: m.evasionCheck,
  });
});

function computeHoverState(event, svgEl, chart, calcFn) {
  if (!svgEl) return null;
  const rect = svgEl.getBoundingClientRect();
  if (rect.width <= 0) return null;

  const relX = ((event.clientX - rect.left) / rect.width) * SVG_WIDTH;
  const plotW = SVG_WIDTH - PAD.left - PAD.right;
  const clampedPlotX = Math.max(0, Math.min(plotW, relX - PAD.left));
  const xVal = Math.round((clampedPlotX / plotW) * chart.maxX);
  const yVal = calcFn(xVal);

  const px = chart.toX(xVal);
  const py = chart.toY(yVal);

  const baseHpe = activeMetrics.value.effectiveHp || 1;
  const deltaPct = ((Math.trunc(yVal) - baseHpe) / baseHpe) * 100;
  const sign = deltaPct >= 0 ? "+" : "";
  const deltaLabel = `${sign}${deltaPct.toFixed(1)}%`;

  const xFrac = (px - PAD.left) / plotW;
  const yFrac = (py - PAD.top) / (SVG_HEIGHT - PAD.top - PAD.bottom);

  const tooltipX = xFrac < 0.68 ? px + 10 : px - 158;
  const tooltipY = yFrac < 0.25 ? py + 8 : py - 44;

  return {
    x: xVal,
    y: yVal,
    px,
    py,
    deltaLabel,
    tooltipX,
    tooltipY,
  };
}

function onDrMouseMove(event) {
  drHover.value = computeHoverState(
    event,
    drSvgRef.value,
    drChart.value,
    (dr) =>
      activeCalculator.value.calculateEffectiveHp({
        dr,
        evasion: activeMetrics.value.evasion,
      }),
  );
}

function onEvaMouseMove(event) {
  evaHover.value = computeHoverState(
    event,
    evaSvgRef.value,
    evaChart.value,
    (ev) =>
      activeCalculator.value.calculateEffectiveHp({
        dr: activeMetrics.value.dr,
        evasion: ev,
      }),
  );
}

function formatCompact(val) {
  if (val >= 1000) {
    return `${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}k`;
  }
  return String(val);
}
</script>
