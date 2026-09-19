export const CLASS_BUFF_SKILLS = {
  hashashin: {
    Awakening: [
      {
        id: 5619,
        name: "Aal's Grace",
        spec: "Awakening",
        icon: "/skills/hashashin/5619.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          crit_hit_rate: 30,
          accuracy: 60,
          attack_speed: 20,
          crit_damage: 15,
        },
      },
      {
        id: 5649,
        name: "Crown Kick",
        spec: "Awakening",
        icon: "/skills/hashashin/5649.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
      {
        id: 5617,
        name: "Flow: Sand Warp",
        spec: "Awakening",
        icon: "/skills/hashashin/5617.webp",
        buffs: {
          duration: 10,
          evasion: 60,
        },
      },
    ],
    Succession: [
      {
        id: 5658,
        name: "Prime: Blade's Pact",
        spec: "Prime",
        icon: "/skills/hashashin/5658.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 60,
          evasion: 60,
          attack_speed: 15,
        },
      },
      {
        id: 5647,
        name: "Serpent's Coil III",
        spec: "Absolute",
        icon: "/skills/hashashin/5647.webp",
        buffs: {
          duration: 5,
          evasion: 60,
          recover: 100,
        },
      },
      {
        id: 5487,
        name: "Aal's Command",
        spec: "Magnus",
        icon: "/skills/hashashin/5487.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
          recover: 128,
        },
      },
    ],
  },
  "dark knight": {
    Awakening: [
      {
        id: 3459,
        name: "Rage Absorption",
        spec: "Absolute",
        icon: "/skills/dark knight/3459.webp",
        buffs: {
          duration: 60,
          all_ap: 55,
          attack_speed: 25,
          casting_speed: 25,
          crit_hit_rate: 50,
        },
      },
      {
        id: 89,
        name: "Rage Absorption (Innate)",
        spec: "Absolute",
        icon: "/skills/dark knight/89.webp",
        buffs: {
          duration: 60,
          damage_reduction: 60,
          crit_hit_rate: 35,
        },
      },
      {
        id: 2422,
        name: "Overlord",
        spec: "Absolute",
        icon: "/skills/dark knight/2422.webp",
        buffs: {
          duration: 30,
          attack_speed: 30,
          movement_speed: 30,
          crit_hit_rate: 24,
          accuracy: 80,
        },
      },
    ],
    Succession: [
      {
        id: 3459,
        name: "Rage Absorption",
        spec: "Absolute",
        icon: "/skills/dark knight/3459.webp",
        buffs: {
          duration: 60,
          all_ap: 55,
          attack_speed: 25,
          casting_speed: 25,
          crit_hit_rate: 50,
        },
      },
      {
        id: 89,
        name: "Rage Absorption (Innate)",
        spec: "Absolute",
        icon: "/skills/dark knight/89.webp",
        buffs: {
          duration: 60,
          damage_reduction: 60,
          crit_hit_rate: 35,
        },
      },
      {
        id: 4781,
        name: "Prime: Spirit Absorption",
        spec: "Prime",
        icon: "/skills/dark knight/4781.webp",
        buffs: {
          duration: 30,
          attack_speed: 30,
          movement_speed: 30,
          crit_hit_rate: 24,
          accuracy: 80,
        },
      },
    ],
  },
  warrior: {
    Awakening: [
      {
        id: 1764,
        name: "Executioner",
        spec: "Absolute",
        icon: "/skills/warrior/1764.webp",
        buffs: {
          duration: 30,
          all_ap: 45,
          attack_speed: 30,
          movement_speed: 40,
        },
      },
      {
        id: 1744,
        name: "Greatsword Defense",
        spec: "Awakening",
        icon: "/skills/warrior/1744.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
          all_ap: 32,
        },
      },
      {
        id: 995,
        name: "War Cry III",
        spec: "Absolute",
        icon: "/skills/warrior/995.webp",
        buffs: {
          duration: 20,
          damage_reduction: 20,
        },
      },
    ],
    Succession: [
      {
        id: 4066,
        name: "Prime: Enhanced Spirit",
        spec: "Prime",
        icon: "/skills/warrior/4066.webp",
        buffs: {
          duration: 30,
          accuracy: 80,
          damage_reduction: 40,
          movement_speed: 40,
        },
      },
      {
        id: 1764,
        name: "Executioner",
        spec: "Absolute",
        icon: "/skills/warrior/1764.webp",
        buffs: {
          duration: 30,
          all_ap: 45,
          attack_speed: 30,
          movement_speed: 40,
        },
      },
      {
        id: 4084,
        name: "Prime: Spinning Slash IV",
        spec: "Prime",
        icon: "/skills/warrior/4084.webp",
        buffs: {
          duration: 3,
          crit_hit_rate: 100,
        },
      },
    ],
  },
  valkyrie: {
    Awakening: [
      {
        id: 1944,
        name: "Noble Spirit",
        spec: "Absolute",
        icon: "/skills/valkyrie/1944.webp",
        buffs: {
          duration: 30,
          damage_reduction: 50,
          casting_speed: 10,
        },
      },
      {
        id: 3218,
        name: "Absolute: Celestial Spear",
        spec: "Absolute",
        icon: "/skills/valkyrie/3218.webp",
        buffs: {
          duration: 5,
          crit_hit_rate: 80,
        },
      },
      {
        id: 2748,
        name: "Celestial Smite",
        spec: "Absolute",
        icon: "/skills/valkyrie/2748.webp",
        buffs: {
          duration: 5,
          crit_hit_rate: 80,
        },
      },
    ],
    Succession: [
      {
        id: 4142,
        name: "Prime: Glory of Enslar",
        spec: "Prime",
        icon: "/skills/valkyrie/4142.webp",
        buffs: {
          duration: 30,
          damage_reduction: 50,
          casting_speed: 10,
        },
      },
      {
        id: 1944,
        name: "Noble Spirit",
        spec: "Absolute",
        icon: "/skills/valkyrie/1944.webp",
        buffs: {
          duration: 30,
          damage_reduction: 50,
          casting_speed: 10,
        },
      },
      {
        id: 4217,
        name: "Prime: Celestial Spear III",
        spec: "Prime",
        icon: "/skills/valkyrie/4217.webp",
        buffs: {
          duration: 5,
          crit_hit_rate: 80,
        },
      },
    ],
  },
  berserker: {
    Awakening: [
      {
        id: 2889,
        name: "Absolute: Fearsome Tyrant",
        spec: "Absolute",
        icon: "/skills/berserker/2889.webp",
        buffs: {
          duration: 5,
          damage_reduction: 20,
        },
      },
      {
        id: 4056,
        name: "Frenzied Tyrant",
        spec: "Absolute",
        icon: "/skills/berserker/4056.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
          recover: 75,
        },
      },
      {
        id: 2740,
        name: "Feral Stampede",
        spec: "Absolute",
        icon: "/skills/berserker/2740.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
    ],
    Succession: [
      {
        id: 5411,
        name: "Prime: Berserk Form",
        spec: "Prime",
        icon: "/skills/berserker/5411.webp",
        buffs: {
          duration: 20,
          damage_reduction: 50,
          crit_hit_rate: 30,
          movement_speed: 20,
          recover: 900,
        },
      },
      {
        id: 5435,
        name: "Prime: Fearsome Tyrant III",
        spec: "Prime",
        icon: "/skills/berserker/5435.webp",
        buffs: {
          duration: 5,
          damage_reduction: 30,
        },
      },
      {
        id: 4056,
        name: "Frenzied Tyrant",
        spec: "Absolute",
        icon: "/skills/berserker/4056.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
          recover: 75,
        },
      },
    ],
  },
  sorceress: {
    Awakening: [
      {
        id: 1792,
        name: "Grim Reaper",
        spec: "Absolute",
        icon: "/skills/sorceress/1792.webp",
        buffs: {
          duration: 30,
          all_ap: 45,
          accuracy: 48,
          crit_hit_rate: 100,
          evasion: 60,
        },
      },
      {
        id: 1806,
        name: "Flow: Requiem",
        spec: "Awakening",
        icon: "/skills/sorceress/1806.webp",
        buffs: {
          duration: 5,
          crit_hit_rate: 100,
        },
      },
      {
        id: 2885,
        name: "Absolute: Midnight Stinger",
        spec: "Absolute",
        icon: "/skills/sorceress/2885.webp",
        buffs: {
          duration: 10,
          crit_hit_rate: 40,
        },
      },
    ],
    Succession: [
      {
        id: 1792,
        name: "Grim Reaper",
        spec: "Absolute",
        icon: "/skills/sorceress/1792.webp",
        buffs: {
          duration: 30,
          all_ap: 45,
          accuracy: 48,
          crit_hit_rate: 100,
          evasion: 60,
        },
      },
      {
        id: 4564,
        name: "Prime: Abyssal Vanguard",
        spec: "Prime",
        icon: "/skills/sorceress/4564.webp",
        buffs: {
          duration: 30,
          all_ap: 45,
          accuracy: 48,
          crit_hit_rate: 100,
          casting_speed: 20,
        },
      },
      {
        id: 4592,
        name: "Prime: Midnight Stinger",
        spec: "Prime",
        icon: "/skills/sorceress/4592.webp",
        buffs: {
          duration: 10,
          crit_hit_rate: 40,
        },
      },
    ],
  },
  ranger: {
    Awakening: [
      {
        id: 1856,
        name: "Guardian",
        spec: "Absolute",
        icon: "/skills/ranger/1856.webp",
        buffs: {
          duration: 30,
          attack_speed: 30,
          movement_speed: 30,
          evasion: 80,
          crit_hit_rate: 20,
        },
      },
      {
        id: 6757,
        name: "Spirit's Haven",
        spec: "Awakening",
        icon: "/skills/ranger/6757.webp",
        buffs: {
          duration: 10,
          evasion: 36,
        },
      },
      {
        id: 1874,
        name: "Wind Step",
        spec: "Awakening",
        icon: "/skills/ranger/1874.webp",
        buffs: {
          duration: 10,
          evasion: 36,
        },
      },
    ],
    Succession: [
      {
        id: 4114,
        name: "Prime: Feathers of the Spirits",
        spec: "Prime",
        icon: "/skills/ranger/4114.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          attack_speed: 30,
          crit_hit_rate: 20,
          movement_speed: 30,
          accuracy: 60,
        },
      },
      {
        id: 1856,
        name: "Guardian",
        spec: "Absolute",
        icon: "/skills/ranger/1856.webp",
        buffs: {
          duration: 30,
          attack_speed: 30,
          movement_speed: 30,
          evasion: 80,
          crit_hit_rate: 20,
        },
      },
      {
        id: 4236,
        name: "Prime: Regeneration",
        spec: "Prime",
        icon: "/skills/ranger/4236.webp",
        buffs: {
          duration: 10,
          attack_speed: 10,
        },
      },
    ],
  },
  tamer: {
    Awakening: [
      {
        id: 1899,
        name: "Heuklang: Berserk",
        spec: "Absolute",
        icon: "/skills/tamer/1899.webp",
        buffs: {
          duration: 30,
          damage_reduction: 20,
          evasion: 60,
          movement_speed: 15,
        },
      },
      {
        id: 231,
        name: "Absorb Heuklang VI",
        spec: "Absolute",
        icon: "/skills/tamer/231.webp",
        buffs: {
          duration: 30,
          all_ap: 10,
          damage_reduction: 8,
          attack_speed: 20,
          movement_speed: 20,
        },
      },
      {
        id: 2555,
        name: "Legendary Beast Dance: Echo",
        spec: "Absolute",
        icon: "/skills/tamer/2555.webp",
        buffs: {
          recover: 105,
          duration: 5,
          evasion: 48,
        },
      },
    ],
    Succession: [
      {
        id: 4476,
        name: "Prime: Heuklang's Aura",
        spec: "Prime",
        icon: "/skills/tamer/4476.webp",
        buffs: {
          duration: 30,
          damage_reduction: 20,
          evasion: 60,
          movement_speed: 15,
        },
      },
      {
        id: 1899,
        name: "Heuklang: Berserk",
        spec: "Absolute",
        icon: "/skills/tamer/1899.webp",
        buffs: {
          duration: 30,
          damage_reduction: 20,
          evasion: 60,
          movement_speed: 15,
        },
      },
      {
        id: 231,
        name: "Absorb Heuklang VI",
        spec: "Absolute",
        icon: "/skills/tamer/231.webp",
        buffs: {
          duration: 30,
          all_ap: 10,
          damage_reduction: 8,
          attack_speed: 20,
          movement_speed: 20,
        },
      },
    ],
  },
  musa: {
    Awakening: [
      {
        id: 1988,
        name: "Musa's Soul",
        spec: "Absolute",
        icon: "/skills/musa/1988.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 60,
          evasion: 60,
          movement_speed: 20,
        },
      },
      {
        id: 1289,
        name: "Tiger Blade",
        spec: "Absolute",
        icon: "/skills/musa/1289.webp",
        buffs: {
          duration: 31,
          evasion: 24,
          attack_speed: 23,
          movement_speed: 23,
        },
      },
      {
        id: 423,
        name: "Ultimate: Gale",
        spec: "Absolute",
        icon: "/skills/musa/423.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
    Succession: [
      {
        id: 1988,
        name: "Musa's Soul",
        spec: "Absolute",
        icon: "/skills/musa/1988.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 60,
          evasion: 60,
          movement_speed: 20,
        },
      },
      {
        id: 4766,
        name: "Prime: Eye of the Storm",
        spec: "Prime",
        icon: "/skills/musa/4766.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          crit_hit_rate: 30,
          accuracy: 60,
          movement_speed: 20,
        },
      },
      {
        id: 1289,
        name: "Tiger Blade",
        spec: "Absolute",
        icon: "/skills/musa/1289.webp",
        buffs: {
          duration: 31,
          evasion: 24,
          attack_speed: 23,
          movement_speed: 23,
        },
      },
    ],
  },
  maehwa: {
    Awakening: [
      {
        id: 2065,
        name: "General's Might",
        spec: "Absolute",
        icon: "/skills/maehwa/2065.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          accuracy: 60,
          crit_hit_rate: 30,
          attack_speed: 20,
          movement_speed: 20,
        },
      },
      {
        id: 1554,
        name: "Tiger Blade",
        spec: "Absolute",
        icon: "/skills/maehwa/1554.webp",
        buffs: {
          duration: 31,
          evasion: 24,
          attack_speed: 23,
          movement_speed: 23,
        },
      },
      {
        id: 6461,
        name: "Flow: Frostflower",
        spec: "Awakening",
        icon: "/skills/maehwa/6461.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
    Succession: [
      {
        id: 2065,
        name: "General's Might",
        spec: "Absolute",
        icon: "/skills/maehwa/2065.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          accuracy: 60,
          crit_hit_rate: 30,
          attack_speed: 20,
          movement_speed: 20,
        },
      },
      {
        id: 4243,
        name: "Prime: Blade of Maehwa",
        spec: "Prime",
        icon: "/skills/maehwa/4243.webp",
        buffs: {
          duration: 30,
          all_ap: 35,
          crit_hit_rate: 30,
          attack_speed: 20,
          movement_speed: 20,
        },
      },
      {
        id: 1554,
        name: "Tiger Blade",
        spec: "Absolute",
        icon: "/skills/maehwa/1554.webp",
        buffs: {
          duration: 31,
          evasion: 24,
          attack_speed: 23,
          movement_speed: 23,
        },
      },
    ],
  },
  witch: {
    Awakening: [
      {
        id: 2165,
        name: "Psyche of Aad Sphera",
        spec: "Absolute",
        icon: "/skills/witch/2165.webp",
        buffs: {
          duration: 30,
          casting_speed: 20,
          crit_hit_rate: 20,
          all_ap: 20,
          accuracy: 60,
          evasion: 48,
          damage_reduction: 15,
        },
      },
      {
        id: 2205,
        name: "Tectonic Block",
        spec: "Awakening",
        icon: "/skills/witch/2205.webp",
        buffs: {
          duration: 10,
          damage_reduction: 30,
        },
      },
      {
        id: 1122,
        name: "Speed Spell III",
        spec: "Absolute",
        icon: "/skills/witch/1122.webp",
        buffs: {
          duration: 30,
          movement_speed: 20,
          attack_speed: 20,
          casting_speed: 20,
        },
      },
    ],
    Succession: [
      {
        id: 2165,
        name: "Psyche of Aad Sphera",
        spec: "Absolute",
        icon: "/skills/witch/2165.webp",
        buffs: {
          duration: 30,
          casting_speed: 20,
          crit_hit_rate: 20,
          all_ap: 20,
          accuracy: 60,
          evasion: 48,
          damage_reduction: 15,
        },
      },
      {
        id: 4934,
        name: "Prime: Elemental Palace",
        spec: "Prime",
        icon: "/skills/witch/4934.webp",
        buffs: {
          duration: 30,
          casting_speed: 20,
          crit_hit_rate: 30,
          all_ap: 20,
          accuracy: 60,
          damage_reduction: 15,
        },
      },
      {
        id: 1122,
        name: "Speed Spell III",
        spec: "Absolute",
        icon: "/skills/witch/1122.webp",
        buffs: {
          duration: 30,
          movement_speed: 20,
          attack_speed: 20,
          casting_speed: 20,
        },
      },
    ],
  },
  wizard: {
    Awakening: [
      {
        id: 2211,
        name: "Controlled Madness",
        spec: "Absolute",
        icon: "/skills/wizard/2211.webp",
        buffs: {
          duration: 30,
          casting_speed: 20,
          crit_hit_rate: 30,
          damage_reduction: 15,
          evasion: 48,
          accuracy: 60,
          all_ap: 20,
        },
      },
      {
        id: 2231,
        name: "Chilling Wave III",
        spec: "Awakening",
        icon: "/skills/wizard/2231.webp",
        buffs: {
          duration: 10,
          crit_hit_rate: 30,
        },
      },
      {
        id: 4983,
        name: "Freezing Gaze",
        spec: "Secondary Skills",
        icon: "/skills/wizard/4983.webp",
        buffs: {
          evasion: 8,
        },
      },
    ],
    Succession: [
      {
        id: 2211,
        name: "Controlled Madness",
        spec: "Absolute",
        icon: "/skills/wizard/2211.webp",
        buffs: {
          duration: 30,
          casting_speed: 20,
          crit_hit_rate: 30,
          damage_reduction: 15,
          evasion: 48,
          accuracy: 60,
          all_ap: 20,
        },
      },
      {
        id: 4983,
        name: "Freezing Gaze",
        spec: "Secondary Skills",
        icon: "/skills/wizard/4983.webp",
        buffs: {
          evasion: 8,
        },
      },
      {
        id: 4985,
        name: "Magnificent Steps",
        spec: "Secondary Skills",
        icon: "/skills/wizard/4985.webp",
        buffs: {
          damage_reduction: 2,
        },
      },
    ],
  },
  ninja: {
    Awakening: [
      {
        id: 2109,
        name: "Asura",
        spec: "Absolute",
        icon: "/skills/ninja/2109.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          accuracy: 80,
        },
      },
      {
        id: 2096,
        name: "Silent Charge",
        spec: "Awakening",
        icon: "/skills/ninja/2096.webp",
        buffs: {
          duration: 10,
          evasion: 24,
        },
      },
      {
        id: 4038,
        name: "Ghost Claw",
        spec: "Absolute",
        icon: "/skills/ninja/4038.webp",
        buffs: {
          duration: 10,
          attack_speed: 15,
        },
      },
    ],
    Succession: [
      {
        id: 4691,
        name: "Prime: Malicious Cut",
        spec: "Prime",
        icon: "/skills/ninja/4691.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          accuracy: 80,
          crit_hit_rate: 30,
          back_attack_damage: 10,
          air_attack_damage: 10,
          down_attack_damage: 10,
        },
      },
      {
        id: 2109,
        name: "Asura",
        spec: "Absolute",
        icon: "/skills/ninja/2109.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          accuracy: 80,
        },
      },
      {
        id: 4701,
        name: "Prime: Shadow Slash III",
        spec: "Prime",
        icon: "/skills/ninja/4701.webp",
        buffs: {
          duration: 10,
          attack_speed: 15,
        },
      },
    ],
  },
  kunoichi: {
    Awakening: [
      {
        id: 2150,
        name: "Crimson Eclipse",
        spec: "Absolute",
        icon: "/skills/kunoichi/2150.webp",
        buffs: {
          duration: 20,
          all_ap: 20,
          attack_speed: 10,
          accuracy: 40,
          evasion: 60,
          crit_hit_rate: 16,
        },
      },
      {
        id: 2144,
        name: "Danse Macabre",
        spec: "Awakening",
        icon: "/skills/kunoichi/2144.webp",
        buffs: {
          duration: 10,
          evasion: 24,
        },
      },
      {
        id: 2142,
        name: "Lunar Dash III",
        spec: "Awakening",
        icon: "/skills/kunoichi/2142.webp",
        buffs: {
          duration: 10,
          evasion: 24,
        },
      },
    ],
    Succession: [
      {
        id: 2150,
        name: "Crimson Eclipse",
        spec: "Absolute",
        icon: "/skills/kunoichi/2150.webp",
        buffs: {
          duration: 20,
          all_ap: 20,
          attack_speed: 10,
          accuracy: 40,
          evasion: 60,
          crit_hit_rate: 16,
        },
      },
      {
        id: 4630,
        name: "Prime: Ninjutsu Commence",
        spec: "Prime",
        icon: "/skills/kunoichi/4630.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          attack_speed: 20,
          accuracy: 60,
          crit_hit_rate: 24,
        },
      },
      {
        id: 1649,
        name: "Shining Blade",
        spec: "Absolute",
        icon: "/skills/kunoichi/1649.webp",
        buffs: {
          attack_speed: 10,
        },
      },
    ],
  },
  mystic: {
    Awakening: [
      {
        id: 2773,
        name: "Dragonize",
        spec: "Absolute",
        icon: "/skills/mystic/2773.webp",
        buffs: {
          duration: 30,
          all_ap: 32,
          damage_reduction: 50,
          attack_speed: 30,
        },
      },
      {
        id: 2795,
        name: "Spiral Torpedo III",
        spec: "Awakening",
        icon: "/skills/mystic/2795.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
      {
        id: 2665,
        name: "Howling Wolf",
        spec: "Absolute",
        icon: "/skills/mystic/2665.webp",
        buffs: {
          evasion: 40,
        },
      },
    ],
    Succession: [
      {
        id: 5374,
        name: "Prime: Amplify Martial Spirit",
        spec: "Prime",
        icon: "/skills/mystic/5374.webp",
        buffs: {
          duration: 30,
          all_ap: 28,
          accuracy: 60,
          damage_reduction: 20,
          evasion: 60,
          attack_speed: 30,
        },
      },
      {
        id: 2773,
        name: "Dragonize",
        spec: "Absolute",
        icon: "/skills/mystic/2773.webp",
        buffs: {
          duration: 30,
          all_ap: 32,
          damage_reduction: 50,
          attack_speed: 30,
        },
      },
      {
        id: 5387,
        name: "Prime: Sweeping Kick III",
        spec: "Prime",
        icon: "/skills/mystic/5387.webp",
        buffs: {
          duration: 10,
          all_ap: 28,
        },
      },
    ],
  },
  striker: {
    Awakening: [
      {
        id: 2559,
        name: "Descent of Fury",
        spec: "Absolute",
        icon: "/skills/striker/2559.webp",
        buffs: {
          duration: 30,
          all_ap: 35,
          damage_reduction: 50,
          evasion: 60,
          attack_speed: 30,
        },
      },
      {
        id: 2642,
        name: "Gardbrace Training V",
        spec: "Absolute",
        icon: "/skills/striker/2642.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
      {
        id: 2649,
        name: "Savage Somersault",
        spec: "Awakening",
        icon: "/skills/striker/2649.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
    ],
    Succession: [
      {
        id: 2559,
        name: "Descent of Fury",
        spec: "Absolute",
        icon: "/skills/striker/2559.webp",
        buffs: {
          duration: 30,
          all_ap: 35,
          damage_reduction: 50,
          evasion: 60,
          attack_speed: 30,
        },
      },
      {
        id: 5329,
        name: "Prime: Unleashing Potential",
        spec: "Prime",
        icon: "/skills/striker/5329.webp",
        buffs: {
          duration: 30,
          all_ap: 32,
          damage_reduction: 50,
          evasion: 60,
          attack_speed: 30,
        },
      },
      {
        id: 5348,
        name: "Prime: Crimson Fang IV",
        spec: "Prime",
        icon: "/skills/striker/5348.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
    ],
  },
  lahn: {
    Awakening: [
      {
        id: 3293,
        name: "Annihilator",
        spec: "Absolute",
        icon: "/skills/lahn/3293.webp",
        buffs: {
          duration: 30,
          all_ap: 25,
          evasion: 80,
          attack_speed: 25,
          movement_speed: 30,
        },
      },
      {
        id: 3298,
        name: "Bloody Stride",
        spec: "Awakening",
        icon: "/skills/lahn/3298.webp",
        buffs: {
          duration: 10,
          evasion: 48,
        },
      },
      {
        id: 3294,
        name: "Eradication III",
        spec: "Absolute",
        icon: "/skills/lahn/3294.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
    Succession: [
      {
        id: 3293,
        name: "Annihilator",
        spec: "Absolute",
        icon: "/skills/lahn/3293.webp",
        buffs: {
          duration: 30,
          all_ap: 25,
          evasion: 80,
          attack_speed: 25,
          movement_speed: 30,
        },
      },
      {
        id: 4885,
        name: "Prime: Crescent Charm",
        spec: "Prime",
        icon: "/skills/lahn/4885.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          attack_speed: 25,
          crit_hit_rate: 20,
          movement_speed: 30,
        },
      },
      {
        id: 3294,
        name: "Eradication III",
        spec: "Absolute",
        icon: "/skills/lahn/3294.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
  },
  archer: {
    Awakening: [
      {
        id: 3915,
        name: "Watcher",
        spec: "Ascension",
        icon: "/skills/archer/3915.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          accuracy: 48,
          down_attack_damage: 10,
          air_attack_damage: 10,
          back_attack_damage: 10,
          crit_damage: 10,
          crit_hit_rate: 100,
        },
      },
      {
        id: 3947,
        name: "Glissade",
        spec: "Ascension",
        icon: "/skills/archer/3947.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
      {
        id: 3914,
        name: "Greatbow Training X",
        spec: "Ascension",
        icon: "/skills/archer/3914.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
    Succession: [
      {
        id: 3915,
        name: "Watcher",
        spec: "Ascension",
        icon: "/skills/archer/3915.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          accuracy: 48,
          down_attack_damage: 10,
          air_attack_damage: 10,
          back_attack_damage: 10,
          crit_damage: 10,
          crit_hit_rate: 100,
        },
      },
      {
        id: 3947,
        name: "Glissade",
        spec: "Ascension",
        icon: "/skills/archer/3947.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
      {
        id: 3914,
        name: "Greatbow Training X",
        spec: "Ascension",
        icon: "/skills/archer/3914.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
  },
  shai: {
    Awakening: [
      {
        id: 4619,
        name: "Stick to Me!",
        spec: "Ascension",
        icon: "/skills/shai/4619.webp",
        buffs: {
          duration: 1,
          damage_reduction: 50,
        },
      },
      {
        id: 4095,
        name: "Rage Absorption (Innate)",
        spec: "Ascension",
        icon: "/skills/shai/4095.webp",
        buffs: {
          duration: 60,
          crit_hit_rate: 100,
        },
      },
      {
        id: 4097,
        name: "Do it Better!",
        spec: "Ascension",
        icon: "/skills/shai/4097.webp",
        buffs: {
          duration: 30,
          all_ap: 40,
          special_attack_damage: 2,
        },
      },
    ],
    Succession: [
      {
        id: 4619,
        name: "Stick to Me!",
        spec: "Ascension",
        icon: "/skills/shai/4619.webp",
        buffs: {
          duration: 1,
          damage_reduction: 50,
        },
      },
      {
        id: 4095,
        name: "Rage Absorption (Innate)",
        spec: "Ascension",
        icon: "/skills/shai/4095.webp",
        buffs: {
          duration: 60,
          crit_hit_rate: 100,
        },
      },
      {
        id: 4097,
        name: "Do it Better!",
        spec: "Ascension",
        icon: "/skills/shai/4097.webp",
        buffs: {
          duration: 30,
          all_ap: 40,
          special_attack_damage: 2,
        },
      },
    ],
  },
  guardian: {
    Awakening: [
      {
        id: 5153,
        name: "Omua's Blessing",
        spec: "Awakening",
        icon: "/skills/guardian/5153.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
          crit_hit_rate: 50,
          accuracy: 60,
          movement_speed: 30,
          crit_damage: 20,
        },
      },
      {
        id: 5103,
        name: "Omua's Glare",
        spec: "Absolute",
        icon: "/skills/guardian/5103.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          crit_hit_rate: 50,
          accuracy: 60,
          movement_speed: 30,
          crit_damage: 20,
        },
      },
      {
        id: 6116,
        name: "Mountain's Echo",
        spec: "Absolute",
        icon: "/skills/guardian/6116.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
    ],
    Succession: [
      {
        id: 5213,
        name: "Prime: Omua's Aura",
        spec: "Prime",
        icon: "/skills/guardian/5213.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
          crit_hit_rate: 50,
          accuracy: 60,
          movement_speed: 30,
          crit_damage: 20,
        },
      },
      {
        id: 5103,
        name: "Omua's Glare",
        spec: "Absolute",
        icon: "/skills/guardian/5103.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          crit_hit_rate: 50,
          accuracy: 60,
          movement_speed: 30,
          crit_damage: 20,
        },
      },
      {
        id: 6116,
        name: "Mountain's Echo",
        spec: "Absolute",
        icon: "/skills/guardian/6116.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
    ],
  },
  nova: {
    Awakening: [
      {
        id: 5834,
        name: "Quoratum's Guard",
        spec: "Absolute",
        icon: "/skills/nova/5834.webp",
        buffs: {
          duration: 30,
          damage_reduction: 50,
        },
      },
      {
        id: 5730,
        name: "Winter's Bulwark",
        spec: "Absolute",
        icon: "/skills/nova/5730.webp",
        buffs: {
          duration: 20,
          damage_reduction: 50,
        },
      },
      {
        id: 5908,
        name: "En Garde",
        spec: "Absolute",
        icon: "/skills/nova/5908.webp",
        buffs: {
          duration: 30,
          all_ap: 40,
          casting_speed: 15,
        },
      },
    ],
    Succession: [
      {
        id: 5834,
        name: "Quoratum's Guard",
        spec: "Absolute",
        icon: "/skills/nova/5834.webp",
        buffs: {
          duration: 30,
          damage_reduction: 50,
        },
      },
      {
        id: 5730,
        name: "Winter's Bulwark",
        spec: "Absolute",
        icon: "/skills/nova/5730.webp",
        buffs: {
          duration: 20,
          damage_reduction: 50,
        },
      },
      {
        id: 5940,
        name: "Prime: Distorted Guard",
        spec: "Prime",
        icon: "/skills/nova/5940.webp",
        buffs: {
          duration: 30,
          damage_reduction: 50,
        },
      },
    ],
  },
  sage: {
    Awakening: [
      {
        id: 6273,
        name: "Electrify",
        spec: "Absolute",
        icon: "/skills/sage/6273.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 60,
          crit_hit_rate: 50,
        },
      },
      {
        id: 6309,
        name: "Spear Bolt III",
        spec: "Awakening",
        icon: "/skills/sage/6309.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
          recover: 128,
        },
      },
      {
        id: 6328,
        name: "Flow: Judgment",
        spec: "Awakening",
        icon: "/skills/sage/6328.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
    Succession: [
      {
        id: 6273,
        name: "Electrify",
        spec: "Absolute",
        icon: "/skills/sage/6273.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 60,
          crit_hit_rate: 50,
        },
      },
      {
        id: 6154,
        name: "Prime: Optimization",
        spec: "Prime",
        icon: "/skills/sage/6154.webp",
        buffs: {
          duration: 15,
          crit_hit_rate: 50,
          crit_damage: 20,
        },
      },
      {
        id: 6280,
        name: "Prime: Spatial Fissure III",
        spec: "Prime",
        icon: "/skills/sage/6280.webp",
        buffs: {
          duration: 10,
          all_ap: 15,
        },
      },
    ],
  },
  corsair: {
    Awakening: [
      {
        id: 6705,
        name: "Family's Honor",
        spec: "Awakening",
        icon: "/skills/corsair/6705.webp",
        buffs: {
          duration: 30,
          all_ap: 20,
          attack_speed: 20,
          crit_hit_rate: 20,
          recover: 100,
        },
      },
      {
        id: 6704,
        name: "Pirate's Life For Me",
        spec: "Absolute",
        icon: "/skills/corsair/6704.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
      {
        id: 6678,
        name: "Close Quarters: Suppress IV",
        spec: "Awakening",
        icon: "/skills/corsair/6678.webp",
        buffs: {
          duration: 10,
          crit_hit_rate: 40,
          recover: 200,
        },
      },
    ],
    Succession: [
      {
        id: 6625,
        name: "Prime: Hydropower",
        spec: "Prime",
        icon: "/skills/corsair/6625.webp",
        buffs: {
          duration: 30,
          all_ap: 10,
          evasion: 60,
          attack_speed: 15,
          movement_speed: 15,
        },
      },
      {
        id: 6704,
        name: "Pirate's Life For Me",
        spec: "Absolute",
        icon: "/skills/corsair/6704.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
      {
        id: 6736,
        name: "Vigor Rush",
        spec: "Magnus",
        icon: "/skills/corsair/6736.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
  },
  drakania: {
    Awakening: [
      {
        id: 7044,
        name: "Burning Resolve",
        spec: "Absolute",
        icon: "/skills/drakania/7044.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          crit_hit_rate: 30,
          accuracy: 60,
          attack_speed: 10,
        },
      },
      {
        id: 7048,
        name: "Legacy",
        spec: "Absolute",
        icon: "/skills/drakania/7048.webp",
        buffs: {
          all_ap: 18,
          attack_speed: 15,
        },
      },
      {
        id: 6819,
        name: "Absolute: Soaring Assault",
        spec: "Absolute",
        icon: "/skills/drakania/6819.webp",
        buffs: {
          duration: 10,
          crit_hit_rate: 24,
        },
      },
    ],
    Succession: [
      {
        id: 7044,
        name: "Burning Resolve",
        spec: "Absolute",
        icon: "/skills/drakania/7044.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          crit_hit_rate: 30,
          accuracy: 60,
          attack_speed: 10,
        },
      },
      {
        id: 6976,
        name: "Prime: Dragon's Fury",
        spec: "Prime",
        icon: "/skills/drakania/6976.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 60,
          attack_speed: 15,
        },
      },
      {
        id: 7048,
        name: "Legacy",
        spec: "Absolute",
        icon: "/skills/drakania/7048.webp",
        buffs: {
          all_ap: 18,
          attack_speed: 15,
        },
      },
    ],
  },
  woosa: {
    Awakening: [
      {
        id: 7717,
        name: "Lunar Serenade",
        spec: "Awakening",
        icon: "/skills/woosa/7717.webp",
        buffs: {
          duration: 30,
          all_ap: 25,
          crit_hit_rate: 50,
          damage_reduction: 20,
        },
      },
      {
        id: 7687,
        name: "Perilous Waltz",
        spec: "Awakening",
        icon: "/skills/woosa/7687.webp",
        buffs: {
          duration: 5,
          damage_reduction: 30,
        },
      },
      {
        id: 7688,
        name: "Soul Cleanse",
        spec: "Awakening",
        icon: "/skills/woosa/7688.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
    Succession: [
      {
        id: 7634,
        name: "Prime: Butterfly Dream",
        spec: "Prime",
        icon: "/skills/woosa/7634.webp",
        buffs: {
          duration: 30,
          all_ap: 32,
          crit_hit_rate: 30,
          damage_reduction: 20,
        },
      },
      {
        id: 7610,
        name: "Prime: Thunderstroke",
        spec: "Prime",
        icon: "/skills/woosa/7610.webp",
        buffs: {
          duration: 10,
          all_ap: 24,
        },
      },
      {
        id: 7624,
        name: "Prime: Fan Kick IV",
        spec: "Prime",
        icon: "/skills/woosa/7624.webp",
        buffs: {
          duration: 10,
          all_ap: 24,
        },
      },
    ],
  },
  maegu: {
    Awakening: [
      {
        id: 7362,
        name: "Foxspirit Conduit",
        spec: "Awakening",
        icon: "/skills/maegu/7362.webp",
        buffs: {
          duration: 5,
          all_ap: 25,
          crit_hit_rate: 30,
          evasion: 60,
          air_attack_damage: 10,
        },
      },
      {
        id: 7215,
        name: "Flow: Nether River",
        spec: "Absolute",
        icon: "/skills/maegu/7215.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
      {
        id: 7217,
        name: "Absolute: Charmed",
        spec: "Absolute",
        icon: "/skills/maegu/7217.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
    Succession: [
      {
        id: 7279,
        name: "Prime: Foxspirit: Form",
        spec: "Prime",
        icon: "/skills/maegu/7279.webp",
        buffs: {
          duration: 30,
          all_ap: 25,
          crit_hit_rate: 30,
          damage_reduction: 20,
        },
      },
      {
        id: 7215,
        name: "Flow: Nether River",
        spec: "Absolute",
        icon: "/skills/maegu/7215.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
      {
        id: 7217,
        name: "Absolute: Charmed",
        spec: "Absolute",
        icon: "/skills/maegu/7217.webp",
        buffs: {
          duration: 10,
          all_ap: 20,
        },
      },
    ],
  },
  scholar: {
    Awakening: [
      {
        id: 8060,
        name: "Particle Acceleration",
        spec: "Ascension",
        icon: "/skills/scholar/8060.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 80,
          damage_reduction: 40,
        },
      },
      {
        id: 8131,
        name: "Core Fusion",
        spec: "Ascension",
        icon: "/skills/scholar/8131.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
      {
        id: 8027,
        name: "Absolute: One Small Step",
        spec: "Ascension",
        icon: "/skills/scholar/8027.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
    ],
    Succession: [
      {
        id: 8060,
        name: "Particle Acceleration",
        spec: "Ascension",
        icon: "/skills/scholar/8060.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 80,
          damage_reduction: 40,
        },
      },
      {
        id: 8131,
        name: "Core Fusion",
        spec: "Ascension",
        icon: "/skills/scholar/8131.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
      {
        id: 8027,
        name: "Absolute: One Small Step",
        spec: "Ascension",
        icon: "/skills/scholar/8027.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
    ],
  },
  deadeye: {
    Awakening: [
      {
        id: 9043,
        name: "Gunslinger's Standoff",
        spec: "Ascension",
        icon: "/skills/deadeye/9043.webp",
        buffs: {
          duration: 30,
          all_ap: 10,
          crit_hit_rate: 30,
        },
      },
      {
        id: 8978,
        name: "The Canary Way X",
        spec: "Ascension",
        icon: "/skills/deadeye/8978.webp",
        buffs: {
          all_ap: 1,
        },
      },
    ],
    Succession: [
      {
        id: 9043,
        name: "Gunslinger's Standoff",
        spec: "Ascension",
        icon: "/skills/deadeye/9043.webp",
        buffs: {
          duration: 30,
          all_ap: 10,
          crit_hit_rate: 30,
        },
      },
      {
        id: 8978,
        name: "The Canary Way X",
        spec: "Ascension",
        icon: "/skills/deadeye/8978.webp",
        buffs: {
          all_ap: 1,
        },
      },
    ],
  },
  wukong: {
    Awakening: [
      {
        id: 9605,
        name: "Fighting Buddha",
        spec: "Ascension",
        icon: "/skills/wukong/9605.webp",
        buffs: {
          duration: 10,
          all_ap: 22,
          evasion: 60,
        },
      },
      {
        id: 9517,
        name: "To Shreds You Say?!",
        spec: "Ascension",
        icon: "/skills/wukong/9517.webp",
        buffs: {
          duration: 10,
          all_ap: 22,
        },
      },
      {
        id: 9512,
        name: "Move Outta My Way!",
        spec: "Ascension",
        icon: "/skills/wukong/9512.webp",
        buffs: {
          duration: 10,
          all_ap: 22,
        },
      },
    ],
    Succession: [
      {
        id: 9605,
        name: "Fighting Buddha",
        spec: "Ascension",
        icon: "/skills/wukong/9605.webp",
        buffs: {
          duration: 10,
          all_ap: 22,
          evasion: 60,
        },
      },
      {
        id: 9517,
        name: "To Shreds You Say?!",
        spec: "Ascension",
        icon: "/skills/wukong/9517.webp",
        buffs: {
          duration: 10,
          all_ap: 22,
        },
      },
      {
        id: 9512,
        name: "Move Outta My Way!",
        spec: "Ascension",
        icon: "/skills/wukong/9512.webp",
        buffs: {
          duration: 10,
          all_ap: 22,
        },
      },
    ],
  },
  seraph: {
    Awakening: [
      {
        id: 9809,
        name: "Purga: Perpetual Persecution III",
        spec: "Ascension",
        icon: "/skills/seraph/9809.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
      {
        id: 9800,
        name: "Purga: Enslar's Greatsword Arts III",
        spec: "Ascension",
        icon: "/skills/seraph/9800.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
      {
        id: 9691,
        name: "Absolute: Fling Kick",
        spec: "Ascension",
        icon: "/skills/seraph/9691.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
    ],
    Succession: [
      {
        id: 9809,
        name: "Purga: Perpetual Persecution III",
        spec: "Ascension",
        icon: "/skills/seraph/9809.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
      {
        id: 9800,
        name: "Purga: Enslar's Greatsword Arts III",
        spec: "Ascension",
        icon: "/skills/seraph/9800.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
      {
        id: 9691,
        name: "Absolute: Fling Kick",
        spec: "Ascension",
        icon: "/skills/seraph/9691.webp",
        buffs: {
          duration: 10,
          all_ap: 32,
        },
      },
    ],
  },
  dosa: {
    Awakening: [
      {
        id: 8768,
        name: "Elemental Invocation",
        spec: "Awakening",
        icon: "/skills/dosa/8768.webp",
        buffs: {
          duration: 10,
          all_ap: 30,
          crit_hit_rate: 50,
          special_attack_damage: 2,
          damage_reduction: 30,
          damage_reduction_rate: 10,
          recover: 2500,
        },
      },
      {
        id: 8769,
        name: "Elements: Generate",
        spec: "Awakening",
        icon: "/skills/dosa/8769.webp",
        buffs: {
          duration: 10,
          all_ap: 22,
          recover: 200,
        },
      },
      {
        id: 8781,
        name: "Enlightened Haze III",
        spec: "Absolute",
        icon: "/skills/dosa/8781.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
    ],
    Succession: [
      {
        id: 8711,
        name: "Prime: Cloud Legion",
        spec: "Prime",
        icon: "/skills/dosa/8711.webp",
        buffs: {
          duration: 30,
          accuracy: 80,
          damage_reduction: 20,
          down_attack_damage: 15,
          air_attack_damage: 15,
          back_attack_damage: 15,
          crit_damage: 15,
        },
      },
      {
        id: 8745,
        name: "Prime: Unsa's Heir",
        spec: "Prime",
        icon: "/skills/dosa/8745.webp",
        buffs: {
          duration: 20,
          all_ap: 20,
          crit_hit_rate: 42,
        },
      },
      {
        id: 8781,
        name: "Enlightened Haze III",
        spec: "Absolute",
        icon: "/skills/dosa/8781.webp",
        buffs: {
          duration: 10,
          damage_reduction: 20,
        },
      },
    ],
  },
  agent: {
    Awakening: [
      {
        id: 9931,
        name: "Absolute: Evasive Detonation",
        spec: "Absolute",
        icon: "/skills/agent/9931.webp",
        buffs: {
          duration: 10,
          evasion: 36,
        },
      },
      {
        id: 9963,
        name: "Tactical Directive",
        spec: "Absolute",
        icon: "/skills/agent/9963.webp",
        buffs: {
          duration: 10,
          movement_speed: 10,
          accuracy: 24,
        },
      },
      {
        id: 9952,
        name: "Rules of Engagement X",
        spec: "Absolute",
        icon: "/skills/agent/9952.webp",
        buffs: {
          all_ap: 1,
        },
      },
    ],
    Succession: [
      {
        id: 9968,
        name: "Prime: Gannicus's Gambit",
        spec: "Prime",
        icon: "/skills/agent/9968.webp",
        buffs: {
          duration: 30,
          all_ap: 30,
          accuracy: 60,
          crit_hit_rate: 100,
        },
      },
      {
        id: 9931,
        name: "Absolute: Evasive Detonation",
        spec: "Absolute",
        icon: "/skills/agent/9931.webp",
        buffs: {
          duration: 10,
          evasion: 36,
        },
      },
      {
        id: 9963,
        name: "Tactical Directive",
        spec: "Absolute",
        icon: "/skills/agent/9963.webp",
        buffs: {
          duration: 10,
          movement_speed: 10,
          accuracy: 24,
        },
      },
    ],
  },
};
