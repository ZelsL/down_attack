<template>
  <div class="inline-block bg-transparent p-2">
    <SolareCard v-if="overlayData" :data="overlayData" :layout="layoutMode" />

    <div
      v-else-if="errorMessage"
      class="w-[340px] rounded-md bg-[#181615]/95 border border-[#584938] p-4 text-center font-sans text-[#ebdcc6] shadow-2xl"
    >
      <p class="text-xs font-black uppercase tracking-wider text-amber-400">
        Arena of Solare Overlay
      </p>
      <p class="mt-1 text-xs text-[#c2b4a3]">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

definePageMeta({
  layout: false,
});

const route = useRoute();

useSeoMeta({
  title: "Solare Stream Overlay",
  robots: "noindex, nofollow",
});

useHead({
  style: [
    {
      children:
        "html, body, #__nuxt { background: transparent !important; margin: 0; padding: 0; overflow: hidden; }",
    },
  ],
});

const overlayData = ref(null);
const errorMessage = ref("");
let pollTimer = null;

const layoutMode = computed(() => {
  const raw = String(route.query.layout || "vertical").toLowerCase();
  return raw === "horizontal" ? "horizontal" : "vertical";
});

async function fetchOverlay() {
  const token = route.query.token ? String(route.query.token).trim() : "";
  const nick = route.query.nick ? String(route.query.nick).trim() : "";
  const region = route.query.region
    ? String(route.query.region).trim().toUpperCase()
    : "SA";

  if (!token && !nick) {
    errorMessage.value =
      "Missing 'token' or 'nick' parameter in the Overlay URL.";
    return;
  }

  const params = new URLSearchParams();
  if (token) {
    params.set("token", token);
  } else {
    params.set("nick", nick);
    params.set("region", region);
  }

  try {
    const response = await fetch(`/api/v1/solare/overlay?${params.toString()}`);
    const body = await response.json();

    if (!response.ok) {
      if (!overlayData.value) {
        errorMessage.value = body?.message || "Unable to load overlay data.";
      }
      return;
    }

    overlayData.value = body;
    errorMessage.value = "";
  } catch {
    if (!overlayData.value) {
      errorMessage.value = "Connection error while loading overlay.";
    }
  }
}

onMounted(() => {
  fetchOverlay();
  pollTimer = setInterval(fetchOverlay, 20000);
});

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer);
  }
});
</script>
