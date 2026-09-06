<template>
  <div class="chance-calculator">
    <h4 class="calculator-title">Chance Calculator</h4>
    <div class="form-group">
      <label for="attempts-input">Attempts</label>
      <input
        id="attempts-input"
        type="number"
        v-model.number="attempts"
        class="attempts-input"
        min="1"
      />
    </div>
    <div class="result-group">
      <span class="result-label">Chance of Success</span>
      <span class="result-value">{{ chanceOfSuccess }} %</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnhancingCalculatorComponent",
  props: {
    baseSuccessRate: {
      type: [Number, String],
      required: true,
      default: 0,
    },
  },
  data() {
    return {
      attempts: 1,
    };
  },
  computed: {
    chanceOfSuccess() {
      if (!this.attempts || this.attempts <= 0 || !this.baseSuccessRate) {
        return "0.000";
      }
      // Fórmula: 1 - (chance de falha ^ número de tentativas)
      const baseRate = parseFloat(this.baseSuccessRate) / 100;
      const failureRate = 1 - baseRate;
      const totalSuccessChance = 1 - Math.pow(failureRate, this.attempts);

      return (totalSuccessChance * 100).toFixed(3);
    },
  },
};
</script>

<style scoped>
.chance-calculator {
  background-color: hsl(221, 14%, 9%);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  color: #e2e8f0;
  width: 100%;
}

.calculator-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
}

.form-group,
.result-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.attempts-input {
  background-color: #0e0f11;
  border: 1px solid #3e4753;
  border-radius: 6px;
  color: #e2e8f0;
  padding: 0.5rem;
  width: 80px;
  text-align: center;
  font-size: 1rem;
}

.attempts-input:focus {
  outline: none;
  border-color: #718096;
}

.result-label {
  color: #a0aec0;
}

.result-value {
  font-size: 1.75rem;
  font-weight: bold;
  color: #fff;
}
.attempts-input::-webkit-outer-spin-button,
.attempts-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.attempts-input[type="number"] {
  -moz-appearance: textfield;
}
</style>
