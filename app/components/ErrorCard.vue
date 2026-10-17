<template>
  <div
    v-if="message"
    class="fixed bottom-4 left-4 z-50 overflow-hidden w-[340px] max-w-[calc(100vw-2rem)] min-h-[84px] bg-[#3c4043] border border-[#1a1c1e] rounded-[4px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_6px_16px_rgba(0,0,0,0.6)] px-6 py-5 flex items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      stroke="#a84a4e"
      stroke-width="28"
      class="absolute -left-3 top-1/2 -translate-y-1/2 w-24 h-24 opacity-30 pointer-events-none select-none"
    >
      <circle cx="256" cy="256" r="216" />
      <circle cx="256" cy="256" r="176" stroke-width="14" />
      <path
        stroke-linecap="round"
        stroke-width="32"
        d="M256 148v128M256 348h.01"
      />
    </svg>

    <button
      type="button"
      class="absolute top-2 right-2.5 z-10 text-[#b0b3db] hover:brightness-125 transition-all cursor-pointer leading-none"
      aria-label="Close"
      @click="$emit('close')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        fill="currentColor"
        class="w-3.5 h-3.5"
      >
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        />
      </svg>
    </button>

    <div
      class="relative z-10 pl-8 pr-4 text-xs text-[#f8f3e7] leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]"
    >
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "",
  },
});

defineEmits(["close"]);
</script>
