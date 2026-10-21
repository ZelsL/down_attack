<template>
  <button
    type="button"
    class="relative group flex items-center justify-center p-1 cursor-pointer"
  >
    <slot />
    <div
      v-if="!hideTooltip"
      class="absolute left-0 top-full mt-1.5 hidden group-hover:flex items-center gap-1.5 bg-[#131215] border border-[#131215]/20 text-[#ffedd4] text-xs font-semibold px-2.5 py-1 rounded-[4px] shadow-lg whitespace-nowrap pointer-events-none z-50"
    >
      <slot name="tooltip">
        <slot />
        <span>{{ label }}</span>
      </slot>
    </div>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  hideTooltip: {
    type: Boolean,
    default: false,
  },
});
</script>
