<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    if (!titleChunk) {
      return "Down Attack — BDO PvP Damage Calculator & Arena of Solare Overlay";
    }
    return titleChunk.includes("Down Attack")
      ? titleChunk
      : `${titleChunk} — Down Attack`;
  },
});
</script>
