(function () {
  "use strict";

  // Balance and weapon configuration.
  // Modify values in the weapons section.
  // For changing id values, see the configuration in app.js.
  window.GAME_WEAPON_CONFIG = {
  "balance": {
    "damageScale": 1.02,
    "speedScale": 1.5,
    "adrenalineMultiplier": 1.2,
    "adrenalineDurationSec": 0.35,
    "cooldownScale": 0.9,
    "projectileSpriteScale": 1.5,
    "simulationTimeoutSec": 120,
    "fastSetSimDt": 0.04,
    "round": {
      "limitSec": 45,
      "suddenDeathStartSec": 30,
      "suddenDeathDotMax": 8,
      "suddenDeathDotIntervalSec": 0.8,
      "suddenDeathHealScale": 0.2,
      "suddenDeathShieldScale": 0.25
    },
    "rail": {
      "wallHitsToFinalize": 4,
      "minTrailPoints": 7,
      "chargeTimeSec": 0.22,
      "fireTimeSec": 3.0,
      "wagonCount": 8,
      "wagonSpawnDelaySec": 0.12,
      "wagonDamageMin": 7,
      "wagonDamageMax": 8,
      "wagonHitCooldownSec": 0.08,
      "comboCooldownSec": 0.55,
      "comboDamage": 7,
      "comboDamageLate": 10,
      "comboRequiredWagons": 2,
      "comboRequiredWagonsLate": 1,
      "pullStrength": 240,
      "pullLateMultiplier": 0.45,
      "terminalStartSec": 35,
      "terminalPullMultiplier": 1.25,
      "terminalDamageBonus": 3,
      "terminalSpawnRateBonus": 0.2
    }
  },
  "legacyWeaponLibrary": {
    "rail": {
      "id": "rail",
      "title": "Rails",
      "description": "Lays track after wall hits and launches minecarts."
    },
    "boat": {
      "id": "boat",
      "title": "Boat + Buckets",
      "description": "Armored hull with alternating ice and lava buckets."
    }
  },
  "weapons": [
    {
      "id": "rail",
      "title": "Rails",
      "description": "Lays track after wall hits and launches minecarts.",
      "badge": "RL",
      "color": "#f7d98d",
      "balanceBias": 0.18,
      "category": "Legacy",
      "speedMin": 320.0,
      "speedMax": 380.0
    },
    {
      "id": "boat",
      "title": "Boat",
      "description": "Armored hull with alternating ice and lava buckets.",
      "badge": "BT",
      "color": "#8fd6ff",
      "balanceBias": 0.00,
      "category": "Legacy",
      "speedMin": 280.0,
      "speedMax": 340.0
    },
    {
      "id": "pacifist",
      "title": "No Weapon",
      "description": "Passive ball: does not attack and deals no damage.",
      "badge": "NW",
      "color": "#b9c2d9",
      "category": "Rebalance",
      "speedMin": 300.0,
      "speedMax": 360.0
    },
    {
      "id": "fishingRod",
      "title": "Fishing Rod",
      "description": "Hooks the enemy with a line or pulls the owner to the wall.",
      "badge": "FR",
      "color": "#9fd0ff",
      "balanceBias": 0.07,
      "category": "Tools",
    },
    {
      "id": "loyaltyTrident",
      "title": "Loyalty Trident",
      "description": "Heavy throw that always returns to the owner.",
      "badge": "TR",
      "color": "#6de4ff",
      "balanceBias": 0.02,
      "category": "Tools"
    },
    {
      "id": "waterBucket",
      "title": "Water Bucket",
      "description": "Floods the arena, slows enemies and extinguishes fire.",
      "badge": "WB",
      "color": "#6fb8ff",
      "balanceBias": -0.05,
      "category": "Tools"
    },
    {
      "id": "lavaBucket",
      "title": "Lava Bucket",
      "description": "Creates a scorching zone and punishes close pressure.",
      "badge": "LB",
      "color": "#ff8b54",
      "balanceBias": 0.08,
      "category": "Tools"
    },
    {
      "id": "snowball",
      "title": "Snowballs",
      "description": "Bursts of freezing shots that break combos.",
      "badge": "SN",
      "color": "#dff8ff",
      "balanceBias": 0.10,
      "category": "Tools"
    },
    {
      "id": "flintSteel",
      "title": "Flint and Steel",
      "description": "Fire spreads across the floor and burns paths.",
      "badge": "FS",
      "color": "#ffb46e",
      "balanceBias": -0.60,
      "category": "Tools",
      "damageMultiplier": 8.0
    },
    {
      "id": "expBottle",
      "title": "Experience Bottle",
      "description": "Scatters experience orbs to charge enchantments.",
      "badge": "XP",
      "color": "#9c86ff",
      "balanceBias": -0.08,
      "category": "Alchemy",
      "damageMultiplier": 0.35
    },
    {
      "id": "totem",
      "title": "Totem",
      "description": "One emergency second life with a counterattack window.",
      "badge": "TT",
      "color": "#9ff39f",
      "balanceBias": 0.01,
      "category": "Magic"
    },
    {
      "id": "hopperMinecart",
      "title": "Hopper Minecart",
      "description": "Steals health, buffs and charge from nearby enemy.",
      "badge": "HC",
      "color": "#c9c2a9",
      "balanceBias": -0.02,
      "category": "Mechanisms"
    },
    {
      "id": "tnt",
      "title": "TNT",
      "description": "Places timed explosives and clears the arena.",
      "badge": "TN",
      "color": "#ff7878",
      "balanceBias": -0.08,
      "category": "Mechanisms"
    },
    {
      "id": "slimePiston",
      "title": "Slime Piston",
      "description": "Pushes enemy with sticky piston or gives bounce to owner.",
      "badge": "SP",
      "color": "#7cff99",
      "balanceBias": 0.00,
      "category": "Mechanisms"
    },
    {
      "id": "observer",
      "title": "Observer",
      "description": "Reads enemy actions and strikes with disruption pulses.",
      "badge": "OB",
      "color": "#b7c7ff",
      "balanceBias": 0.08,
      "category": "Механизмы"
    },
    {
      "id": "beehive",
      "title": "Beehive",
      "description": "Summons bees, honey zones and a panicking swarm.",
      "badge": "BH",
      "color": "#ffd45c",
      "balanceBias": 0.00,
      "category": "Mechanisms"
    },
    {
      "id": "noteBlock",
      "title": "Note Block",
      "description": "Wall hits generate music waves and break control.",
      "badge": "NB",
      "color": "#ffc18a",
      "balanceBias": 0.12,
      "category": "Mechanisms"
    },
    {
      "id": "shulkerBox",
      "title": "Shulker Box",
      "description": "Collects projectiles and teleports owner from heavy hits.",
      "badge": "SB",
      "color": "#d3a7ff",
      "balanceBias": -0.50,
      "category": "Mechanisms",
      "damageMultiplier": 0.3
    },
    {
      "id": "respawnAnchor",
      "title": "Respawn Anchor",
      "description": "Sets a respawn point and saves with a sharp jump.",
      "badge": "RA",
      "color": "#b978ff",
      "balanceBias": 0.14,
      "category": "Mechanisms"
    },
    {
      "id": "enderPearl",
      "title": "Ender Pearl",
      "description": "Teleports through danger and behind the enemy.",
      "badge": "EP",
      "color": "#9f7cff",
      "balanceBias": -0.03,
      "category": "Dimensions"
    },
    {
      "id": "cryingObsidian",
      "title": "Crying Obsidian",
      "description": "Spreads pools against knockback and warps the arena with portals.",
      "badge": "CO",
      "color": "#7e5dff",
      "balanceBias": -0.18,
      "category": "Dimensions",
      "damageMultiplier": 0.35
    },
    {
      "id": "blazeRod",
      "title": "Blaze Rod",
      "description": "Triple fireballs and a returning fire ring.",
      "badge": "BR",
      "color": "#ffbd66",
      "balanceBias": -0.38,
      "category": "Dimensions",
      "damageMultiplier": 0.15
    },
    {
      "id": "rottenFlesh",
      "title": "Rotten Flesh",
      "description": "Brings zombies to the arena and infects the battlefield.",
      "badge": "RF",
      "color": "#9dba76",
      "balanceBias": 0.35,
      "category": "Magic",
      "damageMultiplier": 1.8
    },
    {
      "id": "jackOLantern",
      "title": "Jack O'Lantern",
      "description": "Sets light traps and frightens enemy with flashes.",
      "badge": "JL",
      "color": "#ffb657",
      "balanceBias": 0.40,
      "category": "Magic"
    },
    {
      "id": "boneMeal",
      "title": "Bone Meal",
      "description": "Grows random terrain and ensnares the target.",
      "badge": "BM",
      "color": "#f3f0df",
      "balanceBias": -0.10,
      "category": "Magic",
      "damageMultiplier": 5.0
    },
    {
      "id": "bookQuill",
      "title": "Book and Quill",
      "description": "Remembers enemy abilities and echoes back.",
      "badge": "BQ",
      "color": "#ffdca8",
      "balanceBias": -0.10,
      "category": "Magic"
    },
    {
      "id": "elytra",
      "title": "Elytra",
      "description": "Converts speed to gliding and dive bombs.",
      "badge": "EL",
      "color": "#dbe7f9",
      "balanceBias": 0.10,
      "category": "Dimensions",
      "damageMultiplier": 1.5
    },
    {
      "id": "goldenApple",
      "title": "Golden Apple",
      "description": "Grants regeneration under pressure.",
      "badge": "GA",
      "color": "#ffd757",
      "balanceBias": -0.06,
      "category": "Alchemy"
    },
    {
      "id": "invisPotion",
      "title": "Invisibility",
      "description": "Allows hiding, phasing through enemy and repositioning.",
      "badge": "IV",
      "color": "#d6c9ff",
      "balanceBias": 0.03,
      "category": "Alchemy",
      "damageMultiplier": 1.5
    },
    {
      "id": "gravityPotion",
      "title": "Gravity Potion",
      "description": "Lifts enemy into the air or lightens the owner.",
      "badge": "GP",
      "color": "#b8d5ff",
      "balanceBias": 0.09,
      "category": "Alchemy",
      "damageMultiplier": 2.5
    },
    {
      "id": "turtlePotion",
      "title": "Turtle Potion",
      "description": "Greatly reduces incoming damage and gives shell knockback.",
      "badge": "TP",
      "color": "#7be2b2",
      "balanceBias": 0.12,
      "category": "Alchemy"
    }
  ]
};
})();
