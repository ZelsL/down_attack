<template>
  <div class="simulator-panel">
    <div class="simulator-controls">
      <div class="field animation-toggle mt-2">
        <label class="label" for="animationSwitch">Skip Animation</label>
        <input
          id="animationSwitch"
          type="checkbox"
          class="switch is-rounded"
          v-model="skipAnimation"
          @change="repetitions = 1"
        />
        <label for="animationSwitch"></label>
      </div>
      <div class="input-group">
        <input
          type="number"
          v-model.number="repetitions"
          @input="limitRepetitions"
          placeholder="1000"
          class="attempts-input"
          :disabled="!skipAnimation"
        />
        <button
          class="button"
          :class="{ 'is-success': !isAnimating, 'is-danger': isAnimating }"
          @click="isAnimating ? cancelAnimation() : runSimulation()"
        >
          {{ isAnimating ? "Cancel" : skipAnimation ? "Simulate" : "Enhance" }}
        </button>
        <button class="button" @click="clearLog">Clear</button>
      </div>
    </div>
    <div class="log-container">
      <ul class="log-list">
        <li
          v-for="(entry, index) in log"
          :key="index"
          class="is-align-items-center"
          :class="entry.success ? 'log-success' : 'log-fail'"
        >
          {{ entry.message }}
        </li>
      </ul>
    </div>
    <div class="results-display">
      <div class="result-box">
        <span class="result-label">Sucessos</span>
        <span class="result-value has-text-success">{{ successCount }}</span>
      </div>
      <div class="result-box">
        <span class="result-label">Falhas</span>
        <span class="result-value has-text-danger">{{ failCount }}</span>
      </div>
      <div class="result-box">
        <span class="result-label">Média Tentativas</span>
        <span class="result-value">{{ averageAttempts }}</span>
      </div>
      <div class="result-box">
        <span class="result-label">Total</span>
        <span class="result-value">{{ failCount + successCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnhancingSimulatorComponent",
  props: {
    baseSuccessRate: {
      type: [Number, String],
      required: true,
      default: 0,
    },
  },
  emits: ["animation-start", "animation-result", "animation-end"],
  data() {
    return {
      repetitions: 1,
      successCount: 0,
      failCount: 0,
      log: [],
      skipAnimation: false, // MUDANÇA 4: Renomeado e valor inicial trocado para 'false'
      isAnimating: false,
      animationTimers: [],
    };
  },
  methods: {
    animateAndEnhance() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.$emit("animation-start");

      const resultTimer = setTimeout(
        () => {
          const rate = parseFloat(this.baseSuccessRate) / 100;
          const prizeDraw = Math.random();
          const isSuccess = prizeDraw < rate;

          if (isSuccess) {
            this.successCount++;
            this.log.unshift({
              success: true,
              message: `Success: ${(prizeDraw * 100).toFixed(3)}`,
            });
          } else {
            this.failCount++;
            this.log.unshift({
              success: false,
              message: `Failed: ${(prizeDraw * 100).toFixed(3)}`,
            });
          }

          this.$emit("animation-result", { success: isSuccess });

          const endTimer = setTimeout(() => {
            this.$emit("animation-end");
            this.isAnimating = false;
            this.clearTimers();
          }, 3000);

          this.animationTimers.push(endTimer);
        },
        4000 + Math.random() * 1000,
      );

      this.animationTimers.push(resultTimer);
    },

    cancelAnimation() {
      if (!this.isAnimating) return;

      this.clearTimers();
      this.isAnimating = false;
      this.$emit("animation-end");
    },

    clearTimers() {
      this.animationTimers.forEach((timerId) => clearTimeout(timerId));
      this.animationTimers = [];
    },

    runSimulation() {
      // MUDANÇA 5: Lógica do IF invertida
      if (!this.skipAnimation) {
        // Se NÃO for para pular a animação...
        this.animateAndEnhance(); // ...então anime.
        return;
      }

      // Se for para pular, executa a simulação em massa
      if (!this.repetitions || this.repetitions <= 0) return;
      const rate = parseFloat(this.baseSuccessRate) / 100;

      for (let i = 0; i < this.repetitions; i++) {
        const prizeDraw = Math.random();
        const isSuccess = prizeDraw < rate;
        if (isSuccess) {
          this.successCount++;
          this.log.unshift({
            success: true,
            message: `Success: ${(prizeDraw * 100).toFixed(3)}`,
          });
        } else {
          this.failCount++;
          this.log.unshift({
            success: false,
            message: `Failed: ${(prizeDraw * 100).toFixed(3)}`,
          });
        }
      }
    },
    clearLog() {
      this.log = [];
      this.successCount = 0;
      this.failCount = 0;
      this.cancelAnimation();
    },
    limitRepetitions() {
      if (this.repetitions > 1000) {
        this.repetitions = 1000;
      }
      if (this.repetitions < 1) {
        this.repetitions = 1;
      }
    },
  },
  computed: {
    averageAttempts() {
      const totalAttempts = this.successCount + this.failCount;
      if (this.successCount === 0) return "0.00";
      return (totalAttempts / this.successCount).toFixed(2);
    },
  },
};
</script>

<style scoped>
/* Estilos do painel de simulação - pode ajustar conforme necessário */
.simulator-panel {
  background-color: hsl(221, 14%, 9%);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #e2e8f0;
}

.simulator-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.attempts-input {
  width: 80px;
  background-color: #0e0f11;
  border: 1px solid #3e4753;
  color: #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
}
.attempts-input:disabled {
  background-color: #1a1c1e;
  cursor: not-allowed;
}

.results-display {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-around;
  background-color: #0e0f11;
  padding: 0.75rem;
  border-radius: 8px;
}

.result-box {
  text-align: center;
}

.result-label {
  color: #a0aec0;
  font-size: 0.9rem;
}

.result-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}

.log-container {
  background-color: #0e0f11;
  border-radius: 8px;
  padding: 1rem;
  height: 200px;
  overflow-y: auto;
  border: 1px solid #3e4753;
}

.log-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-family: monospace;
  text-align: center;
  display: flex;
  flex-direction: column-reverse;
}

.log-success {
  color: #48bb78;
}
.log-fail {
  color: #f56565;
}

.attempts-input::-webkit-outer-spin-button,
.attempts-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.attempts-input[type="number"] {
  -moz-appearance: textfield;
}

.animation-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.switch[type="checkbox"] {
  outline: 0;
  user-select: none;
  display: inline-block;
  position: absolute;
  opacity: 0;
}
.switch[type="checkbox"] + label {
  position: relative;
  display: inline-block;
  cursor: pointer;
  height: 1.5rem;
  width: 2.75rem;
  border-radius: 1.5rem;
  background: #4a5568;
  transition: background 0.2s ease-out;
}
.switch[type="checkbox"] + label::after {
  content: "";
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  display: block;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 50%;
  background: #fff;
  transition: all 0.2s ease-out;
}
.switch[type="checkbox"]:checked + label {
  background: #48bb78;
}
.switch[type="checkbox"]:checked + label::after {
  left: 1.375rem;
}
</style>
