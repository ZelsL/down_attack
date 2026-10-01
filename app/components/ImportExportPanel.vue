<template>
  <div class="flex flex-col gap-1.5 pt-1 pb-5">
    <div class="relative flex items-center justify-center my-1">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-[#ffedd4]/20" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2 pt-2">
      <button
        type="button"
        class="flex items-center justify-center gap-2 px-10 py-1.5 min-w-[110px] rounded-sm text-xs font-semibold tracking-wide text- [#e4e4e7] bg-[#3f3f49] hover:bg-[#4c4b57] border border-[#5a5966] transition-all cursor-pointer shadow-sm active:translate-y-[1px]"
        @click="handleExport('p1')"
      >
        <span>Export</span>
      </button>
      <button
        type="button"
        class="flex items-center justify-center gap-2 px-10 py-1.5 min-w-[110px] rounded-sm text-xs font-semibold tracking-wide text- [#e4e4e7] bg-[#3f3f49] hover:bg-[#4c4b57] border border-[#5a5966] transition-all cursor-pointer shadow-sm active:translate-y-[1px]"
        @click="handleExport('p2')"
      >
        <span>Export</span>
      </button>
    </div>
  </div>

  <div
    class="relative w-full border border-white/20 rounded-md p-3.5 bg-[#18181b] flex flex-col gap-3 shadow-lg"
  >
    <div
      class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#222122] px-3 flex items-center justify-center pointer-events-none"
    >
      <span
        class="text-xs font-bold text-[#d7ad70] uppercase tracking-wider select-none"
      >
        Import / Export
      </span>
    </div>

    <div class="flex flex-col gap-2.5">
      <input
        v-model="presetTitle"
        type="text"
        class="w-full bg-[#18181b] border border-[#ffedd4]/30 rounded pl-2.5 pr-2.5 py-1.5 text-xs text-[#ffedd4] placeholder-[#947f60] focus:outline-none focus:border-[#d7ad70] transition-colors"
      />

      <textarea
        v-model="rawInput"
        rows="4"
        placeholder="Paste Garmoth URL/ID, or preset text here..."
        class="bg-[#141417] border border-[#ffedd4]/20 rounded p-2 text-xs font-mono text-[#ffedd4] placeholder:text-[#ffedd4]/30 focus:outline-none focus:border-[#d7ad70] resize-none"
      />

      <div class="flex justify-center">
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-10 py-1.5 min-w-[110px] rounded-sm text-xs font-semibold tracking-wide text- [#e4e4e7] bg-[#3f3f49] hover:bg-[#4c4b57] border border-[#5a5966] transition-all cursor-pointer shadow-sm active:translate-y-[1px]"
          @click="handleImport"
        >
          <span
            class="w-4 h-4 bg-[#e4e4e7] inline-block shrink-0"
            :style="{
              mask: 'url(/icons/import.png) no-repeat center / contain',
              WebkitMask: 'url(/icons/import.png) no-repeat center / contain',
            }"
          />
          <span>Import</span>
        </button>
      </div>
    </div>

    <div
      v-if="statusFeedback.message"
      class="text-[11px] px-2 py-1 rounded text-center"
      :class="
        statusFeedback.type === 'error'
          ? 'bg-red-950/40 border border-red-500/30 text-red-300'
          : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
      "
    >
      {{ statusFeedback.message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  player1: {
    type: Object,
    required: true,
  },
  player2: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["add-preset"]);

const rawInput = ref("");
const isLoading = ref(false);
const statusFeedback = ref({ type: "", message: "" });
const presetTitle = ref("Custom preset");

function extractGarmothId(input) {
  if (!input) return "";
  const trimmed = input.trim();

  const match = trimmed.match(/character\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }

  return trimmed.replace(/[^a-zA-Z0-9_-]/g, "");
}

async function handleGarmothImport(text) {
  const characterId = extractGarmothId(text);

  if (!characterId) {
    statusFeedback.value = {
      type: "error",
      message: "Please enter a valid Garmoth URL or character ID.",
    };
    return;
  }

  isLoading.value = true;
  statusFeedback.value = { type: "", message: "" };

  try {
    const response = await $fetch("/api/v1/presets/import", {
      method: "POST",
      body: {
        provider: "garmoth",
        character_id: characterId,
        position: 0,
      },
    });

    const build = Array.isArray(response) ? response[0] : response;

    if (!build) {
      throw new Error("No combat build found in this character.");
    }

    return build;
  } catch (err) {
    const errorMessage =
      err?.data?.message ||
      err?.message ||
      "Failed to import build from Garmoth. Please check the URL/ID.";

    statusFeedback.value = {
      type: "error",
      message: errorMessage,
    };
  }
}

function formatPlayerToText(player) {
  if (!player) return "";

  const lines = [];

  const title = `${player.class_name || "Unknown"} ${player.spec || "Awakening"} @ ${player?.name}`;
  lines.push(title);

  lines.push(
    `HP: ${player.hp || 0} / AP: ${player.ap || 0} / AAP: ${player.aap || 0} / Total AP: ${player.adventureap || 0} / Total AAP:
${player.adventureaap || 0}`,
  );
  lines.push(`Accuracy: ${player.acc || 0}`);
  lines.push(
    `DR: Melee ${player.mldr || 0} | Ranged ${player.radr || 0} | Magic ${player.madr || 0}`,
  );
  lines.push(
    `Evasion: Melee ${player.meev || 0} | Ranged ${player.raev || 0} | Magic ${player.maev || 0}`,
  );
  lines.push(
    `Special: Crit Dmg ${player.chrp || 0}% | Back ${player.abad || 0}% | Down ${player.adad || 0}% | Air ${player.aaad || 0}%`,
  );

  if (Array.isArray(player.combo) && player.combo.length > 0) {
    lines.push("");
    lines.push("Combo Sequence:");

    player.combo.forEach((skill, index) => {
      const command = skill.command ? ` [${skill.command}]` : "";
      lines.push(`${index + 1}. ${skill.name}${command}`);

      (skill.hits || []).forEach((hit, hitIndex) => {
        const hitDetails = [];
        if (hit.normal_hits > 0) hitDetails.push(`${hit.normal_hits} Normal`);
        if (hit.down_hits > 0) hitDetails.push(`${hit.down_hits} Down`);
        if (hit.back_hits > 0) hitDetails.push(`${hit.back_hits} Back`);
        if (hit.air_hits > 0) hitDetails.push(`${hit.air_hits} Air`);

        const summary =
          hitDetails.length > 0 ? hitDetails.join(", ") : "0 Landed";
        lines.push(
          `   • Hit ${hitIndex + 1} (${hit.damage_percent || 0}%): ${summary}`,
        );
      });
    });
  }

  return lines.join("\n");
}

async function handleExport(target) {
  const player = target === "p1" ? props.player1 : props.player2;

  const exportedText = formatPlayerToText(player);
  rawInput.value = exportedText;
}

async function handleImport() {
  const inputType = detectInputType(rawInput.value);

  let build;

  switch (inputType) {
    case "downattack_text":
      build = await handleDownattackTextImport(rawInput.value);

      break;
    case "garmoth":
      build = await handleGarmothImport(rawInput.value);
      break;
    default:
      statusFeedback.value = {
        type: "error",
        message:
          "No presets imported, please check your syntax or Garmoth URL/ID and try again",
      };
  }

  if (build) {
    emit("add-preset", build);
    statusFeedback.value = {
      type: "success",
      message: `Preset "${build.name || build.class_name}" imported successfully!`,
    };
  }

  function detectInputType(content) {
    const trimmed = content.trim();

    if (!trimmed) return "empty";

    const firstLine = trimmed.split("\n")[0];
    if (
      firstLine.includes("@") ||
      (trimmed.includes("HP:") && trimmed.includes("DR:"))
    ) {
      return "downattack_text";
    }

    if (
      trimmed.includes("garmoth.com") ||
      (!trimmed.includes("\n") && trimmed.length < 50)
    ) {
      return "garmoth";
    }

    return "unknown";
  }
}

async function handleDownattackTextImport(text) {
  const firstLine = text.trim().split("\n")[0];
  const titleRegex = firstLine.match(
    /^(.+?)\s+(Awakening|Succession|Ascension)(?:\s*@\s*(.*))?$/i,
  );
  const className = titleRegex?.[1];
  const spec = titleRegex?.[2];
  const title = titleRegex?.[3];
  const presetName = presetTitle.value || title?.trim();
  const hp = Number(text.match(/HP:\s*(\d+)/i)?.[1]) || 0;
  const ap = Number(text.match(/(?<!Total\s)\bAP:\s*(\d+)/i)?.[1]) || 0;
  const aap = Number(text.match(/(?<!Total\s)\bAAP:\s*(\d+)/i)?.[1]) || 0;
  const acc = Number(text.match(/Accuracy:\s*(\d+)/i)?.[1]) || 0;
  const mldr = Number(text.match(/DR:.*Melee\s*(\d+)/i)?.[1]);
  const madr = Number(text.match(/DR:.*Magic\s*(\d+)/i)?.[1]);
  const radr = Number(text.match(/DR:.*Ranged\s*(\d+)/i)?.[1]);
  const meev = Number(text.match(/Evasion:.*Melee\s*(\d+)/i)?.[1]) || 0;
  const raev = Number(text.match(/Evasion:.*Ranged\s*(\d+)/i)?.[1]) || 0;
  const maev = Number(text.match(/Evasion:.*Magic\s*(\d+)/i)?.[1]) || 0;
  const chrp = Number(text.match(/Crit Dmg\s*(\d+(?:\.\d+)?)\s*%/i)?.[1]) || 0;
  const abad = Number(text.match(/Back\s*(\d+(?:\.\d+)?)\s*%/i)?.[1]) || 0;
  const adad = Number(text.match(/Down\s*(\d+(?:\.\d+)?)\s*%/i)?.[1]) || 0;
  const aaad = Number(text.match(/Air\s*(\d+(?:\.\d+)?)\s*%/i)?.[1]) || 0;
  const adventureap = Number(text.match(/Total AP:\s*(\d+)/i)?.[1]) || 0;
  const adventureaap = Number(text.match(/Total AAP:\s*(\d+)/i)?.[1]) || 0;

  const hasValidStats =
    hp > 0 ||
    ap > 0 ||
    aap > 0 ||
    acc > 0 ||
    mldr > 0 ||
    madr > 0 ||
    radr > 0 ||
    meev > 0 ||
    raev > 0 ||
    maev > 0 ||
    chrp > 0 ||
    abad > 0 ||
    adad > 0 ||
    aaad > 0;

  if (!className || !spec || !hasValidStats) {
    console.log(hp);
    statusFeedback.value = {
      type: "error",
      message:
        "No presets imported, please check your syntax or Garmoth URL/ID and try again",
    };
    return;
  }

  const skillRegex = /^\s*(\d+)\.\s*(.*?)(?:\s*\[(.*?)\])?\s*$/;
  const lines = text.split("\n");
  const comboHeaderRegex = /^\s*Combo Sequence:\s*$/i;
  const availableSkills = [];
  const hitRegex = /•\s*Hit\s*(\d+).*?:\s*(.*)/i;

  try {
    const response = await $fetch(
      `/api/v1/skills?className=${className}&spec=${spec}`,
    );
    if (Array.isArray(response)) {
      availableSkills.push(...response);
    }
  } catch (error) {
    statusFeedback.value = {
      type: "error",
      message: "Failed to fetch skills: " + error.message,
    };
    return;
  }

  const combo = [];
  let currentSkill = null;

  for (const line of lines) {
    const comboHeader = line.match(comboHeaderRegex);
    if (comboHeader) {
      continue;
    }

    const skillMatch = line.match(skillRegex);
    if (skillMatch) {
      const skillName = skillMatch[2].trim();
      const skill = availableSkills.find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase(),
      );
      if (skill) {
        const newSkill = {
          ...skill,
          instanceId: crypto.randomUUID(),
          hits: (skill.hits || []).map((hit) => ({
            ...hit,
            normal_hits: 0,
            down_hits: 0,
            back_hits: 0,
            air_hits: 0,
          })),
        };
        combo.push(newSkill);
        currentSkill = newSkill;
      } else {
        statusFeedback.value = {
          type: "error",
          message: `Skill '${skillName}' not found for this class.`,
        };
        return;
      }
    }

    const hitMatch = line.match(hitRegex);
    if (hitMatch) {
      const hitIndex = Number(hitMatch[1] - 1);
      const targetHit = currentSkill?.hits?.[hitIndex];
      const details = hitMatch[2].trim();

      if (!targetHit) {
        continue;
      }

      targetHit.normal_hits =
        Number(details.match(/(\d+)\s*Normal/i)?.[1]) || 0;
      targetHit.down_hits = Number(details.match(/(\d+)\s*Down/i)?.[1]) || 0;
      targetHit.back_hits = Number(details.match(/(\d+)\s*Back/i)?.[1]) || 0;
      targetHit.air_hits = Number(details.match(/(\d+)\s*Air/i)?.[1]) || 0;
    }
  }
  const parsedBuild = {
    name: presetName,
    class_name: className,
    spec: spec,
    hp,
    ap,
    aap,
    adventureap,
    adventureaap,
    acc,
    mldr,
    madr,
    radr,
    meev,
    raev,
    maev,
    chrp,
    abad,
    adad,
    aaad,
    combo,
  };
  return parsedBuild;
}
</script>
