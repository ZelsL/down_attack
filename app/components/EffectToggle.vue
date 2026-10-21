<template>
  <TooltipButton
    :label="name"
    :hide-tooltip="isIconHovered"
    :class="[
      'w-full !justify-start gap-2 !px-2.5 !py-1.5 rounded-sm border text-xs font-semibold transition-all select-none',
      active
        ? 'bg-[#4f433c] border-[#857062] text-[#d2b996]'
        : 'bg-[#3f3f49] border-[#555462] text-[#9e9ea7] hover:border-[#737282]',
    ]"
  >
    <span
      :class="[
        'w-2.5 h-2.5 rounded-[2px] border shrink-0 transition-all',
        active
          ? 'bg-[#fff1df] border-white/60 shadow-[0_0_5px_rgba(255,241,223,0.6)]'
          : 'bg-[#292929] border-black/80',
      ]"
    />

    <!-- Hovering the icon shows the Bdolytics skill tooltip instead -->
    <span
      v-if="icon"
      class="flex"
      @mouseenter="isIconHovered = true"
      @mouseleave="isIconHovered = false"
    >
      <SkillLink :skill-id="skillId">
        <img
          :src="icon"
          :alt="name"
          class="w-5 h-5 rounded-sm object-cover shrink-0 bg-black/40 border border-black/50"
        />
      </SkillLink>
    </span>

    <span class="truncate flex-1 text-left">{{ name }}</span>

    <template #tooltip>
      <div class="flex flex-col gap-0.5 text-left">
        <span class="text-[#d7ad70]">{{ name }}</span>
        <span v-if="duration" class="font-mono text-[11px] text-[#ffedd4]/50">
          Duration: {{ duration }}s
        </span>
        <span
          v-for="label in selfLabels"
          :key="`self-${label}`"
          class="font-mono text-[11px] text-[#ffedd4]/80"
        >
          {{ label }}
        </span>
        <span
          v-for="label in enemyLabels"
          :key="`enemy-${label}`"
          class="font-mono text-[11px] text-[#ff9d9d]/90"
        >
          {{ label }} (enemy)
        </span>
      </div>
    </template>
  </TooltipButton>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  skillId: {
    type: [Number, String],
    default: null,
  },
  active: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
  duration: {
    type: Number,
    default: 0,
  },
  selfLabels: {
    type: Array,
    default: () => [],
  },
  enemyLabels: {
    type: Array,
    default: () => [],
  },
});

const isIconHovered = ref(false);
</script>
