<template>
  <div
    class="min-h-[calc(100vh-4.5rem)] bg-[#1e1d1e] text-[#cfd2dc] font-sans py-10 sm:py-14 px-4 sm:px-6 lg:px-8 selection:bg-[#d7ad70]/20 selection:text-[#ffedd4]"
  >
    <!-- BEGIN: MainContainer -->
    <div
      class="max-w-4xl mx-auto space-y-6"
      data-purpose="terms-content-container"
    >
      <!-- BEGIN: HeaderCard -->
      <header
        class="golden-corner-card bg-[#18181b] border border-[#2e2a26] rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        data-purpose="header-section"
      >
        <!-- Top Badges Row -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <!-- Badge: Legal & Community Guidelines -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201d1a] border border-[#483d2e] text-[#d7ad70] text-xs font-semibold uppercase tracking-wider"
          >
            <svg
              aria-hidden="true"
              class="w-3.5 h-3.5 text-[#d7ad70]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.54-3.14 8.79-7 9.88-3.86-1.09-7-5.34-7-9.88V6.3l7-3.12zM11 7v6h2V7h-2zm0 8v2h2v-2h-2z"
              />
            </svg>
            <span class="font-serif text-[11px] tracking-widest">
              LEGAL &amp; COMMUNITY GUIDELINES
            </span>
          </div>

          <!-- Pill: Last Updated -->
          <div
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1e22] border border-[#2b2b30] text-[#848895] text-xs font-medium"
          >
            <svg
              class="w-3.5 h-3.5 text-[#848895]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <span>Last Updated: October 2026</span>
          </div>
        </div>

        <!-- Title & Intro -->
        <h1
          class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#ffedd4] mb-2 uppercase"
        >
          Terms of Service
        </h1>
        <p
          class="text-[#848895] text-sm sm:text-base font-normal leading-relaxed mb-6"
        >
          Rules, disclaimers, and guidelines for using
          <strong class="text-white font-semibold">Down Attack</strong>.
        </p>

        <!-- TL;DR Summary Box -->
        <div
          class="bg-[#121214] border border-[#2f2c29] rounded-lg p-4 sm:p-5 flex items-start gap-3.5"
          data-purpose="tldr-summary"
        >
          <div class="mt-0.5 text-[#d7ad70] shrink-0">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
          <div>
            <span
              class="block font-serif text-xs font-bold uppercase tracking-wider text-[#d7ad70] mb-1"
            >
              TL;DR SUMMARY
            </span>
            <p class="text-xs sm:text-sm text-[#848895] leading-relaxed">
              Down Attack is a free, fan-made community tool for Black Desert
              Online. Use it
              <strong class="text-[#cfd2dc] font-medium">fairly</strong>, don’t
              abuse our APIs or overlays, and remember we are
              <strong class="text-[#ffedd4] font-semibold">
                not affiliated with Pearl Abyss
              </strong>
              .
            </p>
          </div>
        </div>
      </header>
      <!-- END: HeaderCard -->

      <!-- BEGIN: Section01 -->
      <section
        class="bg-[#18181b] border border-[#2a2724] rounded-xl p-6 sm:p-7 shadow-xl space-y-4"
        data-purpose="section-acceptance"
      >
        <!-- Section Title Header -->
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center justify-center w-7 h-7 text-xs font-serif font-bold text-[#d7ad70] bg-[#141416] border border-[#483d2e] rounded-md shadow-inner"
          >
            01
          </span>
          <h2
            class="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#ffedd4] uppercase"
          >
            Acceptance of Terms &amp; Fan-Made Disclaimer
          </h2>
        </div>
        <div class="border-t border-[#262422] pt-4 space-y-4">
          <p class="text-sm leading-relaxed text-[#848895]">
            By accessing or using
            <strong class="text-white font-medium">Down Attack</strong>, you
            agree to be bound by these Terms of Service. If you do not agree to
            all terms stated herein, you must immediately discontinue using our
            calculators, presets, and overlay tools.
          </p>
          <!-- Unofficial Community Disclaimer Box -->
          <div
            class="bg-[#131315] border border-[#2c2925] rounded-lg p-4 sm:p-5 space-y-3"
          >
            <div class="flex items-start gap-2.5">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#d7ad70] mt-2 shrink-0"
              />
              <p class="text-xs sm:text-sm leading-relaxed text-[#848895]">
                <strong class="text-[#d7ad70] font-semibold">
                  Unofficial Community Project:
                </strong>
                Down Attack is an independent, non-commercial fan-made
                open-source project and is
                <strong class="text-[#ffedd4]">
                  NOT affiliated with, endorsed, sponsored, or approved by Pearl
                  Abyss Corp.
                </strong>
                or Black Desert Online.
              </p>
            </div>
            <div class="flex items-start gap-2.5">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#d7ad70] mt-2 shrink-0"
              />
              <p class="text-xs sm:text-sm leading-relaxed text-[#848895]">
                All in-game icons, class names, skill descriptors, equipment
                terminology, and game registered trademarks remain the exclusive
                property of
                <span class="text-[#cfd2dc]">Pearl Abyss Corp</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
      <!-- END: Section01 -->

      <!-- BEGIN: Section02 -->
      <section
        class="bg-[#18181b] border border-[#2a2724] rounded-xl p-6 sm:p-7 shadow-xl space-y-4"
        data-purpose="section-authentication"
      >
        <!-- Section Title Header -->
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center justify-center w-7 h-7 text-xs font-serif font-bold text-[#d7ad70] bg-[#141416] border border-[#483d2e] rounded-md shadow-inner"
          >
            02
          </span>
          <h2
            class="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#ffedd4] uppercase"
          >
            Account &amp; Discord Authentication
          </h2>
        </div>
        <!-- Grid of 2 Cards -->
        <div
          class="border-t border-[#262422] pt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <!-- Card 1: Discord OAuth2 Security -->
          <div
            class="bg-[#131315] border border-[#2b2825] rounded-lg p-5 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center gap-2 mb-2 text-[#d7ad70]">
                <span class="w-2 h-2 rounded-full bg-[#d7ad70]" />
                <h3 class="font-medium text-sm text-[#ffedd4]">
                  Discord OAuth2 Security
                </h3>
              </div>
              <p class="text-xs sm:text-sm leading-relaxed text-[#848895]">
                You sign in securely through Discord OAuth2. You are solely
                responsible for maintaining the security of your Discord account
                and credentials. Any action initiated under your Discord
                authentication is assumed to be authorized by you.
              </p>
            </div>
          </div>
          <!-- Card 2: OBS Overlay Token URL -->
          <div
            class="bg-[#131315] border border-[#2b2825] rounded-lg p-5 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center gap-2 mb-2 text-[#34d399]">
                <span class="w-2 h-2 rounded-full bg-[#34d399]" />
                <h3 class="font-medium text-sm text-[#ffedd4]">
                  OBS Overlay Token URL
                </h3>
              </div>
              <p class="text-xs sm:text-sm leading-relaxed text-[#848895]">
                Keep your Arena of Solare OBS Browser Source URL and access
                token private. Anyone possessing your unique URL can view,
                embed, or monitor your live overlay broadcast sessions. Treat
                this URL like a streaming key.
              </p>
            </div>
          </div>
        </div>
      </section>
      <!-- END: Section02 -->

      <!-- BEGIN: Section03 -->
      <section
        class="bg-[#18181b] border border-[#2a2724] rounded-xl p-6 sm:p-7 shadow-xl space-y-4"
        data-purpose="section-fair-play"
      >
        <!-- Section Title Header -->
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center justify-center w-7 h-7 text-xs font-serif font-bold text-[#d7ad70] bg-[#141416] border border-[#483d2e] rounded-md shadow-inner"
          >
            03
          </span>
          <h2
            class="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#ffedd4] uppercase"
          >
            Acceptable Use &amp; Fair Play
          </h2>
        </div>
        <!-- 3 Columns Card Grid -->
        <div
          class="border-t border-[#262422] pt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <!-- Sub-card 1 -->
          <div
            class="bg-[#131315] border border-[#2a2724] rounded-lg p-4 sm:p-5 flex flex-col"
          >
            <div class="flex items-center gap-2 text-[#d7ad70] mb-2.5">
              <svg
                class="w-4 h-4 shrink-0 text-[#d7ad70]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              <h3 class="font-medium text-xs sm:text-sm text-[#ffedd4]">
                No API Abuse or Scraping
              </h3>
            </div>
            <p class="text-xs leading-relaxed text-[#848895]">
              Do not flood requests, run automated high-frequency scrapers, or
              attempt rate-limit bypasses against our calculator endpoints or
              Solare live data queues.
            </p>
          </div>
          <!-- Sub-card 2 -->
          <div
            class="bg-[#131315] border border-[#2a2724] rounded-lg p-4 sm:p-5 flex flex-col"
          >
            <div class="flex items-center gap-2 text-[#d7ad70] mb-2.5">
              <svg
                class="w-4 h-4 shrink-0 text-[#d7ad70]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              <h3 class="font-medium text-xs sm:text-sm text-[#ffedd4]">
                Respectful Content
              </h3>
            </div>
            <p class="text-xs leading-relaxed text-[#848895]">
              Publicly saved preset titles, combo rotations, and gear build
              notes must remain free of hate speech, targeted harassment, or
              malicious links.
            </p>
          </div>
          <!-- Sub-card 3 -->
          <div
            class="bg-[#131315] border border-[#2a2724] rounded-lg p-4 sm:p-5 flex flex-col"
          >
            <div class="flex items-center gap-2 text-[#d7ad70] mb-2.5">
              <span
                class="w-4 h-4 bg-[#d7ad70] shrink-0 inline-block"
                :style="{
                  mask: `url(/icons/overlay.png) no-repeat center / contain`,
                  WebkitMask: `url(/icons/overlay.png) no-repeat center / contain`,
                }"
              />
              <h3 class="font-medium text-xs sm:text-sm text-[#ffedd4]">
                Fair Stream Usage
              </h3>
            </div>
            <p class="text-xs leading-relaxed text-[#848895]">
              The Arena of Solare Overlay strictly reads public match rankings.
              It does not hook, inject code into, modify, or manipulate the
              Black Desert Online game client.
            </p>
          </div>
        </div>
      </section>
      <!-- END: Section03 -->

      <!-- BEGIN: Section04 -->
      <section
        class="bg-[#18181b] border border-[#2a2724] rounded-xl p-6 sm:p-7 shadow-xl space-y-4"
        data-purpose="section-accuracy"
      >
        <!-- Section Title Header -->
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center justify-center w-7 h-7 text-xs font-serif font-bold text-[#d7ad70] bg-[#141416] border border-[#483d2e] rounded-md shadow-inner"
          >
            04
          </span>
          <h2
            class="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#ffedd4] uppercase"
          >
            Accuracy of Calculations &amp; Service Availability
          </h2>
        </div>
        <div class="border-t border-[#262422] pt-4 space-y-3">
          <p class="text-sm leading-relaxed text-[#848895]">
            Down Attack is offered strictly as an informational and
            theorycrafting tool:
          </p>
          <ul class="space-y-2.5 text-xs sm:text-sm text-[#848895] pl-1">
            <li class="flex items-start gap-2.5">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#d7ad70] mt-2 shrink-0"
              />
              <span>
                PvP damage calculations, effective HP formulas, class modifiers,
                and Solare PDL tracking are provided
                <strong class="text-[#ffedd4]">"AS IS"</strong> for estimation
                and community theorycrafting purposes only.
              </span>
            </li>
            <li class="flex items-start gap-2.5">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#d7ad70] mt-2 shrink-0"
              />
              <span>
                Official game updates and weekly patches by Pearl Abyss may
                modify hidden damage brackets, caps, or skill balance formulas
                at any time. We cannot guarantee 100% real-time mathematical
                parity or uninterrupted server availability.
              </span>
            </li>
          </ul>
        </div>
      </section>
      <!-- END: Section04 -->

      <!-- BEGIN: Section05 -->
      <section
        class="bg-[#18181b] border border-[#2a2724] rounded-xl p-6 sm:p-7 shadow-xl space-y-4"
        data-purpose="section-termination"
      >
        <!-- Section Title Header -->
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center justify-center w-7 h-7 text-xs font-serif font-bold text-[#d7ad70] bg-[#141416] border border-[#483d2e] rounded-md shadow-inner"
          >
            05
          </span>
          <h2
            class="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#ffedd4] uppercase"
          >
            Account Termination &amp; Modifications
          </h2>
        </div>
        <div class="border-t border-[#262422] pt-4">
          <!-- Inner Box with Points -->
          <div
            class="bg-[#131315] border border-[#2a2724] rounded-lg p-4 sm:p-5 space-y-3"
          >
            <div class="flex items-start gap-2.5">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#d7ad70] mt-2 shrink-0"
              />
              <p class="text-xs sm:text-sm leading-relaxed text-[#848895]">
                We reserve the right to temporarily suspend accounts, terminate
                access, or revoke Solare overlay browser keys that abuse backend
                systems, exploit ranking endpoints, or violate community
                standards.
              </p>
            </div>
            <div class="flex items-start gap-2.5">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#d7ad70] mt-2 shrink-0"
              />
              <p class="text-xs sm:text-sm leading-relaxed text-[#848895]">
                These terms may be revised as new calculators, class modules, or
                stream integrations are introduced. Continued usage of Down
                Attack following revisions represents your acceptance of the
                updated terms.
              </p>
            </div>
          </div>
        </div>
      </section>
      <!-- END: Section05 -->

      <!-- BEGIN: BottomContactCard -->
      <div
        class="bg-[#18181b] border border-[#2a2724] rounded-xl p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        data-purpose="contact-card"
      >
        <div>
          <h3
            class="font-serif text-base sm:text-lg font-bold text-[#ffedd4] uppercase tracking-wide"
          >
            Have questions about our Terms of Service?
          </h3>
          <p class="text-xs sm:text-sm text-[#848895] mt-1">
            Reach out to the maintainers on Discord or check our open-source
            repository.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <!-- Discord Button -->
          <a
            href="https://discord.gg/kNYvABEHJ3"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs sm:text-sm font-semibold transition-colors duration-150 shadow-md"
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
            class="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#141416] hover:bg-[#202024] border border-[#2f2c29] text-[#cfd2dc] hover:text-white text-xs sm:text-sm font-semibold transition-colors duration-150"
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
      <!-- END: BottomContactCard -->
    </div>
    <!-- END: MainContainer -->
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Terms of Service",
  description:
    "Terms of Service, usage guidelines, and community disclaimers for Down Attack (Black Desert Online PvP Calculator & Arena of Solare Overlay).",
});

definePageMeta({
  header: {
    name: "Terms of Service",
    icon: "/icons/terms.png",
  },
});
</script>

<style scoped>
.golden-corner-card {
  position: relative;
}

.golden-corner-card::before,
.golden-corner-card::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  pointer-events: none;
}

.golden-corner-card::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid #d7ad70;
  border-left: 2px solid #d7ad70;
  border-top-left-radius: 0.5rem;
}

.golden-corner-card::after {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid #d7ad70;
  border-right: 2px solid #d7ad70;
  border-bottom-right-radius: 0.5rem;
}
</style>
