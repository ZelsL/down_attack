<template>
  <a
    v-if="skillId"
    :href="`https://bdolytics.com/en/NA/db/skill/${skillId}`"
    draggable="false"
    class="shrink-0 flex"
    @click.prevent
  >
    <slot />
  </a>
  <slot v-else />
</template>

<script setup>
/**
 * Links a skill to its Bdolytics page. The Bdolytics tooltip script (loaded in
 * nuxt.config.ts) shows the skill details when hovering any of these links.
 * Clicking is intentionally ignored, so it does not interfere with the parent
 * (toggle, open hits modal, drag...).
 */
defineProps({
  skillId: {
    type: [Number, String],
    default: null,
  },
});
</script>
