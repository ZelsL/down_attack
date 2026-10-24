<template>
  <div
    class="min-h-[calc(100vh-4.5rem)] bg-[#222122] text-[#cfd2dc] font-sans py-14 px-4 sm:px-6 lg:px-8 selection:bg-[#d7ad70]/20 selection:text-[#ffedd4]"
  >
    <!-- Main Container (Centered, max-w-4xl) -->
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- 1. Header Banner / Hero Section -->
      <header
        class="panel-frame panel-highlight bg-[#161618] rounded-xl p-8 sm:p-10 relative overflow-hidden"
      >
        <!-- Decorative medieval corner accents -->
        <div
          class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d7ad70]/30 rounded-tl-xl pointer-events-none"
        />
        <div
          class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d7ad70]/30 rounded-tr-xl pointer-events-none"
        />

        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <!-- Tag Badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d7ad70]/10 border border-[#d7ad70]/30 text-[#d7ad70] text-xs font-semibold tracking-widest uppercase"
          >
            <svg
              class="w-3.5 h-3.5 text-[#d7ad70]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            LEGAL &amp; TRANSPARENCY
          </div>

          <!-- Last Updated Pill -->
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1e24] border border-[#2d2d35] text-[#848895] text-xs font-medium"
          >
            <svg
              class="w-3.5 h-3.5 text-[#848895]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Last Updated: October 2026
          </span>
        </div>

        <!-- Title & Subtitle -->
        <h1
          class="text-3xl sm:text-4xl font-extrabold text-[#ffedd4] tracking-tight font-serif gold-glow mb-2"
        >
          Privacy Policy
        </h1>
        <p class="text-base sm:text-lg text-[#848895] leading-relaxed">
          How <span class="text-[#cfd2dc] font-semibold">Down Attack</span>
          collects, uses, and protects your data.
        </p>

        <!-- TL;DR Callout Box -->
        <div
          class="mt-6 p-4 sm:p-5 rounded-lg bg-[#1f1d1b] border border-[#3d3428]/70 relative"
        >
          <div class="flex items-start gap-3.5">
            <div
              class="p-2 rounded-md bg-[#d7ad70]/15 text-[#d7ad70] shrink-0 mt-0.5"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <span
                class="text-xs font-bold tracking-wider uppercase text-[#d7ad70] block mb-1"
              >
                TL;DR Summary
              </span>
              <p class="text-sm text-[#cfd2dc] leading-relaxed">
                We only collect what is strictly necessary to save your PvP
                presets, combos, and Solare stream overlays. We
                <strong class="text-[#ffedd4]">never sell your data</strong> or
                use ad trackers.
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. Numbered Content Sections -->
      <div class="space-y-6">
        <!-- 01. Information We Collect -->
        <section
          class="panel-frame bg-[#161618] rounded-xl p-6 sm:p-8 space-y-5"
        >
          <div class="flex items-center gap-3 border-b border-[#262529] pb-4">
            <span
              class="text-sm font-mono font-bold text-[#d7ad70] px-2.5 py-1 rounded bg-[#d7ad70]/10 border border-[#d7ad70]/20"
            >
              01
            </span>
            <h2
              class="text-xl font-bold text-[#ffedd4] font-serif tracking-wide flex items-center gap-2"
            >
              Information We Collect
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Item 1: Discord OAuth2 -->
            <div
              class="p-4 rounded-lg bg-[#1b1b1e] border border-[#27272c] space-y-2"
            >
              <div
                class="flex items-center gap-2 text-[#d7ad70] text-sm font-semibold"
              >
                <span
                  class="w-4 h-4 bg-[#d7ad70] shrink-0 inline-block"
                  :style="{
                    mask: `url(/icons/discord.png) no-repeat center / contain`,
                    WebkitMask: `url(/icons/discord.png) no-repeat center / contain`,
                  }"
                />
                <span>Discord OAuth2 Login</span>
              </div>
              <p class="text-xs sm:text-sm text-[#848895] leading-relaxed">
                We only receive your public Discord ID, username, display name,
                and avatar hash.
                <strong class="text-[#cfd2dc]">
                  We do not access your email, private messages, or servers.
                </strong>
              </p>
            </div>

            <!-- Item 2: Calculator Builds -->
            <div
              class="p-4 rounded-lg bg-[#1b1b1e] border border-[#27272c] space-y-2"
            >
              <div
                class="flex items-center gap-2 text-[#d7ad70] text-sm font-semibold"
              >
                <span
                  class="w-4 h-4 bg-[#d7ad70] shrink-0 inline-block"
                  :style="{
                    mask: `url(/icons/sword.png) no-repeat center / contain`,
                    WebkitMask: `url(/icons/sword.png) no-repeat center / contain`,
                  }"
                />
                <span>Calculator Builds &amp; Combos</span>
              </div>
              <p class="text-xs sm:text-sm text-[#848895] leading-relaxed">
                Character stats, gear presets, and skill combos you voluntarily
                configure and choose to save to your personal account library.
              </p>
            </div>

            <!-- Item 3: Solare Overlay -->
            <div
              class="p-4 rounded-lg bg-[#1b1b1e] border border-[#27272c] space-y-2"
            >
              <div
                class="flex items-center gap-2 text-[#d7ad70] text-sm font-semibold"
              >
                <span
                  class="w-4 h-4 bg-[#d7ad70] shrink-0 inline-block"
                  :style="{
                    mask: `url(/icons/overlay.png) no-repeat center / contain`,
                    WebkitMask: `url(/icons/overlay.png) no-repeat center / contain`,
                  }"
                />
                <span>Arena of Solare Overlay</span>
              </div>
              <p class="text-xs sm:text-sm text-[#848895] leading-relaxed">
                Public in-game match records, Family Name, region, and session
                baseline rating (PDL) queried specifically to generate your
                real-time OBS Browser Source overlay.
              </p>
            </div>
          </div>
        </section>

        <!-- 02. Cookies & Local Storage -->
        <section
          class="panel-frame bg-[#161618] rounded-xl p-6 sm:p-8 space-y-5"
        >
          <div class="flex items-center gap-3 border-b border-[#262529] pb-4">
            <span
              class="text-sm font-mono font-bold text-[#d7ad70] px-2.5 py-1 rounded bg-[#d7ad70]/10 border border-[#d7ad70]/20"
            >
              02
            </span>
            <h2
              class="text-xl font-bold text-[#ffedd4] font-serif tracking-wide flex items-center gap-2"
            >
              Cookies &amp; Local Storage
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="p-4 rounded-lg bg-[#1b1b1e] border border-[#27272c] space-y-2"
            >
              <div
                class="flex items-center gap-2 text-[#ffedd4] text-sm font-semibold"
              >
                <span class="w-2 h-2 rounded-full bg-[#d7ad70]" />
                <span>Essential Session Cookies</span>
              </div>
              <p class="text-sm text-[#cfd2dc] leading-relaxed">
                We employ strict, secure HTTP-only cookies solely for
                authenticating your Discord login session. They expire
                automatically and never hold any tracking data.
              </p>
            </div>

            <div
              class="p-4 rounded-lg bg-[#1b1b1e] border border-[#27272c] space-y-2"
            >
              <div
                class="flex items-center gap-2 text-[#ffedd4] text-sm font-semibold"
              >
                <span class="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Browser Local Storage</span>
              </div>
              <p class="text-sm text-[#cfd2dc] leading-relaxed">
                Used strictly on your device to remember your calculator
                scratchpad and active Solare overlay preview mode (Horizontal /
                Vertical).
                <strong class="text-[#ffedd4]">
                  Zero third-party tracking or advertising scripts.
                </strong>
              </p>
            </div>
          </div>
        </section>

        <!-- 03. How We Use Your Information -->
        <section
          class="panel-frame bg-[#161618] rounded-xl p-6 sm:p-8 space-y-4"
        >
          <div class="flex items-center gap-3 border-b border-[#262529] pb-4">
            <span
              class="text-sm font-mono font-bold text-[#d7ad70] px-2.5 py-1 rounded bg-[#d7ad70]/10 border border-[#d7ad70]/20"
            >
              03
            </span>
            <h2
              class="text-xl font-bold text-[#ffedd4] font-serif tracking-wide"
            >
              How We Use Your Information
            </h2>
          </div>
          <p class="text-sm sm:text-base text-[#cfd2dc] leading-relaxed">
            The limited data we collect is processed solely to operate the core
            features of
            <span class="text-[#d7ad70] font-medium">Down Attack</span>:
          </p>
          <ul class="space-y-2.5 pl-2 text-sm text-[#cfd2dc]">
            <li class="flex items-start gap-3">
              <span class="text-[#d7ad70] font-bold mt-0.5">•</span>
              <span>
                <strong class="text-[#ffedd4]">Authentication:</strong> To
                securely sign you in and bind your saved presets to your Discord
                account.
              </span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#d7ad70] font-bold mt-0.5">•</span>
              <span>
                <strong class="text-[#ffedd4]">Cloud Synchronization:</strong>
                To store and retrieve your PvP damage calculations, gear
                templates, and combo rotations across devices.
              </span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#d7ad70] font-bold mt-0.5">•</span>
              <span>
                <strong class="text-[#ffedd4]">Live Stream Overlays:</strong>
                To query publicly visible Solare match outcomes, calculate your
                current broadcast session statistics, and deliver dynamic
                updates to your OBS Browser Source.
              </span>
            </li>
          </ul>
        </section>

        <!-- 04. Third-Party Services -->
        <section
          class="panel-frame bg-[#161618] rounded-xl p-6 sm:p-8 space-y-4"
        >
          <div class="flex items-center gap-3 border-b border-[#262529] pb-4">
            <span
              class="text-sm font-mono font-bold text-[#d7ad70] px-2.5 py-1 rounded bg-[#d7ad70]/10 border border-[#d7ad70]/20"
            >
              04
            </span>
            <h2
              class="text-xl font-bold text-[#ffedd4] font-serif tracking-wide"
            >
              Third-Party Services
            </h2>
          </div>
          <p class="text-sm sm:text-base text-[#cfd2dc] leading-relaxed">
            We integrate only with reputable gaming and community infrastructure
            essential to the platform:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="p-3.5 rounded-lg bg-[#1a1a1d] border border-[#25252b]">
              <span class="font-semibold text-[#d7ad70] text-sm block mb-1">
                Discord Inc.
              </span>
              <span class="text-xs text-[#848895]">
                Used for federated user authentication and identity
                verification.
              </span>
            </div>
            <div class="p-3.5 rounded-lg bg-[#1a1a1d] border border-[#25252b]">
              <span class="font-semibold text-[#d7ad70] text-sm block mb-1">
                Garmoth
              </span>
              <span class="text-xs text-[#848895]">
                Optional build and gear import triggered strictly on your
                explicit user request.
              </span>
            </div>
            <div class="p-3.5 rounded-lg bg-[#1a1a1d] border border-[#25252b]">
              <span class="font-semibold text-[#d7ad70] text-sm block mb-1">
                Black Desert Online
              </span>
              <span class="text-xs text-[#848895]">
                Queries against publicly visible match history and competitive
                rankings.
              </span>
            </div>
          </div>
        </section>

        <!-- 05. Data Retention & Account Deletion -->
        <section
          class="panel-frame bg-[#161618] rounded-xl p-6 sm:p-8 space-y-4"
        >
          <div class="flex items-center gap-3 border-b border-[#262529] pb-4">
            <span
              class="text-sm font-mono font-bold text-[#d7ad70] px-2.5 py-1 rounded bg-[#d7ad70]/10 border border-[#d7ad70]/20"
            >
              05
            </span>
            <h2
              class="text-xl font-bold text-[#ffedd4] font-serif tracking-wide"
            >
              Data Retention &amp; Account Deletion
            </h2>
          </div>
          <div
            class="p-4 rounded-lg bg-[#1a1919] border border-[#2e2a24] text-sm text-[#cfd2dc] leading-relaxed space-y-2"
          >
            <p>
              Your account data and saved presets remain stored only while your
              account remains active. You maintain full ownership of your data:
            </p>
            <ul class="space-y-1.5 pl-2">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#d7ad70] shrink-0" />
                <span>
                  You can delete individual saved combos, damage setups, or
                  overlay configs at any moment via the app.
                </span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#d7ad70] shrink-0" />
                <span>
                  To request complete account removal and permanent erasure of
                  all associated database records, reach out through our Discord
                  community or open a ticket on GitHub.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <!-- 3. Bottom Contact / Community Card -->
      <div
        class="panel-frame bg-[#161618] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-[#3d3428]/50"
      >
        <div class="space-y-1 text-center sm:text-left">
          <h3 class="text-lg font-bold text-[#ffedd4] font-serif">
            Have questions about your privacy?
          </h3>
          <p class="text-sm text-[#848895]">
            Want to submit feedback or request immediate data deletion?
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <!-- Discord Button -->
          <a
            href="https://discord.gg/kNYvABEHJ3"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <span
              class="w-4 h-4 bg-white shrink-0 inline-block"
              :style="{
                mask: `url(/icons/discord.png) no-repeat center / contain`,
                WebkitMask: `url(/icons/discord.png) no-repeat center / contain`,
              }"
            />
            <span>Join our Discord</span>
          </a>

          <!-- GitHub Button -->
          <a
            href="https://github.com/ZelsL/down_attack"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#252529] hover:bg-[#2f2f35] border border-[#393940] text-[#cfd2dc] hover:text-white text-sm font-semibold transition-colors"
          >
            <span
              class="w-4 h-4 bg-[#cfd2dc] group-hover:bg-white transition-colors shrink-0 inline-block"
              :style="{
                mask: `url(/icons/github.svg) no-repeat center / contain`,
                WebkitMask: `url(/icons/github.svg) no-repeat center / contain`,
              }"
            />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Privacy Policy",
});

definePageMeta({
  header: {
    name: "Privacy Policy",
    icon: "/icons/privacy.png",
  },
});
</script>

<style scoped>
.gold-glow {
  text-shadow: 0 0 16px rgba(215, 173, 112, 0.25);
}

.panel-frame {
  border: 1px solid #2f2c29;
  box-shadow:
    0 4px 20px -2px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(215, 173, 112, 0.04);
}

.panel-highlight {
  background: radial-gradient(
    circle at 50% 0%,
    rgba(215, 173, 112, 0.06),
    transparent 70%
  );
}
</style>
