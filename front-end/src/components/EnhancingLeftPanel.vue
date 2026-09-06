<template>
  <div class="left-panel">
    <div
      v-if="averageAttempts > 0 && durabilityLoss >= 0 && softcap >= 0"
      class="left-panel-content"
    >
      <div class="stat-card">
        <span class="stat-label is-align-self-center">Average Attempts</span>
        <span class="stat-value is-align-self-center">{{
          averageAttempts
        }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label is-align-self-center">Durability Loss</span>
        <span class="stat-value is-align-self-center">{{
          durabilityLoss
        }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label is-align-self-center">Softcap</span>
        <span class="stat-value is-align-self-center">{{ softcap }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnhLeftPanelComponent",
  props: {
    averageAttempts: {
      type: [String, Number],
      required: true,
    },
    durabilityLoss: {
      type: Number,
      required: true,
    },
    softcap: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.left-panel {
  background-color: hsl(221, 14%, 9%);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: #e2e8f0;
  height: 100%;
}

.stat-card {
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.stat-label {
  font-size: 1rem;
  color: #a0aec0;
  margin-bottom: 0.5rem;
  font-weight: bolder;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}
</style>
