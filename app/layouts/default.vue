<template>
  <div class="min-h-screen bg-[#222122] text-[#ffedd4]">
    <header class="w-full">
      <!-- 1st Row: Upper Bronze Bar (Title & Active Tab Icon) -->
      <div class="w-full bg-[#775d3a] px-4 h-8 flex items-center space-x-2">
        <span
          class="w-6 h-6 bg-[#ffedd4] inline-block transition-colors"
          :style="{
            mask: `url(${currentTab.icon}) no-repeat center / contain`,
            WebkitMask: `url(${currentTab.icon}) no-repeat center / contain`,
          }"
        />
        <span class="font-semibold text-sm text-[#ffedd4]">
          {{ currentTab.name }}
        </span>
      </div>

      <!-- 2nd Row: Dark Bar with Centered Icons & Reactive Colors -->
      <div
        class="w-full bg-[#323134] px-4 h-10 flex justify-center items-center space-x-6"
      >
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="tab.path"
          class="p-1.5 rounded transition-all focus:outline-none flex items-center justify-center group"
          :title="tab.name"
        >
          <!-- Icon changing color reactively using CSS Mask -->
          <span
            class="w-6 h-6 inline-block transition-colors duration-200"
            :class="
              activeTab === tab.id
                ? 'bg-[#ffedd4]'
                : 'bg-[#5d5856] group-hover:bg-[#ffedd4]/70'
            "
            :style="{
              mask: `url(${tab.icon}) no-repeat center / contain`,
              WebkitMask: `url(${tab.icon}) no-repeat center / contain`,
            }"
          />
        </NuxtLink>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";

const route = useRoute();
const customHeader = useHeader();

// Application tabs list
const tabs = [
  {
    id: "home",
    name: "Home",
    icon: "/icons/home.png",
    path: "/",
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: "/icons/sword.png",
    path: "/calculator",
  },
  {
    id: "discord",
    name: "Discord",
    icon: "/icons/discord.png",
    path: "https://discord.gg",
  },
];

// Dynamically compute the active tab based on route path
const activeTab = computed(() => {
  if (route.path.startsWith("/calculator")) {
    return "calculator";
  }
  if (route.path === "/") {
    return "home";
  }
  return "";
});

// Dynamically compute the active tab data for the upper bar
const currentTab = computed(() => {
  if (
    customHeader.value &&
    (customHeader.value.name || customHeader.value.icon)
  ) {
    return {
      name: customHeader.value.name || "",
      icon: customHeader.value.icon || "",
    };
  }

  if (route.meta?.header) {
    return {
      name: route.meta.header.name || "",
      icon: route.meta.header.icon || "",
    };
  }

  return tabs.find((t) => t.id === activeTab.value) || tabs[0];
});
</script>
