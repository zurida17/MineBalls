(function () {
  "use strict";

  const WIDTH = 900;
  const HEIGHT = 1600;
  const HUD_TOP = 416;
  const HUD_BOTTOM = 416;
  const ARENA = {
    x: 66,
    y: HUD_TOP,
    width: 768,
    height: 768,
  };
  const RECORDING_SIZE = {
    width: 2160,
    height: 3840,
  };
  const RECORDING_BUFFER_SCALE = 0.75;
  const RECORDING_BUFFER_SIZE = {
    width: Math.round(WIDTH * RECORDING_BUFFER_SCALE),
    height: Math.round(HEIGHT * RECORDING_BUFFER_SCALE),
  };
  const RECORDING_FPS = 60; // higher FPS for smoother video
  const RECORDING_VIDEO_BITRATE = 30000000; // 30Mbps for 4K at 60fps
  const RECORDING_AUDIO_BITRATE = 192000;
  const RECORDING_EXPORT_FRAME_MS = Math.round(1000 / RECORDING_FPS);

  let RNG_STATE = (((Date.now() >>> 0) ^ 0x9e3779b9) >>> 0);

  function setRandomSeed(seed) {
    RNG_STATE = ((seed >>> 0) || 1) >>> 0;
  }

  function randomUnit() {
    RNG_STATE = (Math.imul(RNG_STATE, 1664525) + 1013904223) >>> 0;
    return RNG_STATE / 4294967296;
  }

  function makeBattleSeed() {
    return (((Date.now() >>> 0) ^ ((Math.random() * 4294967295) >>> 0)) >>> 0);
  }

  // Put custom backgrounds in ./backgrounds/.
  // Put custom sprites in ./sprites/.
  const CUSTOM_ASSETS = {
    backgroundCandidates: [
      "./backgrounds/custom.png",
      "./backgrounds/custom.jpg",
      "./backgrounds/custom.jpeg",
      "./backgrounds/custom.webp",
    ],
    sprites: {
      ballLeft: ["./sprites/balls/left.png", "./sprites/balls/left.webp"],
      ballRight: ["./sprites/balls/right.png", "./sprites/balls/right.webp"],
      railAttachment: [
        "./sprites/weapons/rail_attachment.png",
        "./sprites/weapons/rail_attachment.webp",
      ],
      boatHull: [
        "./sprites/weapons/boat.png",
        "./sprites/weapons/boat_hull.png",
        "./sprites/weapons/boat_hull.webp",
      ],
      bucketIce: [
        "./sprites/weapons/bucket_ice.png",
        "./sprites/weapons/bucket_ice.webp",
      ],
      bucketLava: [
        "./sprites/weapons/bucket_lava.png",
        "./sprites/weapons/bucket_lava.webp",
      ],
      zoneWater: [
        "./sprites/zones/water_still.png",
        "./sprites/zones/water_overlay.png",
      ],
      minionZombieHead: [
        "./sprites/weapons/zombie_head.svg",
        "./sprites/weapons/zombie_head.png",
        "./sprites/weapons/zombie.png",
      ],
      minionSkeletonHead: [
        "./sprites/weapons/skeleton_head.svg",
        "./sprites/weapons/skeleton_head.png",
        "./sprites/weapons/skeleton.png",
      ],
      zoneLava: [
        "./sprites/zones/lava_still.png",
      ],
      zoneIce: [
        "./sprites/zones/packed_ice.png",
      ],
      zoneFire: [
        "./sprites/zones/fire_0.png",
      ],
      zoneHoney: [
        "./sprites/zones/honey_block_top.png",
      ],
      zoneCryingObsidian: [
        "./sprites/zones/crying_obsidian.png",
      ],
      zoneObsidian: [
        "./sprites/zones/obsidian.png",
      ],
      zoneSteam: [
        "./sprites/zones/water_overlay.png",
        "./sprites/zones/water_still.png",
      ],
      zoneVoid: [
        "./sprites/zones/nether_portal.png",
      ],
      zoneGravity: [
        "./sprites/zones/amethyst_block.png",
      ],
      zoneLight: [
        "./sprites/zones/glowstone.png",
      ],
      zonePlantsGrass: [
        "./sprites/zones/grass_block_top.png",
      ],
      zonePlantsFlower: [
        "./sprites/zones/flowering_azalea_top.png",
      ],
      zonePlantsMushroom: [
        "./sprites/zones/red_mushroom_block.png",
      ],
      zoneRadiation: [
        "./sprites/zones/sculk.png",
      ],
      zoneTotemAura: [
        "./sprites/zones/respawn_anchor_top.png",
      ],
      zoneQuake: [
        "./sprites/zones/cracked_stone_bricks.png",
      ],
      wagon: [
        "./sprites/weapons/minecart.png",
        "./sprites/weapons/hopper_minecart.png",
        "./sprites/weapons/wagon.png",
        "./sprites/weapons/wagon.webp",
      ],
hudRail: ["./sprites/weapons/rail.png"],
      hudBoat: ["./sprites/weapons/boat.png"],
hudBoat: [
        "./sprites/hud/boat_icon.png",
        "./sprites/hud/boat_icon.webp",
        "./sprites/weapons/boat.png",
      ],
hudFishingRod: ["./sprites/weapons/fishing_rod.png"],
      hudTrident: ["./sprites/weapons/trident.png"],
      hudWaterBucket: ["./sprites/weapons/water_bucket.png"],
      hudLavaBucket: ["./sprites/weapons/lava_bucket.png"],
      hudSnowball: ["./sprites/weapons/snowball.png"],
      hudFlintSteel: ["./sprites/weapons/flint_and_steel.png"],
      hudExpBottle: ["./sprites/weapons/experience_bottle.png"],
      hudTotem: ["./sprites/weapons/totem_of_undying.png"],
      hudHopperMinecart: ["./sprites/weapons/hopper_minecart.png"],
      hudTnt: ["./sprites/weapons/tnt.png"],
      hudBeehive: ["./sprites/weapons/beehive_front.png"],
      hudNoteBlock: ["./sprites/weapons/note_block.png"],
      hudShulkerBox: ["./sprites/weapons/shulker_box.png"],
      hudRespawnAnchor: ["./sprites/weapons/respawn_anchor_top.png"],
      hudEnderPearl: ["./sprites/weapons/ender_pearl.png"],
      hudCryingObsidian: ["./sprites/weapons/crying_obsidian.png"],
      hudBlazeRod: ["./sprites/weapons/blaze_rod.png"],
      hudRottenFlesh: ["./sprites/weapons/rotten_flesh.png"],
      hudJackOLantern: ["./sprites/weapons/jack_o_lantern.png"],
      hudBoneMeal: ["./sprites/weapons/bone_meal.png"],
      hudBookQuill: ["./sprites/weapons/written_book.png"],
      hudElytra: ["./sprites/weapons/elytra.png"],
      hudGoldenApple: ["./sprites/weapons/golden_apple.png"],
      hudInvisPotion: ["./sprites/weapons/invisibility.png"],
      hudGravityPotion: ["./sprites/weapons/potion.png"],
      hudTurtlePotion: ["./sprites/weapons/turtle_scute.png"],
      hudTrident: [
        "./sprites/hud/trident_icon.png",
        "./sprites/weapons/trident.png",
      ],
      hudWaterBucket: [
        "./sprites/hud/water_bucket_icon.png",
        "./sprites/weapons/water_bucket.png",
      ],
      hudLavaBucket: [
        "./sprites/hud/lava_bucket_icon.png",
        "./sprites/weapons/lava_bucket.png",
      ],
      hudSnowball: [
        "./sprites/hud/snowball_icon.png",
        "./sprites/weapons/snowball.png",
      ],
      hudFlintSteel: [
        "./sprites/hud/flint_steel_icon.png",
        "./sprites/weapons/flint_and_steel.png",
      ],
      hudExpBottle: [
        "./sprites/hud/exp_bottle_icon.png",
        "./sprites/weapons/experience_bottle.png",
      ],
      hudTotem: [
        "./sprites/hud/totem_icon.png",
        "./sprites/weapons/totem_of_undying.png",
      ],
      hudHopperMinecart: [
        "./sprites/hud/hopper_minecart_icon.png",
        "./sprites/weapons/hopper_minecart.png",
      ],
      hudTnt: [
        "./sprites/hud/tnt_icon.png",
        "./sprites/weapons/tnt.png",
      ],
      hudBeehive: [
        "./sprites/hud/beehive_icon.png",
        "./sprites/weapons/beehive_front.png",
      ],
      hudNoteBlock: [
        "./sprites/hud/note_block_icon.png",
        "./sprites/weapons/note_block.png",
      ],
      hudShulkerBox: [
        "./sprites/hud/shulker_box_icon.png",
        "./sprites/weapons/shulker_box.png",
      ],
      hudRespawnAnchor: [
        "./sprites/hud/respawn_anchor_icon.png",
        "./sprites/weapons/respawn_anchor_top.png",
      ],
      hudEnderPearl: [
        "./sprites/hud/ender_pearl_icon.png",
        "./sprites/weapons/ender_pearl.png",
      ],
      hudCryingObsidian: [
        "./sprites/hud/crying_obsidian_icon.png",
        "./sprites/weapons/crying_obsidian.png",
      ],
      hudBlazeRod: [
        "./sprites/hud/blaze_rod_icon.png",
        "./sprites/weapons/blaze_rod.png",
      ],
      hudRottenFlesh: [
        "./sprites/hud/rotten_flesh_icon.png",
        "./sprites/weapons/rotten_flesh.png",
      ],
      hudJackOLantern: [
        "./sprites/hud/jack_o_lantern_icon.png",
        "./sprites/weapons/jack_o_lantern.png",
      ],
      hudBoneMeal: [
        "./sprites/hud/bone_meal_icon.png",
        "./sprites/weapons/bone_meal.png",
      ],
      hudBookQuill: [
        "./sprites/hud/book_quill_icon.png",
        "./sprites/weapons/written_book.png",
      ],
      hudElytra: [
        "./sprites/hud/elytra_icon.png",
        "./sprites/weapons/elytra.png",
      ],
      hudGoldenApple: [
        "./sprites/hud/golden_apple_icon.png",
        "./sprites/weapons/golden_apple.png",
      ],
      hudInvisPotion: [
        "./sprites/hud/invis_potion_icon.png",
        "./sprites/mob_effect/invisibility.png",
      ],
      hudGravityPotion: [
        "./sprites/hud/gravity_potion_icon.png",
        "./sprites/weapons/potion.png",
      ],
      hudTurtlePotion: [
        "./sprites/hud/turtle_potion_icon.png",
        "./sprites/weapons/turtle_scute.png",
      ],
      projectileIce: [
        "./sprites/projectiles/ice.png",
        "./sprites/projectiles/ice.webp",
      ],
      projectileLava: [
        "./sprites/projectiles/lava.png",
        "./sprites/projectiles/lava.webp",
      ],
      projectileTrident: [
        "./sprites/projectiles/trident.png",
        "./sprites/projectiles/trident.webp",
      ],
      projectileHook: [
        "./sprites/projectiles/hook.png",
        "./sprites/projectiles/hook.webp",
      ],
      projectilePearl: [
        "./sprites/projectiles/pearl.png",
        "./sprites/projectiles/pearl.webp",
      ],
      projectileSnow: [
        "./sprites/projectiles/snow.png",
        "./sprites/projectiles/snow.webp",
      ],
      projectileFireball: [
        "./sprites/projectiles/fireball.png",
        "./sprites/projectiles/fireball.webp",
      ],
      projectileBook: [
        "./sprites/projectiles/book.png",
        "./sprites/projectiles/book.webp",
      ],
      projectileXpBottle: [
        "./sprites/projectiles/xp_bottle.png",
        "./sprites/projectiles/xp_bottle.webp",
      ],
      projectileShulkerBolt: [
        "./sprites/projectiles/shulker_bolt.png",
        "./sprites/projectiles/shulker_bolt.webp",
      ],
      projectileEcho: [
        "./sprites/projectiles/echo.png",
        "./sprites/projectiles/echo.webp",
      ],
      fishingRod: [
        "./sprites/weapons/fishing_rod.png",
        "./sprites/weapons/fishing_rod.webp",
      ],
      trident: [
        "./sprites/weapons/trident.png",
        "./sprites/weapons/trident.webp",
      ],
      waterBucket: [
        "./sprites/weapons/water_bucket.png",
        "./sprites/weapons/water_bucket.webp",
      ],
      snowball: [
        "./sprites/weapons/snowball.png",
        "./sprites/weapons/snowball.webp",
      ],
      flintSteel: [
        "./sprites/weapons/flint_steel.png",
        "./sprites/weapons/flint_steel.webp",
      ],
      expBottle: [
        "./sprites/weapons/exp_bottle.png",
        "./sprites/weapons/exp_bottle.webp",
      ],
      totem: [
        "./sprites/weapons/totem.png",
        "./sprites/weapons/totem.webp",
      ],
      hopperMinecart: [
        "./sprites/weapons/hopper_minecart.png",
        "./sprites/weapons/hopper_minecart.webp",
      ],
      tnt: [
        "./sprites/weapons/tnt.png",
        "./sprites/weapons/tnt.webp",
      ],
      beehive: [
        "./sprites/weapons/beehive.png",
        "./sprites/weapons/beehive.webp",
      ],
      noteBlock: [
        "./sprites/weapons/note_block.png",
        "./sprites/weapons/note_block.webp",
      ],
      shulkerBox: [
        "./sprites/weapons/shulker_box.png",
        "./sprites/weapons/shulker_box.webp",
      ],
      respawnAnchor: [
        "./sprites/weapons/respawn_anchor.png",
        "./sprites/weapons/respawn_anchor.webp",
      ],
      enderPearl: [
        "./sprites/weapons/ender_pearl.png",
        "./sprites/weapons/ender_pearl.webp",
      ],
      cryingObsidian: [
        "./sprites/weapons/crying_obsidian.png",
        "./sprites/weapons/crying_obsidian.webp",
      ],
      blazeRod: [
        "./sprites/weapons/blaze_rod.png",
        "./sprites/weapons/blaze_rod.webp",
      ],
      rottenFlesh: [
        "./sprites/weapons/rotten_flesh.png",
        "./sprites/weapons/rotten_flesh.webp",
      ],
      jackOLantern: [
        "./sprites/weapons/jack_o_lantern.png",
        "./sprites/weapons/jack_o_lantern.webp",
      ],
      boneMeal: [
        "./sprites/weapons/bone_meal.png",
        "./sprites/weapons/bone_meal.webp",
      ],
      bookQuill: [
        "./sprites/weapons/book_quill.png",
        "./sprites/weapons/book_quill.webp",
      ],
      elytra: [
        "./sprites/weapons/elytra.png",
        "./sprites/weapons/elytra.webp",
      ],
      goldenApple: [
        "./sprites/weapons/golden_apple.png",
        "./sprites/weapons/golden_apple.webp",
      ],
      invisPotion: [
        "./sprites/weapons/invis_potion.png",
        "./sprites/weapons/invis_potion.webp",
      ],
      gravityPotion: [
        "./sprites/weapons/gravity_potion.png",
        "./sprites/weapons/gravity_potion.webp",
],
      turtlePotion: [
        "./sprites/weapons/turtle_potion.png",
        "./sprites/weapons/turtle_potion.webp",
      ],
    },
    palette: {
      leftBall: "#33ff63",
      leftBallDark: "#0e8d2c",
      rightBall: "#2da9ff",
      rightBallDark: "#0d4ec7",
      arenaFillTop: "rgba(8, 17, 32, 0.78)",
      arenaFillBottom: "rgba(3, 8, 18, 0.96)",
      arenaGlowA: "rgba(0, 255, 218, 0.2)",
      arenaGlowB: "rgba(255, 129, 56, 0.18)",
      hudLeft: "#6eff75",
      hudRight: "#68c8ff",
      menuAccent: "#ffbf3f",
    },
    rail: {
      glow: "rgba(255, 244, 186, 0.48)",
      metalLight: "#f6f8ff",
      metalDark: "#596273",
      sleeper: "#d06d2a",
      sleeperShadow: "#643113",
    },
    wagon: {
      shell: "#8f99a8",
      cab: "#161c24",
      trim: "#f8f3d1",
      wheel: "#242932",
    },
  };

const CUSTOM_ASSET_FOLDERS = [
    "./sprites",
    "./sprites/weapons",
    "./sprites/projectiles",
    "./sprites/zones",
    "./sprites/hud",
    "./sprites/balls",
    "./backgrounds",
    "./assets",
    "./assets/images",
    "./assets/textures",
  ];

  const CUSTOM_ASSET_EXTENSIONS = [".png", ".webp", ".jpg", ".jpeg"];
  const CUSTOM_SOUND_FOLDERS = [
    "./sounds",
    "./sounds/ui",
    "./sounds/weapons",
    "./sounds/effects",
    "./sounds/impact",
    "./assets/sounds",
  ];
  const CUSTOM_SOUND_EXTENSIONS = [".ogg", ".wav", ".mp3"];
  const APP_ROOT_URL = (() => {
    const appScript = Array.from(document.scripts || []).find((script) => /(?:^|\/)app\.js(?:[?#]|$)/i.test(script.src || ""));
    try {
      return new URL(".", appScript && appScript.src ? appScript.src : document.baseURI);
    } catch (error) {
      return new URL(".", document.baseURI);
    }
  })();

  function resolveAssetUrl(path) {
    return new URL(String(path || "").replace(/^\.\//, ""), APP_ROOT_URL).href;
  }

  function normalizeMediaCandidate(candidate) {
    const value = String(candidate || "");
    if (!value) {
      return value;
    }
    if (/^(?:[a-z]+:|\/)/i.test(value)) {
      return value;
    }
    return /[./\\]/.test(value) ? resolveAssetUrl(value) : value;
  }

  function normalizeRepoAssetPath(path) {
    return String(path || "")
      .replace(/\\/g, "/")
      .replace(/^\.\//, "")
      .replace(/^\/+/, "");
  }

  function parseAssetManifest(text) {
    return String(text || "")
      .split(/\r?\n/)
      .map((line) => normalizeRepoAssetPath(line.trim()))
      .filter(Boolean);
  }

  function buildAssetLookup(paths) {
    const byName = new Map();
    for (const rawPath of paths) {
      const normalized = normalizeRepoAssetPath(rawPath);
      const fileName = normalized.split("/").pop() || "";
      const dotIndex = fileName.lastIndexOf(".");
      const baseName = dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName;
      if (!baseName) {
        continue;
      }
      if (!byName.has(baseName)) {
        byName.set(baseName, []);
      }
      byName.get(baseName).push(resolveAssetUrl(normalized));
    }
    return {
      pathSet: new Set(paths.map((path) => normalizeRepoAssetPath(path))),
      byName,
    };
  }

  const KNOWN_SOUND_ASSETS = buildAssetLookup(parseAssetManifest(`
sounds/effects/book_laser_1.ogg
sounds/effects/book_laser_2.ogg
sounds/effects/book_laser_3.ogg
sounds/effects/book_lightning_1.ogg
sounds/effects/book_lightning_2.ogg
sounds/effects/book_lightning_3.ogg
sounds/effects/book_quake_1.ogg
sounds/effects/book_quake_2.ogg
sounds/effects/burn_1.ogg
sounds/effects/burn_2.ogg
sounds/effects/charge.ogg
sounds/effects/combo.ogg
sounds/effects/ender_blink_1.ogg
sounds/effects/ender_blink_2.ogg
sounds/effects/ender_blink_3.ogg
sounds/effects/fire.ogg
sounds/effects/ice.ogg
sounds/effects/ice_crack_1.ogg
sounds/effects/ice_crack_2.ogg
sounds/effects/ice_crack_3.ogg
sounds/effects/ignite_1.ogg
sounds/effects/ignite_2.ogg
sounds/effects/lava.ogg
sounds/effects/lava_burst_1.ogg
sounds/effects/lava_burst_2.ogg
sounds/effects/lava_sizzle_1.ogg
sounds/effects/lava_sizzle_2.ogg
sounds/effects/magic.ogg
sounds/effects/magic_pop_1.ogg
sounds/effects/magic_pop_2.ogg
sounds/effects/magic_pop_3.ogg
sounds/effects/metal.ogg
sounds/effects/nature.ogg
sounds/effects/nature_buzz_1.ogg
sounds/effects/nature_buzz_2.ogg
sounds/effects/nature_buzz_3.ogg
sounds/effects/spawn.ogg
sounds/effects/teleport.ogg
sounds/effects/thunder_1.ogg
sounds/effects/thunder_2.ogg
sounds/effects/thunder_3.ogg
sounds/effects/water.ogg
sounds/effects/water_splash_1.ogg
sounds/effects/water_splash_2.ogg
sounds/effects/water_splash_3.ogg
sounds/impact/ball_1.ogg
sounds/impact/ball_2.ogg
sounds/impact/ball_3.ogg
sounds/impact/ball_4.ogg
sounds/impact/explosion_1.ogg
sounds/impact/explosion_2.ogg
sounds/impact/explosion_3.ogg
sounds/impact/hit.ogg
sounds/impact/hit_1.ogg
sounds/impact/hit_2.ogg
sounds/impact/hit_3.ogg
sounds/impact/hit_4.ogg
sounds/impact/hit_5.ogg
sounds/impact/hit_6.ogg
sounds/impact/metal_clang_1.ogg
sounds/impact/metal_clang_2.ogg
sounds/impact/metal_clang_3.ogg
sounds/impact/slime_splat_1.ogg
sounds/impact/slime_splat_2.ogg
sounds/impact/wall_1.ogg
sounds/impact/wall_2.ogg
sounds/impact/wall_3.ogg
sounds/impact/wall_4.ogg
sounds/impact/wall_5.ogg
sounds/impact/wall_soft_1.ogg
sounds/impact/wall_soft_2.ogg
sounds/impact/wall_soft_3.ogg
sounds/impact/wall_soft_4.ogg
sounds/impact/wall_soft_5.ogg
sounds/impact/wood_thud_1.ogg
sounds/impact/wood_thud_2.ogg
sounds/ui/click.ogg
sounds/ui/countdown.ogg
sounds/ui/death.ogg
sounds/ui/round_start.ogg
sounds/ui/select.ogg
sounds/ui/start.ogg
sounds/ui/victory.ogg
sounds/weapons/beehive.ogg
sounds/weapons/beehive_1.ogg
sounds/weapons/beehive_2.ogg
sounds/weapons/beehive_3.ogg
sounds/weapons/beehive_4.ogg
sounds/weapons/blaze_rod.ogg
sounds/weapons/blaze_rod_1.ogg
sounds/weapons/blaze_rod_2.ogg
sounds/weapons/blaze_rod_3.ogg
sounds/weapons/blaze_rod_4.ogg
sounds/weapons/boat.ogg
sounds/weapons/boat_1.ogg
sounds/weapons/boat_2.ogg
sounds/weapons/boat_3.ogg
sounds/weapons/boat_4.ogg
sounds/weapons/bone_meal.ogg
sounds/weapons/bone_meal_1.ogg
sounds/weapons/bone_meal_2.ogg
sounds/weapons/bone_meal_3.ogg
sounds/weapons/bone_meal_4.ogg
sounds/weapons/crying_obsidian.ogg
sounds/weapons/crying_obsidian_1.ogg
sounds/weapons/crying_obsidian_2.ogg
sounds/weapons/crying_obsidian_3.ogg
sounds/weapons/elytra.ogg
sounds/weapons/ender_pearl.ogg
sounds/weapons/ender_pearl_1.ogg
sounds/weapons/ender_pearl_2.ogg
sounds/weapons/experience_bottle.ogg
sounds/weapons/fishing_rod.ogg
sounds/weapons/fishing_rod_1.ogg
sounds/weapons/fishing_rod_2.ogg
sounds/weapons/fishing_rod_3.ogg
sounds/weapons/fishing_rod_4.ogg
sounds/weapons/flint_and_steel.ogg
sounds/weapons/golden_apple.ogg
sounds/weapons/golden_apple_1.ogg
sounds/weapons/golden_apple_2.ogg
sounds/weapons/golden_apple_3.ogg
sounds/weapons/gravity.ogg
sounds/weapons/hopper_minecart.ogg
sounds/weapons/invisibility.ogg
sounds/weapons/invisibility_1.ogg
sounds/weapons/invisibility_2.ogg
sounds/weapons/invisibility_3.ogg
sounds/weapons/invisibility_4.ogg
sounds/weapons/jack_o_lantern.ogg
sounds/weapons/jack_o_lantern_1.ogg
sounds/weapons/jack_o_lantern_2.ogg
sounds/weapons/lava_bucket.ogg
sounds/weapons/lava_bucket_1.ogg
sounds/weapons/lava_bucket_2.ogg
sounds/weapons/lava_bucket_3.ogg
sounds/weapons/note_block.ogg
sounds/weapons/note_block_1.ogg
sounds/weapons/note_block_2.ogg
sounds/weapons/note_block_3.ogg
sounds/weapons/note_block_4.ogg
sounds/weapons/observer.ogg
sounds/weapons/observer_1.ogg
sounds/weapons/observer_2.ogg
sounds/weapons/observer_3.ogg
sounds/weapons/rail.ogg
sounds/weapons/rail_1.ogg
sounds/weapons/rail_2.ogg
sounds/weapons/respawn_anchor.ogg
sounds/weapons/rotten_flesh.ogg
sounds/weapons/rotten_flesh_1.ogg
sounds/weapons/rotten_flesh_2.ogg
sounds/weapons/rotten_flesh_3.ogg
sounds/weapons/shoot.ogg
sounds/weapons/shoot_1.ogg
sounds/weapons/shoot_2.ogg
sounds/weapons/shoot_3.ogg
sounds/weapons/shoot_4.ogg
sounds/weapons/shulker_box.ogg
sounds/weapons/slime.ogg
sounds/weapons/slime_1.ogg
sounds/weapons/slime_2.ogg
sounds/weapons/snowball.ogg
sounds/weapons/snowball_1.ogg
sounds/weapons/snowball_2.ogg
sounds/weapons/snowball_3.ogg
sounds/weapons/snowball_4.ogg
sounds/weapons/tnt.ogg
sounds/weapons/totem_of_undying.ogg
sounds/weapons/trident.ogg
sounds/weapons/trident_1.ogg
sounds/weapons/trident_2.ogg
sounds/weapons/turtle_scute.ogg
sounds/weapons/water_bucket.ogg
sounds/weapons/water_bucket_1.ogg
sounds/weapons/water_bucket_2.ogg
sounds/weapons/water_bucket_3.ogg
sounds/weapons/written_book.ogg
sounds/weapons/written_book_1.ogg
sounds/weapons/written_book_2.ogg
sounds/weapons/written_book_3.ogg
sounds/weapons/blaze_shoot.ogg
sounds/weapons/fire_charge.ogg
sounds/weapons/ghast_shoot.ogg
sounds/weapons/magma_jump_1.ogg
sounds/weapons/magma_jump_2.ogg
sounds/weapons/guardian_attack.ogg
sounds/weapons/guardian_hurt.ogg
sounds/weapons/arrow_shoot.ogg
sounds/weapons/crossbow_shoot_1.ogg
sounds/weapons/crossbow_shoot_2.ogg
sounds/weapons/egg_throw.ogg
sounds/weapons/potion_throw.ogg
sounds/weapons/shulker_shoot.ogg
sounds/weapons/enchantment.ogg
sounds/weapons/beacon_activate.ogg
sounds/weapons/dragon_growl_1.ogg
sounds/weapons/dragon_growl_2.ogg
sounds/weapons/wither_ambient.ogg
sounds/weapons/evoker_attack.ogg
sounds/weapons/evoker_summon.ogg
sounds/weapons/creeper_primed.ogg
sounds/weapons/tnt_primed.ogg
sounds/weapons/iron_golem_attack_1.ogg
sounds/weapons/iron_golem_attack_2.ogg
sounds/weapons/slime_jump_1.ogg
sounds/weapons/slime_jump_2.ogg
sounds/weapons/spider_ambient.ogg
sounds/effects/snow_break_1.ogg
sounds/effects/snow_break_2.ogg
sounds/effects/thunder_extra_1.ogg
sounds/effects/thunder_extra_2.ogg
sounds/impact/shulker_hit.ogg
sounds/impact/anvil_break.ogg
sounds/impact/lightning_impact_1.ogg
sounds/impact/lightning_impact_2.ogg
sounds/impact/crit_1.ogg
sounds/impact/crit_2.ogg
sounds/impact/knockback_1.ogg
sounds/impact/knockback_2.ogg
`));

  const KNOWN_SPRITE_ASSETS = buildAssetLookup(parseAssetManifest(`
sprites/hud/beehive_front.png
sprites/hud/blaze_rod.png
sprites/hud/bone_meal.png
sprites/hud/crying_obsidian.png
sprites/hud/elytra.png
sprites/hud/ender_pearl.png
sprites/hud/experience_bottle.png
sprites/hud/fishing_rod.png
sprites/hud/flint_and_steel.png
sprites/hud/golden_apple.png
sprites/hud/hopper_minecart.png
sprites/hud/invisibility.png
sprites/hud/jack_o_lantern.png
sprites/hud/lava_bucket.png
sprites/hud/note_block.png
sprites/hud/potion.png
sprites/hud/rail.png
sprites/hud/respawn_anchor_top.png
sprites/hud/rotten_flesh.png
sprites/hud/shulker_box.png
sprites/hud/snowball.png
sprites/hud/totem_of_undying.png
sprites/hud/trident.png
sprites/hud/turtle_scute.png
sprites/hud/water_bucket.png
sprites/hud/written_book.png
sprites/projectiles/book.png
sprites/projectiles/ender_pearl.png
sprites/projectiles/experience_bottle.png
sprites/projectiles/fire_charge.png
sprites/projectiles/shulker_shell.png
sprites/projectiles/snowball.png
sprites/projectiles/trident.png
sprites/weapons/beehive_front.png
sprites/weapons/blaze_rod.png
sprites/weapons/bone_meal.png
sprites/weapons/book.png
sprites/weapons/crying_obsidian.png
sprites/weapons/echo_shard.png
sprites/weapons/elytra.png
sprites/weapons/ender_pearl.png
sprites/weapons/experience_bottle.png
sprites/weapons/fire_charge.png
sprites/weapons/fishing_rod.png
sprites/weapons/flint_and_steel.png
sprites/weapons/golden_apple.png
sprites/weapons/hopper_minecart.png
sprites/weapons/invisibility.png
sprites/weapons/jack_o_lantern.png
sprites/weapons/lava_bucket.png
sprites/weapons/minecart.png
sprites/weapons/note_block.png
sprites/weapons/potion.png
sprites/weapons/rail.png
sprites/weapons/rail_attachment.png
sprites/weapons/respawn_anchor_top.png
sprites/weapons/rotten_flesh.png
sprites/weapons/shulker_box.png
sprites/weapons/shulker_shell.png
sprites/weapons/skeleton_head.svg
sprites/weapons/snowball.png
sprites/weapons/totem_of_undying.png
sprites/weapons/trident.png
sprites/weapons/turtle_scute.png
sprites/weapons/water_bucket.png
sprites/weapons/written_book.png
sprites/weapons/zombie_head.svg
sprites/weapons/boat.svg
sprites/zones/amethyst_block.png
sprites/zones/cracked_stone_bricks.png
sprites/zones/crying_obsidian.png
sprites/zones/fire_0.png
sprites/zones/flowering_azalea_top.png
sprites/zones/glowstone.png
sprites/zones/grass_block_top.png
sprites/zones/honey_block_top.png
sprites/zones/lava_still.png
sprites/zones/nether_portal.png
sprites/zones/obsidian.png
sprites/zones/packed_ice.png
sprites/zones/red_mushroom_block.png
sprites/zones/respawn_anchor_top.png
sprites/zones/sculk.png
sprites/zones/slime_block.png
sprites/zones/water_overlay.png
sprites/zones/water_still.png
`));

  function mergeSoundNames(...groups) {
    return [...new Set(groups.flat().filter(Boolean))];
  }

  const SPRITE_SOURCE_ALIASES = {
    bucketIce: ["water_bucket", "snowball"],
    bucketLava: ["lava_bucket", "fire_charge"],
    wagon: ["minecart", "hopper_minecart"],
    boatHull: ["boat"],
    hudRail: ["rail"],
    hudBoat: ["boat"],
    hudFishingRod: ["fishing_rod"],
    hudTrident: ["trident"],
    hudWaterBucket: ["water_bucket"],
    hudLavaBucket: ["lava_bucket"],
    hudSnowball: ["snowball"],
    hudFlintSteel: ["flint_and_steel"],
    hudExpBottle: ["experience_bottle"],
    hudTotem: ["totem_of_undying"],
    hudHopperMinecart: ["hopper_minecart"],
    hudBeehive: ["beehive_front"],
    hudNoteBlock: ["note_block"],
    hudShulkerBox: ["shulker_box"],
    hudRespawnAnchor: ["respawn_anchor_top"],
    hudEnderPearl: ["ender_pearl"],
    hudCryingObsidian: ["crying_obsidian"],
    hudBlazeRod: ["blaze_rod"],
    hudRottenFlesh: ["rotten_flesh"],
    hudJackOLantern: ["jack_o_lantern"],
    hudBoneMeal: ["bone_meal"],
    hudBookQuill: ["written_book"],
    hudGoldenApple: ["golden_apple"],
    hudInvisPotion: ["invisibility"],
    hudGravityPotion: ["potion"],
    hudTurtlePotion: ["turtle_scute"],
    projectileIce: ["snowball"],
    projectileLava: ["fire_charge"],
    projectileHook: ["fishing_rod"],
    projectilePearl: ["ender_pearl"],
    projectileSnow: ["snowball"],
    projectileFireball: ["fire_charge"],
    projectileXpBottle: ["experience_bottle"],
    projectileShulkerBolt: ["shulker_shell"],
    projectileEcho: ["echo_shard"],
    flintSteel: ["flint_and_steel"],
    expBottle: ["experience_bottle"],
    totem: ["totem_of_undying"],
    beehive: ["beehive_front"],
    respawnAnchor: ["respawn_anchor_top"],
    bookQuill: ["written_book"],
    invisPotion: ["invisibility"],
    turtlePotion: ["turtle_scute"],
  };

  const ZONE_TEXTURE_SPRITES = {
    water: "zoneWater",
    lava: "zoneLava",
    ice: "zoneIce",
    fire: "zoneFire",
    cry: "zoneCryingObsidian",
    obsidian: "zoneObsidian",
    honey: "zoneHoney",
    steam: "zoneSteam",
    void: "zoneVoid",
    gravity: "zoneGravity",
    light: "zoneLight",
    plants: "zonePlantsGrass",
    radiation: "zoneRadiation",
    totemAura: "zoneTotemAura",
    quake: "zoneQuake",
  };

  const ZONE_TILE_PATTERN_CACHE = new Map();
  function getZonePattern(zoneTexture, tileSize) {
    if (!zoneTexture) {
      return null;
    }
    const cacheKey = `${zoneTexture.src}::${Math.round(tileSize)}`;
    if (ZONE_TILE_PATTERN_CACHE.has(cacheKey)) {
      return ZONE_TILE_PATTERN_CACHE.get(cacheKey);
    }
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = tileSize;
    patternCanvas.height = tileSize;
    const patternCtx = patternCanvas.getContext("2d");
    if (!patternCtx) {
      return null;
    }
    patternCtx.imageSmoothingEnabled = false;
    patternCtx.drawImage(zoneTexture, 0, 0, tileSize, tileSize);
    const pattern = patternCtx.createPattern(patternCanvas, "repeat");
    ZONE_TILE_PATTERN_CACHE.set(cacheKey, pattern);
    return pattern;
  }

  const SOUND_VARIANTS = {
    shoot: ["shoot", "shoot_1", "shoot_2", "shoot_3", "shoot_4"],
    hit: ["hit", "hit_1", "hit_2", "hit_3", "hit_4", "hit_5", "hit_6", "crit_1", "crit_2", "knockback_1", "knockback_2"],
    wall: ["wall_1", "wall_2", "wall_3", "wall_4", "wall_5"],
    wallSoft: ["wall_soft_1", "wall_soft_2", "wall_soft_3", "wall_soft_4", "wall_soft_5"],
    ball: ["ball_1", "ball_2", "ball_3", "ball_4"],
    thunder: ["thunder_1", "thunder_2", "thunder_3", "thunder_extra_1", "thunder_extra_2"],
    bookLaser: ["book_laser_1", "book_laser_2", "book_laser_3"],
    bookLightning: ["book_lightning_1", "book_lightning_2", "book_lightning_3", "thunder_1", "thunder_2", "thunder_3", "lightning_impact_1", "lightning_impact_2"],
    bookQuake: ["book_quake_1", "book_quake_2", "thunder_2", "thunder_3"],
  };

  const ELEMENT_SOUND_VARIANTS = {
    fire: ["burn_1", "burn_2", "ignite_1", "ignite_2", "fire", "flint_and_steel", "blaze_rod", "blaze_rod_1", "blaze_rod_2", "jack_o_lantern", "jack_o_lantern_1", "blaze_shoot", "fire_charge", "ghast_shoot"],
    lava: ["lava_burst_1", "lava_burst_2", "lava_sizzle_1", "lava_sizzle_2", "lava", "lava_bucket", "lava_bucket_1", "lava_bucket_2", "lava_bucket_3", "fire", "magma_jump_1", "magma_jump_2"],
    water: ["water_splash_1", "water_splash_2", "water_splash_3", "water", "water_bucket", "water_bucket_1", "water_bucket_2", "water_bucket_3", "boat_3", "boat_4", "guardian_attack", "guardian_hurt"],
    ice: ["ice_crack_1", "ice_crack_2", "ice_crack_3", "ice", "snowball", "snowball_1", "snowball_2", "snowball_3", "snowball_4", "turtle_scute", "snow_break_1", "snow_break_2"],
    ender: ["ender_blink_1", "ender_blink_2", "ender_blink_3", "ender_pearl", "ender_pearl_1", "ender_pearl_2", "teleport", "respawn_anchor", "crying_obsidian_2", "shulker_box", "shulker_shoot"],
    magic: ["magic_pop_1", "magic_pop_2", "magic_pop_3", "magic", "experience_bottle", "written_book", "invisibility", "gravity", "totem_of_undying", "book_laser_1", "book_lightning_1", "book_quake_1", "enchantment", "beacon_activate", "dragon_growl_1", "dragon_growl_2", "wither_ambient", "evoker_attack", "evoker_summon"],
    nature: ["nature_buzz_1", "nature_buzz_2", "nature_buzz_3", "nature", "beehive", "beehive_1", "beehive_2", "beehive_3", "beehive_4", "bone_meal", "bone_meal_1", "bone_meal_2", "bone_meal_3", "bone_meal_4", "rotten_flesh", "rotten_flesh_1", "spider_ambient"],
    metal: ["metal_clang_1", "metal_clang_2", "metal_clang_3", "metal", "rail", "rail_1", "rail_2", "rail_3", "hopper_minecart", "observer", "observer_1", "observer_2", "observer_3", "trident", "trident_1", "trident_2", "iron_golem_attack_1", "iron_golem_attack_2", "anvil_break"],
    wood: ["wood_thud_1", "wood_thud_2", "boat", "boat_1", "boat_2", "boat_3", "boat_4", "fishing_rod", "fishing_rod_1", "fishing_rod_2", "fishing_rod_3", "fishing_rod_4", "arrow_shoot", "crossbow_shoot_1", "crossbow_shoot_2", "egg_throw", "potion_throw"],
    slime: ["slime_splat_1", "slime_splat_2", "slime", "slime_1", "slime_2", "slime_jump_1", "slime_jump_2"],
    explosion: ["explosion_1", "explosion_2", "explosion_3", "tnt", "respawn_anchor", "creeper_primed", "tnt_primed"],
  };

  const IMPACT_SOUND_ALIASES = {
    fire: mergeSoundNames(ELEMENT_SOUND_VARIANTS.fire, ["jack_o_lantern", "jack_o_lantern_1"]),
    lava: mergeSoundNames(ELEMENT_SOUND_VARIANTS.lava, ELEMENT_SOUND_VARIANTS.fire),
    water: mergeSoundNames(ELEMENT_SOUND_VARIANTS.water, ["boat_3", "boat_4"]),
    ice: mergeSoundNames(ELEMENT_SOUND_VARIANTS.ice, ["turtle_scute"]),
    ender: mergeSoundNames(ELEMENT_SOUND_VARIANTS.ender, ["shulker_box", "crying_obsidian", "crying_obsidian_1", "crying_obsidian_3"]),
    magic: mergeSoundNames(ELEMENT_SOUND_VARIANTS.magic, ["book_laser_1", "book_lightning_1", "book_quake_1"]),
    nature: mergeSoundNames(ELEMENT_SOUND_VARIANTS.nature, ["rotten_flesh", "rotten_flesh_1"], ELEMENT_SOUND_VARIANTS.slime),
    metal: mergeSoundNames(ELEMENT_SOUND_VARIANTS.metal, ["observer_1", "observer_2", "observer_3"]),
    wood: [...ELEMENT_SOUND_VARIANTS.wood],
    slime: [...ELEMENT_SOUND_VARIANTS.slime],
    explosion: [...ELEMENT_SOUND_VARIANTS.explosion],
    hit: [...SOUND_VARIANTS.hit],
  };

  const COLLISION_SOUND_ALIASES = {
    wall: [...SOUND_VARIANTS.wallSoft],
    wallMetal: [...SOUND_VARIANTS.wallSoft, ...SOUND_VARIANTS.wall],
    ball: [...SOUND_VARIANTS.ball],
  };

  const SPECIAL_SOUND_ALIASES = {
    uiClick: ["click"],
    uiSelect: ["select"],
    roundStart: ["round_start"],
    victory: ["victory"],
    death: ["death"],
    countdown: ["countdown"],
    charge: ["charge"],
    combo: ["combo"],
    spawn: ["spawn"],
    thunder: [...SOUND_VARIANTS.thunder],
    bookLaser: [...SOUND_VARIANTS.bookLaser],
    bookLightning: [...SOUND_VARIANTS.bookLightning],
    bookQuake: [...SOUND_VARIANTS.bookQuake],
  };

  const WEAPON_SOUND_ALIASES = {
    rail: ["rail", "rail_1", "rail_2"],
    hopperMinecart: ["hopper_minecart", "rail_2", "rail_1", "rail"],
    pacifist: ["shoot", "shoot_1", "shoot_2", "shoot_3", "shoot_4"],
    fishingRod: ["fishing_rod", "fishing_rod_1", "fishing_rod_2", "fishing_rod_3", "fishing_rod_4"],
    loyaltyTrident: ["trident", "trident_1", "trident_2"],
    waterBucket: ["water_bucket", "water_bucket_1", "water_bucket_2", "water_bucket_3"],
    lavaBucket: ["lava_bucket", "lava_bucket_1", "lava_bucket_2", "lava_bucket_3"],
    snowball: ["snowball", "snowball_1", "snowball_2", "snowball_3", "snowball_4"],
    slimePiston: ["slime", "slime_1", "slime_2", "slime_splat_1", "slime_splat_2"],
    observer: ["observer", "observer_1", "observer_2", "observer_3"],
    noteBlock: ["note_block", "note_block_1", "note_block_2", "note_block_3", "note_block_4"],
    shulkerBox: ["shulker_box", "ender_blink_1", "ender_pearl"],
    blazeRod: ["blaze_rod", "blaze_rod_1", "blaze_rod_2", "blaze_rod_3", "blaze_rod_4"],
    expBottle: ["experience_bottle"],
    enderPearl: ["ender_pearl", "ender_pearl_1", "ender_pearl_2"],
    gravityPotion: ["gravity", "magic_pop_1", "magic_pop_2"],
  };

  const WEAPON_ATTACHMENT_SPRITES = {
    fishingRod: "fishingRod",
    loyaltyTrident: "trident",
    waterBucket: "waterBucket",
    lavaBucket: "bucketLava",
    snowball: "snowball",
    flintSteel: "flintSteel",
    expBottle: "expBottle",
    totem: "totem",
    hopperMinecart: "hopperMinecart",
    tnt: "tnt",
    beehive: "beehive",
    noteBlock: "noteBlock",
    shulkerBox: "shulkerBox",
    respawnAnchor: "respawnAnchor",
    enderPearl: "enderPearl",
    cryingObsidian: "cryingObsidian",
    blazeRod: "blazeRod",
    rottenFlesh: "rottenFlesh",
    jackOLantern: "jackOLantern",
    boneMeal: "boneMeal",
    bookQuill: "bookQuill",
    elytra: "elytra",
    goldenApple: "goldenApple",
    invisPotion: "invisPotion",
    gravityPotion: "gravityPotion",
    turtlePotion: "turtlePotion",
  };

  const PROJECTILE_SPRITE_KEYS = {
    lava: "projectileLava",
    ice: "projectileIce",
    trident: "projectileTrident",
    hook: "projectileHook",
    pearl: "projectilePearl",
    snow: "projectileSnow",
    fireball: "projectileFireball",
    "book-shot": "projectileBook",
    "xp-bottle": "projectileXpBottle",
    "shulker-bolt": "projectileShulkerBolt",
    echo: "projectileEcho",
  };

  function getWeaponAttachmentSpriteKey(id) {
    return WEAPON_ATTACHMENT_SPRITES[id] || null;
  }

  function getProjectileSpriteKey(kind) {
    return PROJECTILE_SPRITE_KEYS[kind] || null;
  }

  function drawWeaponAttachmentSprite(game, ctx, weaponId, x, y, width, height, options = {}) {
    const key = getWeaponAttachmentSpriteKey(weaponId);
    if (key && game && game.drawSprite(ctx, key, x, y, width, height, options)) {
      return true;
    }
    return drawProceduralWeaponSprite(ctx, weaponId, x, y, width, height, options);
  }

  function fillPixelRect(ctx, left, top, unit, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(left + x * unit, top + y * unit, width * unit, height * unit);
  }

  function drawProceduralWeaponSprite(ctx, weaponId, x, y, width, height, options = {}) {
    const supported = new Set(["boat", "tnt", "slimePiston", "observer"]);
    if (!supported.has(weaponId)) {
      return false;
    }
    ctx.save();
    ctx.globalAlpha = options.alpha ?? 1;
    ctx.translate(x, y);
    if (options.rotation) {
      ctx.rotate(options.rotation);
    }
    const prevSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    const unit = Math.max(2, Math.floor(Math.min(width, height) / 16));
    const left = -Math.floor((unit * 16) / 2);
    const top = -Math.floor((unit * 16) / 2);

    if (weaponId === "boat") {
      fillPixelRect(ctx, left, top, unit, 2, 10, 12, 2, "#6d4524");
      fillPixelRect(ctx, left, top, unit, 3, 8, 10, 2, "#8e6339");
      fillPixelRect(ctx, left, top, unit, 4, 6, 8, 2, "#a47746");
      fillPixelRect(ctx, left, top, unit, 1, 9, 1, 3, "#4d3118");
      fillPixelRect(ctx, left, top, unit, 14, 9, 1, 3, "#4d3118");
      fillPixelRect(ctx, left, top, unit, 11, 3, 3, 3, "#7cc6ff");
      fillPixelRect(ctx, left, top, unit, 11, 2, 3, 1, "#dff8ff");
      fillPixelRect(ctx, left, top, unit, 10, 6, 4, 1, "#3d2a16");
    } else if (weaponId === "tnt") {
      fillPixelRect(ctx, left, top, unit, 2, 2, 12, 12, "#b63a2d");
      fillPixelRect(ctx, left, top, unit, 2, 6, 12, 2, "#f0ece7");
      fillPixelRect(ctx, left, top, unit, 3, 8, 10, 3, "#6d3c33");
      fillPixelRect(ctx, left, top, unit, 4, 9, 2, 1, "#ece5d4");
      fillPixelRect(ctx, left, top, unit, 7, 9, 2, 1, "#ece5d4");
      fillPixelRect(ctx, left, top, unit, 10, 9, 2, 1, "#ece5d4");
    } else if (weaponId === "slimePiston") {
      fillPixelRect(ctx, left, top, unit, 2, 5, 4, 6, "#5d4a35");
      fillPixelRect(ctx, left, top, unit, 6, 6, 4, 4, "#9d7751");
      fillPixelRect(ctx, left, top, unit, 10, 4, 4, 8, "#6fc96f");
      fillPixelRect(ctx, left, top, unit, 11, 5, 2, 6, "#99f19a");
      fillPixelRect(ctx, left, top, unit, 9, 4, 1, 8, "#3f8d43");
      fillPixelRect(ctx, left, top, unit, 14, 4, 1, 8, "#3f8d43");
    } else if (weaponId === "observer") {
      fillPixelRect(ctx, left, top, unit, 2, 2, 12, 12, "#8f959d");
      fillPixelRect(ctx, left, top, unit, 3, 3, 10, 2, "#bfc5cd");
      fillPixelRect(ctx, left, top, unit, 3, 5, 10, 6, "#787e87");
      fillPixelRect(ctx, left, top, unit, 4, 6, 3, 3, "#e8edf1");
      fillPixelRect(ctx, left, top, unit, 9, 7, 2, 2, "#21252c");
      fillPixelRect(ctx, left, top, unit, 11, 11, 1, 1, "#cf4f4f");
      fillPixelRect(ctx, left, top, unit, 12, 11, 1, 1, "#6a1f1f");
    }

    ctx.imageSmoothingEnabled = prevSmoothing;
    ctx.restore();
    return true;
  }

  function getZoneTextureSpriteKey(kind, data = null) {
    if (kind === "plants" && data && data.plantType === "mushroom") {
      return "zonePlantsMushroom";
    }
    if (kind === "plants" && data && data.plantType === "flower") {
      return "zonePlantsFlower";
    }
    return ZONE_TEXTURE_SPRITES[kind] || null;
  }

    function buildAssetCandidates(name, explicit = []) {
      const generated = [];
      for (const folder of CUSTOM_ASSET_FOLDERS) {
        for (const ext of CUSTOM_ASSET_EXTENSIONS) {
          generated.push(resolveAssetUrl(`${folder}/${name}${ext}`));
        }
      }
      return [...explicit.map(normalizeMediaCandidate), ...generated];
    }

    function buildSpriteCandidates(name, explicit = []) {
      const aliases = SPRITE_SOURCE_ALIASES[name] || [];
      const explicitCandidates = explicit
        .map((candidate) => normalizeMediaCandidate(candidate))
        .filter((candidate) => {
          if (/^(?:[a-z]+:|\/)/i.test(candidate)) {
            return true;
          }
          return KNOWN_SPRITE_ASSETS.pathSet.has(normalizeRepoAssetPath(candidate));
        });
      const generatedAliases = aliases.flatMap((alias) => KNOWN_SPRITE_ASSETS.byName.get(alias) || []);
      const direct = KNOWN_SPRITE_ASSETS.byName.get(name) || [];
      return [...new Set([...explicitCandidates, ...generatedAliases, ...direct])];
    }

    function buildSoundCandidates(name, explicit = []) {
      const explicitCandidates = explicit
        .map((candidate) => normalizeMediaCandidate(candidate))
        .filter((candidate) => {
          if (/^(?:[a-z]+:|\/)/i.test(candidate)) {
            return true;
          }
          return KNOWN_SOUND_ASSETS.pathSet.has(normalizeRepoAssetPath(candidate));
        });
      const direct = KNOWN_SOUND_ASSETS.byName.get(name) || [];
      return [...new Set([...explicitCandidates, ...direct])];
    }

    const AUDIO = {
      ctx: null,
      recordingDestination: null,
      musicBus: null,
      musicState: null,
      sampleCache: new Map(),
      lastSampleIndex: new Map(),
      loadingSamples: new Set(),
      failedSamples: new Set(),
      recentPlays: new Map(),
      audioUnsupportedWarned: false,
      init() {
        if (this.ctx) {
          return;
        }
        try {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          this.ctx = new Ctx({
            latencyHint: "interactive",
            sampleRate: 48000,
          });
          this.recordingDestination = this.ctx.createMediaStreamDestination();
        } catch (e) {
          if (!this.audioUnsupportedWarned) {
            this.audioUnsupportedWarned = true;
            console.warn("Audio not supported");
          }
        }
      },
      ensureRecordingDestination() {
        if (!this.ctx) {
          this.init();
        }
        if (this.ctx && !this.recordingDestination) {
          this.recordingDestination = this.ctx.createMediaStreamDestination();
        }
        return this.recordingDestination;
      },
      resume() {
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume();
        }
      },
      ensureMusicBus() {
        if (!this.ctx) {
          this.init();
        }
        if (!this.ctx) {
          return null;
        }
        if (!this.musicBus) {
          this.musicBus = this.ctx.createGain();
          this.musicBus.gain.value = 0.18;
          this.musicBus.connect(this.ctx.destination);
          if (this.recordingDestination) {
            this.musicBus.connect(this.recordingDestination);
          }
        }
        if (!this.musicState) {
          this.musicState = {
            nextPadAt: 0,
            nextBellAt: 0,
            root: 196,
          };
        }
        return this.musicBus;
      },
      ambientTick() {
        if (!this.ctx || this.ctx.state !== "running") {
          return;
        }
        const bus = this.ensureMusicBus();
        if (!bus || !this.musicState) {
          return;
        }
        const now = this.ctx.currentTime;
        if (now >= this.musicState.nextPadAt) {
          this.playAmbientPad(now);
          this.musicState.nextPadAt = now + randomRange(4.8, 6.9);
        }
        if (now >= this.musicState.nextBellAt) {
          this.playAmbientBell(now);
          this.musicState.nextBellAt = now + randomRange(2.8, 4.5);
        }
      },
      playAmbientPad(when) {
        if (!this.ctx || !this.musicBus) {
          return;
        }
        const roots = [130.81, 146.83, 174.61, 196.0, 220.0];
        const root = roots[randomInt(0, roots.length - 1)];
        this.musicState.root = root;
        const chord = [root, root * 1.25, root * 1.5];
        for (const freq of chord) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.value = freq;
          osc.detune.value = randomRange(-4, 4);
          gain.gain.setValueAtTime(0.0001, when);
          gain.gain.linearRampToValueAtTime(0.045, when + 1.2);
          gain.gain.linearRampToValueAtTime(0.0001, when + 4.8);
          osc.connect(gain);
          gain.connect(this.musicBus);
          osc.start(when);
          osc.stop(when + 5.1);
        }
      },
      playAmbientBell(when) {
        if (!this.ctx || !this.musicBus || !this.musicState) {
          return;
        }
        const root = this.musicState.root || 196;
        const melody = [1, 1.125, 1.25, 1.5, 2];
        const freq = root * melody[randomInt(0, melody.length - 1)];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, when);
        gain.gain.linearRampToValueAtTime(0.028, when + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, when + 1.8);
        osc.connect(gain);
        gain.connect(this.musicBus);
        osc.start(when);
        osc.stop(when + 2);
      },
      nowMs() {
        return typeof performance !== "undefined" && typeof performance.now === "function"
          ? performance.now()
          : Date.now();
      },
      allowBurst(key, minIntervalMs = 0) {
        if (!minIntervalMs) {
          return true;
        }
        const now = this.nowMs();
        const previous = this.recentPlays.get(key) || 0;
        if (now - previous < minIntervalMs) {
          return false;
        }
        this.recentPlays.set(key, now);
        return true;
      },
      ensureSample(key, aliases = []) {
        if (this.sampleCache.has(key) || this.failedSamples.has(key) || this.loadingSamples.has(key)) {
          return;
        }
        const names = [...new Set(aliases.length ? aliases : [key])];
        if (!names.length) {
          this.failedSamples.add(key);
          return;
        }
        this.loadingSamples.add(key);
        const loadedSamples = [];
        let settled = 0;
        const finalize = () => {
          settled += 1;
          if (loadedSamples.length) {
            this.sampleCache.set(key, [...loadedSamples]);
          }
          if (settled < names.length) {
            return;
          }
          this.loadingSamples.delete(key);
          if (!loadedSamples.length) {
            this.failedSamples.add(key);
          }
        };
        const tryLoadName = (name, queue = buildSoundCandidates(name)) => {
          if (!queue.length) {
            finalize();
            return;
          }
          const source = queue.shift();
          const loadWithElement = () => {
            const audio = new Audio();
            let done = false;
            const resolveAudio = () => {
              if (done) {
                return;
              }
              done = true;
              loadedSamples.push({ type: "element", element: audio });
              finalize();
            };
            audio.preload = "auto";
            audio.addEventListener("canplaythrough", resolveAudio, { once: true });
            audio.addEventListener("loadeddata", resolveAudio, { once: true });
            audio.addEventListener("error", () => tryLoadName(name, queue), { once: true });
            audio.src = source;
            audio.load();
          };

          if (this.ctx && typeof fetch === "function") {
            fetch(source)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}`);
                }
                return response.arrayBuffer();
              })
              .then((buffer) => this.ctx.decodeAudioData(buffer.slice(0)))
              .then((decoded) => {
                loadedSamples.push({ type: "buffer", buffer: decoded });
                finalize();
              })
              .catch(() => {
                loadWithElement();
              });
            return;
          }

          loadWithElement();
        };
        for (const name of names) {
          tryLoadName(name);
        }
      },
      playLoadedSample(key, options = {}) {
        const samples = this.sampleCache.get(key);
        if (!samples || !samples.length) {
          return false;
        }
        try {
          let index = 0;
          if (samples.length > 1) {
            const lastIndex = this.lastSampleIndex.get(key);
            index = Math.floor(Math.random() * samples.length);
            if (!options.allowRepeat && samples.length > 1) {
              for (let attempt = 0; attempt < 6 && index === lastIndex; attempt += 1) {
                index = Math.floor(Math.random() * samples.length);
              }
            }
          }
          this.lastSampleIndex.set(key, index);
          const pitchJitter = options.pitchJitter ?? 0;
          const playbackRate = options.playbackRate ?? 1;
          const jitteredPlayback = clamp(playbackRate * (pitchJitter ? randomRange(1 - pitchJitter, 1 + pitchJitter) : 1), 0.6, 1.7);
          const base = samples[index];
          if (base && base.type === "buffer" && base.buffer && this.ctx) {
            const sourceNode = this.ctx.createBufferSource();
            const gain = this.ctx.createGain();
            sourceNode.buffer = base.buffer;
            sourceNode.playbackRate.value = jitteredPlayback;
            gain.gain.setValueAtTime(clamp(options.volume ?? 0.55, 0, 1), this.ctx.currentTime);
            sourceNode.connect(gain);
            gain.connect(this.ctx.destination);
            if (this.recordingDestination) {
              gain.connect(this.recordingDestination);
            }
            sourceNode.start();
            return true;
          }
          const instance = (base && base.element ? base.element : base).cloneNode();
          instance.volume = clamp(options.volume ?? 0.55, 0, 1);
          instance.playbackRate = jitteredPlayback;
          instance.preservesPitch = false;
          if (this.ctx) {
            instance.muted = true;
            const sourceNode = this.ctx.createMediaElementSource(instance);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(clamp(options.volume ?? 0.55, 0, 1), this.ctx.currentTime);
            sourceNode.connect(gain);
            gain.connect(this.ctx.destination);
            if (this.recordingDestination) {
              gain.connect(this.recordingDestination);
            }
          }
          const playPromise = instance.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
          }
          return true;
        } catch (error) {
          return false;
        }
      },
      getSampleDuration(key, options = {}) {
        const samples = this.sampleCache.get(key);
        if (!samples || !samples.length) {
          return 0;
        }
        const index = Math.min(this.lastSampleIndex.get(key) || 0, samples.length - 1);
        const base = samples[index];
        const playbackRate = options.playbackRate ?? 1;
        const pitchJitter = options.pitchJitter ?? 0;
        const safeRate = clamp(playbackRate * (pitchJitter ? 1 - pitchJitter : 1), 0.6, 1.7);
        if (base && base.type === "buffer" && base.buffer && typeof base.buffer.duration === "number") {
          return base.buffer.duration / safeRate;
        }
        const element = base && base.type === "element" && base.element ? base.element : base;
        if (element && typeof element.duration === "number" && !Number.isNaN(element.duration) && element.duration > 0) {
          return element.duration / safeRate;
        }
        return 0;
      },
      playTone(freq, duration, type = "sine", volume = 0.15) {
        if (!this.ctx) {
          return;
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.recordingDestination) {
          gain.connect(this.recordingDestination);
        }
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      },
      playSweep(startFreq, endFreq, duration, type = "sine", volume = 0.12) {
        if (!this.ctx) {
          return;
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(1, startFreq), this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.recordingDestination) {
          gain.connect(this.recordingDestination);
        }
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      },
      playNoise(duration, volume = 0.1) {
        if (!this.ctx) {
          return;
        }
        const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let index = 0; index < bufferSize; index += 1) {
          data[index] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        source.buffer = buffer;
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.recordingDestination) {
          gain.connect(this.recordingDestination);
        }
        source.start();
      },
      playNamed(key, aliases, fallback, options = {}) {
        this.init();
        this.resume();
        if (!this.allowBurst(key, options.throttleMs || 0)) {
          return;
        }
        this.ensureSample(key, aliases);
        if (this.playLoadedSample(key, options)) {
          return;
        }
        fallback.call(this);
      },
      uiClick() {
        this.playNamed("ui:click", ["ui_click", ...SPECIAL_SOUND_ALIASES.uiClick], () => {
          this.playTone(880, 0.05, "square", 0.06);
        }, { volume: 0.3, throttleMs: 40, pitchJitter: 0.03 });
      },
      uiSelect() {
        this.playNamed("ui:select", ["ui_select", ...SPECIAL_SOUND_ALIASES.uiSelect], () => {
          this.playTone(660, 0.08, "triangle", 0.09);
        }, { volume: 0.34, throttleMs: 55, pitchJitter: 0.03 });
      },
      shoot() {
        this.playNamed("weapon:default", [...SOUND_VARIANTS.shoot], () => {
          this.playTone(440, 0.12, "square", 0.08);
        }, { volume: 0.45, throttleMs: 70, pitchJitter: 0.04 });
      },
      hit() {
        this.playNamed("impact:hit", IMPACT_SOUND_ALIASES.hit, () => {
          this.playTone(220, 0.08, "sawtooth", 0.14);
        }, { volume: 0.48, throttleMs: 35, pitchJitter: 0.05 });
      },
      charge() {
        this.playNamed("charge:default", SPECIAL_SOUND_ALIASES.charge, () => {
          this.playSweep(280, 520, 0.16, "triangle", 0.06);
        }, { volume: 0.35, throttleMs: 90, pitchJitter: 0.04 });
      },
      combo() {
        this.playNamed("combo", SPECIAL_SOUND_ALIASES.combo, () => {
          this.playTone(550, 0.1, "triangle", 0.1);
          this.playTone(740, 0.08, "triangle", 0.07);
        }, { volume: 0.45, throttleMs: 120, pitchJitter: 0.04 });
      },
      totems() {
        this.playNamed("magic:totem", ["totem", "beacon_activate", "enchantment"], () => {
          this.playTone(440, 0.3, "sine", 0.12);
          this.playTone(660, 0.3, "sine", 0.09);
        }, { volume: 0.5, throttleMs: 160 });
      },
      teleport() {
        this.playNamed("magic:teleport", ["teleport", "ender"], () => {
          this.playSweep(1240, 760, 0.16, "sine", 0.07);
          this.playTone(800, 0.08, "triangle", 0.07);
        }, { volume: 0.46, throttleMs: 110 });
      },
      fire() {
        this.playNamed("element:fire", IMPACT_SOUND_ALIASES.fire, () => {
          this.playNoise(0.16, 0.08);
          this.playSweep(240, 150, 0.18, "sawtooth", 0.07);
        }, { volume: 0.44, throttleMs: 45 });
      },
      ice() {
        this.playNamed("element:ice", IMPACT_SOUND_ALIASES.ice, () => {
          this.playTone(1200, 0.1, "sine", 0.05);
          this.playTone(900, 0.06, "triangle", 0.04);
        }, { volume: 0.4, throttleMs: 50 });
      },
      water() {
        this.playNamed("element:water", IMPACT_SOUND_ALIASES.water, () => {
          this.playTone(200, 0.2, "sine", 0.08);
          this.playNoise(0.04, 0.03);
        }, { volume: 0.42, throttleMs: 55 });
      },
      lava() {
        this.playNamed("element:lava", IMPACT_SOUND_ALIASES.lava, () => {
          this.playSweep(180, 120, 0.22, "sawtooth", 0.09);
          this.playNoise(0.08, 0.04);
        }, { volume: 0.46, throttleMs: 55 });
      },
      electric() {
        this.playNamed("element:electric", ["electric", "zap"], () => {
          this.playTone(800, 0.08, "square", 0.06);
          this.playTone(600, 0.08, "square", 0.05);
        }, { volume: 0.42, throttleMs: 70 });
      },
      spawn() {
        this.playNamed("spawn", SPECIAL_SOUND_ALIASES.spawn, () => {
          this.playTone(440, 0.12, "sine", 0.08);
          this.playTone(550, 0.12, "sine", 0.07);
        }, { volume: 0.46, throttleMs: 95, pitchJitter: 0.04 });
      },
      death() {
        this.playNamed("death", ["lose", ...SPECIAL_SOUND_ALIASES.death], () => {
          this.playSweep(170, 72, 0.38, "sawtooth", 0.11);
        }, { volume: 0.54, throttleMs: 180, pitchJitter: 0.02 });
      },
      countdown(count) {
        this.playNamed(`countdown:${count}`, SPECIAL_SOUND_ALIASES.countdown, () => {
          this.playTone(440 + count * 110, 0.15, "sine", 0.1);
        }, { volume: 0.42, throttleMs: 120, pitchJitter: 0.03 });
      },
      roundStart() {
        this.playNamed("round:start", ["start", ...SPECIAL_SOUND_ALIASES.roundStart], () => {
          this.playTone(550, 0.16, "sine", 0.1);
          this.playTone(660, 0.16, "sine", 0.1);
        }, { volume: 0.48, throttleMs: 200, pitchJitter: 0.03 });
      },
      victory() {
        this.playNamed("victory", ["win", ...SPECIAL_SOUND_ALIASES.victory], () => {
          this.playTone(523, 0.15, "sine", 0.08);
          this.playTone(659, 0.15, "sine", 0.08);
          this.playTone(784, 0.3, "sine", 0.1);
        }, { volume: 0.55, throttleMs: 220, pitchJitter: 0.02 });
      },
      thunder(kind = "default") {
        const aliases = kind === "laser"
          ? SPECIAL_SOUND_ALIASES.bookLaser
          : kind === "quake"
            ? SPECIAL_SOUND_ALIASES.bookQuake
            : kind === "lightning"
              ? SPECIAL_SOUND_ALIASES.bookLightning
              : SPECIAL_SOUND_ALIASES.thunder;
        this.playNamed(`effect:thunder:${kind}`, aliases, () => {
          this.playNoise(kind === "quake" ? 0.28 : 0.2, 0.06);
          this.playSweep(kind === "quake" ? 180 : 320, kind === "quake" ? 72 : 120, kind === "quake" ? 0.34 : 0.24, "sawtooth", 0.09);
        }, { volume: kind === "quake" ? 0.62 : 0.54, throttleMs: kind === "quake" ? 180 : 140, pitchJitter: 0.04 });
      },
      wallCollision(kind = "wall") {
        const lower = String(kind || "wall").toLowerCase();
        const metalLike = /rail|wagon|minecart|trident|hook|observer|piston|anchor|shulker|shell/.test(lower);
        const aliases = metalLike
          ? [...COLLISION_SOUND_ALIASES.wallMetal, ...IMPACT_SOUND_ALIASES.metal]
          : COLLISION_SOUND_ALIASES.wall;
        this.playNamed(`collision:wall:${metalLike ? "metal" : "default"}`, aliases, () => {
          this.playTone(metalLike ? 140 : 95, metalLike ? 0.06 : 0.05, metalLike ? "triangle" : "sine", 0.05);
          this.playNoise(metalLike ? 0.03 : 0.022, metalLike ? 0.02 : 0.015);
        }, { volume: metalLike ? 0.24 : 0.18, throttleMs: 45, pitchJitter: 0.04 });
      },
      ballCollision(speed = 0) {
        const heavy = speed > 230;
        this.playNamed(`collision:ball:${heavy ? "heavy" : "light"}`, COLLISION_SOUND_ALIASES.ball, () => {
          this.playTone(heavy ? 210 : 290, heavy ? 0.1 : 0.07, "square", heavy ? 0.08 : 0.06);
        }, { volume: heavy ? 0.48 : 0.38, throttleMs: 55, pitchJitter: 0.06 });
      },
      bookEvent(kind = "laser") {
        if (kind === "laser") {
          this.thunder("laser");
          return;
        }
        if (kind === "lightning") {
          this.thunder("lightning");
          return;
        }
        this.thunder("quake");
      },
      impact(type = "hit") {
        const lower = String(type || "hit").toLowerCase();
        if (/explosion|blast|detonat|tnt|anchor-burst|overload/.test(lower)) {
          this.playNamed("impact:explosion", IMPACT_SOUND_ALIASES.explosion, () => {
            this.playNoise(0.12, 0.06);
            this.playSweep(220, 78, 0.26, "sawtooth", 0.08);
          }, { volume: 0.56, throttleMs: 75 });
          return;
        }
        if (/observer/.test(lower)) {
          this.playNamed("impact:observer", WEAPON_SOUND_ALIASES.observer, () => {
            this.playTone(392, 0.08, "triangle", 0.06);
            this.playTone(294, 0.06, "square", 0.04);
          }, { volume: 0.42, throttleMs: 60 });
          return;
        }
        if (/piston|slime-hit|slime-wall/.test(lower)) {
          this.playNamed("impact:piston", WEAPON_SOUND_ALIASES.slimePiston, () => {
            this.playTone(172, 0.08, "square", 0.06);
            this.playNoise(0.025, 0.02);
          }, { volume: 0.42, throttleMs: 55 });
          return;
        }
        if (/lava|burn|fire|blaze|lantern-flash|ignite|ember|scorch|flame/.test(lower)) {
          this.lava();
          return;
        }
        if (/water|storm|submerged|soak|splash|bubble|drench|flow/.test(lower)) {
          this.water();
          return;
        }
        if (/ice|snow|freeze|frost|cold|blizzard/.test(lower)) {
          this.ice();
          return;
        }
        if (/pearl|shulker|anchor|void|echo|cry|obsidian|portal/.test(lower)) {
          this.playNamed("impact:ender", IMPACT_SOUND_ALIASES.ender, () => {
            this.playSweep(980, 620, 0.14, "triangle", 0.07);
            this.playTone(540, 0.08, "sine", 0.04);
          }, { volume: 0.44, throttleMs: 55 });
          return;
        }
        if (/poison|rotten|zombie|bee|honey|plants|slime|mushroom|vine|root|spore/.test(lower)) {
          this.playNamed("impact:nature", IMPACT_SOUND_ALIASES.nature, () => {
            this.playTone(240, 0.08, "triangle", 0.06);
            this.playNoise(0.03, 0.02);
          }, { volume: 0.4, throttleMs: 60 });
          return;
        }
        if (/wood|boat|plank|hook|rod/.test(lower)) {
          this.playNamed("impact:wood", IMPACT_SOUND_ALIASES.wood, () => {
            this.playTone(180, 0.05, "triangle", 0.05);
            this.playNoise(0.025, 0.018);
          }, { volume: 0.36, throttleMs: 45 });
          return;
        }
        if (/wagon|rail|trident|hook|piston|observer|skeleton-arrow|minecart/.test(lower)) {
          this.playNamed("impact:metal", IMPACT_SOUND_ALIASES.metal, () => {
            this.playTone(196, 0.06, "square", 0.07);
            this.playTone(294, 0.08, "triangle", 0.05);
          }, { volume: 0.46, throttleMs: 45 });
          return;
        }
        if (/totem|xp|book|light|gravity|overcharge|magic|heal|regen|bless|spell/.test(lower)) {
          this.playNamed("impact:magic", IMPACT_SOUND_ALIASES.magic, () => {
            this.playTone(698, 0.08, "sine", 0.05);
            this.playTone(932, 0.1, "triangle", 0.04);
          }, { volume: 0.42, throttleMs: 55 });
          return;
        }
        this.hit();
      },
      weapon(id = "shoot") {
        const aliases = WEAPON_SOUND_ALIASES[id] || [id];
        const key = `weapon:${id}`;
        if (id === "rail" || id === "hopperMinecart") {
          this.playNamed(key, aliases, () => {
            this.playTone(196, 0.05, "square", 0.06);
            this.playTone(392, 0.12, "triangle", 0.08);
          }, { volume: 0.48, throttleMs: 90 });
          return;
        }
        if (id === "boat") {
          this.playNamed(key, aliases, () => {
            this.playTone(240, 0.08, "triangle", 0.05);
            this.playNoise(0.03, 0.02);
            this.playTone(170, 0.15, "sine", 0.05);
          }, { volume: 0.44, throttleMs: 95 });
          return;
        }
        if (id === "fishingRod") {
          this.playNamed(key, aliases, () => {
            this.playTone(880, 0.03, "square", 0.06);
            this.playSweep(520, 220, 0.08, "triangle", 0.04);
          }, { volume: 0.4, throttleMs: 70 });
          return;
        }
        if (id === "loyaltyTrident") {
          this.playNamed(key, aliases, () => {
            this.playSweep(420, 780, 0.12, "sawtooth", 0.06);
          }, { volume: 0.42, throttleMs: 80 });
          return;
        }
        if (id === "waterBucket") {
          this.playNamed(key, aliases, () => {
            this.water();
            this.playTone(320, 0.06, "triangle", 0.04);
          }, { volume: 0.46, throttleMs: 85 });
          return;
        }
        if (id === "lavaBucket" || id === "blazeRod" || id === "flintSteel" || id === "tnt") {
          this.playNamed(key, aliases, () => {
            this.lava();
          }, { volume: 0.5, throttleMs: 85 });
          return;
        }
if (id === "snowball") {
          this.playNamed(key, aliases, () => {
            this.ice();
            this.playTone(720, 0.05, "triangle", 0.04);
          }, { volume: 0.4, throttleMs: 70 });
          return;
        }
        if (id === "pacifist") {
          this.playNamed(key, aliases, () => {
            this.playTone(660, 0.06, "sine", 0.04);
          }, { volume: 0.3, throttleMs: 60 });
          return;
        }
        if (id === "totem" || id === "goldenApple" || id === "expBottle") {
          this.playNamed(key, aliases, () => {
            this.playTone(740, 0.09, "sine", 0.05);
            this.playTone(988, 0.1, "triangle", 0.04);
          }, { volume: 0.44, throttleMs: 95 });
          return;
        }
        if (id === "slimePiston") {
          this.playNamed(key, aliases, () => {
            this.playSweep(180, 110, 0.1, "square", 0.06);
            this.playTone(140, 0.08, "triangle", 0.05);
          }, { volume: 0.42, throttleMs: 75 });
          return;
        }
        if (id === "observer" || id === "noteBlock") {
          this.playNamed(key, aliases, () => {
            this.playTone(id === "noteBlock" ? 523 : 392, 0.1, "triangle", 0.07);
            if (id === "noteBlock") {
              this.playTone(659, 0.08, "triangle", 0.05);
            }
          }, { volume: 0.42, throttleMs: 90 });
          return;
        }
        if (id === "shulkerBox" || id === "respawnAnchor" || id === "enderPearl" || id === "cryingObsidian" || id === "invisPotion" || id === "gravityPotion") {
          this.playNamed(key, aliases, () => {
            this.teleport();
          }, { volume: 0.46, throttleMs: 95 });
          return;
        }
        if (id === "beehive" || id === "boneMeal" || id === "rottenFlesh") {
          this.playNamed(key, aliases, () => {
            this.playTone(260, 0.09, "triangle", 0.05);
            this.playNoise(0.04, 0.02);
          }, { volume: 0.38, throttleMs: 85 });
          return;
        }
        if (id === "jackOLantern") {
          this.playNamed(key, aliases, () => {
            this.playTone(330, 0.12, "sine", 0.05);
            this.playTone(220, 0.14, "triangle", 0.04);
          }, { volume: 0.4, throttleMs: 95 });
          return;
        }
        if (id === "bookQuill") {
          this.playNamed(key, aliases, () => {
            this.playTone(494, 0.07, "triangle", 0.05);
            this.playNoise(0.025, 0.015);
          }, { volume: 0.38, throttleMs: 80 });
          return;
        }
        if (id === "elytra" || id === "turtlePotion") {
          this.playNamed(key, aliases, () => {
            this.playSweep(360, 520, 0.14, "sine", 0.05);
          }, { volume: 0.38, throttleMs: 85 });
          return;
        }
        this.shoot();
      },
      weaponLoop(id = "rail", intensity = 1) {
        const loopIntensity = clamp(intensity, 0.2, 1);
        const aliases = id === "hopperMinecart"
          ? [...new Set([...(WEAPON_SOUND_ALIASES.hopperMinecart || []), ...(WEAPON_SOUND_ALIASES.rail || [])])]
          : (WEAPON_SOUND_ALIASES[id] || [id]);
        if (id === "rail" || id === "hopperMinecart") {
          this.playNamed(`weapon-loop:${id}`, aliases, () => {
            this.playTone(156, 0.05, "triangle", 0.045);
            this.playNoise(0.02, 0.02);
          }, { volume: 0.2 + loopIntensity * 0.12, throttleMs: 150, pitchJitter: 0.05 });
          return;
        }
        this.weapon(id);
      },
      chargeWeapon(id = "charge") {
        const aliases = WEAPON_SOUND_ALIASES[id] || [id];
        if (id === "rail" || id === "respawnAnchor") {
          this.playNamed(`charge:${id}`, aliases, () => {
            this.playSweep(240, 620, 0.2, "triangle", 0.06);
          }, { volume: 0.4, throttleMs: 120 });
          return;
        }
        if (id === "noteBlock") {
          this.playNamed(`charge:${id}`, aliases, () => {
            this.playTone(392, 0.06, "triangle", 0.05);
            this.playTone(523, 0.08, "triangle", 0.04);
          }, { volume: 0.36, throttleMs: 120 });
          return;
        }
        this.charge();
      },
    };

  const MODES = {
    MENU: "menu",
    COUNTDOWN: "countdown",
    FIGHT: "fight",
    RESULT: "result",
    TOURNAMENT_BREAK: "tournament-break",
  };

  const STATUS_PRIORITY = [
    "charging",
    "firing",
    "dashing",
    "hooked",
    "warded",
    "gliding",
    "invisible",
    "spooked",
    "marked",
    "frozen",
    "burning",
    "submerged",
    "shocked",
    "tanking",
    "anchored",
    "levitating",
    "knockback",
    "poison",
    "regen",
    "rooted",
    "silenced",
    "foreseen",
    "shielded",
    "overcharged",
    "laying",
    "normal",
    "dead",
  ];

  const TEXT = {
    title: "Ball Arena",
    ready: "READY",
    fight: "FIGHT",
    winner: "WINNER",
    draw: "DRAW",
    leftBall: "Left Ball",
    rightBall: "Right Ball",
    choose: "Choose weapons for two balls and start the battle.",
    replay: "Choose weapons for a rematch and press FIGHT again.",
    hpLeft: "Left HP",
    hpRight: "Right HP",
    names: {
      rail: "Rails",
      boat: "Boat",
    },
    statuses: {
      normal: "NORMAL",
      laying: "BUILDING",
      charging: "CHARGING",
      firing: "FIRING",
      frozen: "FROZEN",
      knockback: "KNOCKBACK",
      dashing: "DASHING",
      hooked: "HOOKED",
      burning: "BURNING",
      submerged: "SUBMERGED",
      snagged: "SNAGGED",
      shocked: "SHOCKED",
      invisible: "INVISIBLE",
      warded: "WARDED",
      gliding: "GLIDING",
      spooked: "SPOOKED",
      marked: "MARKED",
      tanking: "TANKING",
      anchored: "ANCHORED",
      levitating: "LEVITATING",
      overcharged: "OVERCHARGED",
      rooted: "ROOTED",
      poison: "POISON",
      regen: "REGEN",
      shielded: "SHIELDED",
      silenced: "DISRUPTED",
      foreseen: "FORESIGHT",
      dead: "DEAD",
    },
  };

  const GAME_WEAPON_CONFIG = window.GAME_WEAPON_CONFIG || {};

  const LEGACY_WEAPON_LIBRARY = {
    rail: {
      id: "rail",
      title: "Rails",
      description: "Lays track after wall hits and launches minecarts.",
    },
    boat: {
      id: "boat",
      title: "Boat + Buckets",
      description: "Armored hull with alternating ice and lava buckets.",
    },
  };

  if (GAME_WEAPON_CONFIG.legacyWeaponLibrary && typeof GAME_WEAPON_CONFIG.legacyWeaponLibrary === "object") {
    for (const [key, value] of Object.entries(GAME_WEAPON_CONFIG.legacyWeaponLibrary)) {
      if (!value || typeof value !== "object") {
        continue;
      }
      LEGACY_WEAPON_LIBRARY[key] = {
        ...(LEGACY_WEAPON_LIBRARY[key] || { id: key }),
        ...value,
      };
    }
  }

  // Global balance constants
  const BALANCE = GAME_WEAPON_CONFIG.balance || {};
  const GLOBAL_DAMAGE_SCALE = Number.isFinite(BALANCE.damageScale) ? BALANCE.damageScale : 1.15; // incoming damage multiplier (rebalanced for longer rounds)
  const GLOBAL_SPEED_SCALE = Number.isFinite(BALANCE.speedScale) ? BALANCE.speedScale : 1.35; // ball / projectile speed multiplier
  const GLOBAL_ADRENALINE_MULT = Number.isFinite(BALANCE.adrenalineMultiplier) ? BALANCE.adrenalineMultiplier : 1.45; // speed multiplier when adrenaline is active
  const GLOBAL_ADRENALINE_DURATION = Number.isFinite(BALANCE.adrenalineDurationSec) ? BALANCE.adrenalineDurationSec : 0.5; // seconds of adrenaline on damage
  const GLOBAL_COOLDOWN_SCALE = Number.isFinite(BALANCE.cooldownScale) ? BALANCE.cooldownScale : 0.75; // global cooldown multiplier (shortens by 25%)
  const PROJECTILE_SPRITE_SCALE = Number.isFinite(BALANCE.projectileSpriteScale) ? BALANCE.projectileSpriteScale : 1.5; // enlarge projectile sprites
  const SIMULATION_TIMEOUT_SEC = Number.isFinite(BALANCE.simulationTimeoutSec) ? BALANCE.simulationTimeoutSec : 180; // safety timeout for non-rendered test simulations
  const FAST_SET_SIM_DT = Number.isFinite(BALANCE.fastSetSimDt) ? BALANCE.fastSetSimDt : (1 / 20); // faster 100x set simulations
  const ROUND_BALANCE = BALANCE.round && typeof BALANCE.round === "object" ? BALANCE.round : {};
  const RAIL_BALANCE = BALANCE.rail && typeof BALANCE.rail === "object" ? BALANCE.rail : {};
  const ROUND_LIMIT_SEC = Number.isFinite(ROUND_BALANCE.limitSec) ? ROUND_BALANCE.limitSec : 60;
  const SUDDEN_DEATH_START_SEC = Number.isFinite(ROUND_BALANCE.suddenDeathStartSec) ? ROUND_BALANCE.suddenDeathStartSec : 45;
  const SUDDEN_DEATH_DOT_MAX = Number.isFinite(ROUND_BALANCE.suddenDeathDotMax) ? ROUND_BALANCE.suddenDeathDotMax : 8;
  const SUDDEN_DEATH_DOT_INTERVAL_SEC = Number.isFinite(ROUND_BALANCE.suddenDeathDotIntervalSec) ? ROUND_BALANCE.suddenDeathDotIntervalSec : 1;
  const SUDDEN_DEATH_HEAL_SCALE = Number.isFinite(ROUND_BALANCE.suddenDeathHealScale) ? ROUND_BALANCE.suddenDeathHealScale : 0.2;
  const SUDDEN_DEATH_SHIELD_SCALE = Number.isFinite(ROUND_BALANCE.suddenDeathShieldScale) ? ROUND_BALANCE.suddenDeathShieldScale : 0.25;
  const PLAYER_BALL_SCALE = 1.2; // enlarge fighters
  const CHAOS_KNOCKBACK_MULT = 1.28; // stronger recoil from hits
  const CHAOS_SPIN_IMPULSE = 0.36; // side impulse to make trajectories wilder
  const CHAOS_COLLISION_RESTITUTION = 1.24; // bouncier fighter-to-fighter collisions
  const DAMAGE_IMPULSE_PER_POINT = 0.055; // extra knockback per point of resolved damage
  const DAMAGE_IMPULSE_MAX_MULT = 2.9; // cap for anti-infinity impulses
  const RAGE_MOMENTUM_DECAY = 0.065; // how fast momentum fades per second

  function scaleCooldown(value) {
    return value * GLOBAL_COOLDOWN_SCALE;
  }

  function balanceNumber(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
  }

  function getSimulationMaxSteps(dt = 1 / 30) {
    return Math.ceil(SIMULATION_TIMEOUT_SEC / dt);
  }

  function weaponDefFromConfig(entry = {}) {
    const speedMin = entry.speedMin !== undefined ? Math.round(entry.speedMin * GLOBAL_SPEED_SCALE) : Math.round(220 * GLOBAL_SPEED_SCALE);
    const speedMax = entry.speedMax !== undefined ? Math.round(entry.speedMax * GLOBAL_SPEED_SCALE) : Math.round(280 * GLOBAL_SPEED_SCALE);
    const hasBalanceBias = Number.isFinite(entry.balanceBias);
    const balanceBias = hasBalanceBias ? entry.balanceBias : 0;
    const derivedDamageMultiplier = Math.min(1.7, Math.max(0.45, 1 + balanceBias * 0.75));
    const derivedDamageTakenMultiplier = Math.min(1.32, Math.max(0.68, 1 - balanceBias * 0.52));
    const derivedHpMultiplier = Math.min(1.22, Math.max(0.82, 1 + balanceBias * 0.24));
    const derivedCooldownRateMultiplier = Math.min(1.32, Math.max(0.78, 1 + balanceBias * 0.5));
    const derivedMassMultiplier = Math.min(1.18, Math.max(0.82, 1 + balanceBias * 0.12));
    const derivedArmorMultiplier = Math.min(1.2, Math.max(0.8, 1 - balanceBias * 0.18));
    const safeTitle = entry.title || entry.id || "Untitled";
    return {
      id: entry.id,
      title: safeTitle,
      description: entry.description || "",
      category: entry.category || "Miscellaneous",
      badge: entry.badge || safeTitle.slice(0, 2).toUpperCase(),
      color: entry.color || "#d7e5ff",
      speedMin,
      speedMax,
      balanceBias,
      damageMultiplier: hasBalanceBias ? derivedDamageMultiplier : (Number.isFinite(entry.damageMultiplier) ? entry.damageMultiplier : derivedDamageMultiplier),
      damageTakenMultiplier: hasBalanceBias ? derivedDamageTakenMultiplier : (Number.isFinite(entry.damageTakenMultiplier) ? entry.damageTakenMultiplier : derivedDamageTakenMultiplier),
      hpMultiplier: hasBalanceBias ? derivedHpMultiplier : (Number.isFinite(entry.hpMultiplier) ? entry.hpMultiplier : derivedHpMultiplier),
      cooldownRateMultiplier: hasBalanceBias ? derivedCooldownRateMultiplier : (Number.isFinite(entry.cooldownRateMultiplier) ? entry.cooldownRateMultiplier : derivedCooldownRateMultiplier),
      massMultiplier: hasBalanceBias ? derivedMassMultiplier : (Number.isFinite(entry.massMultiplier) ? entry.massMultiplier : derivedMassMultiplier),
      armorMultiplier: hasBalanceBias ? derivedArmorMultiplier : (Number.isFinite(entry.armorMultiplier) ? entry.armorMultiplier : derivedArmorMultiplier),
    };
  }

  const fallbackWeapons = [
    {
      id: "rail",
      title: "Rails",
      description: "Lays track after wall hits and launches minecarts.",
      badge: "RL",
      color: "#f7d98d",
      speedMin: 236,
      speedMax: 286,
      category: "Legacy",
    },
    {
      id: "boat",
      title: "Boat",
      description: "Armored hull with alternating ice and lava buckets.",
      badge: "BT",
      color: "#8fd6ff",
      speedMin: 196,
      speedMax: 236,
      category: "Legacy",
    },
  ];

  const weaponSource = Array.isArray(GAME_WEAPON_CONFIG.weapons) && GAME_WEAPON_CONFIG.weapons.length
    ? GAME_WEAPON_CONFIG.weapons
    : fallbackWeapons;

  const WEAPON_CATALOG = weaponSource.map(weaponDefFromConfig).filter((weapon) => weapon.id);
  const WEAPON_LIBRARY = Object.fromEntries(WEAPON_CATALOG.map((weapon) => [weapon.id, weapon]));

  function configureWeaponBalanceProfile(weapon) {
    const meta = WEAPON_LIBRARY[weapon.id] || {};
    weapon.damageMultiplier = Number.isFinite(meta.damageMultiplier) ? meta.damageMultiplier : 1;
    weapon.damageTakenMultiplier = Number.isFinite(meta.damageTakenMultiplier) ? meta.damageTakenMultiplier : 1;
    weapon.hpMultiplier = Number.isFinite(meta.hpMultiplier) ? meta.hpMultiplier : 1;
    weapon.cooldownRateMultiplier = Number.isFinite(meta.cooldownRateMultiplier) ? meta.cooldownRateMultiplier : 1;
    weapon.massMultiplier = Number.isFinite(meta.massMultiplier) ? meta.massMultiplier : 1;
    weapon.balanceArmorMultiplier = Number.isFinite(meta.armorMultiplier) ? meta.armorMultiplier : 1;
    return weapon;
  }

  function restoreWeaponBalanceFrame(weapon) {
    if (!weapon || !weapon._balanceFrameApplied) {
      return;
    }
    if (Number.isFinite(weapon._rawBalanceMass)) {
      weapon.mass = weapon._rawBalanceMass;
    }
    if (Number.isFinite(weapon._rawBalanceArmor)) {
      weapon.armorMultiplier = weapon._rawBalanceArmor;
    }
    weapon._balanceFrameApplied = false;
  }

  function applyWeaponBalanceFrame(weapon) {
    if (!weapon) {
      return;
    }
    const massMultiplier = Number.isFinite(weapon.massMultiplier) ? weapon.massMultiplier : 1;
    const armorMultiplier = Number.isFinite(weapon.balanceArmorMultiplier) ? weapon.balanceArmorMultiplier : 1;
    weapon._rawBalanceMass = Number.isFinite(weapon.mass) ? weapon.mass : 1;
    weapon._rawBalanceArmor = Number.isFinite(weapon.armorMultiplier) ? weapon.armorMultiplier : 1;
    weapon.mass = Math.max(0.2, weapon._rawBalanceMass * massMultiplier);
    weapon.armorMultiplier = Math.max(0.2, weapon._rawBalanceArmor * armorMultiplier);
    weapon._balanceFrameApplied = true;
  }

  function getWeaponCooldownDecay(weapon, dt) {
    const cooldownRateMultiplier = weapon && Number.isFinite(weapon.cooldownRateMultiplier) ? weapon.cooldownRateMultiplier : 1;
    return (dt * cooldownRateMultiplier) / GLOBAL_COOLDOWN_SCALE;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpVector(a, b, t) {
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
    };
  }

  function vec(x = 0, y = 0) {
    return { x, y };
  }

  function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  function sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  function scale(v, amount) {
    return { x: v.x * amount, y: v.y * amount };
  }

  function dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }

  function length(v) {
    return Math.hypot(v.x, v.y);
  }

  function distance(a, b) {
    return length(sub(a, b));
  }

  function normalize(v) {
    const len = length(v);
    if (len < 0.0001) {
      return { x: 0, y: 0 };
    }
    return { x: v.x / len, y: v.y / len };
  }

  function perpendicular(v) {
    return { x: -v.y, y: v.x };
  }

  function reflect(velocity, normal) {
    const impact = dot(velocity, normal);
    return sub(velocity, scale(normal, 2 * impact));
  }

  function angleOf(v) {
    return Math.atan2(v.y, v.x);
  }

  function pointOnSegment(a, b, t) {
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
    };
  }

  function chance(probability) {
    return randomUnit() < probability;
  }

  function randomRange(min, max) {
    return min + randomUnit() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
  }

  function fitCanvas(canvas) {
    const scale = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
    canvas.style.width = `${Math.floor(WIDTH * scale)}px`;
    canvas.style.height = `${Math.floor(HEIGHT * scale)}px`;
    canvas.style.left = `${Math.floor((window.innerWidth - WIDTH * scale) / 2)}px`;
    canvas.style.top = `${Math.floor((window.innerHeight - HEIGHT * scale) / 2)}px`;
  }

  function createTrailPath(points) {
    const safe = points.slice();
    const lengths = [0];
    let total = 0;
    for (let index = 1; index < safe.length; index += 1) {
      total += distance(safe[index - 1], safe[index]);
      lengths.push(total);
    }
    return {
      points: safe,
      lengths,
      total: total || 1,
    };
  }

  function samplePath(path, progress) {
    const clamped = clamp(progress, 0, 1);
    const target = path.total * clamped;
    for (let index = 1; index < path.points.length; index += 1) {
      const prevLength = path.lengths[index - 1];
      const nextLength = path.lengths[index];
      if (target <= nextLength) {
        const local = (target - prevLength) / (nextLength - prevLength || 1);
        return pointOnSegment(path.points[index - 1], path.points[index], local);
      }
    }
    return path.points[path.points.length - 1];
  }

  function pathTangent(path, progress) {
    const p1 = samplePath(path, clamp(progress - 0.01, 0, 1));
    const p2 = samplePath(path, clamp(progress + 0.01, 0, 1));
    return normalize(sub(p2, p1));
  }

  function rotateVector(v, radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos,
    };
  }

  function keepPointInArena(point, padding = 24) {
    return {
      x: clamp(point.x, ARENA.x + padding, ARENA.x + ARENA.width - padding),
      y: clamp(point.y, ARENA.y + padding, ARENA.y + ARENA.height - padding),
    };
  }

  function pointInZone(zone, point, padding = 0) {
    const dx = point.x - zone.position.x;
    const dy = point.y - zone.position.y;
    const cos = Math.cos(-(zone.rotation || 0));
    const sin = Math.sin(-(zone.rotation || 0));
    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;
    const radiusX = (zone.currentRadiusX || zone.radiusX || zone.radius || 0) + padding;
    const radiusY = (zone.currentRadiusY || zone.radiusY || zone.radius || 0) + padding;
    return ((localX * localX) / (radiusX * radiusX)) + ((localY * localY) / (radiusY * radiusY)) <= 1;
  }

  function zoneMaxRadius(zone) {
    return Math.max(zone.currentRadiusX || zone.radiusX || zone.radius || 0, zone.currentRadiusY || zone.radiusY || zone.radius || 0);
  }

  function getEnemyFighter(game, owner) {
    return game.fighters.find((fighter) => fighter !== owner && !fighter.dead) || null;
  }

  function getCombatantSide(unit) {
    if (!unit) {
      return "";
    }
    if (unit.side) {
      return unit.side;
    }
    if (unit.owner && unit.owner.side) {
      return unit.owner.side;
    }
    return "";
  }

  function isCombatantDead(unit) {
    if (!unit) {
      return true;
    }
    if (typeof unit.dead === "boolean") {
      return unit.dead;
    }
    if (typeof unit.hp === "number") {
      return unit.hp <= 0;
    }
    return false;
  }

  function getActiveCombatants(game) {
    const minions = game && Array.isArray(game.minions) ? game.minions : [];
    return [...(game ? game.fighters : []), ...minions].filter((unit) => unit && !isCombatantDead(unit));
  }

  function spawnGameMinion(game, minion) {
    if (!game || !minion) {
      return false;
    }
    if (typeof game.spawnMinion === "function") {
      game.spawnMinion(minion);
      return true;
    }
    if (Array.isArray(game.minions)) {
      game.minions.push(minion);
      return true;
    }
    return false;
  }

  function getNearestEnemyTarget(game, owner, fallback = null, fromPosition = null) {
    if (!game || !owner) {
      return fallback;
    }
    const origin = fromPosition || owner.position;
    if (!origin) {
      return fallback;
    }
    const side = getCombatantSide(owner);
    let nearest = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const unit of getActiveCombatants(game)) {
      if (unit === owner || isCombatantDead(unit)) {
        continue;
      }
      if (side && getCombatantSide(unit) === side) {
        continue;
      }
      const d = distance(origin, unit.position);
      if (d < bestDistance) {
        bestDistance = d;
        nearest = unit;
      }
    }
    return nearest || fallback;
  }

  function getNearestEnemyFighter(game, owner, fallback = null, fromPosition = null) {
    if (!game || !owner) {
      return fallback;
    }
    const origin = fromPosition || owner.position;
    const side = getCombatantSide(owner);
    let nearest = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const fighter of game.fighters) {
      if (!fighter || fighter === owner || fighter.dead) {
        continue;
      }
      if (side && fighter.side === side) {
        continue;
      }
      const d = distance(origin, fighter.position);
      if (d < bestDistance) {
        bestDistance = d;
        nearest = fighter;
      }
    }
    return nearest || fallback;
  }

  function closestPointOnSegment(point, a, b) {
    const ab = sub(b, a);
    const ap = sub(point, a);
    const abLenSq = dot(ab, ab) || 1;
    const t = clamp(dot(ap, ab) / abLenSq, 0, 1);
    return pointOnSegment(a, b, t);
  }

  function closestPointOnPath(path, point) {
    if (!path || !path.points || path.points.length < 2) {
      return null;
    }
    let best = null;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let index = 1; index < path.points.length; index += 1) {
      const a = path.points[index - 1];
      const b = path.points[index];
      const candidate = closestPointOnSegment(point, a, b);
      const d = distance(candidate, point);
      if (d < bestDist) {
        bestDist = d;
        best = candidate;
      }
    }
    return best;
  }

  function distanceToSegment(point, a, b) {
    const ab = sub(b, a);
    const ap = sub(point, a);
    const abLenSq = dot(ab, ab) || 1;
    const t = clamp(dot(ap, ab) / abLenSq, 0, 1);
    return distance(point, pointOnSegment(a, b, t));
  }

  function radialBlast(game, position, owner, options = {}) {
    const radius = options.radius || 140;
    const maxDamage = options.damage ?? 10;
    const edgeDamage = options.edgeDamage ?? Math.max(1, Math.round(maxDamage * 0.35));
    const maxKnockback = options.knockback ?? 220;
    for (const target of getActiveCombatants(game)) {
      if (isCombatantDead(target)) {
        continue;
      }
      if (target === owner && options.affectOwner === false) {
        continue;
      }
      const dist = distance(target.position, position);
      if (dist > radius + (target.ballRadius || 0)) {
        continue;
      }
      const falloff = 1 - clamp(dist / Math.max(1, radius), 0, 1);
      const damage = Math.round(lerp(edgeDamage, maxDamage, falloff));
      if (damage > 0) {
        target.takeDamage(damage, {
          game,
          type: options.type || "blast",
          hitFrom: position,
          knockback: lerp(maxKnockback * 0.45, maxKnockback, falloff),
          color: options.color || "#ffffff",
          ignoreArmor: !!options.ignoreArmor,
          ignoreInvulnerable: !!options.ignoreInvulnerable,
          sourceFighter: owner,
        });
      } else if (maxKnockback > 0) {
        const away = normalize(sub(target.position, position));
        target.receiveVelocity(scale(away, lerp(maxKnockback * 0.3, maxKnockback, falloff) / Math.max(0.6, target.mass || 1)));
      }
      if (options.statusKey && target !== owner && typeof target.setStatus === "function") {
        target.setStatus(options.statusKey, options.statusTime || 1);
      }
      if (typeof options.onHit === "function") {
        options.onHit(target, falloff);
      }
    }
    if (!options.silent) {
      game.spawnBurst(position, options.color || "#ffffff", options.particles || 22);
      game.spawnShardBurst(position, options.shardColor || options.color || "#ffffff", options.shards || 12);
      game.screenShake = Math.max(game.screenShake, options.shake || 0.34);
    }
  }

  function pulseLine(game, owner, start, direction, lengthValue, width, options = {}) {
    const end = add(start, scale(normalize(direction), lengthValue));
    const zoneRadius = Math.max(lengthValue * 0.55, width * 2.4);
    const targets = [];
    for (const target of getActiveCombatants(game)) {
      if (isCombatantDead(target) || target === owner) {
        continue;
      }
      if (getCombatantSide(target) === getCombatantSide(owner)) {
        continue;
      }
      if (distanceToSegment(target.position, start, end) <= (target.ballRadius || 0) + width) {
        targets.push(target);
      }
    }
    if (options.visual !== false) {
      game.spawnZone(new Zone({
        kind: options.kind || "pulse",
        owner,
        position: pointOnSegment(start, end, 0.5),
        radius: zoneRadius,
        radiusX: lengthValue * 0.55,
        radiusY: width * 2.4,
        startRadius: Math.max(lengthValue * 0.12, width),
        startRadiusX: lengthValue * 0.2,
        startRadiusY: width,
        rotation: angleOf(direction),
        growTime: 0.08,
        life: options.life || 0.14,
        color: options.color || "rgba(235, 245, 255, 0.22)",
        ownerImmune: true,
        damage: 0,
      }));
    }
    return { end, targets };
  }

  function zonesOverlap(a, b) {
    return distance(a.position, b.position) <= zoneMaxRadius(a) + zoneMaxRadius(b);
  }

  function aimAtEnemy(owner, enemy, lead = 0.24, game = null) {
    const fallback = vec(owner.side === "left" ? 1 : -1, 0);
    const target = game ? getNearestEnemyTarget(game, owner, enemy) : enemy;
    if (!target || isCombatantDead(target)) {
      return fallback;
    }
    const targetPoint = add(target.position, scale(target.velocity || vec(0, 0), lead));
    const aimed = normalize(sub(targetPoint, owner.position));
    return length(aimed) > 0.01 ? aimed : fallback;
  }

  function cloneProjectile(projectile, overrides = {}) {
    return new Projectile({
      kind: overrides.kind || projectile.kind,
      owner: overrides.owner || projectile.owner,
      position: overrides.position || { ...projectile.position },
      velocity: overrides.velocity || { ...projectile.velocity },
      life: overrides.life ?? projectile.life,
      color: overrides.color || projectile.color,
      radius: overrides.radius || projectile.radius,
      gravity: overrides.gravity ?? projectile.gravity,
      bounces: overrides.bounces ?? projectile.bounces,
      returnDelay: overrides.returnDelay ?? projectile.returnDelay,
      returning: overrides.returning ?? projectile.returning,
      returnSpeed: overrides.returnSpeed ?? projectile.returnSpeed,
      passThroughWalls: overrides.passThroughWalls ?? projectile.passThroughWalls,
      pierce: overrides.pierce ?? projectile.pierce,
      onHit: overrides.onHit || projectile.onHit,
      onWall: overrides.onWall || projectile.onWall,
      onExpire: overrides.onExpire || projectile.onExpire,
      onCatch: overrides.onCatch || projectile.onCatch,
      onStep: overrides.onStep || projectile.onStep,
      drawStyle: overrides.drawStyle || projectile.drawStyle,
      rotation: overrides.rotation ?? projectile.rotation,
      rotationSpeed: overrides.rotationSpeed ?? projectile.rotationSpeed,
      maxDistance: overrides.maxDistance ?? projectile.maxDistance,
      ignoreFunnelsTime: overrides.ignoreFunnelsTime ?? 0.08,
    });
  }

  function spawnSteamBurst(game, position, owner, options = {}) {
    const radius = options.radius || 120;
    const knockback = options.knockback || 220;
    for (const target of getActiveCombatants(game)) {
      if (isCombatantDead(target)) {
        continue;
      }
      const dist = distance(target.position, position);
      if (dist > radius + (target.ballRadius || 0)) {
        continue;
      }
      const away = normalize(sub(target.position, position));
      target.receiveVelocity(scale(away, knockback / Math.max(1, target.mass || 1)));
      if (target !== owner && typeof target.setStatus === "function") {
        target.setStatus("shocked", 0.6);
      }
    }
    game.spawnZone(new Zone({
      kind: "steam",
      owner,
      position,
      radius: radius * 0.66,
      life: 0.75,
      growTime: 0.12,
      color: "rgba(230, 244, 255, 0.28)",
      ownerImmune: true,
      tickRate: 0.16,
    }));
    game.spawnBurst(position, "#f3fbff", 18);
    game.screenShake = Math.max(game.screenShake, 0.26);
  }

  function electrifyNearbyWater(game, position, owner, radius = 150) {
    let activated = false;
    for (const zone of game.zones) {
      if (zone.kind !== "water") {
        continue;
      }
      if (distance(zone.position, position) > zoneMaxRadius(zone) + radius) {
        continue;
      }
      zone.electrifiedTime = Math.max(zone.electrifiedTime, 1);
      activated = true;
    }
    if (!activated) {
      return false;
    }
    for (const target of getActiveCombatants(game)) {
      if (isCombatantDead(target) || target === owner) {
        continue;
      }
      if (getCombatantSide(target) === getCombatantSide(owner)) {
        continue;
      }
      if (distance(target.position, position) > radius + (target.ballRadius || 0)) {
        continue;
      }
      target.takeDamage(4, {
        game,
        type: "storm",
        hitFrom: position,
        knockback: 120,
        color: "#9fe8ff",
        ignoreArmor: true,
        sourceFighter: owner,
      });
      if (typeof target.setStatus === "function") {
        target.setStatus("shocked", 1.1);
      }
    }
    game.triggerFlash("#b9edff", 0.18);
    game.spawnShardBurst(position, "#d5fbff", 12);
    return true;
  }

  function spawnWaterFlow(game, owner, position, direction) {
    const zone = new Zone({
      kind: "water",
      owner,
      position: keepPointInArena(position, 40),
      radius: 110,
      radiusX: 200,
      radiusY: 60,
      startRadiusX: 90,
      startRadiusY: 26,
      rotation: angleOf(direction),
      growTime: 0.26,
      life: 4,
      tickRate: 0.2,
      color: "rgba(108, 187, 255, 0.5)",
      ownerImmune: true,
      damage: 2,
      data: {
        waterHit: new Set(),
      },
    });
    game.spawnZone(zone);
    for (const target of getActiveCombatants(game)) {
      if (isCombatantDead(target) || target === owner) {
        continue;
      }
      if (getCombatantSide(target) === getCombatantSide(owner)) {
        continue;
      }
      if (!pointInZone(zone, target.position, target.ballRadius || 0)) {
        continue;
      }
      target.takeDamage(10, {
        game,
        type: "water-cast",
        hitFrom: position,
        knockback: 120,
        color: "#a6dcff",
        sourceFighter: owner,
      });
      zone.data.waterHit.add(target);
    }
    return zone;
  }

  function spawnObsidianZone(game, owner, position) {
    const zone = new Zone({
      kind: "obsidian",
      owner,
      position: keepPointInArena(position, 54),
      radius: 92,
      radiusX: 96,
      radiusY: 96,
      startRadius: 30,
      growTime: 0.16,
      life: 5,
      tickRate: 0.12,
      color: "rgba(42, 34, 58, 0.58)",
      ownerImmune: true,
      damage: 0,
    });
    game.spawnZone(zone);
    game.spawnShardBurst(zone.position, "#7a67a5", 18);
    return zone;
  }

  function spawnPearlCloud(game, owner, position) {
    const zone = new Zone({
      kind: "void",
      owner,
      position: keepPointInArena(position, 40),
      radius: 78,
      startRadius: 20,
      growTime: 0.1,
      life: 1,
      tickRate: 0.14,
      color: "rgba(183, 124, 255, 0.26)",
      ownerImmune: true,
      damage: 0,
    });
    game.spawnZone(zone);
    return zone;
  }

  function spawnLavaPool(game, owner, position, options = {}) {
    const baseRadius = options.baseRadius || 100;
    const zone = new Zone({
      kind: "lava",
      owner,
      position: keepPointInArena(position, 48),
      radius: baseRadius * 1.3,
      radiusX: baseRadius * 1.3,
      radiusY: baseRadius * 1.3,
      startRadius: baseRadius * 0.7,
      startRadiusX: baseRadius * 0.7,
      startRadiusY: baseRadius * 0.7,
      growTime: options.life || 4,
      life: options.life || 4,
      tickRate: 0.22,
      color: "rgba(255, 102, 44, 0.58)",
      ownerImmune: true,
      damage: 2,
      data: {
        dynamicRadius: true,
        baseRadius,
        baseRadiusX: baseRadius,
        baseRadiusY: baseRadius,
        startScale: 0.7,
        endScale: 1.3,
      },
    });
    game.spawnZone(zone);
    return zone;
  }

  class Particle {
    constructor(position, velocity, color, life, size, kind = "circle") {
      this.position = { ...position };
      this.velocity = { ...velocity };
      this.color = color;
      this.life = life;
      this.maxLife = life;
      this.size = size;
      this.kind = kind;
      this.spin = randomRange(-10, 10);
      this.rotation = randomRange(0, Math.PI * 2);
    }

    update(dt) {
      this.life -= dt;
      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;
      this.rotation += this.spin * dt;
    }

    draw(ctx) {
      if (this.life <= 0) {
        return;
      }
      ctx.save();
      ctx.globalAlpha = clamp(this.life / this.maxLife, 0, 1);
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      if (this.kind === "square") {
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class FloatingText {
    constructor(text, position, color) {
      this.text = text;
      this.position = { ...position };
      this.velocity = vec(0, -22);
      this.life = 0.7;
      this.maxLife = 0.7;
      this.color = color;
    }

    update(dt) {
      this.life -= dt;
      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;
    }

    draw(ctx) {
      if (this.life <= 0) {
        return;
      }
      ctx.save();
      ctx.globalAlpha = clamp(this.life / this.maxLife, 0, 1);
      ctx.fillStyle = this.color;
      ctx.textAlign = "center";
      ctx.font = "bold 12px Consolas, monospace";
      ctx.fillText(this.text, this.position.x, this.position.y);
      ctx.restore();
    }
  }

  class Zone {
    constructor(options) {
      this.kind = options.kind;
      this.owner = options.owner;
      this.position = { ...options.position };
      this.radius = options.radius;
      this.radiusX = options.radiusX || options.radius;
      this.radiusY = options.radiusY || options.radius;
      this.currentRadius = options.startRadius || Math.max(18, options.radius * 0.45);
      this.currentRadiusX = options.startRadiusX || options.startRadius || Math.max(18, this.radiusX * 0.45);
      this.currentRadiusY = options.startRadiusY || options.startRadius || Math.max(18, this.radiusY * 0.45);
      this.growTime = options.growTime || 0.7;
      this.age = 0;
      this.life = options.life;
      this.maxLife = options.life;
      this.color = options.color;
      this.tick = 0;
      this.tickRate = options.tickRate || (this.kind === "lava" ? 0.16 : 1);
      this.rotation = options.rotation || 0;
      this.style = options.style || this.kind;
      this.ownerImmune = options.ownerImmune !== false;
      this.damage = options.damage ?? 0;
      this.onTick = options.onTick || null;
      this.onExpire = options.onExpire || null;
      this.data = options.data || {};
      this.electrifiedTime = options.electrifiedTime || 0;
      this.phase = randomRange(0, Math.PI * 2);
      this.edgeOffsets = Array.from({ length: 34 }, () => randomRange(0.72, 1.24));
    }

    containsFighter(fighter) {
      const dx = fighter.position.x - this.position.x;
      const dy = fighter.position.y - this.position.y;
      const cos = Math.cos(-this.rotation);
      const sin = Math.sin(-this.rotation);
      const localX = dx * cos - dy * sin;
      const localY = dx * sin + dy * cos;
      const radiusX = this.currentRadiusX + fighter.ballRadius;
      const radiusY = this.currentRadiusY + fighter.ballRadius;
      return ((localX * localX) / (radiusX * radiusX)) + ((localY * localY) / (radiusY * radiusY)) <= 1;
    }

    update(dt, game) {
      this.age += dt;
      this.life -= dt;
      if (this.life <= 0) {
        return;
      }
      if (this.currentRadius < 8 && this.currentRadiusX < 8) {
        return;
      }
      this.tick -= dt;
      this.electrifiedTime = Math.max(0, this.electrifiedTime - dt);
      this.phase += dt * (this.kind === "lava" || this.kind === "fire" ? 2.8 : 1.6);
      if (this.data && this.data.dynamicRadius) {
        const t = clamp(this.age / Math.max(0.01, this.maxLife || this.life || 1), 0, 1);
        const scaleValue = lerp(this.data.startScale || 1, this.data.endScale || 1, t);
        const baseRadius = this.data.baseRadius || this.radius || 1;
        this.radius = baseRadius * scaleValue;
        this.radiusX = (this.data.baseRadiusX || baseRadius) * scaleValue;
        this.radiusY = (this.data.baseRadiusY || baseRadius) * scaleValue;
      }
      const growT = clamp(this.age / this.growTime, 0, 1);
      const easedGrow = 1 - Math.pow(1 - growT, 3);
      this.currentRadius = lerp(this.currentRadius, this.radius, easedGrow * 0.25 + dt * 1.9);
      this.currentRadiusX = lerp(this.currentRadiusX, this.radiusX, easedGrow * 0.25 + dt * 1.9);
      this.currentRadiusY = lerp(this.currentRadiusY, this.radiusY, easedGrow * 0.25 + dt * 1.9);
      if (this.life <= 0) {
        if (this.onExpire) {
          this.onExpire(game, this);
        }
        return;
      }
      if (this.tick > 0) {
        return;
      }
      this.tick = this.tickRate;

      const insideUnits = new Set();
      const combatants = getActiveCombatants(game);
      for (const unit of combatants) {
        const inside = this.containsFighter(unit);
        if (!inside) {
          continue;
        }
        insideUnits.add(unit);

        if (this.onTick) {
          this.onTick(unit, game, this);
          continue;
        }

        if (this.kind === "lava") {
          if (unit !== this.owner || !this.ownerImmune) {
            unit.takeDamage(this.damage || 6, {
              game,
              type: "lava",
              hitFrom: this.position,
              color: "#ff7b47",
              sourceFighter: this.owner,
            });
            if (typeof unit.applyBurn === "function") {
              unit.applyBurn(0.462, 3);
            }
          }
        } else if (this.kind === "ice") {
          if (unit !== this.owner) {
            const exposure = this.data.iceExposure instanceof Map ? this.data.iceExposure : (this.data.iceExposure = new Map());
            const tickMap = this.data.iceDamageTick instanceof Map ? this.data.iceDamageTick : (this.data.iceDamageTick = new Map());
            const nextExposure = (exposure.get(unit) || 0) + this.tickRate;
            exposure.set(unit, nextExposure);
            if (nextExposure > 0.5) {
              let accumulated = (tickMap.get(unit) || 0) + this.tickRate;
              while (accumulated >= 1) {
                accumulated -= 1;
                unit.takeDamage(1, {
                  game,
                  type: "ice",
                  hitFrom: this.position,
                  color: "#c8f0ff",
                  sourceFighter: this.owner,
                });
              }
              tickMap.set(unit, accumulated);
            }
            if (typeof unit.addFreezeStacks === "function") {
              unit.addFreezeStacks(1, game);
            }
            if (typeof unit.setStatus === "function") {
              unit.setStatus("rooted", 0.2);
            }
          } else if (unit.weapon && unit.weapon.id === "boat") {
            unit.weapon.boostFromIce(this.owner);
          }
        } else if (this.kind === "water") {
          if (unit === this.owner) {
            const tickMap = this.data.waterHealTick instanceof Map ? this.data.waterHealTick : (this.data.waterHealTick = new Map());
            let accumulated = (tickMap.get(unit) || 0) + this.tickRate;
            while (accumulated >= 1) {
              accumulated -= 1;
              unit.heal(1, game, "#86ffb4");
            }
            tickMap.set(unit, accumulated);
          } else {
            const waterHit = this.data.waterHit instanceof Set ? this.data.waterHit : (this.data.waterHit = new Set());
            if (!waterHit.has(unit)) {
              waterHit.add(unit);
              unit.takeDamage(8, {
                game,
                type: "water-hit",
                hitFrom: this.position,
                knockback: 120,
                color: "#a6dcff",
                sourceFighter: this.owner,
              });
            }
            const tickMap = this.data.waterDamageTick instanceof Map ? this.data.waterDamageTick : (this.data.waterDamageTick = new Map());
            let accumulated = (tickMap.get(unit) || 0) + this.tickRate;
            if (accumulated >= 0.5) {
              const times = Math.floor(accumulated / 0.5);
              accumulated -= times * 0.5;
              for (let index = 0; index < times; index += 1) {
                unit.takeDamage(2, {
                  game,
                  type: "water-soak",
                  hitFrom: this.position,
                  color: "#a6dcff",
                  ignoreArmor: true,
                  sourceFighter: this.owner,
                });
              }
            }
            tickMap.set(unit, accumulated);
          }
        } else if (this.kind === "fire") {
          if (unit !== this.owner || !this.ownerImmune) {
            unit.takeDamage(this.damage || 7, {
              game,
              type: "fire",
              hitFrom: this.position,
              color: "#ff9b68",
              sourceFighter: this.owner,
            });
            if (this.data && this.data.flintTrail) {
              const exposure = this.data.fireExposure instanceof Map ? this.data.fireExposure : (this.data.fireExposure = new Map());
              exposure.set(unit, (exposure.get(unit) || 0) + this.tickRate);
            } else if (typeof unit.applyBurn === "function") {
              unit.applyBurn(3, 3);
            }
          }
        } else if (this.kind === "cry") {
          if (unit !== this.owner) {
            if (typeof unit.setStatus === "function") {
              unit.setStatus("anchored", 0.8);
              unit.setStatus("rooted", 0.55);
            }
            unit.velocity = scale(unit.velocity, 0.75);
          }
        } else if (this.kind === "obsidian") {
          const away = normalize(length(sub(unit.position, this.position)) > 0.01 ? sub(unit.position, this.position) : vec(getCombatantSide(unit) === "left" ? -1 : 1, 0));
          if (typeof unit.setStatus === "function") {
            unit.setStatus("anchored", 0.18);
          }
          unit.velocity = scale(unit.velocity, 0.72);
          unit.receiveVelocity(scale(away, 58));
        } else if (this.kind === "honey") {
          if (unit !== this.owner) {
            if (typeof unit.setStatus === "function") {
              unit.setStatus("rooted", 0.75);
            }
            unit.velocity = scale(unit.velocity, this.data && this.data.heavySlow ? 0.5 : 0.7);
          } else {
            unit.receiveVelocity(scale(normalize(unit.velocity.x || unit.velocity.y ? unit.velocity : vec(1, 0)), 8));
          }
        } else if (this.kind === "steam") {
          if (unit !== this.owner && typeof unit.setStatus === "function") {
            unit.setStatus("shocked", 0.35);
          }
        } else if (this.kind === "void") {
          if (unit !== this.owner) {
            if (typeof unit.setStatus === "function") {
              unit.setStatus("spooked", 0.65);
            }
            unit.velocity = scale(unit.velocity, 0.9);
          }
        } else if (this.kind === "gravity") {
          if (unit !== this.owner) {
            if (typeof unit.setStatus === "function") {
              unit.setStatus("levitating", 0.9);
            }
            unit.receiveVelocity(scale(normalize(sub(unit.position, this.position)), 42));
          } else {
            if (typeof unit.setStatus === "function") {
              unit.setStatus("gliding", 0.65);
            }
          }
        } else if (this.kind === "light") {
          if (unit !== this.owner) {
            unit.takeDamage(this.damage || 8, {
              game,
              type: "light",
              hitFrom: this.position,
              color: "#ffc05b",
              sourceFighter: this.owner,
            });
            if (typeof unit.setStatus === "function") {
              unit.setStatus("shocked", 0.6);
            }
          }
        } else if (this.kind === "plants") {
          if (this.data.plantType === "bush" && unit !== this.owner) {
            if (typeof unit.setStatus === "function") {
              unit.setStatus("rooted", 0.7);
            }
          } else if (this.data.plantType === "mushroom") {
            const launch = normalize(length(unit.velocity) > 0.01 ? unit.velocity : sub(unit.position, this.position));
            unit.receiveVelocity(scale(launch, 130));
          } else if (this.data.plantType === "flower" && unit.weapon && unit.weapon.id === "beehive") {
            unit.weapon.beeBoostTimer = Math.max(unit.weapon.beeBoostTimer || 0, 2.4);
          }
        }
      }

      if (this.kind === "water") {
        const exposure = this.data.waterExposure instanceof Map ? this.data.waterExposure : null;
        const tickMap = this.data.waterDamageTick instanceof Map ? this.data.waterDamageTick : null;
        if (exposure) {
          for (const key of [...exposure.keys()]) {
            if (!insideUnits.has(key)) {
              exposure.delete(key);
              if (tickMap) {
                tickMap.delete(key);
              }
            }
          }
        }
      }
      if (this.kind === "fire" && this.data && this.data.flintTrail) {
        const exposure = this.data.fireExposure instanceof Map ? this.data.fireExposure : null;
        if (exposure) {
          for (const key of [...exposure.keys()]) {
            if (insideUnits.has(key)) {
              continue;
            }
            const total = exposure.get(key) || 0;
            if (total > 3 && key && !isCombatantDead(key) && typeof key.applyBurn === "function") {
              key.applyBurn(2, 3);
            }
            exposure.delete(key);
          }
        }
      }
    }

    draw(ctx, game = null) {
      const alpha = clamp(this.life / this.maxLife, 0, 1);
      if (alpha < 0.05) {
        return;
      }
      const radius = this.currentRadius;
      if (radius < 12) {
        return;
      }
      const radiusX = this.currentRadiusX;
      const radiusY = this.currentRadiusY;
      const canvas = ctx.canvas;
      if (this.position.x + radiusX < 0 || this.position.x - radiusX > canvas.width || this.position.y + radiusY < 0 || this.position.y - radiusY > canvas.height) {
        return;
      }
      const fiery = this.kind === "lava" || this.kind === "fire";
      const watery = this.kind === "ice" || this.kind === "water";
      const pulse = fiery ? 1 + Math.sin(this.phase * 2.6) * 0.08 : 1 + Math.sin(this.phase * 1.4) * 0.03;
      ctx.save();
      ctx.globalAlpha = fiery ? 0.26 + alpha * 0.36 : 0.24 + alpha * 0.28;
      ctx.fillStyle = this.kind === "water"
        ? "rgba(103, 189, 255, 0.48)"
        : this.kind === "cry"
          ? "rgba(145, 104, 255, 0.35)"
          : this.kind === "obsidian"
            ? "rgba(62, 54, 84, 0.62)"
          : this.kind === "honey"
            ? "rgba(255, 215, 92, 0.36)"
            : this.kind === "void"
              ? "rgba(173, 121, 255, 0.34)"
            : this.kind === "gravity"
              ? "rgba(174, 202, 255, 0.34)"
              : this.kind === "light"
                ? "rgba(255, 198, 98, 0.3)"
                : this.color;
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, radiusX * pulse, radiusY * pulse, 0, 0, Math.PI * 2);
      ctx.fill();

      const zoneTextureKey = getZoneTextureSpriteKey(this.kind, this.data);
      const zoneTexture = zoneTextureKey && game && game.sprites ? game.sprites.get(zoneTextureKey) : null;
      if (zoneTexture && radius > 28) {
        const prevSmoothing = ctx.imageSmoothingEnabled;
        const tileSize = this.kind === "fire"
          ? clamp(Math.min(radiusX, radiusY) * 0.32, 28, 48)
          : clamp(Math.min(radiusX, radiusY) * 0.28, 24, 42);
        const driftX = ((this.phase * (fiery ? 18 : watery ? 11 : 7)) % tileSize) - tileSize;
        const driftY = ((this.phase * (fiery ? 12 : watery ? 7 : 5)) % tileSize) - tileSize;
        const pattern = getZonePattern(zoneTexture, tileSize);
        if (pattern) {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(0, 0, radiusX * pulse, radiusY * pulse, 0, 0, Math.PI * 2);
          ctx.clip();
          ctx.globalAlpha = fiery ? 0.16 + alpha * 0.18 : watery ? 0.16 + alpha * 0.16 : 0.14 + alpha * 0.14;
          ctx.imageSmoothingEnabled = false;
          ctx.fillStyle = pattern;
          ctx.translate(driftX, driftY);
          ctx.fillRect(
            -radiusX * pulse - tileSize,
            -radiusY * pulse - tileSize,
            (radiusX * pulse + tileSize) * 2,
            (radiusY * pulse + tileSize) * 2,
          );
          ctx.restore();
        }
        ctx.imageSmoothingEnabled = prevSmoothing;
      }

      ctx.globalAlpha = fiery ? 0.26 + alpha * 0.28 : 0.22 + alpha * 0.22;
      ctx.strokeStyle = fiery
        ? "rgba(255, 217, 161, 0.9)"
        : watery
          ? "rgba(228, 248, 255, 0.88)"
          : this.kind === "obsidian"
            ? "rgba(167, 145, 219, 0.82)"
          : "rgba(240, 240, 255, 0.75)";
      ctx.lineWidth = fiery ? 3 : 2.5;
      ctx.stroke();

      if (radius > 35) {
        if (this.kind === "lava" || this.kind === "fire") {
          ctx.globalAlpha = 0.16 + alpha * 0.12;
          ctx.strokeStyle = "rgba(255, 120, 76, 0.75)";
          ctx.beginPath();
          ctx.ellipse(0, 0, radiusX * 0.48, radiusY * 0.48, 0, 0, Math.PI * 2);
          ctx.stroke();
          if (radius > 70) {
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = "rgba(255, 214, 148, 0.45)";
            ctx.beginPath();
            ctx.ellipse(0, 0, radiusX * 0.66, radiusY * 0.66, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.globalAlpha = 0.18;
          for (let spark = 0; spark < 5; spark += 1) {
            const angle = this.phase + spark * 1.25;
            const sparkRadius = radius * randomRange(0.2, 0.55);
            const x = Math.cos(angle) * sparkRadius;
            const y = Math.sin(angle * 1.15) * sparkRadius * 0.45;
            ctx.fillStyle = spark % 2 === 0 ? "#ffd7a3" : "#ff8b54";
            ctx.beginPath();
            ctx.arc(x, y, randomRange(2, 3.2), 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (this.kind === "obsidian") {
          ctx.globalAlpha = 0.24;
          ctx.strokeStyle = "rgba(201, 184, 255, 0.65)";
          ctx.beginPath();
          ctx.ellipse(0, 0, radiusX * 0.42, radiusY * 0.42, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.globalAlpha = 0.18;
          for (let shard = 0; shard < 8; shard += 1) {
            const angle = this.phase + shard * 0.82;
            const shardRadius = radius * randomRange(0.25, 0.8);
            const x = Math.cos(angle) * shardRadius;
            const y = Math.sin(angle) * shardRadius;
            ctx.fillStyle = watery ? (shard % 3 === 0 ? "#d5f5ff" : "#f9feff") : "#f4ecff";
            ctx.beginPath();
            ctx.arc(x, y, randomRange(2, 3.2), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    }
  }

  class Projectile {
    constructor(options) {
      this.kind = options.kind;
      this.owner = options.owner;
      this.position = { ...options.position };
      this.velocity = { ...options.velocity };
      this.life = options.life;
      this.color = options.color;
      this.radius = options.radius;
      this.gravity = options.gravity || 0;
      this.bounces = options.bounces || 0;
      this.returnDelay = options.returnDelay || 0;
      this.returning = options.returning || false;
      this.returnSpeed = options.returnSpeed || 460;
      this.passThroughWalls = !!options.passThroughWalls;
      this.pierce = options.pierce || 0;
      this.onHit = options.onHit || null;
      this.onWall = options.onWall || null;
      this.onExpire = options.onExpire || null;
      this.onCatch = options.onCatch || null;
      this.onStep = options.onStep || null;
      this.drawStyle = options.drawStyle || options.kind;
      this.rotation = options.rotation || 0;
      this.rotationSpeed = options.rotationSpeed || 0;
      this.hitCooldowns = new Map();
      this.initialLife = options.life || 0;
      this.maxDistance = options.maxDistance || (length(this.velocity) * Math.max(0.2, this.initialLife));
      this.travelled = 0;
      this.travelledInsideGravity = 0;
      this.ignoreFunnelsTime = options.ignoreFunnelsTime || 0;
      this.expired = false;
    }

    detonate(game, directTarget = null) {
      if (this.expired) {
        return;
      }
      this.expired = true;
      const zone = new Zone({
        kind: this.kind,
        owner: this.owner,
        position: this.position,
        startRadius: this.kind === "lava" ? randomRange(26, 42) : randomRange(30, 46),
        radius: this.kind === "lava" ? (this.owner.weapon && this.owner.weapon.id === "boat" ? randomRange(106, 149) : randomRange(88, 124)) : randomRange(94, 132),
        growTime: this.kind === "lava" ? 0.7 : 0.82,
        life: this.kind === "lava" ? 3.5 : 3.9,
        color: this.kind === "lava" ? "rgba(255, 91, 38, 0.62)" : "rgba(110, 221, 255, 0.56)",
      });
      game.spawnZone(zone);

      const burstRadius = this.kind === "lava" ? 84 : 74;
      for (const target of getActiveCombatants(game)) {
        if (isCombatantDead(target) || target === this.owner) {
          continue;
        }
        if (getCombatantSide(target) === getCombatantSide(this.owner)) {
          continue;
        }
        const dist = distance(target.position, this.position);
        if (dist > burstRadius + (target.ballRadius || 0)) {
          continue;
        }
        const directBonus = target === directTarget ? 3 : 0;
        target.takeDamage(this.kind === "lava" ? 5 + directBonus : 3 + directBonus, {
          game,
          type: `${this.kind}-impact`,
          hitFrom: this.position,
          knockback: this.kind === "lava" ? 210 : 170,
          color: this.kind === "lava" ? "#ff7c45" : "#c8f7ff",
          sourceFighter: this.owner,
        });
      }

      game.spawnBurst(this.position, this.kind === "lava" ? "#ff8c59" : "#d7f4ff", 28);
      game.spawnShardBurst(this.position, this.kind === "lava" ? "#ffd0a4" : "#f1feff", 18);
      game.screenShake = Math.max(game.screenShake, this.kind === "lava" ? 0.42 : 0.3);
      this.life = 0;
    }

    expire(game, directTarget = null) {
      if (this.expired) {
        return;
      }
      if (this.onExpire) {
        this.expired = true;
        this.onExpire(game, this, directTarget);
        this.life = 0;
        return;
      }
      if (this.kind === "lava" || this.kind === "ice") {
        this.detonate(game, directTarget);
        return;
      }
      this.expired = true;
      this.life = 0;
    }

    startReturn() {
      this.returning = true;
      this.passThroughWalls = true;
    }

    update(dt, game) {
      if (this.expired) {
        return;
      }
      this.life -= dt;
      this.rotation += this.rotationSpeed * dt;
      this.ignoreFunnelsTime = Math.max(0, this.ignoreFunnelsTime - dt);
      if (this.returnDelay > 0) {
        this.returnDelay -= dt;
        if (this.returnDelay <= 0) {
          this.startReturn();
        }
      }
      if (this.returning && this.owner && !this.owner.dead) {
        const toOwner = normalize(sub(this.owner.position, this.position));
        this.velocity = lerpVector(this.velocity, scale(toOwner, this.returnSpeed), clamp(dt * 5.6, 0, 1));
      }
      if (this.gravity) {
        this.velocity.y += this.gravity * dt;
      }
      if (this.onStep) {
        this.onStep(dt, game, this);
      }
      const previousPosition = { ...this.position };
      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;
      this.travelled += distance(previousPosition, this.position);

      if (typeof game.tryRedirectProjectile === "function" && this.ignoreFunnelsTime <= 0) {
        const redirected = game.tryRedirectProjectile(this);
        if (redirected) {
          return;
        }
      }

      for (const zone of game.zones) {
        if (zone.kind !== "obsidian" || !pointInZone(zone, this.position, this.radius)) {
          continue;
        }
        game.spawnShardBurst(this.position, "#8973b9", 8);
        this.expire(game);
        return;
      }

      if (this.returning && distance(this.position, this.owner.position) <= this.owner.ballRadius + this.radius + 8) {
        if (this.onCatch) {
          this.onCatch(game, this);
        }
        this.expired = true;
        this.life = 0;
        return;
      }

      let directHit = null;
      for (const target of getActiveCombatants(game)) {
        if (isCombatantDead(target)) {
          continue;
        }
        if (target === this.owner) {
          continue;
        }
        if (getCombatantSide(target) === getCombatantSide(this.owner)) {
          continue;
        }
        if (distance(target.position, this.position) <= (target.ballRadius || 0) + this.radius) {
          const lastHit = this.hitCooldowns.get(target) || -99;
          if (game.time - lastHit < 0.08) {
            continue;
          }
          this.hitCooldowns.set(target, game.time);
          directHit = target;
          break;
        }
      }

      let wallNormal = null;
      if (!this.passThroughWalls) {
        if (this.position.x - this.radius <= ARENA.x) {
          this.position.x = ARENA.x + this.radius;
          wallNormal = vec(1, 0);
        } else if (this.position.x + this.radius >= ARENA.x + ARENA.width) {
          this.position.x = ARENA.x + ARENA.width - this.radius;
          wallNormal = vec(-1, 0);
        }
        if (this.position.y - this.radius <= ARENA.y) {
          this.position.y = ARENA.y + this.radius;
          wallNormal = vec(0, 1);
        } else if (this.position.y + this.radius >= ARENA.y + ARENA.height) {
          this.position.y = ARENA.y + ARENA.height - this.radius;
          wallNormal = vec(0, -1);
        }
      }

      if (wallNormal) {
        AUDIO.wallCollision(this.kind || "projectile");
        if (this.bounces > 0) {
          this.velocity = reflect(this.velocity, wallNormal);
          this.bounces -= 1;
          if (this.onWall) {
            this.onWall(game, wallNormal, this, true);
          }
        } else if (this.onWall) {
          const keepAlive = this.onWall(game, wallNormal, this, false) === false;
          if (!keepAlive) {
            this.expire(game, directHit);
            return;
          }
        } else if (this.returnDelay >= 0) {
          this.expire(game, directHit);
          return;
        }
      }

      if (directHit) {
        if (this.onHit) {
          const destroy = this.onHit(directHit, game, this);
          if (destroy !== false) {
            if (this.pierce > 0) {
              this.pierce -= 1;
            } else {
              this.expire(game, directHit);
            }
          }
        } else {
          this.expire(game, directHit);
        }
        return;
      }

      const tooFar =
        this.position.x < ARENA.x - 220 ||
        this.position.x > ARENA.x + ARENA.width + 220 ||
        this.position.y < ARENA.y - 220 ||
        this.position.y > ARENA.y + ARENA.height + 220;
      if (tooFar || this.life <= 0) {
        this.expire(game, directHit);
      }
    }

    draw(ctx, game = null) {
      if (this.life <= 0) {
        return;
      }
      ctx.save();
      if (game) {
        const spriteKey = getProjectileSpriteKey(this.kind);
        if (spriteKey) {
          const size = this.radius * 4.4 * PROJECTILE_SPRITE_SCALE;
          if (game.drawSprite(ctx, spriteKey, this.position.x, this.position.y, size, size)) {
            ctx.restore();
            return;
          }
        }
      }
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation || angleOf(this.velocity));
      if (this.drawStyle === "trident") {
        ctx.fillStyle = "#d2fbff";
        ctx.fillRect(-this.radius * 1.7, -2, this.radius * 2.8, 4);
        ctx.beginPath();
        ctx.moveTo(this.radius * 1.2, 0);
        ctx.lineTo(this.radius * 2.4, -7);
        ctx.lineTo(this.radius * 2.1, 0);
        ctx.lineTo(this.radius * 2.4, 7);
        ctx.closePath();
        ctx.fill();
      } else if (this.drawStyle === "hook") {
        ctx.strokeStyle = "#f5f7ff";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, Math.PI * 0.3, Math.PI * 1.8);
        ctx.stroke();
      } else if (this.drawStyle === "snow") {
        ctx.strokeStyle = "#eefbff";
        ctx.lineWidth = 2;
        for (let index = 0; index < 3; index += 1) {
          ctx.beginPath();
          ctx.moveTo(-this.radius, 0);
          ctx.lineTo(this.radius, 0);
          ctx.stroke();
          ctx.rotate(Math.PI / 3);
        }
      } else if (this.drawStyle === "pearl") {
        ctx.fillStyle = "#b37cff";
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f7ecff";
        ctx.beginPath();
        ctx.arc(-this.radius * 0.25, -this.radius * 0.28, this.radius * 0.36, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.drawStyle === "fireball") {
        ctx.fillStyle = this.color || "#ffb466";
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff1c1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.72, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = this.kind === "lava" ? "#ff965f" : this.kind === "ice" ? "#dff8ff" : (this.color || "#ffffff");
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class Minion {
    constructor(options) {
      this.kind = options.kind;
      this.owner = options.owner;
      this.side = this.owner.side;
      this.position = { ...options.position };
      this.velocity = { ...options.velocity };
      this.ballRadius = options.radius || 14;
      this.mass = options.mass || 0.55;
      this.hp = options.hp || 1;
      this.maxHp = this.hp;
      this.dead = false;
      this.life = options.life || 18;
      this.speed = options.speed || 100;
      this.friction = options.friction || 0.92;
      this.statusTimers = new Map();
      this.burnTick = 0;
      this.poisonTick = 0;
      this.regenTick = 0;
      this.hitCooldown = 0;
      this.freezeStacks = 0;
      this.frozenMemory = { ...options.velocity };
      this.shotsLeft = options.shotsLeft || 0;
      this.shotCooldown = options.shotCooldown || randomRange(0.35, 0.8);
    }

    hasStatus(key) {
      return (this.statusTimers.get(key) || 0) > 0;
    }

    setStatus(key, time) {
      this.statusTimers.set(key, Math.max(this.statusTimers.get(key) || 0, time));
    }

    clearStatus(key) {
      this.statusTimers.delete(key);
    }

    receiveVelocity(force) {
      this.velocity = add(this.velocity, force);
    }

    addFreezeStacks(count, game) {
      if (this.dead) {
        return;
      }
      this.freezeStacks += count;
      if (this.freezeStacks >= 4) {
        this.freezeStacks = 0;
        this.freeze(0.9);
        if (game) {
          game.spawnShardBurst(this.position, "#e8fbff", 10);
        }
      }
    }

    freeze(time) {
      if (this.dead) {
        return;
      }
      if (!this.hasStatus("frozen")) {
        this.frozenMemory = { ...this.velocity };
      }
      this.velocity = vec(0, 0);
      this.setStatus("frozen", time);
    }

    applyBurn(time, dps = 3) {
      this.setStatus("burning", time);
      this.burnTick = Math.min(this.burnTick, 0) || 1 / Math.max(1, dps);
    }

    applyPoison(time, dps = 1) {
      this.setStatus("poison", time);
      this.poisonTick = Math.min(this.poisonTick, 0) || 1 / Math.max(1, dps);
    }

    applyRegen(time, hps = 1) {
      this.setStatus("regen", time);
      this.regenTick = Math.min(this.regenTick, 0) || 1 / Math.max(1, hps);
    }

    heal(amount) {
      if (this.dead || amount <= 0) {
        return;
      }
      this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    interruptWeapon() {}

    takeDamage(amount, info = {}) {
      if (this.dead || amount <= 0) {
        return;
      }
      if (info.sourceFighter && info.sourceFighter === this) {
        return;
      }
      const finalDamage = Math.max(1, Math.round(amount));
      this.hp -= finalDamage;
      if (info.knockback && info.hitFrom) {
        const away = normalize(sub(this.position, info.hitFrom));
        this.receiveVelocity(scale(away, info.knockback / Math.max(0.4, this.mass)));
      }
      if (this.hp <= 0) {
        this.dead = true;
        this.statusTimers.clear();
        if (info.game) {
          info.game.spawnBurst(this.position, info.color || "#ffffff", 10);
        }
      }
    }

    updateStatuses(dt, game) {
      for (const [key, value] of this.statusTimers.entries()) {
        const next = value - dt;
        if (next <= 0) {
          this.statusTimers.delete(key);
        } else {
          this.statusTimers.set(key, next);
        }
      }
      if (this.hasStatus("burning")) {
        this.burnTick -= dt;
        if (this.burnTick <= 0) {
          this.takeDamage(3, {
            game,
            type: "burn",
            ignoreArmor: true,
            color: "#ffb07a",
            sourceFighter: this.owner,
          });
          this.burnTick = 1;
        }
      } else {
        this.burnTick = 0;
      }
      if (this.hasStatus("poison")) {
        this.poisonTick -= dt;
        if (this.poisonTick <= 0) {
          this.takeDamage(1, {
            game,
            type: "poison",
            ignoreArmor: true,
            color: "#a5df7f",
            sourceFighter: this.owner,
          });
          this.poisonTick = 1;
        }
      } else {
        this.poisonTick = 0;
      }
      if (this.hasStatus("regen")) {
        this.regenTick -= dt;
        if (this.regenTick <= 0) {
          this.heal(1);
          this.regenTick = 1;
        }
      } else {
        this.regenTick = 0;
      }
    }

    updateSkeleton(dt, game) {
      if (this.shotsLeft <= 0) {
        this.dead = true;
        return;
      }
      this.shotCooldown -= dt;
      if (this.shotCooldown > 0) {
        return;
      }
      const target = getNearestEnemyTarget(game, this, null, this.position);
      if (!target) {
        this.shotCooldown = 0.35;
        return;
      }
      const dir = normalize(sub(target.position, this.position));
      AUDIO.weapon("fishingRod");
      game.projectiles.push(new Projectile({
        kind: "skeleton-arrow",
        owner: this.owner,
        position: { ...this.position },
        velocity: scale(dir, 300),
        life: 1.45,
        color: "#f6ead8",
        radius: 6,
        onHit: (hitTarget, currentGame, shot) => {
          if (hitTarget === this.owner) {
            return false;
          }
          const arrowDamage = this.owner.weapon && this.owner.weapon.id === "boneMeal" ? 7 : 6;
          hitTarget.takeDamage(arrowDamage, {
            game: currentGame,
            type: "skeleton-arrow",
            hitFrom: shot.position,
            knockback: 80,
            color: "#efe2cf",
            sourceFighter: this.owner,
          });
          if (this.owner.weapon && this.owner.weapon.id === "boneMeal" && typeof hitTarget.setStatus === "function") {
            hitTarget.setStatus("rooted", 0.35);
          }
          return true;
        },
      }));
      this.shotsLeft -= 1;
      this.shotCooldown = randomRange(0.65, 1.05);
      if (this.shotsLeft <= 0) {
        this.life = Math.min(this.life, 0.25);
      }
    }

    updateZombie(dt, game) {
      const target = getNearestEnemyTarget(game, this, null, this.position);
      if (!target) {
        return;
      }
      const desired = scale(normalize(sub(target.position, this.position)), this.speed);
      this.velocity = lerpVector(this.velocity, desired, clamp(dt * 2.6, 0, 1));
    }

    update(dt, game) {
      if (this.dead) {
        return;
      }
      this.life -= dt;
      this.hitCooldown = Math.max(0, this.hitCooldown - dt);
      if (this.life <= 0 || this.hp <= 0) {
        this.dead = true;
        return;
      }
      this.updateStatuses(dt, game);
      if (this.dead) {
        return;
      }

      if (this.hasStatus("frozen")) {
        this.velocity = vec(0, 0);
      } else if (this.kind === "zombie") {
        this.updateZombie(dt, game);
      } else if (this.kind === "skeleton") {
        this.updateSkeleton(dt, game);
      }

      this.velocity = scale(this.velocity, clamp(1 - dt * (1 - this.friction) * 8, 0, 1));
      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;

      const minX = ARENA.x + this.ballRadius;
      const maxX = ARENA.x + ARENA.width - this.ballRadius;
      const minY = ARENA.y + this.ballRadius;
      const maxY = ARENA.y + ARENA.height - this.ballRadius;
      if (this.position.x <= minX) {
        this.position.x = minX;
        this.velocity.x = Math.abs(this.velocity.x);
      } else if (this.position.x >= maxX) {
        this.position.x = maxX;
        this.velocity.x = -Math.abs(this.velocity.x);
      }
      if (this.position.y <= minY) {
        this.position.y = minY;
        this.velocity.y = Math.abs(this.velocity.y);
      } else if (this.position.y >= maxY) {
        this.position.y = maxY;
        this.velocity.y = -Math.abs(this.velocity.y);
      }
    }

    draw(ctx, game = null) {
      if (this.dead) {
        return;
      }
      ctx.save();
      if (this.kind === "zombie") {
        const spriteDrawn = game && game.drawSprite(ctx, "minionZombieHead", this.position.x, this.position.y, this.ballRadius * 2.4, this.ballRadius * 2.4);
        if (spriteDrawn) {
          ctx.restore();
          return;
        }
        ctx.fillStyle = "#8aae67";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#d6f3b8";
        ctx.fillRect(this.position.x - 4, this.position.y - 2, 8, 4);
      } else {
        const spriteDrawn = game && game.drawSprite(ctx, "minionSkeletonHead", this.position.x, this.position.y, this.ballRadius * 2.4, this.ballRadius * 2.4);
        if (spriteDrawn) {
          ctx.restore();
          return;
        }
        ctx.fillStyle = "#e4dccf";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.ballRadius - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#a8967d";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.position.x - this.ballRadius - 4, this.position.y - 8);
        ctx.lineTo(this.position.x + this.ballRadius + 6, this.position.y - 8);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  class Fighter {
    constructor(options) {
      this.side = options.side;
      this.weaponId = options.weaponId;
      this.name = (WEAPON_LIBRARY[options.weaponId] || LEGACY_WEAPON_LIBRARY[options.weaponId] || { title: options.weaponId }).title;
      this.baseColor = options.baseColor;
      this.ballRadius = Math.round(58 * PLAYER_BALL_SCALE);
      this.mass = 1;
      this.armorMultiplier = 1;
      this.position = { ...options.position };
      this.velocity = { ...options.velocity };
      this.initialVelocity = { ...options.velocity };
      this.hp = 100;
      this.baseMaxHp = 100;
      this.maxHp = 100;
      this.dead = false;
      this.damageFlash = 0;
      this.statusTimers = new Map();
      this.statusList = [];
      this.hitCooldown = 0;
      this.frozenMemory = { ...options.velocity };
      this.frozenReplaced = false;
      this.lastWallAt = -99;
      this.weapon = null;
      this.shieldHp = 0;
      this.freezeStacks = 0;
      this.experience = 0;
      this.overcharge = 0;
      this.enchantReady = false;
      this.burnTick = 0;
      this.poisonTick = 0;
      this.regenTick = 0;
      this.opacity = 1;
      this.lastDamageType = "";
      this.bonusDamageMultiplier = 1;
      this.rageMomentum = 0;
    }

    setWeapon(weapon) {
      this.weapon = weapon;
      this.baseMaxHp = 100;
      this.maxHp = this.baseMaxHp;
      this.hp = this.maxHp;
      applyWeaponBalanceFrame(weapon);
      this.mass = weapon.mass;
      this.armorMultiplier = weapon.armorMultiplier;
      this.name = (WEAPON_LIBRARY[weapon.id] || LEGACY_WEAPON_LIBRARY[weapon.id] || { title: weapon.id }).title;
    }

    hasStatus(key) {
      return (this.statusTimers.get(key) || 0) > 0;
    }

    setStatus(key, time) {
      this.statusTimers.set(key, Math.max(this.statusTimers.get(key) || 0, time));
    }

    clearStatus(key) {
      this.statusTimers.delete(key);
    }

    heal(amount, game, color = "#86ffb4") {
      if (this.dead || amount <= 0) {
        return;
      }
      const healScale = game && typeof game.getSuddenDeathHealScale === "function" ? game.getSuddenDeathHealScale() : 1;
      const scaledAmount = amount * healScale;
      if (scaledAmount <= 0) {
        return;
      }
      if (this.overcharge >= 10 || this.hasStatus("overcharged")) {
        this.takeDamage(Math.max(1, Math.round(scaledAmount * 0.5)), {
          game,
          type: "overcharge",
          color: "#d49cff",
          ignoreArmor: true,
          hitFrom: this.position,
        });
        return;
      }
      const healed = Math.min(this.maxHp - this.hp, scaledAmount);
      if (healed <= 0) {
        return;
      }
      this.hp += healed;
      if (game) {
        game.addFloatingText(`+${Math.round(healed)}`, add(this.position, vec(0, -34)), color);
      }
    }
    addShield(amount, game, color = "#ffe27a") {
      if (this.dead || amount <= 0) {
        return;
      }
      const shieldScale = game && typeof game.getSuddenDeathShieldScale === "function" ? game.getSuddenDeathShieldScale() : 1;
      const scaledAmount = amount * shieldScale;
      if (scaledAmount <= 0) {
        return;
      }
      if (this.overcharge >= 10 || this.hasStatus("overcharged")) {
        this.takeDamage(Math.max(1, Math.round(scaledAmount * 0.35)), {
          game,
          type: "overcharge-shield",
          color: "#d49cff",
          ignoreArmor: true,
          hitFrom: this.position,
        });
        return;
      }
      this.shieldHp += scaledAmount;
      this.setStatus("shielded", 4.2);
      if (game) {
        game.addFloatingText(`SHIELD +${Math.round(scaledAmount)}`, add(this.position, vec(0, -42)), color);
      }
    }
    applyBurn(time, dps = 3) {
      this.setStatus("burning", time);
      this.burnTick = Math.min(this.burnTick, 0) || 1 / Math.max(1, dps);
    }

    applyPoison(time, dps = 1) {
      this.setStatus("poison", time);
      this.poisonTick = Math.min(this.poisonTick, 0) || 1 / Math.max(1, dps);
    }

    applyRegen(time, hps = 2) {
      this.setStatus("regen", time);
      this.regenTick = Math.min(this.regenTick, 0) || 1 / Math.max(1, hps);
    }

    addFreezeStacks(count, game) {
      if (this.dead) {
        return;
      }
      this.freezeStacks += count;
      if (this.freezeStacks >= 5) {
        this.freezeStacks = 0;
        this.freeze(1.2);
        this.setStatus("anchored", 0.25);
        this.setStatus("exposed", 2.6);
        if (game) {
          game.addFloatingText("ICE", add(this.position, vec(0, -52)), "#d7f7ff");
          game.spawnShardBurst(this.position, "#e8fbff", 20);
        }
      }
    }

    freeze(time) {
      if (this.dead) {
        return;
      }
      if (!this.hasStatus("frozen")) {
        this.frozenMemory = { ...this.velocity };
        this.velocity = vec(0, 0);
        this.frozenReplaced = false;
      }
      this.setStatus("frozen", time);
    }

    receiveVelocity(force) {
      this.velocity = add(this.velocity, force);
      if (this.hasStatus("frozen")) {
        this.frozenReplaced = true;
      }
    }

    interruptWeapon(time = 1) {
      this.setStatus("silenced", time);
      if (this.weapon && typeof this.weapon.interrupt === "function") {
        this.weapon.interrupt(time);
      }
    }

    takeDamage(amount, info = {}) {
      if (this.dead) {
        return;
      }
      if (info.sourceFighter === this) {
        return;
      }
      if (this.hasStatus("invulnerable") && !info.ignoreInvulnerable) {
        return;
      }
      AUDIO.impact(info.type || "hit");

      let sourceBonus = 1;
      if (info.sourceFighter) {
        sourceBonus *= info.sourceFighter.bonusDamageMultiplier || 1;
        if (typeof info.sourceFighter.hasStatus === "function" && info.sourceFighter.hasStatus("totemFury")) {
          sourceBonus *= 1.2;
        }
        if (info.sourceFighter.weapon && info.sourceFighter.weapon.id === "shulkerBox") {
          sourceBonus *= 1.2;
        }
        // Apply weapon-specific damage multiplier from config
        if (info.sourceFighter.weapon && Number.isFinite(info.sourceFighter.weapon.damageMultiplier)) {
          sourceBonus *= info.sourceFighter.weapon.damageMultiplier;
        }
      }
      amount *= GLOBAL_DAMAGE_SCALE * sourceBonus;
      if (this.weapon && Number.isFinite(this.weapon.damageTakenMultiplier)) {
        amount *= this.weapon.damageTakenMultiplier;
      }
      let armor = info.ignoreArmor ? 1 : this.armorMultiplier;
      let enchantBonus = 1;
      if (this.hasStatus("tanking")) {
        armor *= 0.68;
      }
      if (info.sourceFighter && info.sourceFighter.enchantReady) {
        enchantBonus = 1.3;
        info.sourceFighter.enchantReady = false;
        const curse = randomInt(0, 2);
        if (curse === 0) {
          this.applyBurn(2.4, 3);
        } else if (curse === 1) {
          this.applyPoison(3.6, 1);
        } else {
          this.setStatus("rooted", 1.1);
        }
      }

      const crit = chance(0.12);
      let scaled = Math.max(1, Math.round(amount * armor * enchantBonus * (crit ? 1.45 : 1)));
      if (scaled > 0) {
        const dynamicAdrenaline = GLOBAL_ADRENALINE_DURATION + clamp((scaled / 30) * 0.9, 0, 1.2);
        this.setStatus("adrenaline", dynamicAdrenaline);
      }
      if (this.hasStatus("marked")) {
        scaled = Math.max(1, Math.round(scaled * 1.18));
        this.clearStatus("marked");
      }
      if (this.hasStatus("exposed")) {
        scaled = Math.max(1, Math.round(scaled * 2.2));
        this.clearStatus("exposed");
      }
      if (this.weapon && typeof this.weapon.modifyIncomingDamage === "function") {
        scaled = Math.max(0, Math.round(this.weapon.modifyIncomingDamage(scaled, info) ?? scaled));
      }

      let remaining = scaled;
      if (this.shieldHp > 0) {
        const absorbed = Math.min(this.shieldHp, remaining);
        this.shieldHp -= absorbed;
        remaining -= absorbed;
      }

      if (remaining > 0 && this.hp - remaining <= 0 && !info.ignoreDeathPrevention && this.weapon && typeof this.weapon.tryPreventDeath === "function") {
        if (this.weapon.tryPreventDeath(remaining, info)) {
          return;
        }
      }

      this.hp = Math.max(0, this.hp - remaining);
      this.damageFlash = 0.18;
      this.lastDamageType = info.type || "hit";
      const resolvedDamage = remaining > 0 ? remaining : scaled;
      this.rageMomentum = clamp(this.rageMomentum + resolvedDamage * 0.024, 0, 2.6);
      if (info.knockback) {
        this.setStatus("knockback", 0.18);
      }

      if (info.knockback && info.hitFrom) {
        const direction = normalize(sub(this.position, info.hitFrom));
        const damageImpulseMult = clamp(1 + (resolvedDamage * DAMAGE_IMPULSE_PER_POINT), 1, DAMAGE_IMPULSE_MAX_MULT);
        let knockback = (info.knockback * CHAOS_KNOCKBACK_MULT * damageImpulseMult) / Math.max(0.45, this.mass);
        if (this.hasStatus("snagged")) {
          knockback *= 1.35;
        }
        if (this.hasStatus("tanking")) {
          knockback *= 0.65;
        }
        this.receiveVelocity(scale(direction, knockback));
        const tangent = perpendicular(direction);
        const roundChaosRamp = info.game ? clamp((info.game.roundTime - 20) / 120, 0, 0.22) : 0;
        const spinScale = CHAOS_SPIN_IMPULSE + clamp(resolvedDamage / 85, 0, 0.55) + roundChaosRamp;
        const spinSeed = Math.sin((this.position.x * 0.014) + (this.position.y * 0.019) + (info.hitFrom.x * 0.011) + (info.hitFrom.y * 0.023));
        const spinDirection = spinSeed >= 0 ? 1 : -1;
        const spinForce = knockback * spinScale * spinDirection;
        this.receiveVelocity(scale(tangent, spinForce));
      }

      if (this.weapon && typeof this.weapon.onOwnerDamaged === "function") {
        info.resolvedDamage = remaining > 0 ? remaining : scaled;
        this.weapon.onOwnerDamaged(info);
      }

      if (info.game) {
        const damageText = remaining > 0 ? remaining : scaled;
        info.game.addFloatingText(`-${damageText}${crit ? "!" : ""}`, add(this.position, vec(0, -26)), info.color || "#ffffff");
        info.game.spawnBurst(this.position, info.color || "#ffffff", crit ? 30 : 18);
      }

      if (this.hp <= 0) {
        this.dead = true;
        this.statusTimers.clear();
        this.setStatus("dead", 99);
        this.updateStatusList();
        if (info.game) {
          info.game.onFighterKilled(this, info);
        }
      }
    }

    update(dt, game, enemy) {
      if (this.dead) {
        return;
      }

      if (this.damageFlash > 0) {
        this.damageFlash = Math.max(0, this.damageFlash - dt);
      }
      if (this.hitCooldown > 0) {
        this.hitCooldown = Math.max(0, this.hitCooldown - dt / GLOBAL_COOLDOWN_SCALE);
      }
      this.rageMomentum = Math.max(0, this.rageMomentum - dt * RAGE_MOMENTUM_DECAY);
      this.opacity = this.hasStatus("invisible") ? 0.22 : 1;

      for (const [key, value] of this.statusTimers.entries()) {
        const next = value - dt;
        if (next <= 0) {
          this.statusTimers.delete(key);
          if (key === "frozen" && !this.frozenReplaced) {
            this.velocity = { ...this.frozenMemory };
          }
        } else {
          this.statusTimers.set(key, next);
        }
      }

      if (this.hasStatus("burning")) {
        this.burnTick -= dt;
        if (this.burnTick <= 0) {
          this.takeDamage(3, {
            game,
            type: "burn",
            color: "#ffae73",
            ignoreArmor: true,
            hitFrom: this.position,
          });
          this.burnTick = 1;
        }
      } else {
        this.burnTick = 0;
      }

      if (this.hasStatus("poison")) {
        this.poisonTick -= dt;
        if (this.poisonTick <= 0) {
          this.takeDamage(1, {
            game,
            type: "poison",
            color: "#9fe07d",
            ignoreArmor: true,
            hitFrom: this.position,
          });
          this.poisonTick = 1;
        }
      } else {
        this.poisonTick = 0;
      }

      if (this.hasStatus("regen")) {
        this.regenTick -= dt;
        if (this.regenTick <= 0) {
          this.heal(1, game, "#9cffc9");
          this.regenTick = 2;
        }
      } else {
        this.regenTick = 0;
      }

      if (this.hasStatus("submerged")) {
        this.velocity = scale(this.velocity, 1 - dt * 0.82);
      }
      if (this.hasStatus("rooted")) {
        this.velocity = scale(this.velocity, 1 - dt * 1.35);
      }
      if (this.hasStatus("shocked")) {
        this.velocity = scale(this.velocity, 1 - dt * 0.28);
      }
      if (this.hasStatus("spooked")) {
        this.velocity = rotateVector(this.velocity, Math.sin(game.time * 18 + (this.side === "left" ? 0 : Math.PI)) * dt * 0.75);
        this.velocity = scale(this.velocity, 1 - dt * 0.12);
      }
      if (this.hasStatus("foreseen")) {
        this.velocity = scale(this.velocity, 1 + dt * 0.18);
      }
      if (this.hasStatus("gliding")) {
        this.velocity = scale(this.velocity, 1 + dt * 0.08);
      }

      if (this.hasStatus("invisible")) {
        this.setStatus("phase", 0.12);
      }

      if (this.weapon) {
        restoreWeaponBalanceFrame(this.weapon);
        this.weapon.update(dt, game, enemy);
        applyWeaponBalanceFrame(this.weapon);
      }

      this.mass = this.weapon ? this.weapon.mass : 1;
      this.armorMultiplier = this.weapon ? this.weapon.armorMultiplier : 1;
      if (this.hasStatus("submerged")) {
        this.mass *= 3;
      }
      if (this.hasStatus("gliding")) {
        this.mass *= 0.8;
      }
      if (this.hasStatus("tanking")) {
        this.mass *= 1.05;
      }

      const currentSpeed = length(this.velocity);
      if (currentSpeed > 0 && this.hasStatus("adrenaline")) {
        this.velocity = scale(normalize(this.velocity), currentSpeed * GLOBAL_ADRENALINE_MULT);
      }
      let speedLimit = this.weapon && this.weapon.id === "boat" && this.weapon.iceBoostTimer > 0 ? 620 : 410;
      speedLimit += this.rageMomentum * 220;
      if (this.weapon && typeof this.weapon.modifySpeedLimit === "function") {
        speedLimit = this.weapon.modifySpeedLimit(speedLimit, game, enemy);
      }
      if (this.hasStatus("submerged")) {
        speedLimit = Math.min(speedLimit, 220);
      }
      if (this.hasStatus("tanking")) {
        speedLimit = Math.max(speedLimit, 492);
      }
      if (this.hasStatus("totemFury")) {
        speedLimit = Math.max(speedLimit, 533);
      }
      if (this.hasStatus("gliding")) {
        speedLimit = Math.max(speedLimit, 480);
      }
      if (currentSpeed > speedLimit) {
        this.velocity = scale(normalize(this.velocity), speedLimit);
      }

      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;
      game.handleArenaCollision(this);
      this.updateStatusList();
    }

    updateStatusList() {
      const list = [];
      if (this.dead) {
        list.push("dead");
      } else {
        if (this.weapon && this.weapon.stateKey) {
          list.push(this.weapon.stateKey);
        } else {
          list.push("normal");
        }
        if (this.hasStatus("frozen")) {
          list.push("frozen");
        }
        if (this.hasStatus("knockback")) {
          list.push("knockback");
        }
        if (this.hasStatus("hooked")) {
          list.push("hooked");
        }
        if (this.hasStatus("burning")) {
          list.push("burning");
        }
        if (this.hasStatus("submerged")) {
          list.push("submerged");
        }
        if (this.hasStatus("snagged")) {
          list.push("snagged");
        }
        if (this.hasStatus("shocked")) {
          list.push("shocked");
        }
        if (this.hasStatus("invisible")) {
          list.push("invisible");
        }
        if (this.hasStatus("invulnerable")) {
          list.push("warded");
        }
        if (this.hasStatus("gliding")) {
          list.push("gliding");
        }
        if (this.hasStatus("spooked")) {
          list.push("spooked");
        }
        if (this.hasStatus("marked")) {
          list.push("marked");
        }
        if (this.hasStatus("tanking")) {
          list.push("tanking");
        }
        if (this.hasStatus("anchored")) {
          list.push("anchored");
        }
        if (this.hasStatus("levitating")) {
          list.push("levitating");
        }
        if (this.hasStatus("rooted")) {
          list.push("rooted");
        }
        if (this.hasStatus("poison")) {
          list.push("poison");
        }
        if (this.hasStatus("regen")) {
          list.push("regen");
        }
        if (this.hasStatus("silenced")) {
          list.push("silenced");
        }
        if (this.hasStatus("foreseen")) {
          list.push("foreseen");
        }
        if (this.shieldHp > 0) {
          list.push("shielded");
        }
        if (this.overcharge >= 10) {
          list.push("overcharged");
        }
      }

      list.sort((a, b) => {
        const left = STATUS_PRIORITY.indexOf(a);
        const right = STATUS_PRIORITY.indexOf(b);
        return (left === -1 ? 999 : left) - (right === -1 ? 999 : right);
      });
      this.statusList = [...new Set(list)];
    }
  }

  class RailWeapon {
    constructor(owner) {
      this.id = "rail";
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 1;
      this.armorMultiplier = 1;
      this.wallHits = 0;
      this.trailPoints = [];
      this.track = null;
      this.wagons = [];
      this.chargeTimer = 0;
      this.fireTimer = 0;
      this.spawnTimer = 0;
      this.wagonsLeft = 0;
      this.lastWagonSoundAt = -99;
      this.breakCooldown = 0;
      this.comboHitAt = -99;
      this.railRadius = 28;
      this.wallHitsToFinalize = Math.max(2, Math.round(balanceNumber(RAIL_BALANCE.wallHitsToFinalize, 4)));
      this.minTrailPoints = Math.max(5, Math.round(balanceNumber(RAIL_BALANCE.minTrailPoints, 7)));
      this.chargeTimeSec = Math.max(0.1, balanceNumber(RAIL_BALANCE.chargeTimeSec, 0.32));
      this.fireTimeSec = Math.max(1.5, balanceNumber(RAIL_BALANCE.fireTimeSec, 4.2));
      this.wagonCount = Math.max(1, Math.round(balanceNumber(RAIL_BALANCE.wagonCount, 6)));
      this.wagonSpawnDelaySec = Math.max(0.05, balanceNumber(RAIL_BALANCE.wagonSpawnDelaySec, 0.18));
      this.wagonDamageMin = Math.max(1, Math.round(balanceNumber(RAIL_BALANCE.wagonDamageMin, 6)));
      this.wagonDamageMax = Math.max(this.wagonDamageMin, Math.round(balanceNumber(RAIL_BALANCE.wagonDamageMax, 7)));
      this.wagonHitCooldownSec = Math.max(0.05, balanceNumber(RAIL_BALANCE.wagonHitCooldownSec, 0.12));
      this.comboCooldownSec = Math.max(0.2, balanceNumber(RAIL_BALANCE.comboCooldownSec, 0.85));
      this.comboDamage = Math.max(1, Math.round(balanceNumber(RAIL_BALANCE.comboDamage, 7)));
      this.comboDamageLate = Math.max(this.comboDamage, Math.round(balanceNumber(RAIL_BALANCE.comboDamageLate, 10)));
      this.comboRequiredWagons = Math.max(1, Math.round(balanceNumber(RAIL_BALANCE.comboRequiredWagons, 2)));
      this.comboRequiredWagonsLate = Math.max(1, Math.round(balanceNumber(RAIL_BALANCE.comboRequiredWagonsLate, 1)));
      this.pullStrength = Math.max(50, balanceNumber(RAIL_BALANCE.pullStrength, 250));
      this.pullLateMultiplier = Math.max(0, balanceNumber(RAIL_BALANCE.pullLateMultiplier, 0.45));
      this.terminalStartSec = Math.max(0, balanceNumber(RAIL_BALANCE.terminalStartSec, 50));
      this.terminalPullMultiplier = Math.max(1, balanceNumber(RAIL_BALANCE.terminalPullMultiplier, 1.25));
      this.terminalDamageBonus = Math.max(0, balanceNumber(RAIL_BALANCE.terminalDamageBonus, 3));
      this.terminalSpawnRateBonus = clamp(balanceNumber(RAIL_BALANCE.terminalSpawnRateBonus, 0.2), 0, 0.8);
    }

    reset() {
      this.stateKey = "normal";
      this.wallHits = 0;
      this.trailPoints = [];
      this.track = null;
      this.wagons = [];
      this.chargeTimer = 0;
      this.fireTimer = 0;
      this.spawnTimer = 0;
      this.wagonsLeft = 0;
      this.lastWagonSoundAt = -99;
      this.breakCooldown = 0;
      this.comboHitAt = -99;
    }

    startTrail() {
      this.stateKey = "laying";
      this.wallHits = 1;
      this.trailPoints = [{ ...this.owner.position }];
      this.track = null;
      this.wagons = [];
      this.lastWagonSoundAt = -99;
    }

    breakTrail() {
      if (this.stateKey === "laying") {
        this.stateKey = "normal";
        this.wallHits = 0;
        this.trailPoints = [];
        this.track = null;
        this.breakCooldown = 0.22;
      }
    }

    finalizeTrail(game) {
      if (this.trailPoints.length < this.minTrailPoints) {
        this.breakTrail();
        return;
      }
      this.stateKey = "charging";
      this.track = createTrailPath(this.trailPoints);
      this.trailPoints = [];
      this.chargeTimer = this.chargeTimeSec;
      this.fireTimer = 0;
      this.spawnTimer = 0;
      this.wagonsLeft = this.wagonCount;
      this.wagons = [];
      this.lastWagonSoundAt = -99;
      AUDIO.chargeWeapon("rail");
      if (game) {
        game.screenShake = Math.max(game.screenShake, 0.42);
        for (const point of this.track.points) {
          game.spawnBurst(point, "#f4f7fd", 6);
        }
      }
    }

    onWallHit(_normal, game) {
      if (this.owner.dead || this.owner.hasStatus("frozen") || this.owner.hasStatus("knockback")) {
        return;
      }
      if (this.breakCooldown > 0 || this.stateKey === "charging" || this.stateKey === "firing") {
        return;
      }
      if (this.stateKey === "normal") {
        this.startTrail();
        return;
      }
      if (this.stateKey === "laying") {
        this.wallHits += 1;
        this.trailPoints.push({ ...this.owner.position });
        if (this.wallHits >= this.wallHitsToFinalize) {
          this.finalizeTrail(game);
        }
      }
    }

    onOwnerDamaged(info) {
      if (info.type === "sudden-death") {
        return;
      }
      // Removed breakTrail to only break on ball collision
    }

    interrupt() {
      if (this.stateKey === "laying") {
        this.breakTrail();
      } else if (this.stateKey === "charging") {
        this.stateKey = "normal";
        this.track = null;
        this.wallHits = 0;
        this.trailPoints = [];
        this.wagons = [];
        this.wagonsLeft = 0;
        this.chargeTimer = 0;
        this.lastWagonSoundAt = -99;
        this.breakCooldown = 0.35;
      }
    }

    onTouchEnemy() {
      if (this.stateKey === "laying") {
        this.breakTrail();
      }
    }

    spawnWagon(game, enemy) {
      const speedBase = randomRange(1.34, 1.54);
      this.wagons.push({
        progress: 0,
        speed: speedBase,
        lastHitAt: -1,
        damage: randomInt(this.wagonDamageMin, this.wagonDamageMax),
        enemy,
      });
      game.screenShake = Math.max(game.screenShake, 0.34);
      AUDIO.weapon("hopperMinecart");
    }

    update(dt, game, enemy) {
      enemy = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      const terminalProgress = ROUND_LIMIT_SEC > this.terminalStartSec
        ? clamp((game.roundTime - this.terminalStartSec) / (ROUND_LIMIT_SEC - this.terminalStartSec), 0, 1)
        : (game.roundTime >= this.terminalStartSec ? 1 : 0);
      if (this.breakCooldown > 0) {
        this.breakCooldown = Math.max(0, this.breakCooldown - getWeaponCooldownDecay(this, dt));
      }

      if ((this.stateKey === "charging" || this.stateKey === "firing") && this.track && enemy && !isCombatantDead(enemy)) {
        const closest = closestPointOnPath(this.track, enemy.position);
        if (closest) {
          const attractionRadius = enemy.ballRadius + this.railRadius + enemy.ballRadius;
          const d = distance(closest, enemy.position);
          if (d <= attractionRadius) {
            const pullDir = normalize(sub(closest, enemy.position));
            let pullStrength = this.pullStrength * (1 + terminalProgress * this.pullLateMultiplier);
            if (terminalProgress > 0) {
              pullStrength *= this.terminalPullMultiplier;
            }
            enemy.receiveVelocity(scale(pullDir, pullStrength * dt));
          }
        }
      }

      if (this.stateKey === "laying") {
        const last = this.trailPoints[this.trailPoints.length - 1];
        if (!last || distance(last, this.owner.position) > 7) {
          this.trailPoints.push({ ...this.owner.position });
        }
      } else if (this.stateKey === "charging") {
        this.chargeTimer -= dt;
        if (this.chargeTimer <= 0) {
          this.stateKey = "firing";
          this.fireTimer = this.fireTimeSec;
          this.spawnTimer = 0.02;
          this.lastWagonSoundAt = game.time - 0.2;
          AUDIO.weapon("rail");
        }
      } else if (this.stateKey === "firing") {
        this.fireTimer -= dt;
        this.spawnTimer -= dt;
        if (this.wagonsLeft > 0 && this.spawnTimer <= 0) {
          this.spawnWagon(game, enemy);
          this.wagonsLeft -= 1;
          const spawnScale = 1 - (terminalProgress * this.terminalSpawnRateBonus);
          this.spawnTimer = this.wagonSpawnDelaySec * Math.max(0.2, spawnScale);
        }

        const nextWagons = [];
        for (const wagon of this.wagons) {
          let progressStep = wagon.speed * dt;
          progressStep *= 1 + terminalProgress * 0.7;
          wagon.progress += progressStep;
          const position = samplePath(this.track, wagon.progress);
          wagon.position = position;

          if (enemy && !isCombatantDead(enemy) && distance(position, enemy.position) <= enemy.ballRadius + 36) {
            const canHit = game.time - wagon.lastHitAt > this.wagonHitCooldownSec;
            if (canHit) {
              const lateFightDamageBonus = Math.round(this.terminalDamageBonus * terminalProgress);
              enemy.takeDamage(wagon.damage + lateFightDamageBonus, {
                game,
                type: "wagon",
                hitFrom: position,
                knockback: 420,
                color: "#ff8c8c",
                sourceFighter: this.owner,
              });
              wagon.lastHitAt = game.time;
              game.screenShake = Math.max(game.screenShake, 0.62);
              game.spawnBurst(position, "#ffe8e8", 24);
              game.spawnShardBurst(position, "#fff0cc", 8);
            }
          }

          if (wagon.progress <= 1.02) {
            nextWagons.push(wagon);
          }
        }
        this.wagons = nextWagons;

        if (this.wagons.length > 0 && game.time - this.lastWagonSoundAt > Math.max(0.14, 0.26 - this.wagons.length * 0.018)) {
          const loopSound = this.wagons.length > 1 ? "rail" : "hopperMinecart";
          const intensity = clamp(this.wagons.length / Math.max(1, this.wagonCount), 0.3, 1);
          AUDIO.weaponLoop(loopSound, intensity);
          this.lastWagonSoundAt = game.time;
        }

        const closeWagons = this.wagons.filter((wagon) => wagon.position && distance(wagon.position, enemy.position) <= enemy.ballRadius + 120).length;
        const requiredWagons = Math.round(lerp(this.comboRequiredWagons, this.comboRequiredWagonsLate, terminalProgress));
        if (enemy && !isCombatantDead(enemy) && game.time - this.comboHitAt > this.comboCooldownSec && closeWagons >= requiredWagons) {
          const comboDamage = Math.round(lerp(this.comboDamage, this.comboDamageLate, terminalProgress));
          enemy.takeDamage(comboDamage, {
            game,
            type: "wagon-clamp",
            hitFrom: enemy.position,
            knockback: 320,
            color: "#ffe1af",
            sourceFighter: this.owner,
          });
          if (typeof enemy.setStatus === "function") {
            enemy.setStatus("anchored", lerp(0.72, 1.05, terminalProgress));
            if (terminalProgress > 0.45) {
              enemy.setStatus("marked", 1.4);
            }
          }
          this.comboHitAt = game.time;
          game.spawnBurst(enemy.position, "#ffeac6", 20);
        }

        if (this.fireTimer <= 0 && this.wagons.length === 0 && this.wagonsLeft <= 0) {
          this.stateKey = "normal";
          this.track = null;
          this.wallHits = 0;
          this.lastWagonSoundAt = -99;
        }
      }
    }

    drawArena(ctx, game = null) {
      const source = this.stateKey === "laying" ? this.trailPoints : this.track ? this.track.points : [];
      if (!source || source.length < 2) {
        return;
      }

      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = CUSTOM_ASSETS.rail.glow;
      ctx.lineWidth = 32;
      ctx.beginPath();
      ctx.moveTo(source[0].x, source[0].y);
      for (let index = 1; index < source.length; index += 1) {
        ctx.lineTo(source[index].x, source[index].y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = CUSTOM_ASSETS.rail.metalLight;
      ctx.lineWidth = 22;
      ctx.moveTo(source[0].x, source[0].y);
      for (let index = 1; index < source.length; index += 1) {
        ctx.lineTo(source[index].x, source[index].y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = CUSTOM_ASSETS.rail.metalDark;
      ctx.lineWidth = 10;
      ctx.moveTo(source[0].x, source[0].y);
      for (let index = 1; index < source.length; index += 1) {
        ctx.lineTo(source[index].x, source[index].y);
      }
      ctx.stroke();

      for (let index = 2; index < source.length; index += 3) {
        const p1 = source[index - 1];
        const p2 = source[index];
        const normal = normalize(perpendicular(sub(p2, p1)));
        const center = source[index];
        ctx.beginPath();
        ctx.strokeStyle = CUSTOM_ASSETS.rail.sleeper;
        ctx.lineWidth = 12;
        ctx.moveTo(center.x + normal.x * 20, center.y + normal.y * 20);
        ctx.lineTo(center.x - normal.x * 20, center.y - normal.y * 20);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = CUSTOM_ASSETS.rail.sleeperShadow;
        ctx.lineWidth = 4;
        ctx.moveTo(center.x + normal.x * 20, center.y + normal.y * 20);
        ctx.lineTo(center.x - normal.x * 20, center.y - normal.y * 20);
        ctx.stroke();
      }

      ctx.restore();

      for (const wagon of this.wagons) {
        this.drawWagon(ctx, wagon, game);
      }
    }

    drawOwnerAttachment(ctx, game) {
      const pos = this.owner.position;
      if (game && game.drawSprite(ctx, "railAttachment", pos.x + 78, pos.y + 48, 120, 120)) {
        return;
      }
      ctx.save();
      ctx.translate(pos.x + 78, pos.y + 48);
      ctx.fillStyle = "#86785a";
      ctx.fillRect(-33, -20, 66, 40);
      ctx.fillStyle = "#d4d0c5";
      ctx.fillRect(-24, -16, 48, 12);
      ctx.fillStyle = "#4e4f56";
      ctx.fillRect(-33, 14, 66, 8);
      ctx.restore();
    }

    drawWagon(ctx, wagon, game = null) {
      if (!wagon.position || !this.track) {
        return;
      }
      const tangent = pathTangent(this.track, wagon.progress);
      const angle = angleOf(tangent);
      if (game) {
        ctx.save();
        ctx.translate(wagon.position.x, wagon.position.y);
        ctx.rotate(angle);
        ctx.fillStyle = "rgba(255, 248, 200, 0.22)";
        ctx.beginPath();
        ctx.ellipse(0, 8, 58, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (
          game.drawSprite(ctx, "wagon", wagon.position.x, wagon.position.y, 136, 136, { rotation: angle }) ||
          game.drawSprite(ctx, "hopperMinecart", wagon.position.x, wagon.position.y, 136, 136, { rotation: angle })
        ) {
          return;
        }
      }
      ctx.save();
      ctx.translate(wagon.position.x, wagon.position.y);
      ctx.rotate(angle);
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.fillRect(-36, -28, 72, 56);
      ctx.fillStyle = CUSTOM_ASSETS.wagon.shell;
      ctx.fillRect(-32, -24, 64, 48);
      ctx.fillStyle = CUSTOM_ASSETS.wagon.trim;
      ctx.fillRect(-26, -18, 52, 10);
      ctx.fillStyle = CUSTOM_ASSETS.wagon.cab;
      ctx.fillRect(-22, -8, 44, 24);
      ctx.fillStyle = CUSTOM_ASSETS.wagon.wheel;
      ctx.beginPath();
      ctx.arc(-20, 26, 8, 0, Math.PI * 2);
      ctx.arc(20, 26, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class BoatWeapon {
    constructor(owner) {
      this.id = "boat";
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 1.28;
      this.armorMultiplier = 0.94;
      this.attackCooldown = 1.05;
      this.contactCooldown = 0;
      this.bucketKind = "ice";
      this.iceBoostTimer = 0;
      this.bucketFlip = false;
    }

    reset() {
      this.stateKey = "normal";
      this.attackCooldown = 4.2;
      this.contactCooldown = 0;
      this.bucketKind = chance(0.65) ? "ice" : "lava";
      this.iceBoostTimer = 0;
      this.bucketFlip = false;
    }

    interrupt() {
      this.iceBoostTimer = 0;
      this.contactCooldown = Math.max(this.contactCooldown, 0.25);
      this.attackCooldown = Math.max(this.attackCooldown, 0.75);
      this.stateKey = "normal";
    }

    boostFromIce(zoneOwner = null) {
      if (zoneOwner && zoneOwner !== this.owner) {
        return;
      }
      this.iceBoostTimer = 10;
    }

    throwBucket(game, enemy) {
      const autoTarget = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      const baseAim = aimAtEnemy(this.owner, autoTarget, 0.18, game);
      const shotDir = rotateVector(baseAim, randomRange(-0.08, 0.08));
      const speed = this.bucketKind === "lava" ? 228 : 208;
      const start = add(this.owner.position, scale(shotDir, this.owner.ballRadius + 20));
      game.projectiles.push(new Projectile({
        kind: this.bucketKind,
        owner: this.owner,
        position: start,
        velocity: add(scale(shotDir, speed), scale(this.owner.velocity, 0.36)),
        life: 0.52,
        color: this.bucketKind === "lava" ? "#ff9a67" : "#dff9ff",
        radius: this.bucketKind === "lava" ? 14 : 12,
      }));
      this.bucketKind = this.bucketFlip ? "ice" : (chance(0.4) ? "lava" : "ice");
      this.bucketFlip = !this.bucketFlip;
    }

    onTouchEnemy(enemy, game) {
      if (this.contactCooldown > 0 || this.owner.dead) {
        return;
      }
      const dashing = this.iceBoostTimer > 0;
      enemy.takeDamage(dashing ? 2.25 : 0.75, {
        game,
        type: dashing ? "dash" : "boat-contact",
        hitFrom: this.owner.position,
        knockback: dashing ? 290 : 156,
        color: dashing ? "#98e0ff" : "#9ccfff",
      });
      this.contactCooldown = dashing ? 0.32 : 0.55;
      if (dashing) {
        game.screenShake = Math.max(game.screenShake, 0.56);
        game.spawnBurst(enemy.position, "#b8edff", 18);
      }
    }

    update(dt, game, enemy) {
      enemy = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      if (this.contactCooldown > 0) {
        this.contactCooldown = Math.max(0, this.contactCooldown - getWeaponCooldownDecay(this, dt));
      }

      if (this.iceBoostTimer > 0) {
        this.iceBoostTimer = Math.max(0, this.iceBoostTimer - dt);
        this.stateKey = "dashing";
        const dir = length(this.owner.velocity) > 0.01 ? normalize(this.owner.velocity) : vec(this.owner.side === "left" ? 1 : -1, 0);
        const speedBonus = 1 + (this.iceBoostTimer / 5);
        const desiredSpeed = Math.max(length(this.owner.velocity), 280 * speedBonus);
        this.owner.velocity = lerpVector(this.owner.velocity, scale(dir, desiredSpeed), clamp(dt * 3.2, 0, 1));
      } else {
        this.stateKey = "normal";
      }

      if (this.owner.hasStatus("frozen")) {
        return;
      }

      this.attackCooldown = Math.max(0, this.attackCooldown - getWeaponCooldownDecay(this, dt));
      if (this.attackCooldown <= 0) {
        if (this.owner.shieldHp > 0 || this.owner.hasStatus("invulnerable")) {
          this.attackCooldown = 0.4;
          return;
        }
        this.throwBucket(game, enemy);
        this.attackCooldown = randomRange(4.5, 7.8);
      }
    }

    drawArena(ctx) {
      if (this.iceBoostTimer <= 0) {
        return;
      }
      const alpha = clamp(this.iceBoostTimer / 5, 0, 1);
      const dir = length(this.owner.velocity) > 0.01 ? normalize(this.owner.velocity) : vec(1, 0);
      ctx.save();
      ctx.globalAlpha = alpha * 0.34;
      ctx.fillStyle = "rgba(82, 224, 255, 0.78)";
      for (let index = 1; index <= 5; index += 1) {
        const offset = scale(dir, -index * 18);
        ctx.beginPath();
        ctx.ellipse(this.owner.position.x + offset.x, this.owner.position.y + offset.y, 38 - index * 4.2, 22 - index * 1.8, angleOf(dir), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    drawOwnerAttachment(ctx, game) {
      const pos = this.owner.position;
      const hullDrawn = game ? game.drawSprite(ctx, "boatHull", pos.x, pos.y + 34, 144, 144) : false;
      if (hullDrawn) {
        const bucketDrawn = game.drawSprite(ctx, this.bucketKind === "lava" ? "bucketLava" : "bucketIce", pos.x + 52, pos.y - 42, 56, 56);
        if (!bucketDrawn) {
          ctx.save();
          ctx.translate(pos.x + 52, pos.y - 42);
          ctx.fillStyle = this.bucketKind === "lava" ? "#ff914d" : "#dff9ff";
          ctx.fillRect(-16, -16, 32, 32);
          ctx.fillStyle = "#7b868f";
          ctx.fillRect(-11, -20, 22, 6);
          ctx.restore();
        }
        return;
      }

      ctx.save();
      ctx.translate(pos.x, pos.y + 34);
      ctx.fillStyle = this.owner.damageFlash > 0 ? "#f4f8ff" : "#8d643a";
      ctx.beginPath();
      ctx.moveTo(-46, 0);
      ctx.quadraticCurveTo(0, -30, 47, 0);
      ctx.quadraticCurveTo(0, 30, -46, 0);
      ctx.fill();
      ctx.fillStyle = "#d9bf95";
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.quadraticCurveTo(0, -13, 18, 0);
      ctx.quadraticCurveTo(0, 13, -18, 0);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(pos.x + 52, pos.y - 42);
      ctx.fillStyle = this.bucketKind === "lava" ? "#ff914d" : "#dff9ff";
      ctx.fillRect(-16, -16, 32, 32);
      ctx.fillStyle = "#7b868f";
      ctx.fillRect(-11, -20, 22, 6);
      ctx.restore();
    }
  }

  class FishingRodWeapon {
    constructor(owner) {
      this.id = "fishingRod";
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 0.96;
      this.armorMultiplier = 1;
      this.maxAmmo = 4;
      this.ammo = 4;
      this.reloadTimer = 0;
      this.attackCooldown = 0.7;
      this.hookProjectile = null;
      this.tether = null;
      this.releaseBoostTimer = 0;
    }

    reset() {
      this.stateKey = "normal";
      this.mass = 0.96;
      this.ammo = this.maxAmmo;
      this.reloadTimer = 0;
      this.attackCooldown = randomRange(0.55, 0.9);
      this.hookProjectile = null;
      this.tether = null;
      this.releaseBoostTimer = 0;
    }

    interrupt() {
      if (this.hookProjectile) {
        this.hookProjectile.expired = true;
        this.hookProjectile.life = 0;
      }
      this.releaseTether(null, true, false);
      this.hookProjectile = null;
      this.attackCooldown = Math.max(this.attackCooldown, 0.7);
      this.releaseBoostTimer = 0;
    }

    modifySpeedLimit(base) {
      if (this.releaseBoostTimer > 0) {
        return Math.max(base, 700);
      }
      return base;
    }

    releaseTether(game, silent = false, grantBoost = true) {
      if (!this.tether) {
        this.stateKey = "normal";
        return;
      }
      const enemy = this.tether.enemy;
      if (enemy && !isCombatantDead(enemy)) {
        if (typeof enemy.clearStatus === "function") {
          enemy.clearStatus("hooked");
        }
        if (!silent) {
          enemy.takeDamage(6, {
            game,
            type: "rod-break",
            hitFrom: this.owner.position,
            knockback: 110,
            color: "#e6f6ff",
            sourceFighter: this.owner,
          });
          if (typeof enemy.setStatus === "function") {
            enemy.setStatus("snagged", 1.5);
          }
        }
      }
      if (grantBoost && enemy && !isCombatantDead(enemy)) {
        const dir = length(this.owner.velocity) > 0.01 ? normalize(this.owner.velocity) : normalize(sub(enemy.position, this.owner.position));
        const boosted = Math.max(390, length(this.owner.velocity) * 1.95);
        this.owner.velocity = scale(dir, boosted);
        this.releaseBoostTimer = 1.35;
      }
      this.tether = null;
      this.stateKey = "normal";
    }

    fireHook(game, enemy) {
      if (this.ammo <= 0) {
        return;
      }
this.ammo -= 1;
      this.attackCooldown = randomRange(0.75, 1.05);
      const target = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      const aim = aimAtEnemy(this.owner, target, 0.28, game);
      const start = add(this.owner.position, scale(aim, this.owner.ballRadius + 18));
      AUDIO.weapon("loyaltyTrident");
      const projectile = new Projectile({
        kind: "hook",
        owner: this.owner,
        position: start,
        velocity: add(scale(aim, 788), scale(this.owner.velocity, 0.22)),
        life: 0.94,
        color: "#dff5ff",
        radius: 10,
        drawStyle: "hook",
        rotationSpeed: 12,
        onHit: (target, currentGame, shot) => {
          if (target === this.owner || target.dead) {
            return false;
          }
          this.hookProjectile = null;
          this.tether = {
            enemy: target,
            time: 1.8,
            maxDistance: 300,
          };
          target.setStatus("hooked", 1.8);
          this.stateKey = "hooked";
          currentGame.spawnBurst(shot.position, "#e9f8ff", 14);
          currentGame.spawnShardBurst(target.position, "#f3fbff", 6);
          return true;
        },
        onWall: (currentGame, _wallNormal, shot) => {
          this.hookProjectile = null;
          const dashDir = normalize(sub(shot.position, this.owner.position));
          this.owner.receiveVelocity(scale(dashDir, 215));
          currentGame.spawnBurst(shot.position, "#dff5ff", 10);
          currentGame.screenShake = Math.max(currentGame.screenShake, 0.18);
        },
        onExpire: () => {
          this.hookProjectile = null;
        },
      });
      this.hookProjectile = projectile;
      game.projectiles.push(projectile);
    }

    update(dt, game, enemy) {
      enemy = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      if (this.ammo < this.maxAmmo) {
        this.reloadTimer += dt;
        while (this.reloadTimer >= 3.1 && this.ammo < this.maxAmmo) {
          this.reloadTimer -= 3.1;
          this.ammo += 1;
        }
      } else {
        this.reloadTimer = 0;
      }

      if (this.hookProjectile && this.hookProjectile.life <= 0) {
        this.hookProjectile = null;
      }

      if (this.releaseBoostTimer > 0) {
        this.releaseBoostTimer = Math.max(0, this.releaseBoostTimer - dt);
        const dir = length(this.owner.velocity) > 0.01 ? normalize(this.owner.velocity) : aimAtEnemy(this.owner, enemy, 0.12, game);
        const desired = 460 * (1 + this.releaseBoostTimer / 1.35);
        this.owner.velocity = lerpVector(this.owner.velocity, scale(dir, desired), clamp(dt * 3.5, 0, 1));
      }

      if (this.tether) {
        const target = this.tether.enemy;
        this.tether.time -= dt;
        if (!target || isCombatantDead(target) || this.tether.time <= 0) {
          this.releaseTether(game);
        } else {
          this.stateKey = "hooked";
          if (typeof target.setStatus === "function") {
            target.setStatus("hooked", 0.24);
          }
          const offset = sub(target.position, this.owner.position);
          const dist = length(offset);
          if (dist > this.tether.maxDistance) {
            const pullDir = normalize(sub(this.owner.position, target.position));
            const tension = dist - this.tether.maxDistance;
            target.velocity = scale(target.velocity, clamp(1 - dt * 1.8, 0.16, 1));
            target.receiveVelocity(scale(pullDir, (330 + tension * 2.7) * dt));
            this.owner.receiveVelocity(scale(scale(pullDir, -1), 63 * dt));
            if (dist > this.tether.maxDistance * 1.35) {
              this.releaseTether(game, false, true);
              return;
            }
          }
          if (dist <= this.owner.ballRadius + target.ballRadius + 10) {
            const impactSpeed = length(sub(target.velocity || vec(0, 0), this.owner.velocity || vec(0, 0)));
            const impactDamage = impactSpeed >= 220 ? 14 : 12;
            if (impactDamage > 0) {
              target.takeDamage(impactDamage, {
                game,
                type: "hook-collision",
                hitFrom: this.owner.position,
                knockback: 210,
                color: "#e6f6ff",
                sourceFighter: this.owner,
              });
            }
            this.releaseTether(game, true, true);
          }
        }
      } else if (!this.hookProjectile) {
        this.stateKey = "normal";
      }

      if (this.owner.hasStatus("frozen") || this.owner.hasStatus("silenced")) {
        return;
      }

      this.attackCooldown = Math.max(0, this.attackCooldown - getWeaponCooldownDecay(this, dt));
      if (this.attackCooldown <= 0 && !this.tether && !this.hookProjectile && this.ammo > 0) {
        this.fireHook(game, enemy);
      }
    }

    drawArena(ctx) {
      const end = this.tether
        ? this.tether.enemy.position
        : this.hookProjectile && this.hookProjectile.life > 0
          ? this.hookProjectile.position
          : null;
      if (!end) {
        return;
      }
      ctx.save();
      ctx.strokeStyle = "rgba(228, 247, 255, 0.92)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.owner.position.x, this.owner.position.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.strokeStyle = "rgba(125, 194, 255, 0.35)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(this.owner.position.x, this.owner.position.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.restore();
    }

    drawOwnerAttachment(ctx, game) {
      if (game && drawWeaponAttachmentSprite(game, ctx, this.id, this.owner.position.x + 44, this.owner.position.y - 24, 60, 60, { rotation: -0.28 })) {
        return;
      }
      ctx.save();
      ctx.translate(this.owner.position.x + 44, this.owner.position.y - 24);
      ctx.rotate(-0.28);
      ctx.strokeStyle = "#d7eaff";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-20, 14);
      ctx.quadraticCurveTo(0, -28, 24, -8);
      ctx.stroke();
      for (let index = 0; index < this.maxAmmo; index += 1) {
        ctx.fillStyle = index < this.ammo ? "#eaf8ff" : "rgba(255,255,255,0.18)";
        ctx.beginPath();
        ctx.arc(-18 + index * 14, 24, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class LoyaltyTridentWeapon {
    constructor(owner) {
      this.id = "loyaltyTrident";
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 1.02;
      this.armorMultiplier = 1;
      this.attackCooldown = 0.7;
      this.projectile = null;
      this.throwCount = 0;
      this.dragBuffStacks = 0;
    }

    reset() {
      this.stateKey = "normal";
      this.mass = 1.02;
      this.attackCooldown = randomRange(0.9, 1.25);
      this.projectile = null;
      this.throwCount = 0;
      this.dragBuffStacks = 0;
      this.owner.bonusDamageMultiplier = 1;
    }

    interrupt() {
      this.attackCooldown = Math.max(this.attackCooldown, 0.55);
    }

    modifySpeedLimit(base) {
      if (this.projectile && this.projectile.dragMode) {
        return Math.max(base, 660);
      }
      return this.projectile ? Math.max(base, 480) : base;
    }

    throwTrident(game, enemy) {
      const target = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      const dir = aimAtEnemy(this.owner, target, 0.22, game);
      this.throwCount += 1;
      const dragMode = this.throwCount % 3 === 0;
      const start = add(this.owner.position, scale(dir, this.owner.ballRadius + 20));
      AUDIO.shoot();
      const projectile = new Projectile({
        kind: "trident",
        owner: this.owner,
        position: start,
        velocity: add(scale(dir, 360), scale(this.owner.velocity, 0.2)),
        life: 1.68,
        color: "#bcf5ff",
        radius: 8,
        drawStyle: "trident",
        rotationSpeed: 14,
        bounces: 0,
        returnDelay: 0.7,
        returnSpeed: 520,
        onHit: (target, currentGame, shot) => {
          if (target === this.owner || isCombatantDead(target)) {
            return false;
          }
          if (shot.returning) {
            target.takeDamage(3, {
              game: currentGame,
              type: "trident-return",
              hitFrom: shot.position,
              knockback: 170,
              color: "#aeeeff",
              sourceFighter: this.owner,
            });
            return false;
          }

          let damage = 8;
          if (shot.dragMode) {
            damage += 20;
          }
          target.takeDamage(damage, {
            game: currentGame,
            type: "trident",
            hitFrom: shot.position,
            knockback: 260,
            color: "#a9f4ff",
            ignoreArmor: true,
            sourceFighter: this.owner,
          });
          if (shot.dragMode && !shot.dragSucceeded) {
            shot.dragSucceeded = true;
            this.dragBuffStacks = Math.min(10, this.dragBuffStacks + 1);
            this.owner.bonusDamageMultiplier = 1 + this.dragBuffStacks * 0.1;
            currentGame.addFloatingText(`TRIDENT +${this.dragBuffStacks * 10}%`, add(this.owner.position, vec(0, -56)), "#bdf7ff");
          }
          shot.startReturn();
          if (isCombatantDead(target)) {
            currentGame.triggerFlash("#ddfdff", 0.18);
            currentGame.spawnBurst(shot.position, "#e8ffff", 18);
          }
          return false;
        },
        onWall: (_currentGame, _wallNormal, shot, bounced) => {
          if (!bounced && !shot.returning) {
            shot.startReturn();
            return false;
          }
          return false;
        },
        onStep: (stepDt, _currentGame, shot) => {
          if (shot.dragMode && !shot.returning) {
            const travelDir = normalize(length(shot.velocity) > 0.01 ? shot.velocity : dir);
            const followPoint = keepPointInArena(add(shot.position, scale(travelDir, -this.owner.ballRadius - 12)), this.owner.ballRadius + 4);
            this.owner.position = lerpVector(this.owner.position, followPoint, clamp(stepDt * 6, 0, 1));
            this.owner.velocity = lerpVector(this.owner.velocity, scale(travelDir, 840), clamp(stepDt * 4.5, 0, 1));
          }
        },
        onCatch: (currentGame) => {
          this.projectile = null;
          this.attackCooldown = randomRange(1.2, 1.8);
          currentGame.spawnBurst(this.owner.position, "#dffcff", 12);
        },
        onExpire: () => {
          this.projectile = null;
          this.attackCooldown = Math.max(this.attackCooldown, 1.1);
        },
      });
      projectile.dragMode = dragMode;
      projectile.dragSucceeded = false;
      this.projectile = projectile;
      this.attackCooldown = 2.5;
      this.stateKey = "firing";
      game.projectiles.push(projectile);
    }

    update(dt, game, enemy) {
      enemy = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      if (this.projectile && this.projectile.life <= 0) {
        this.projectile = null;
      }

      this.mass = this.projectile ? 0.7 : 1.02;
      this.stateKey = this.projectile ? "firing" : "normal";
      if (this.owner.hasStatus("frozen") || this.owner.hasStatus("silenced")) {
        return;
      }
      if (this.projectile) {
        return;
      }

      this.attackCooldown = Math.max(0, this.attackCooldown - getWeaponCooldownDecay(this, dt));
      if (this.attackCooldown <= 0) {
        this.throwTrident(game, enemy);
      }
    }

    drawOwnerAttachment(ctx, game) {
      if (game && drawWeaponAttachmentSprite(game, ctx, this.id, this.owner.position.x + 48, this.owner.position.y - 20, 64, 64, { rotation: -0.32 })) {
        return;
      }
      ctx.save();
      ctx.translate(this.owner.position.x + 48, this.owner.position.y - 20);
      ctx.rotate(-0.32);
      ctx.fillStyle = this.projectile ? "rgba(255,255,255,0.14)" : "#d8fbff";
      ctx.fillRect(-20, -3, 34, 6);
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(27, -8);
      ctx.lineTo(24, 0);
      ctx.lineTo(27, 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  class WaterBucketWeapon {
    constructor(owner) {
      this.id = "waterBucket";
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 1.02;
      this.armorMultiplier = 1;
      this.attackCooldown = 1.6;
      this.castFlash = 0;
      this.surgeCooldown = 0;
    }

    reset() {
      this.stateKey = "normal";
      this.attackCooldown = randomRange(1.4, 2);
      this.castFlash = 0;
      this.surgeCooldown = 0;
    }

    interrupt() {
      this.attackCooldown = Math.max(this.attackCooldown, 0.65);
      this.castFlash = 0;
      this.surgeCooldown = Math.max(this.surgeCooldown, 0.5);
    }

    cast(game, enemy) {
      const target = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      const dir = aimAtEnemy(this.owner, target, 0.2, game);
      const start = add(this.owner.position, scale(dir, 120));
      spawnWaterFlow(game, this.owner, start, dir);
      game.spawnBurst(start, "#d5f2ff", 16);
      this.castFlash = 0.35;
      this.stateKey = "firing";
      this.attackCooldown = randomRange(4.4, 5.6);
    }

    onWallHit(_normal, game) {
      if (this.attackCooldown > 0.8 || this.owner.hasStatus("frozen") || this.owner.hasStatus("silenced")) {
        return;
      }
      if (length(this.owner.velocity) >= 220) {
        const enemy = game.fighters.find((fighter) => fighter !== this.owner) || null;
        this.cast(game, enemy);
      }
    }

    update(dt, game, enemy) {
      if (this.castFlash > 0) {
        this.castFlash = Math.max(0, this.castFlash - dt);
        if (this.castFlash <= 0) {
          this.stateKey = "normal";
        }
      }
      this.surgeCooldown = Math.max(0, this.surgeCooldown - getWeaponCooldownDecay(this, dt));

      if (this.owner.hasStatus("frozen") || this.owner.hasStatus("silenced")) {
        return;
      }

      enemy = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      this.attackCooldown = Math.max(0, this.attackCooldown - getWeaponCooldownDecay(this, dt));
      if (this.attackCooldown <= 0) {
        this.cast(game, enemy);
      }
    }

    drawOwnerAttachment(ctx, game) {
      if (game && drawWeaponAttachmentSprite(game, ctx, this.id, this.owner.position.x + 52, this.owner.position.y - 34, 60, 60)) {
        return;
      }
      ctx.save();
      ctx.translate(this.owner.position.x + 52, this.owner.position.y - 34);
      ctx.fillStyle = "#7e94a9";
      ctx.fillRect(-15, -16, 30, 26);
      ctx.fillStyle = "#9ee2ff";
      ctx.fillRect(-12, -13, 24, 15);
      ctx.fillStyle = "#e9fbff";
      ctx.fillRect(-9, -10, 18, 8);
      ctx.restore();
    }
  }

  class LavaBucketWeapon {
    constructor(owner) {
      this.id = "lavaBucket";
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 1.08;
      this.armorMultiplier = 0.98;
      this.attackCooldown = 1.9;
      this.auraTick = 0.9;
      this.castFlash = 0;
    }

    reset() {
      this.stateKey = "normal";
      this.attackCooldown = randomRange(1.5, 2.2);
      this.auraTick = 1.2;
      this.castFlash = 0;
    }

    interrupt() {
      this.attackCooldown = Math.max(this.attackCooldown, 0.8);
      this.castFlash = 0;
    }

    cast(game, enemy) {
      const target = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      const dir = aimAtEnemy(this.owner, target, 0.18, game);
      const start = add(this.owner.position, scale(dir, 149));
      spawnLavaPool(game, this.owner, start, { baseRadius: 100, life: 4 });
      game.spawnBurst(start, "#ff9d69", 18);
      game.spawnShardBurst(start, "#ffd1a8", 10);
      this.castFlash = 0.5;
      this.stateKey = "firing";
      this.attackCooldown = randomRange(6, 7);
    }

    onWallHit(_normal, game) {
      if (this.attackCooldown > 0.45 || this.owner.hasStatus("frozen") || this.owner.hasStatus("silenced")) {
        return;
      }
      if (length(this.owner.velocity) >= 235) {
        const enemy = game.fighters.find((fighter) => fighter !== this.owner) || null;
        this.cast(game, enemy);
      }
    }

    update(dt, game, enemy) {
      enemy = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      if (this.castFlash > 0) {
        this.castFlash = Math.max(0, this.castFlash - dt);
        if (this.castFlash <= 0) {
          this.stateKey = "normal";
        }
      }

      this.auraTick -= dt;
      if (this.auraTick <= 0) {
        this.auraTick = 1;
        if (enemy && !enemy.dead && distance(this.owner.position, enemy.position) <= 54 + enemy.ballRadius) {
          enemy.takeDamage(1, {
            game,
            type: "lava-aura",
            hitFrom: this.owner.position,
            color: "#ff9d68",
            ignoreArmor: true,
            sourceFighter: this.owner,
          });
          enemy.applyBurn(1.1, 1);
        }
      }

      if (this.owner.hasStatus("frozen") || this.owner.hasStatus("silenced")) {
        return;
      }

      this.attackCooldown = Math.max(0, this.attackCooldown - getWeaponCooldownDecay(this, dt));
      if (this.attackCooldown <= 0) {
        this.cast(game, enemy);
      }
    }

    drawArena(ctx) {
      if (this.owner.dead) {
        return;
      }
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = "rgba(255, 125, 75, 0.9)";
      ctx.beginPath();
      ctx.arc(this.owner.position.x, this.owner.position.y, 64, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawOwnerAttachment(ctx, game) {
      if (game && drawWeaponAttachmentSprite(game, ctx, this.id, this.owner.position.x + 52, this.owner.position.y - 34, 60, 60)) {
        return;
      }
      ctx.save();
      ctx.translate(this.owner.position.x + 52, this.owner.position.y - 34);
      ctx.fillStyle = "#8a8e94";
      ctx.fillRect(-15, -16, 30, 26);
      ctx.fillStyle = "#ff944d";
      ctx.fillRect(-12, -13, 24, 15);
      ctx.fillStyle = "#ffd2a3";
      ctx.fillRect(-9, -10, 18, 8);
      ctx.restore();
    }
  }

  class SnowballWeapon {
    constructor(owner) {
      this.id = "snowball";
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 0.94;
      this.armorMultiplier = 1;
      this.burstCooldown = 1.2;
      this.shotsLeft = 0;
      this.shotTimer = 0;
      this.volleyCount = 0;
      this.chargeVolley = false;
    }

    reset() {
      this.stateKey = "normal";
      this.burstCooldown = randomRange(0.75, 1.32);
      this.shotsLeft = 0;
      this.shotTimer = 0;
      this.volleyCount = 0;
      this.chargeVolley = false;
    }

    interrupt() {
      this.shotsLeft = 0;
      this.shotTimer = 0;
      this.burstCooldown = Math.max(this.burstCooldown, 0.5);
      this.stateKey = "normal";
    }

    launchShot(game, enemy) {
      const shotIndex = 3 - this.shotsLeft;
      const charged = this.chargeVolley && shotIndex === 0;
      const target = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      const aim = aimAtEnemy(this.owner, target, 0.12, game);
      const spread = rotateVector(aim, randomRange(-0.21, 0.21));
      const speed = charged ? 806 : 538;
      const radius = charged ? 11 : 8;
      const stacks = charged ? 3 : 1;
      const damage = charged ? 4 : 2;
      const start = add(this.owner.position, scale(spread, this.owner.ballRadius + 16));
      game.projectiles.push(new Projectile({
        kind: "snow",
        owner: this.owner,
        position: start,
        velocity: add(scale(spread, speed), scale(this.owner.velocity, 0.22)),
        life: 1.3,
        color: charged ? "#f4feff" : "#e6fbff",
        radius,
        drawStyle: "snow",
        rotationSpeed: charged ? 14 : 8,
        onHit: (target, currentGame, shot) => {
          if (target === this.owner || target.dead) {
            return true;
          }
          target.takeDamage(damage, {
            game: currentGame,
            type: charged ? "snow-charged" : "snow",
            hitFrom: shot.position,
            knockback: charged ? 90 : 50,
            color: "#dbf8ff",
            sourceFighter: this.owner,
          });
          target.addFreezeStacks(stacks, currentGame);
          target.setStatus("rooted", charged ? 0.32 : 0.14);
          const protectedRailBuild = target.weapon && target.weapon.id === "rail" && target.weapon.stateKey === "laying";
          if (!protectedRailBuild) {
            target.interruptWeapon(charged ? 0.65 : 0.35);
          }
          return true;
        },
        onWall: (currentGame, _normal, shot) => {
          currentGame.spawnZone(new Zone({
            kind: "ice",
            owner: this.owner,
            position: shot.position,
            radius: charged ? 42 : 26,
            startRadius: charged ? 22 : 14,
            growTime: 0.1,
            life: charged ? 2.2 : 1.4,
            tickRate: 0.24,
            color: "rgba(190, 240, 255, 0.36)",
            ownerImmune: true,
            damage: 0,
          }));
          currentGame.spawnShardBurst(shot.position, "#ebfcff", charged ? 10 : 6);
        },
      }));
    }

    update(dt, game, enemy) {
      enemy = getNearestEnemyTarget(game, this.owner, enemy) || enemy;
      if (this.owner.hasStatus("frozen") || this.owner.hasStatus("silenced")) {
        return;
      }

      if (this.shotsLeft > 0) {
        this.stateKey = "firing";
        this.shotTimer -= dt;
        if (this.shotTimer <= 0) {
          this.launchShot(game, enemy);
          this.shotsLeft -= 1;
          this.shotTimer = 0.3;
          if (this.shotsLeft <= 0) {
            this.stateKey = "normal";
            this.burstCooldown = randomRange(2.3, 2.7);
          }
        }
        return;
      }

      this.burstCooldown = Math.max(0, this.burstCooldown - getWeaponCooldownDecay(this, dt));
      if (this.burstCooldown <= 0) {
        this.volleyCount += 1;
        this.chargeVolley = this.volleyCount % 3 === 0;
        this.shotsLeft = 3;
        this.shotTimer = 0;
      }
    }

    drawOwnerAttachment(ctx, game) {
      if (game && drawWeaponAttachmentSprite(game, ctx, this.id, this.owner.position.x + 48, this.owner.position.y - 34, 58, 58)) {
        return;
      }
      ctx.save();
      ctx.translate(this.owner.position.x + 48, this.owner.position.y - 34);
      for (let index = 0; index < 3; index += 1) {
        ctx.fillStyle = index === 0 && this.chargeVolley ? "#ffffff" : "#dcf8ff";
        ctx.beginPath();
        ctx.arc(-10 + index * 10, 0, index === 0 && this.chargeVolley ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class FlintSteelWeapon {
    constructor(owner) {
      this.id = "flintSteel";
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 1;
      this.armorMultiplier = 1;
      this.trailDropTimer = 0;
      this.trails = [];
      this.lastDropPos = null;
      this.maxTrailZones = 24;
    }

    reset() {
      this.stateKey = "normal";
      this.trailDropTimer = 0;
      this.trails = [];
      this.lastDropPos = null;
    }

    interrupt() {}

    dropTrail(game, position) {
      const zone = new Zone({
        kind: "fire",
        owner: this.owner,
        position: keepPointInArena(position, 42),
        radius: Math.floor(this.owner.ballRadius * 0.8),
        radiusX: Math.floor(this.owner.ballRadius * 0.8),
        radiusY: Math.floor(this.owner.ballRadius * 0.8),
        startRadius: Math.floor(this.owner.ballRadius * 0.6),
        growTime: 0.08,
        life: 3.2,
        tickRate: 1,
        color: "rgba(255, 128, 70, 0.48)",
        ownerImmune: true,
        damage: 8,
        data: {
          flintTrail: true,
        },
      });
      game.spawnZone(zone);
      this.trails.push(zone);
      if (this.trails.length > this.maxTrailZones) {
        const stale = this.trails.shift();
        if (stale) {
          stale.life = 0;
        }
      }
      game.spawnBurst(zone.position, "#ffb482", 4);
      return zone;
    }

    onWallHit() {}

    update(dt, game) {
      this.trails = this.trails.filter((zone) => zone && zone.life > 0);
      this.trailDropTimer -= dt;
      const movingEnough = length(this.owner.velocity) >= 24;
      if (movingEnough && this.trailDropTimer <= 0) {
        this.trailDropTimer = 0.16;
        const back = length(this.owner.velocity) > 0.01 ? normalize(scale(this.owner.velocity, -1)) : vec(this.owner.side === "left" ? -1 : 1, 0);
        const dropPos = add(this.owner.position, scale(back, this.owner.ballRadius * 0.25));
        if (!this.lastDropPos || distance(this.lastDropPos, dropPos) >= 24) {
          this.dropTrail(game, dropPos);
          this.lastDropPos = { ...dropPos };
        }
      }
      this.stateKey = this.trails.length ? "burning" : "normal";
    }

    drawOwnerAttachment(ctx, game) {
      if (game && drawWeaponAttachmentSprite(game, ctx, this.id, this.owner.position.x + 48, this.owner.position.y - 36, 58, 58)) {
        return;
      }
      ctx.save();
      ctx.translate(this.owner.position.x + 48, this.owner.position.y - 36);
      ctx.fillStyle = "#7e838d";
      ctx.fillRect(-14, -10, 14, 20);
      ctx.fillStyle = "#c7b58b";
      ctx.fillRect(2, -8, 14, 16);
      ctx.fillStyle = "#ffb772";
      ctx.beginPath();
      ctx.moveTo(2, -14);
      ctx.lineTo(12, -28);
      ctx.lineTo(16, -8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  class PreviewWeapon {
    constructor(id, owner) {
      this.id = id;
      this.owner = owner;
      this.stateKey = "normal";
      this.mass = 1;
      this.armorMultiplier = 1;
      this.reset();
    }

    reset() {
      resetPreviewWeapon(this);
    }

    update(dt, game, enemy) {
      updatePreviewWeapon(this, dt, game, enemy);
    }

    interrupt(time = 0.7) {
      interruptPreviewWeapon(this, time);
    }

    modifySpeedLimit(base, game, enemy) {
      return modifyPreviewWeaponSpeed(this, base, game, enemy);
    }

    modifyIncomingDamage(damage, info) {
      return modifyPreviewWeaponDamage(this, damage, info);
    }

    tryPreventDeath(amount, info) {
      return tryPreviewWeaponPreventDeath(this, amount, info);
    }

    onOwnerDamaged(info) {
      onPreviewWeaponOwnerDamaged(this, info);
    }

    onWallHit(normal, game) {
      onPreviewWeaponWallHit(this, normal, game);
    }

    onTouchEnemy(enemy, game) {
      onPreviewWeaponTouchEnemy(this, enemy, game);
    }

    drawArena(ctx, game) {
      drawPreviewWeaponArena(this, ctx, game);
    }

    drawOwnerAttachment(ctx, game) {
      drawPreviewWeaponAttachment(this, ctx, game);
    }
  }

  function resetPreviewWeapon(weapon) {
    weapon.stateKey = "normal";
    weapon.stateTimer = 0;
    weapon.mass = 1;
    weapon.armorMultiplier = 1;
    weapon.cooldown = randomRange(0.9, 1.4);
    weapon.altCooldown = 0;
    weapon.buffTimer = 0;
    weapon.activeTimer = 0;
    weapon.reloadTimer = 0;
    weapon.bashCooldown = 0;
    weapon.meleeCooldown = 0;
    weapon.teleportCooldown = 0;
    weapon.useCount = 0;
    weapon.stored = 0;
    weapon.charges = 0;
    weapon.projectile = null;
    weapon.anchor = null;
    weapon.portal = null;
    weapon.cart = null;
    weapon.tnts = [];
    weapon.orbs = [];
    weapon.waves = [];
    weapon.bees = [];
    weapon.lanterns = [];
    weapon.puddles = [];
    weapon.records = [];
    weapon.baits = [];
    weapon.zombies = [];
    weapon.villagers = [];
    weapon.loot = [];
    weapon.traps = [];
    weapon.noteResonance = 0;
    weapon.noteTimer = 0;
    weapon.noteCrescendo = 0;
    weapon.noteCrescendoTimer = 0;
    weapon.lastEnemyState = "normal";
    weapon.lastEnemyWeaponId = "";
    weapon.orientation = weapon.owner.side === "left" ? 0 : Math.PI;
    weapon.dropTick = 0;
    weapon.totemSpent = false;
    weapon.shellStillTimer = 0;
    weapon.glideCrashLock = 0;
    weapon.beeBoostTimer = 0;
    weapon.totemCooldown = 0;
    weapon.totemPulseTimer = 0;
    weapon.totemAuraZone = null;
    weapon.anchors = [];
    weapon.anchorTimer = 0;
    weapon.portals = [];
    weapon.portalTimer = 0;
    weapon.gravityTimer = 0;
    weapon.gravityLevitateCooldown = 0;
    weapon.gravityAnomalies = [];
    weapon.inAnomaly = false;
    weapon.autoFireTimer = 0;
    weapon.shulkerChargeProgress = 0;
    weapon.mineTraps = [];
    weapon.maxStored = 9;
    weapon.expDamageBonusStacks = 0;
    weapon.funnels = [];
    weapon.tntCounter = 0;
    weapon.noteWallHits = 0;
    weapon.bookAttackIndex = 0;
    weapon.invisPierceCooldown = 0;
    weapon.earthquakes = [];
    weapon.minionSpawnTimer = 0;
    weapon.thornsCooldown = 0;
    weapon._wasTanking = false;

    switch (weapon.id) {
      case "expBottle":
        weapon.mass = 0.95;
        weapon.cooldown = randomRange(2.2, 3.0);
        break;
      case "totem":
        weapon.mass = 1.02;
        weapon.cooldown = 0;
        break;
      case "hopperMinecart":
        weapon.mass = 1.12;
        weapon.armorMultiplier = 0.94;
        weapon.cooldown = randomRange(5, 7);
        break;
      case "tnt":
        weapon.mass = 1.08;
        weapon.cooldown = randomRange(2, 2.6);
        break;
      case "slimePiston":
        weapon.mass = 0.98;
        weapon.cooldown = randomRange(1.1, 1.7);
        break;
      case "observer":
        weapon.mass = 0.94;
        weapon.cooldown = randomRange(1.3, 1.8);
        break;
      case "beehive":
        weapon.mass = 1.04;
        weapon.cooldown = 2.4;
        break;
      case "noteBlock":
        weapon.mass = 0.98;
        weapon.cooldown = 0;
        break;
      case "shulkerBox":
        weapon.mass = 1.08;
        weapon.armorMultiplier = 0.94;
        weapon.cooldown = randomRange(2.6, 3.2);
        weapon.maxStored = 12;
        break;
      case "respawnAnchor":
        weapon.mass = 1.04;
        weapon.cooldown = randomRange(0.8, 1.2);
        weapon.charges = 4;
        weapon.reloadTimer = 8;
        break;
      case "enderPearl":
        weapon.mass = 0.92;
        weapon.cooldown = randomRange(1.2, 1.8);
        break;
      case "cryingObsidian":
        weapon.mass = 1.02;
        weapon.cooldown = 0;
        break;
      case "blazeRod":
        weapon.mass = 0.96;
        weapon.cooldown = randomRange(2, 2.8);
        break;
      case "rottenFlesh":
        weapon.mass = 0.98;
        weapon.cooldown = 0;
        weapon.minionSpawnTimer = 3;
        break;
      case "jackOLantern":
        weapon.mass = 1;
        weapon.cooldown = randomRange(2.1, 2.8);
        break;
      case "boneMeal":
        weapon.mass = 0.96;
        weapon.cooldown = 0;
        weapon.minionSpawnTimer = 2.2;
        break;
      case "bookQuill":
        weapon.mass = 0.98;
        weapon.cooldown = 0;
        break;
      case "elytra":
        weapon.mass = 0.94;
        weapon.cooldown = randomRange(2.3, 3);
        weapon.glideWindup = 0;
        break;
      case "goldenApple":
        weapon.mass = 1.02;
        weapon.cooldown = randomRange(2.4, 3.2);
        break;
      case "invisPotion":
        weapon.mass = 0.9;
        weapon.cooldown = randomRange(1.6, 2.8);
        break;
      case "gravityPotion":
        weapon.mass = 0.94;
        weapon.gravityTimer = randomRange(5, 7);
        break;
      case "turtlePotion":
        weapon.mass = 1.10;
        weapon.cooldown = 0;
        weapon.thornsCooldown = 0;
        weapon._wasTanking = false;
        break;
      default:
        break;
    }
  }

  function previewWeaponFlash(weapon, key, time = 0.24) {
    const now = typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();
    const lastSoundAt = weapon._lastPreviewSoundAt || 0;
    weapon.stateKey = key;
    weapon.stateTimer = Math.max(weapon.stateTimer, time);
    if (now - lastSoundAt < 90) {
      return;
    }
    if (key === "firing" || key === "tanking") {
      weapon._lastPreviewSoundAt = now;
      AUDIO.weapon(weapon.id);
    } else if (key === "charging") {
      weapon._lastPreviewSoundAt = now;
      AUDIO.chargeWeapon(weapon.id);
    }
  }

  function tickPreviewWeaponState(weapon, dt) {
    if (weapon.stateTimer <= 0) {
      return;
    }
    weapon.stateTimer = Math.max(0, weapon.stateTimer - dt);
    if (weapon.stateTimer <= 0) {
      weapon.stateKey = "normal";
    }
  }

  function teleportPreviewWeaponOwner(weapon, game, position, options = {}) {
    const from = { ...weapon.owner.position };
    weapon.owner.position = keepPointInArena(position, weapon.owner.ballRadius + 4);
    if (options.keepVelocity) {
      weapon.owner.velocity = { ...weapon.owner.velocity };
    } else if (options.velocity) {
      weapon.owner.velocity = { ...options.velocity };
    } else {
      weapon.owner.velocity = vec(0, 0);
    }
    game.spawnBurst(from, options.color || "#dcb8ff", 10);
    game.spawnBurst(weapon.owner.position, options.color || "#dcb8ff", 14);
    game.spawnShardBurst(weapon.owner.position, options.shardColor || "#f4e8ff", 8);
    game.screenShake = Math.max(game.screenShake, 0.2);
  }

  function pushPreviewWeaponRecord(weapon, id) {
    if (!id || weapon.records[0] === id) {
      return;
    }
    weapon.records.unshift(id);
    weapon.records = weapon.records.slice(0, 3);
  }

  function createPreviewPlantZone(weapon, game, position, plantType) {
    const zone = new Zone({
      kind: "plants",
      owner: weapon.owner,
      position: keepPointInArena(position, 36),
      radius: plantType === "mushroom" ? 52 : 44,
      startRadius: 20,
      growTime: 0.18,
      life: plantType === "flower" ? 5.8 : 4.8,
      tickRate: 0.22,
      color:
        plantType === "flower"
          ? "rgba(255, 180, 218, 0.28)"
          : plantType === "mushroom"
            ? "rgba(230, 206, 255, 0.26)"
            : plantType === "bush"
              ? "rgba(147, 214, 116, 0.26)"
              : "rgba(214, 235, 184, 0.2)",
      ownerImmune: true,
      damage: 0,
      data: { plantType },
    });
    game.spawnZone(zone);
    return zone;
  }

  function spawnPreviewXpBurst(weapon, game, position) {
    for (let index = 0; index < 3; index += 1) {
      const angle = (Math.PI * 2 * index) / 3 + randomRange(-0.22, 0.22);
      weapon.orbs.push({
        position: { ...position },
        velocity: vec(Math.cos(angle) * randomRange(180, 260), Math.sin(angle) * randomRange(180, 260)),
        life: 1.3,
        radius: 7,
      });
    }
    game.spawnBurst(position, "#b985ff", 10);
  }

  function interruptPreviewWeapon(weapon, time = 0.7) {
    weapon.cooldown = Math.max(weapon.cooldown, time);
    if (weapon.projectile) {
      weapon.projectile.life = 0;
    }
    if (weapon.id === "elytra") {
      weapon.owner.clearStatus("gliding");
    }
  }

  function modifyPreviewWeaponSpeed(weapon, base) {
    if (weapon.id === "elytra" && weapon.owner.hasStatus("gliding")) {
      return Math.max(base, 900);
    }
    if (weapon.id === "totem" && weapon.owner.hasStatus("invulnerable")) {
      return Math.max(base, 520);
    }
    if (weapon.id === "invisPotion" && weapon.owner.hasStatus("invisible")) {
      return Math.max(base, 450);
    }
    if (weapon.id === "gravityPotion" && weapon.buffTimer > 0) {
      return Math.max(base, 480);
    }
    return base;
  }

  function modifyPreviewWeaponDamage(weapon, damage, info) {
    if (weapon.id === "shulkerBox") {
      const projectileLike = /bolt|snow|trident|fire|pearl|lava|ice|book|xp|echo/i.test(info.type || "");
      if (projectileLike && weapon.stored < weapon.maxStored) {
        weapon.stored += 1;
      }
      return Math.round(damage * (projectileLike ? 0.56 : 0.78));
    }
    if (weapon.id === "beehive" && weapon.bees.length > 0) {
      return Math.round(damage * 0.8);
    }
    if (weapon.id === "totem") {
      if (!weapon.totemSpent) {
        return Math.round(damage * 0.8);
      }
      if (weapon.totemCooldown > 0) {
        return Math.round(damage * 1.25);
      }
      return damage;
    }
    if (weapon.id === "goldenApple" && weapon.buffTimer > 0) {
      return Math.round(damage * 0.78);
    }
    if (weapon.id === "elytra" && weapon.owner.hasStatus("gliding") && /bolt|snow|trident|fire|pearl|xp|book|shulker|hook|cry|bee|anchor|obsidian|blast|tnt|lantern|note|wave|piston|echo/i.test(info.type || "")) {
      return Math.round(damage * 1.35);
    }
    if (weapon.id === "gravityPotion" && weapon.inAnomaly) {
      return Math.round(damage * 0.5);
    }
    return damage;
  }

  function tryPreviewWeaponPreventDeath(weapon, amount, info) {
    if (weapon.id === "totem" && !weapon.totemSpent) {
      const tooBig = amount >= weapon.owner.maxHp * 1.8;
      const lavaKill = /lava/i.test(info.type || "");
      if (!tooBig && !lavaKill) {
        weapon.totemSpent = true;
        weapon.totemCooldown = 13;
        weapon.owner.hp = 50;
        weapon.owner.setStatus("invulnerable", 3);
        weapon.owner.setStatus("silenced", 3);
        weapon.owner.setStatus("gliding", 3);
        weapon.owner.addShield(14, info.game, "#b8ffb6");
        weapon.owner.receiveVelocity(scale(normalize(vec(randomRange(-1, 1), randomRange(-1, 1))), 460));
        previewWeaponFlash(weapon, "firing", 1.2);
        if (info.game) {
          radialBlast(info.game, weapon.owner.position, weapon.owner, {
            radius: 210,
            damage: 30,
            edgeDamage: 10,
            knockback: 360,
            color: "#bdf6b4",
            type: "totem-explode",
            affectOwner: false,
          });
          info.game.triggerFlash("#b9ffb8", 0.24);
          info.game.spawnBurst(weapon.owner.position, "#b2ffb5", 34);
          info.game.spawnShardBurst(weapon.owner.position, "#e2ffe2", 16);
        }
        if (info.sourceFighter && info.sourceFighter !== weapon.owner && !info.sourceFighter.dead) {
          info.sourceFighter.applyPoison(5, 3);
          info.sourceFighter.setStatus("marked", 2.2);
        }
        return true;
      }
    }
    if (weapon.id === "respawnAnchor") {
      if (weapon.anchors.length > 0 && info.game) {
        for (const anchor of weapon.anchors) {
          radialBlast(info.game, anchor.position, weapon.owner, {
            radius: 140,
            damage: 35,
            edgeDamage: 15,
            knockback: 320,
            color: "#d1b5ff",
            type: "anchor-death",
            affectOwner: false,
          });
        }
        weapon.anchors = [];
      }
      return false;
    }
    return false;
  }

  function onPreviewWeaponOwnerDamaged(weapon, info) {
    if (weapon.id === "shulkerBox" && info.resolvedDamage > 20 && weapon.teleportCooldown <= 0) {
      for (let index = 0; index < 3; index += 1) {
        weapon.mineTraps.push({
          position: keepPointInArena(add(weapon.owner.position, vec(randomRange(-42, 42), randomRange(-42, 42))), 18),
          life: 6,
        });
      }
      const dir = normalize(vec(randomRange(-1, 1), randomRange(-1, 1)));
      const target = add(weapon.owner.position, scale(dir, randomRange(120, 190)));
      teleportPreviewWeaponOwner(weapon, info.game, target, { color: "#d6a7ff" });
      weapon.teleportCooldown = 7;
    } else if (weapon.id === "beehive" && info.game) {
      info.game.spawnZone(new Zone({
        kind: "honey",
        owner: weapon.owner,
        position: { ...weapon.owner.position },
        radius: 96,
        startRadius: 24,
        growTime: 0.12,
        life: 3.2,
        tickRate: 0.22,
        color: "rgba(255, 217, 101, 0.26)",
        ownerImmune: true,
        damage: 0,
        data: {
          heavySlow: true,
        },
      }));
    } else if (weapon.id === "respawnAnchor" && info.game) {
      info.game.spawnZone(new Zone({
        kind: "radiation",
        owner: weapon.owner,
        position: { ...weapon.owner.position },
        radius: 120,
        startRadius: 18,
        growTime: 0.12,
        life: 3,
        tickRate: 1,
        color: "rgba(140, 90, 255, 0.24)",
        ownerImmune: true,
        damage: 0,
        onTick: (target, currentGame, zone) => {
          if (target === zone.owner) {
            return;
          }
          target.takeDamage(3, {
            game: currentGame,
            type: "anchor-rad-trigger",
            hitFrom: zone.position,
            color: "#c9b8ff",
            sourceFighter: weapon.owner,
            ignoreArmor: true,
          });
        },
      }));
    } else if (weapon.id === "invisPotion" && weapon.owner.hasStatus("invisible")) {
      weapon.owner.setStatus("invisible", 1);
      weapon.owner.setStatus("invulnerable", 1);
    } else if (
      weapon.id === "turtlePotion" &&
      weapon.owner.hasStatus("tanking") &&
      info.sourceFighter &&
      !info.sourceFighter.dead &&
      weapon.thornsCooldown <= 0 &&
      !info.preventReactiveDamage &&
      !/^(thorns|anchor-|burn|poison|water|lava|fire|ice|book-quake|totem-aura-dot)/i.test(info.type || "")
    ) {
      info.sourceFighter.takeDamage(3, {
        game: info.game,
        type: "thorns",
        hitFrom: weapon.owner.position,
        knockback: 60,
        color: "#88e6b8",
        ignoreArmor: true,
        sourceFighter: weapon.owner,
        preventReactiveDamage: true,
      });
      info.sourceFighter.setStatus("snagged", 0.4);
      weapon.thornsCooldown = 0.5;
    }
  }

  function onPreviewWeaponWallHit(weapon, normal, game) {
    if (weapon.id === "slimePiston") {
      weapon.orientation += Math.PI * 0.5;
    } else if (weapon.id === "noteBlock") {
      weapon.noteWallHits = (weapon.noteWallHits || 0) + 1;
      if ((weapon.noteReleaseCooldown || 0) > 0 || weapon.noteWallHits % 2 !== 0) {
        return;
      }
      const strong = weapon.noteWallHits % 6 === 0;
      weapon.lastWallBeat = game.time;
      weapon.noteReleaseCooldown = strong ? 1.8 : 1.2;
      const waveCount = strong ? 2 : 1;
      for (let index = 0; index < waveCount; index += 1) {
        weapon.waves.push({
          position: { ...weapon.owner.position },
          radius: 36,
          maxRadius: strong ? 420 : 380,
          life: 0.62,
          hit: false,
          strong,
          delay: index * 0.18,
        });
      }
      previewWeaponFlash(weapon, "firing", 0.28);
    } else if (weapon.id === "elytra" && weapon.owner.hasStatus("gliding") && weapon.glideCrashLock <= 0) {
      weapon.glideCrashLock = 0.5;
      weapon.owner.clearStatus("gliding");
      weapon.cooldown = Math.max(weapon.cooldown, 6);
    } else if (weapon.id === "respawnAnchor") {
      game.spawnZone(new Zone({
        kind: "radiation",
        owner: weapon.owner,
        position: { ...weapon.owner.position },
        radius: 120,
        startRadius: 16,
        growTime: 0.1,
        life: 3,
        tickRate: 1,
        color: "rgba(140, 90, 255, 0.24)",
        ownerImmune: true,
        damage: 0,
        onTick: (target, currentGame, zone) => {
          if (target === zone.owner) {
            return;
          }
          target.takeDamage(3, {
            game: currentGame,
            type: "anchor-rad-wall",
            hitFrom: zone.position,
            color: "#c9b8ff",
            sourceFighter: weapon.owner,
            ignoreArmor: true,
          });
        },
      }));
    } else if (weapon.id === "jackOLantern") {
      weapon.lanterns.push({
        position: keepPointInArena(add(weapon.owner.position, scale(normal, 82)), 42),
        timer: 3,
        triggered: false,
        damage: randomInt(16, 22),
      });
      weapon.lanterns = weapon.lanterns.slice(-5);
    }
  }

  function onPreviewWeaponTouchEnemy(weapon, enemy, game) {
    if (weapon.id === "blazeRod" && weapon.meleeCooldown <= 0) {
      enemy.takeDamage(5, {
        game,
        type: "blaze-melee",
        hitFrom: weapon.owner.position,
        knockback: 190,
        color: "#ffbf6c",
        sourceFighter: weapon.owner,
      });
      enemy.applyBurn(2.2, 2);
      weapon.meleeCooldown = 1.1;
    } else if (weapon.id === "elytra" && weapon.owner.hasStatus("gliding") && length(weapon.owner.velocity) >= 320 && weapon.bashCooldown <= 0 && weapon.glideWindup <= 0) {
      enemy.takeDamage(21, {
        game,
        type: "elytra-slam",
        hitFrom: weapon.owner.position,
        knockback: 300,
        color: "#eef5ff",
        sourceFighter: weapon.owner,
      });
      enemy.setStatus("anchored", 0.7);
      weapon.owner.clearStatus("gliding");
      weapon.bashCooldown = 1.2;
      weapon.cooldown = Math.max(weapon.cooldown, 4);
    } else if (weapon.id === "goldenApple" && weapon.buffTimer > 0 && weapon.bashCooldown <= 0) {
      enemy.takeDamage(7, {
        game,
        type: "golden-bash",
        hitFrom: weapon.owner.position,
        knockback: 200,
        color: "#ffd96a",
        sourceFighter: weapon.owner,
      });
      weapon.bashCooldown = 1.2;
    } else if (weapon.id === "totem" && weapon.owner.hasStatus("invulnerable") && weapon.bashCooldown <= 0) {
      enemy.takeDamage(8, {
        game,
        type: "totem-wave",
        hitFrom: weapon.owner.position,
        knockback: 200,
        color: "#b6ffb3",
        sourceFighter: weapon.owner,
      });
      weapon.bashCooldown = 0.7;
    } else if (weapon.id === "invisPotion" && weapon.owner.hasStatus("invisible") && !weapon.hasPiercedThisInvis && weapon.bashCooldown <= 0) {
      enemy.takeDamage(5, {
        game,
        type: "invis-collision",
        hitFrom: weapon.owner.position,
        knockback: 120,
        color: "#dfd2ff",
        sourceFighter: weapon.owner,
      });
      weapon.bashCooldown = 0.6;
    } else if (weapon.id === "turtlePotion" && weapon.owner.hasStatus("tanking") && weapon.bashCooldown <= 0) {
      radialBlast(game, weapon.owner.position, weapon.owner, {
        radius: 130,
        damage: 9,
        edgeDamage: 3,
        knockback: 210,
        color: "#88e6b8",
        type: "shell-burst",
        affectOwner: false,
      });
      weapon.bashCooldown = 0.9;
    }
  }

  function spawnPreviewZombie(weapon, position, game = null) {
    weapon.zombies.push({
      position: { ...position },
      velocity: vec(randomRange(-40, 40), randomRange(-40, 40)),
      life: 30,
      maxLife: 30,
      bites: 3,
      alliedTimer: 0,
      hungerTimer: 2,
    });
    // Spawn cost: owner loses 3 HP when a zombie is summoned (if game provided)
    if (game && weapon && weapon.owner && typeof weapon.owner.takeDamage === "function") {
      try {
        weapon.owner.takeDamage(4, {
          game,
          type: "rotten-spawn",
          hitFrom: position,
          color: "#9fbf7b",
          sourceFighter: weapon.owner,
        });
      } catch (e) {
        // swallow any errors; spawn still proceeds
      }
    }
  }

  function releasePreviewShulkerVolley(weapon, game, enemy) {
    const count = Math.min(weapon.stored, 4);
    if (count <= 0 || !enemy) {
      return;
    }
    const base = aimAtEnemy(weapon.owner, enemy, 0.12);
    for (let index = 0; index < count; index += 1) {
      const dir = rotateVector(base, (-0.26 * (count - 1)) / 2 + index * 0.26);
      const start = add(weapon.owner.position, scale(dir, weapon.owner.ballRadius + 18));
      game.projectiles.push(new Projectile({
        kind: "shulker-bolt",
        owner: weapon.owner,
        position: start,
        velocity: scale(dir, 340),
        life: 1.4,
        color: "#e5cfff",
        radius: 8,
        rotationSpeed: 8,
        onHit: (target, currentGame, shot) => {
          target.takeDamage(6, {
            game: currentGame,
            type: "shulker-bolt",
            hitFrom: shot.position,
            knockback: 110,
            color: "#edd9ff",
            sourceFighter: weapon.owner,
          });
          target.setStatus("marked", 1);
          return true;
        },
      }));
    }
    weapon.stored -= count;
    weapon.cooldown = randomRange(2.2, 2.9);
    previewWeaponFlash(weapon, "firing", 0.35);
  }

  function performPreviewBookEcho(weapon, game, enemy) {
    const recorded = weapon.records.shift();
    if (!recorded || !enemy) {
      return;
    }
    const aim = aimAtEnemy(weapon.owner, enemy, 0.18);
    const start = add(weapon.owner.position, scale(aim, weapon.owner.ballRadius + 16));
    if (["fishingRod", "loyaltyTrident", "enderPearl", "observer", "slimePiston"].includes(recorded)) {
      const pulse = pulseLine(game, weapon.owner, weapon.owner.position, aim, 210, 30, {
        color: "rgba(255, 226, 184, 0.22)",
        kind: "echo",
      });
      for (const target of pulse.targets) {
        target.takeDamage(13, {
          game,
          type: "book-echo",
          hitFrom: weapon.owner.position,
          knockback: 180,
          color: "#ffe1aa",
          sourceFighter: weapon.owner,
        });
        target.interruptWeapon(0.6);
      }
    } else if (["waterBucket", "lavaBucket", "flintSteel", "cryingObsidian", "jackOLantern", "boneMeal", "tnt"].includes(recorded)) {
      game.spawnZone(new Zone({
        kind: recorded === "waterBucket" ? "water" : recorded === "boneMeal" ? "plants" : recorded === "cryingObsidian" ? "cry" : recorded === "jackOLantern" ? "light" : "fire",
        owner: weapon.owner,
        position: keepPointInArena(add(weapon.owner.position, scale(aim, 120)), 42),
        radius: recorded === "jackOLantern" ? 70 : 60,
        startRadius: 18,
        growTime: 0.14,
        life: recorded === "cryingObsidian" ? 2.8 : 2.2,
        tickRate: 0.22,
        color: recorded === "waterBucket" ? "rgba(116, 186, 255, 0.28)" : recorded === "boneMeal" ? "rgba(228, 241, 206, 0.22)" : "rgba(255, 170, 118, 0.22)",
        ownerImmune: true,
        damage: recorded === "jackOLantern" ? 5 : recorded === "flintSteel" || recorded === "tnt" ? 4 : 0,
        data: recorded === "boneMeal" ? { plantType: chance(0.35) ? "flower" : (chance(0.5) ? "bush" : "grass") } : {},
      }));
    } else if (["goldenApple", "totem", "invisPotion", "gravityPotion", "turtlePotion", "expBottle", "respawnAnchor"].includes(recorded)) {
      weapon.owner.addShield(10, game, "#ffe4a8");
      weapon.owner.applyRegen(2.6, 2);
      weapon.owner.setStatus("foreseen", 0.8);
    } else if (recorded === "beehive") {
      weapon.bees.push({
        angle: randomRange(0, Math.PI * 2),
        orbit: 34,
        dash: null,
        life: 5,
        damage: 3,
      });
    } else if (recorded === "rottenFlesh") {
      spawnPreviewZombie(weapon, add(weapon.owner.position, scale(aim, 24)), game);
    } else {
      game.projectiles.push(new Projectile({
        kind: "book-shot",
        owner: weapon.owner,
        position: start,
        velocity: scale(aim, 320),
        life: 1.2,
        color: "#ffe4b7",
        radius: 8,
        onHit: (target, currentGame, shot) => {
          target.takeDamage(8, {
            game: currentGame,
            type: "book-shot",
            hitFrom: shot.position,
            knockback: 120,
            color: "#ffe0b0",
            sourceFighter: weapon.owner,
          });
          return true;
        },
      }));
    }
    previewWeaponFlash(weapon, "firing", 0.3);
  }

  function drawPreviewWeaponAttachment(weapon, ctx, game = null) {
    if (game && drawWeaponAttachmentSprite(game, ctx, weapon.id, weapon.owner.position.x + 44, weapon.owner.position.y - 44, 72, 72)) {
      return;
    }
    const meta = WEAPON_LIBRARY[weapon.id];
    if (!meta) {
      return;
    }
    ctx.save();
    ctx.translate(weapon.owner.position.x + 44, weapon.owner.position.y - 44);
    if (weapon.id === "goldenApple") {
      ctx.fillStyle = "#ffd757";
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff6bf";
      ctx.fillRect(-3, -22, 6, 10);
    } else if (weapon.id === "turtlePotion") {
      ctx.fillStyle = "#7fe1b3";
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2c5848";
      ctx.fillRect(-8, -3, 16, 6);
      ctx.fillRect(-3, -8, 6, 16);
    } else if (weapon.id === "totem") {
      ctx.fillStyle = weapon.totemSpent ? "rgba(255,255,255,0.18)" : "#a8f4a0";
      ctx.fillRect(-10, -20, 20, 40);
      ctx.fillRect(-16, -6, 32, 8);
    } else if (weapon.id === "gravityPotion") {
      ctx.fillStyle = "#a9cbff";
      ctx.beginPath();
      ctx.arc(0, 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#dfeaff";
      ctx.fillRect(-6, -22, 12, 10);
      ctx.fillStyle = "#6288d8";
      ctx.fillRect(-9, -4, 18, 10);
    } else {
      ctx.fillStyle = meta.color;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#091018";
    ctx.font = "bold 11px Consolas, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(meta.badge, 0, 1);
    ctx.restore();
  }

  function drawPreviewWeaponArena(weapon, ctx, game = null) {
    const drawArenaSprite = (key, position, size, options = {}) => (
      game && game.drawSprite(ctx, key, position.x, position.y, size, size, options)
    );
    if (weapon.id === "hopperMinecart" && weapon.cart) {
      if (!drawArenaSprite("wagon", weapon.cart.position, 88) && !drawArenaSprite("hopperMinecart", weapon.cart.position, 88)) {
        ctx.save();
        ctx.translate(weapon.cart.position.x, weapon.cart.position.y);
        ctx.fillStyle = "#b9b09b";
        ctx.fillRect(-24, -14, 48, 28);
        ctx.fillStyle = "#f2e6c3";
        ctx.fillRect(-16, -8, 32, 8);
        ctx.restore();
      }
      ctx.save();
      for (const funnel of weapon.funnels) {
        const alpha = clamp(funnel.life / 5, 0.18, 0.72);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(240, 224, 182, 0.16)";
        ctx.beginPath();
        ctx.arc(funnel.position.x, funnel.position.y, funnel.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(246, 236, 204, 0.75)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(funnel.position.x, funnel.position.y, Math.max(12, funnel.radius * 0.72), 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(201, 186, 146, 0.95)";
        ctx.beginPath();
        ctx.moveTo(funnel.position.x - 16, funnel.position.y - 12);
        ctx.lineTo(funnel.position.x + 16, funnel.position.y - 12);
        ctx.lineTo(funnel.position.x + 8, funnel.position.y + 10);
        ctx.lineTo(funnel.position.x + 4, funnel.position.y + 22);
        ctx.lineTo(funnel.position.x - 4, funnel.position.y + 22);
        ctx.lineTo(funnel.position.x - 8, funnel.position.y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#75654a";
        ctx.fillRect(funnel.position.x - 11, funnel.position.y - 18, 22, 6);
      }
      ctx.restore();
    } else if (weapon.id === "tnt") {
      for (const tnt of weapon.tnts) {
        if (!drawArenaSprite("tnt", tnt.position, 48, { alpha: tnt.wet ? 0.72 : 1 })) {
          ctx.save();
          ctx.translate(tnt.position.x, tnt.position.y);
          ctx.fillStyle = tnt.wet ? "#7f8d99" : (tnt.timer < 0.6 ? "#ff9f9f" : "#d25555");
          ctx.fillRect(-18, -18, 36, 36);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(-18, -3, 36, 6);
          ctx.restore();
        }
      }
    } else if (weapon.id === "slimePiston" && weapon.stateKey === "firing") {
      const dir = rotateVector(vec(1, 0), weapon.orientation);
      const end = add(weapon.owner.position, scale(dir, 160));
      const mid = add(weapon.owner.position, scale(dir, 88));
      ctx.save();
      ctx.strokeStyle = "rgba(135, 255, 162, 0.65)";
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(weapon.owner.position.x, weapon.owner.position.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.strokeStyle = "rgba(92, 74, 54, 0.86)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(weapon.owner.position.x, weapon.owner.position.y);
      ctx.lineTo(mid.x, mid.y);
      ctx.stroke();
      ctx.restore();
      drawProceduralWeaponSprite(ctx, "slimePiston", mid.x, mid.y, 60, 60, { rotation: weapon.orientation });
      drawProceduralWeaponSprite(ctx, "slimePiston", end.x, end.y, 82, 82, { rotation: weapon.orientation });
    } else if (weapon.id === "observer") {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = "#bcd7ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(weapon.owner.position.x, weapon.owner.position.y, 145, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      if (!drawArenaSprite("observer", add(weapon.owner.position, vec(0, -56)), 70)) {
        drawProceduralWeaponSprite(ctx, "observer", weapon.owner.position.x, weapon.owner.position.y - 56, 70, 70);
      }
    } else if (weapon.id === "beehive") {
      ctx.save();
      for (const bee of weapon.bees) {
        const pos = bee.position || weapon.owner.position;
        ctx.fillStyle = bee.damage > 2 ? "#ffb84d" : "#ffe067";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, bee.damage > 2 ? 8 : 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (weapon.id === "noteBlock") {
      ctx.save();
      for (const wave of weapon.waves) {
        ctx.globalAlpha = clamp(wave.life / 0.65, 0, 1) * 0.55;
        ctx.strokeStyle = wave.strong ? "#ffd19e" : "#ffbf86";
        ctx.lineWidth = wave.strong ? 5 : 3;
        ctx.beginPath();
        ctx.arc(wave.position.x, wave.position.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (weapon.id === "shulkerBox") {
      ctx.save();
      if (weapon.stored > 0) {
        ctx.fillStyle = "rgba(216, 174, 255, 0.16)";
        ctx.beginPath();
        ctx.arc(weapon.owner.position.x, weapon.owner.position.y, 76, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const trap of weapon.traps) {
        if (!drawArenaSprite("shulkerBox", trap.position, 36, { alpha: trap.timer < 0.4 ? 0.92 : 1 })) {
          ctx.fillStyle = trap.timer < 0.4 ? "#ffd7ff" : "#c98dff";
          ctx.fillRect(trap.position.x - 14, trap.position.y - 14, 28, 28);
          ctx.strokeStyle = "#f4d8ff";
          ctx.lineWidth = 2;
          ctx.strokeRect(trap.position.x - 14, trap.position.y - 14, 28, 28);
        }
      }
      ctx.restore();
    } else if (weapon.id === "respawnAnchor" && weapon.anchor) {
      if (!drawArenaSprite("respawnAnchor", weapon.anchor.position, 58)) {
        ctx.save();
        ctx.translate(weapon.anchor.position.x, weapon.anchor.position.y);
        ctx.fillStyle = "#7c4bba";
        ctx.fillRect(-20, -24, 40, 48);
        ctx.fillStyle = "#d3a7ff";
        for (let index = 0; index < weapon.charges; index += 1) {
          ctx.beginPath();
          ctx.arc(-16 + index * 10, -30, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    } else if (weapon.id === "expBottle") {
      ctx.save();
      for (const orb of weapon.orbs) {
        if (!drawArenaSprite("expBottle", orb.position, Math.max(18, orb.radius * 3))) {
          ctx.fillStyle = "#bd8aff";
          ctx.beginPath();
          ctx.arc(orb.position.x, orb.position.y, orb.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (weapon.id === "cryingObsidian" && weapon.portal) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = "#a47aff";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(weapon.portal.position.x, weapon.portal.position.y, weapon.portal.radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      drawArenaSprite("cryingObsidian", weapon.portal.position, weapon.portal.radius * 0.9, { alpha: 0.28 });
    } else if (weapon.id === "blazeRod") {
      ctx.save();
      for (const orb of weapon.orbs) {
        const size = Math.max(34, orb.orbit ? orb.orbit * 0.52 : 34);
        if (!drawArenaSprite("projectileFireball", orb.position, size)) {
          ctx.fillStyle = "#ffb567";
          ctx.beginPath();
          ctx.arc(orb.position.x, orb.position.y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#fff1c1";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(orb.position.x, orb.position.y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    } else if (weapon.id === "rottenFlesh") {
      ctx.save();
      for (const bait of weapon.baits) {
        if (!drawArenaSprite("rottenFlesh", bait.position, 28)) {
          ctx.fillStyle = "#9fbf7b";
          ctx.beginPath();
          ctx.arc(bait.position.x, bait.position.y, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (const zombie of weapon.zombies) {
        ctx.fillStyle = zombie.alliedTimer > 0 ? "#8ef7a1" : "#a4bf7b";
        ctx.beginPath();
        ctx.arc(zombie.position.x, zombie.position.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const villager of weapon.villagers) {
        ctx.fillStyle = "#9ad8a1";
        ctx.beginPath();
        ctx.arc(villager.position.x, villager.position.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (weapon.id === "jackOLantern") {
      ctx.save();
      for (const lantern of weapon.lanterns) {
        if (!drawArenaSprite("jackOLantern", lantern.position, 42, { alpha: lantern.triggered ? 1 : 0.9 })) {
          ctx.fillStyle = lantern.triggered ? "#ffe1ab" : "#ffb45e";
          ctx.fillRect(lantern.position.x - 18, lantern.position.y - 18, 36, 36);
        }
      }
      ctx.restore();
    } else if (weapon.id === "bookQuill" && weapon.records.length) {
      if (!drawArenaSprite("bookQuill", add(weapon.owner.position, vec(0, -78)), 52, { alpha: 0.34 })) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "#ffe0b2";
        ctx.fillRect(weapon.owner.position.x - 24, weapon.owner.position.y - 104, 48, 54);
        ctx.restore();
      }
    }
  }

  function tickPreviewWeaponTimers(weapon, dt) {
    tickPreviewWeaponState(weapon, dt);
    const cooldownDecay = getWeaponCooldownDecay(weapon, dt);
    // Decay ability cooldowns faster according to GLOBAL_COOLDOWN_SCALE
    weapon.cooldown = Math.max(0, weapon.cooldown - cooldownDecay);
    weapon.altCooldown = Math.max(0, weapon.altCooldown - cooldownDecay);
    weapon.buffTimer = Math.max(0, weapon.buffTimer - dt); // buff durations remain unchanged
    weapon.activeTimer = Math.max(0, weapon.activeTimer - dt);
    weapon.reloadTimer = Math.max(0, weapon.reloadTimer - cooldownDecay);
    weapon.bashCooldown = Math.max(0, weapon.bashCooldown - cooldownDecay);
    weapon.meleeCooldown = Math.max(0, weapon.meleeCooldown - cooldownDecay);
    weapon.teleportCooldown = Math.max(0, weapon.teleportCooldown - cooldownDecay);
    weapon.glideCrashLock = Math.max(0, weapon.glideCrashLock - cooldownDecay);
    weapon.beeBoostTimer = Math.max(0, weapon.beeBoostTimer - dt);
    weapon.thornsCooldown = Math.max(0, weapon.thornsCooldown - dt);
  }

  function updatePreviewEnemyTracking(weapon, enemy) {
    if (!enemy || !enemy.weapon) {
      return;
    }
    if (enemy.weapon.stateKey !== weapon.lastEnemyState) {
      if (enemy.weapon.stateKey !== "normal") {
        if (weapon.id === "observer") {
          weapon.owner.setStatus("foreseen", 1);
          enemy.setStatus("marked", 1);
        }
        if (weapon.id === "bookQuill") {
          pushPreviewWeaponRecord(weapon, enemy.weapon.id);
        }
      }
      weapon.lastEnemyState = enemy.weapon.stateKey;
      weapon.lastEnemyWeaponId = enemy.weapon.id;
    }
  }

  function updatePreviewWeapon(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy);
    tickPreviewWeaponTimers(weapon, dt);
    updatePreviewEnemyTracking(weapon, enemy);

    switch (weapon.id) {
      case "pacifist":
        weapon.stateKey = "normal";
        break;
      case "expBottle":
        updatePreviewExpBottle(weapon, dt, game, enemy);
        break;
      case "totem":
        updatePreviewTotem(weapon, dt, game);
        break;
      case "hopperMinecart":
        updatePreviewHopper(weapon, dt, game, enemy);
        break;
      case "tnt":
        updatePreviewTnt(weapon, dt, game);
        break;
      case "slimePiston":
        updatePreviewSlimePiston(weapon, game, enemy);
        break;
      case "observer":
        updatePreviewObserver(weapon, game, enemy);
        break;
      case "beehive":
        updatePreviewBeehive(weapon, dt, game, enemy);
        break;
      case "noteBlock":
        updatePreviewNoteBlock(weapon, dt, game, enemy);
        break;
      case "shulkerBox":
        updatePreviewShulker(weapon, dt, game, enemy);
        break;
      case "respawnAnchor":
        updatePreviewAnchor(weapon, dt, game, enemy);
        break;
      case "enderPearl":
        updatePreviewPearl(weapon, game, enemy);
        break;
      case "cryingObsidian":
        updatePreviewCryingObsidian(weapon, dt, game);
        break;
      case "blazeRod":
        updatePreviewBlaze(weapon, dt, game, enemy);
        break;
      case "rottenFlesh":
        updatePreviewRottenFlesh(weapon, dt, game, enemy);
        break;
      case "jackOLantern":
        updatePreviewJack(weapon, dt, game, enemy);
        break;
      case "boneMeal":
        updatePreviewBoneMeal(weapon, dt, game, enemy);
        break;
      case "bookQuill":
        updatePreviewBook(weapon, game, enemy);
        break;
      case "elytra":
        updatePreviewElytra(weapon, dt, enemy);
        break;
      case "goldenApple":
        updatePreviewGoldenApple(weapon, game, enemy);
        break;
      case "invisPotion":
        updatePreviewInvis(weapon, dt, game, enemy);
        break;
      case "gravityPotion":
        updatePreviewGravity(weapon, dt, game, enemy);
        break;
      case "turtlePotion":
        updatePreviewTurtle(weapon, dt, game, enemy);
        break;
      default:
        break;
    }
  }

  function updatePreviewExpBottle(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    const damageMult = 1 + weapon.expDamageBonusStacks * 0.1;
    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && weapon.cooldown <= 0 && enemy) {
      const aim = aimAtEnemy(weapon.owner, enemy, 0.14, game);
      const start = add(weapon.owner.position, scale(aim, weapon.owner.ballRadius + 16));
      const speed = 320;
      const range = ARENA.width / 2;
      game.projectiles.push(new Projectile({
        kind: "xp-bottle",
        owner: weapon.owner,
        position: start,
        velocity: add(scale(aim, speed), scale(weapon.owner.velocity, 0.18)),
        gravity: 0,
        life: range / speed,
        color: "#ae86ff",
        radius: 9,
        onHit: (target, currentGame, shot) => {
          if (getCombatantSide(target) !== getCombatantSide(weapon.owner)) {
            target.takeDamage(Math.round(8 * damageMult), {
              game: currentGame,
              type: "xp-bottle-hit",
              hitFrom: shot.position,
              knockback: 140,
              color: "#c6a2ff",
              sourceFighter: weapon.owner,
            });
          }
          spawnPreviewXpBurst(weapon, currentGame, shot.position);
          return true;
        },
        onWall: (currentGame, _normal, shot) => {
          spawnPreviewXpBurst(weapon, currentGame, shot.position);
        },
        onExpire: (currentGame, shot) => {
          spawnPreviewXpBurst(weapon, currentGame, shot.position);
        },
      }));
      weapon.cooldown = 4.5;
      previewWeaponFlash(weapon, "firing", 0.3);
    }

    weapon.orbs = weapon.orbs.filter((orb) => orb.life > 0);
    for (const orb of weapon.orbs) {
      orb.life -= dt;
      orb.position.x += orb.velocity.x * dt;
      orb.position.y += orb.velocity.y * dt;
      orb.velocity = scale(orb.velocity, clamp(1 - dt * 1.6, 0, 1));
      for (const target of getActiveCombatants(game)) {
        if (isCombatantDead(target)) {
          continue;
        }
        if (distance(target.position, orb.position) <= target.ballRadius + orb.radius) {
          if (getCombatantSide(target) === getCombatantSide(weapon.owner)) {
            weapon.expDamageBonusStacks = Math.min(6, weapon.expDamageBonusStacks + 1);
            game.addFloatingText(`XP +${weapon.expDamageBonusStacks * 10}%`, add(weapon.owner.position, vec(0, -54)), "#c6a1ff");
          } else {
            target.takeDamage(Math.round(2 * damageMult), {
              game,
              type: "xp-particle",
              color: "#d2a6ff",
              ignoreArmor: true,
              hitFrom: orb.position,
              sourceFighter: weapon.owner,
            });
          }
          orb.life = 0;
          break;
        }
      }
    }
  }

  function updatePreviewTotem(weapon, dt, game) {
    const active = !weapon.totemSpent && weapon.totemCooldown <= 0;
    weapon.armorMultiplier = active ? 0.76 : 1;
    weapon.stateKey = weapon.owner.hasStatus("invulnerable") ? "firing" : active ? "normal" : "charging";
    if (!weapon.totemAuraZone) {
      weapon.totemAuraZone = new Zone({
        kind: "totemAura",
        owner: weapon.owner,
        position: { ...weapon.owner.position },
        radius: 252,
        startRadius: 24,
        growTime: 0.18,
        life: 15,
        tickRate: 0.5,
        color: "rgba(175, 255, 183, 0.24)",
        ownerImmune: true,
        damage: 0,
        onTick: (target, currentGame, zone) => {
          if (target === zone.owner) {
            return;
          }
          target.takeDamage(2, {
            game: currentGame,
            type: "totem-aura-dot",
            hitFrom: zone.position,
            color: "#adffbb",
            ignoreArmor: true,
            sourceFighter: weapon.owner,
          });
        },
      });
      game.spawnZone(weapon.totemAuraZone);
    } else {
      weapon.totemAuraZone.position = { ...weapon.owner.position };
    }

    if (weapon.totemCooldown > 0) {
      weapon.totemCooldown = Math.max(0, weapon.totemCooldown - getWeaponCooldownDecay(weapon, dt));
    }
  }

  function updatePreviewHopper(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && weapon.cooldown <= 0) {
      const dir = enemy ? normalize(sub(enemy.position, weapon.owner.position)) : vec(weapon.owner.side === "left" ? 1 : -1, 0);
      const center = keepPointInArena(add(weapon.owner.position, scale(dir, randomRange(110, 180))), 80);
      weapon.funnels.push({
        position: center,
        radius: 64,
        life: randomRange(4.2, 5.4),
        hitCooldown: 0,
      });
      weapon.cooldown = randomRange(6.4, 8.2);
      previewWeaponFlash(weapon, "firing", 0.35);
    }

    for (const funnel of weapon.funnels) {
      funnel.life -= dt;
      funnel.hitCooldown = Math.max(0, funnel.hitCooldown - dt);
      const target = getNearestEnemyTarget(game, weapon.owner, enemy, funnel.position);
      if (!target || isCombatantDead(target)) {
        continue;
      }
      if (distance(target.position, funnel.position) <= target.ballRadius + funnel.radius && funnel.hitCooldown <= 0) {
        target.takeDamage(9, {
          game,
          type: "hopper-funnel",
          hitFrom: funnel.position,
          knockback: 140,
          color: "#ece0b8",
          sourceFighter: weapon.owner,
        });
        funnel.hitCooldown = 0.82;
        game.spawnBurst(funnel.position, "#ece0b8", 8);
      }
    }
    weapon.funnels = weapon.funnels.filter((funnel) => funnel.life > 0);
  }

  function updatePreviewTnt(weapon, dt, game) {
    const enemy = getNearestEnemyTarget(game, weapon.owner, null, weapon.owner.position);
    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && weapon.cooldown <= 0) {
      const dir = enemy ? normalize(sub(enemy.position, weapon.owner.position)) : vec(weapon.owner.side === "left" ? 1 : -1, 0);
      weapon.tntCounter += 1;
      weapon.tnts.push({
        position: { ...weapon.owner.position },
        velocity: add(scale(dir, 230), scale(weapon.owner.velocity, 0.2)),
        timer: 2.6,
        wet: false,
        sticky: weapon.tntCounter % 3 === 0,
      });
      weapon.tnts = weapon.tnts.slice(-4);
      weapon.cooldown = randomRange(2.2, 2.8);
      previewWeaponFlash(weapon, "charging", 0.4);
    }

    const pending = [];
    for (const tnt of weapon.tnts) {
      if (!tnt.wet) {
        tnt.timer -= dt;
      }
      tnt.position.x += tnt.velocity.x * dt;
      tnt.position.y += tnt.velocity.y * dt;
      tnt.velocity = scale(tnt.velocity, clamp(1 - dt * 0.4, 0, 1));

      if (tnt.position.x <= ARENA.x + 16 || tnt.position.x >= ARENA.x + ARENA.width - 16) {
        tnt.velocity.x *= -0.65;
      }
      if (tnt.position.y <= ARENA.y + 16 || tnt.position.y >= ARENA.y + ARENA.height - 16) {
        tnt.velocity.y *= -0.65;
      }
      tnt.position = keepPointInArena(tnt.position, 16);

      if (enemy && tnt.sticky && !isCombatantDead(enemy) && distance(enemy.position, tnt.position) <= enemy.ballRadius + 18) {
        tnt.timer = 0;
      }

      for (const zone of game.zones) {
        if (!pointInZone(zone, tnt.position, 16)) {
          continue;
        }
        if (zone.kind === "water") {
          tnt.wet = true;
        } else if (zone.kind === "lava" || zone.kind === "fire") {
          tnt.timer = Math.min(tnt.timer, 0.25);
        }
      }

      if (tnt.timer <= 0 && !tnt.wet) {
        radialBlast(game, tnt.position, weapon.owner, {
          radius: 230,
          damage: 18,
          edgeDamage: 6,
          knockback: 380,
          color: tnt.sticky ? "#ffc4a3" : "#ff8a8a",
          type: tnt.sticky ? "tnt-sticky" : "tnt",
          affectOwner: true,
        });
      } else if (tnt.timer > 0) {
        pending.push(tnt);
      }
    }
    weapon.tnts = pending;
  }

  function updatePreviewSlimePiston(weapon, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    if (weapon.owner.hasStatus("frozen") || weapon.owner.hasStatus("silenced") || weapon.cooldown > 0 || !enemy) {
      return;
    }
    const dir = aimAtEnemy(weapon.owner, enemy, 0.06, game);
    const beam = pulseLine(game, weapon.owner, weapon.owner.position, dir, 190, 40, {
      color: "rgba(134, 255, 161, 0.22)",
      kind: "slime",
    });
    const pistonTip = beam.end;

    const extraProjectiles = [];
    for (const projectile of game.projectiles) {
      if (projectile.expired || projectile.owner === weapon.owner) {
        continue;
      }
      if (distance(projectile.position, pistonTip) > 40 + projectile.radius) {
        continue;
      }
      const reflectedVelocity = sub(projectile.velocity, scale(dir, 2 * dot(projectile.velocity, dir)));
      const reflected = cloneProjectile(projectile, {
        owner: weapon.owner,
        position: { ...projectile.position },
        velocity: reflectedVelocity,
        ignoreFunnelsTime: 0.12,
      });
      extraProjectiles.push(reflected);
      projectile.expired = true;
      projectile.life = 0;
      game.spawnShardBurst(projectile.position, "#b7ffc7", 6);
    }
    if (extraProjectiles.length) {
      game.projectiles.push(...extraProjectiles);
    }

    let hitEnemy = false;
    for (const target of beam.targets) {
      target.takeDamage(8, {
        game,
        type: "slime-hit",
        hitFrom: weapon.owner.position,
        knockback: 120,
        color: "#9cffae",
        sourceFighter: weapon.owner,
      });
      target.receiveVelocity(scale(dir, 340 / Math.max(0.55, target.mass || 1)));
      if (typeof target.setStatus === "function") {
        target.setStatus("marked", 1);
      }
      hitEnemy = true;
      if (distance(target.position, keepPointInArena(add(target.position, scale(dir, 90)), 12)) < 20) {
        target.takeDamage(10, {
          game,
          type: "slime-wall",
          hitFrom: weapon.owner.position,
          knockback: 160,
          color: "#9cffae",
          sourceFighter: weapon.owner,
        });
      }
    }
    if (!hitEnemy) {
      const beamEnd = beam.end;
      const nearWall =
        beamEnd.x <= ARENA.x + 24 ||
        beamEnd.x >= ARENA.x + ARENA.width - 24 ||
        beamEnd.y <= ARENA.y + 24 ||
        beamEnd.y >= ARENA.y + ARENA.height - 24;
      if (nearWall) {
        weapon.owner.receiveVelocity(scale(dir, -300));
      }
    }
    weapon.cooldown = randomRange(1.25, 1.9);
    previewWeaponFlash(weapon, "firing", 0.25);
  }

  function updatePreviewObserver(weapon, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    if (weapon.owner.hasStatus("frozen") || weapon.owner.hasStatus("silenced") || weapon.cooldown > 0 || !enemy) {
      return;
    }
    const dir = aimAtEnemy(weapon.owner, enemy, 0.08);
    const pulse = pulseLine(game, weapon.owner, weapon.owner.position, dir, 280, 34, {
      color: "rgba(187, 215, 255, 0.22)",
      kind: "observer",
    });
    for (const target of pulse.targets) {
      if (target.weapon && target.weapon.stateKey !== "normal") {
        target.interruptWeapon(0.9);
        target.setStatus("silenced", 1.4);
        target.takeDamage(11, {
          game,
          type: "observer-pulse",
          hitFrom: weapon.owner.position,
          knockback: 150,
          color: "#bfd9ff",
          ignoreArmor: true,
          sourceFighter: weapon.owner,
        });
      } else {
        target.takeDamage(5, {
          game,
          type: "observer-mark",
          hitFrom: weapon.owner.position,
          knockback: 90,
          color: "#cbe0ff",
          ignoreArmor: true,
          sourceFighter: weapon.owner,
        });
        target.setStatus("marked", 2);
      }
      weapon.owner.setStatus("foreseen", 1.6);
    }
    weapon.cooldown = randomRange(2.2, 3);
    previewWeaponFlash(weapon, "firing", 0.28);
  }

  function updatePreviewBeehive(weapon, dt, game, enemy) {
    weapon.cooldown -= dt * (weapon.beeBoostTimer > 0 ? 1 : 0);
    const fireNearby = game.zones.some((zone) => (zone.kind === "lava" || zone.kind === "fire") && distance(zone.position, weapon.owner.position) <= zoneMaxRadius(zone) + 90);
    if (weapon.bees.length < 5 && weapon.cooldown <= 0) {
      weapon.bees.push({
        angle: randomRange(0, Math.PI * 2),
        orbit: randomRange(34, 54),
        dash: null,
        life: 6.4,
        damage: weapon.useCount >= 3 ? 8 : 4,
      });
      weapon.cooldown = fireNearby ? 2.45 : (weapon.beeBoostTimer > 0 ? 1.15 : 1.95);
      weapon.useCount = (weapon.useCount + 1) % 5;
    }
    for (const bee of weapon.bees) {
      bee.life -= dt;
      if (bee.dash) {
        bee.position = bee.position || add(weapon.owner.position, vec(Math.cos(bee.angle) * bee.orbit, Math.sin(bee.angle) * bee.orbit));
        bee.position.x += bee.dash.x * dt;
        bee.position.y += bee.dash.y * dt;
        if (enemy && !enemy.dead && distance(bee.position, enemy.position) <= enemy.ballRadius + 12) {
          enemy.takeDamage(bee.damage + 1, {
            game,
            type: "bee",
            hitFrom: bee.position,
            knockback: 70,
            color: "#ffd55a",
            sourceFighter: weapon.owner,
          });
          enemy.applyPoison(3.5, 1);
          game.spawnZone(new Zone({
            kind: "honey",
            owner: weapon.owner,
            position: { ...bee.position },
            radius: 56,
            startRadius: 18,
            growTime: 0.12,
            life: 3.5,
            tickRate: 0.2,
            color: "rgba(255, 217, 101, 0.26)",
            ownerImmune: true,
            damage: 0,
          }));
          bee.life = 0;
        }
      } else {
        bee.angle += dt * 3.2;
        bee.position = add(weapon.owner.position, vec(Math.cos(bee.angle) * bee.orbit, Math.sin(bee.angle) * bee.orbit));
        if (!fireNearby && enemy && distance(weapon.owner.position, enemy.position) <= 320 && chance(dt * 2.2)) {
          bee.dash = scale(normalize(sub(enemy.position, bee.position)), 260);
        }
      }
    }
    weapon.bees = weapon.bees.filter((bee) => bee.life > 0);
    weapon.stateKey = weapon.bees.length ? "firing" : "normal";
  }

  function updatePreviewNoteBlock(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    weapon.noteTimer = Math.max(0, weapon.noteTimer - dt);
    weapon.noteCrescendoTimer = Math.max(0, weapon.noteCrescendoTimer - dt);
    weapon.notePulseTimer = Math.max(0, weapon.notePulseTimer - dt);
    weapon.noteReleaseCooldown = Math.max(0, (weapon.noteReleaseCooldown || 0) - dt);
    if (weapon.noteCrescendoTimer <= 0) {
      weapon.noteCrescendo = 0;
    }

    for (const wave of weapon.waves) {
      if (wave.delay > 0) {
        wave.delay -= dt;
        continue;
      }
      wave.life -= dt;
      wave.radius = lerp(wave.radius, wave.maxRadius, dt * 8.8);
      if (!wave.hit && enemy && !isCombatantDead(enemy) && Math.abs(distance(wave.position, enemy.position) - wave.radius) <= enemy.ballRadius + 16) {
        wave.hit = true;
        const baseDamage = wave.strong ? 10 : 4;
        const noteDamage = baseDamage + weapon.noteCrescendo;
        enemy.takeDamage(noteDamage, {
          game,
          type: wave.strong ? "note-burst" : "note-wave",
          hitFrom: wave.position,
          knockback: wave.strong ? 240 : 150,
          color: "#ffc48d",
          sourceFighter: weapon.owner,
        });
        weapon.noteCrescendo = Math.min(3, weapon.noteCrescendo + 1);
        weapon.noteCrescendoTimer = 1.4;
        if (wave.strong) {
          enemy.receiveVelocity(scale(normalize(vec(randomRange(-1, 1), randomRange(-1, 1))), 180));
        } else {
          weapon.noteResonance = weapon.noteTimer > 0 ? weapon.noteResonance + 1 : 1;
          weapon.noteTimer = 1.1;
          if (weapon.noteResonance >= 4) {
            if (typeof enemy.setStatus === "function") {
              enemy.setStatus("spooked", 0.9);
            }
            if (typeof enemy.interruptWeapon === "function") {
              enemy.interruptWeapon(0.35);
            }
            weapon.noteResonance = 0;
            weapon.noteTimer = 0;
          }
        }
      }
    }
    weapon.waves = weapon.waves.filter((wave) => wave.life > 0);
  }

  function updatePreviewShulker(weapon, dt, game, enemy) {
    weapon.mass = 1.08;
    if (weapon.stored > 0) {
      weapon.armorMultiplier = 0.82;
    } else {
      weapon.armorMultiplier = 0.94;
    }

    weapon.autoFireTimer -= dt;
    weapon.shulkerChargeProgress += dt * (enemy ? 1.2 : 0.45);
    while (weapon.shulkerChargeProgress >= 1) {
      weapon.shulkerChargeProgress -= 1;
      weapon.stored = Math.min(weapon.maxStored, weapon.stored + 1);
    }
    for (const trap of weapon.traps) {
      trap.timer -= dt;
      if (trap.timer <= 0) {
        radialBlast(game, trap.position, weapon.owner, {
          radius: 96,
          damage: 18,
          edgeDamage: 8,
          knockback: 220,
          color: "#efc8ff",
          type: "shulker-trap",
          affectOwner: false,
        });
      }
    }
    weapon.traps = weapon.traps.filter((trap) => trap.timer > 0);

    for (const mine of weapon.mineTraps) {
      mine.life -= dt;
      if (enemy && !enemy.dead && distance(enemy.position, mine.position) <= enemy.ballRadius + 18) {
        radialBlast(game, mine.position, weapon.owner, {
          radius: 64,
          damage: 15,
          edgeDamage: 6,
          knockback: 220,
          color: "#d0b8ff",
          type: "shulker-mine",
          affectOwner: false,
        });
        mine.life = 0;
      }
    }
    weapon.mineTraps = weapon.mineTraps.filter((mine) => mine.life > 0);

    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && weapon.autoFireTimer <= 0 && weapon.stored >= 1 && enemy) {
      if (weapon.stored >= 8) {
        const aim = aimAtEnemy(weapon.owner, enemy, 0.12);
        const start = add(weapon.owner.position, scale(aim, weapon.owner.ballRadius + 18));
        game.projectiles.push(new Projectile({
          kind: "shulker-shell",
          owner: weapon.owner,
          position: start,
          velocity: scale(aim, 280),
          life: 1.35,
          color: "#cfa7ff",
          radius: 14,
          onHit: (target, currentGame, shot) => {
            radialBlast(currentGame, shot.position, weapon.owner, {
              radius: 100,
              damage: 20,
              edgeDamage: 10,
              knockback: 320,
              color: "#d7baff",
              type: "shulker-grenade",
              affectOwner: false,
            });
            return true;
          },
        }));
        weapon.stored -= 5;
      } else if (weapon.stored >= 5) {
        const base = aimAtEnemy(weapon.owner, enemy, 0.12);
        for (let index = 0; index < 3; index += 1) {
          const dir = rotateVector(base, (-0.6 + index * 0.4));
          const start = add(weapon.owner.position, scale(dir, weapon.owner.ballRadius + 18));
          game.projectiles.push(new Projectile({
            kind: "shulker-bolt",
            owner: weapon.owner,
            position: start,
            velocity: scale(dir, 380),
            life: 1.4,
            color: "#e5cfff",
            radius: 8,
            onHit: (target, currentGame, shot) => {
              target.takeDamage(7, {
                game: currentGame,
                type: "shulker-bolt",
                hitFrom: shot.position,
                knockback: 110,
                color: "#edd9ff",
                sourceFighter: weapon.owner,
              });
              target.setStatus("marked", 1);
              return true;
            },
          }));
        }
        weapon.stored -= 5;
      } else if (weapon.stored >= 2) {
        const dir = aimAtEnemy(weapon.owner, enemy, 0.12);
        const start = add(weapon.owner.position, scale(dir, weapon.owner.ballRadius + 18));
        game.projectiles.push(new Projectile({
          kind: "shulker-bolt",
          owner: weapon.owner,
          position: start,
          velocity: scale(dir, 360),
          life: 1.4,
          color: "#e5cfff",
          radius: 8,
          onHit: (target, currentGame, shot) => {
            target.takeDamage(8, {
              game: currentGame,
              type: "shulker-bolt",
              hitFrom: shot.position,
              knockback: 110,
              color: "#edd9ff",
              sourceFighter: weapon.owner,
            });
            target.setStatus("marked", 1);
            return true;
          },
        }));
        weapon.stored -= 1;
      } else {
        const dir = aimAtEnemy(weapon.owner, enemy, 0.08);
        const trapPos = keepPointInArena(add(enemy.position, scale(dir, -42)), 20);
        weapon.traps.push({
          position: trapPos,
          timer: 1.2,
        });
        weapon.traps = weapon.traps.slice(-3);
        weapon.stored = 0;
      }
      weapon.autoFireTimer = 1.2;
      previewWeaponFlash(weapon, "firing", 0.35);
    }
  }

  function updatePreviewAnchor(weapon, dt, game, enemy) {
    weapon.anchorTimer -= dt;
    if (weapon.anchorTimer <= 0 && weapon.anchors.length < 4) {
      weapon.anchorTimer = 5.4;
      weapon.anchors.push({
        position: keepPointInArena({ ...weapon.owner.position }, 42),
        timer: 10,
        exploded: false,
      });
    }

    const nextAnchors = [];
    for (const anchor of weapon.anchors) {
      anchor.timer -= dt;
      if (anchor.timer <= 0) {
        continue;
      }
      let exploded = anchor.exploded;
      if (!exploded && enemy && !enemy.dead && distance(enemy.position, anchor.position) <= 80 + enemy.ballRadius) {
        exploded = true;
      }
      if (exploded) {
        const chain = weapon.anchors.filter((other) => !other.exploded && other !== anchor && distance(other.position, anchor.position) <= 140);
        const primaryDamage = 12;
        radialBlast(game, anchor.position, weapon.owner, {
          radius: 140,
          damage: primaryDamage,
          edgeDamage: 8,
          knockback: 250,
          color: "#c6a7ff",
          type: "anchor-burst",
          affectOwner: false,
        });
        for (const other of chain) {
          radialBlast(game, other.position, weapon.owner, {
            radius: 140,
              damage: Math.round(primaryDamage * 1.1),
              edgeDamage: 6,
            knockback: 260,
            color: "#d7c0ff",
            type: "anchor-chain",
            affectOwner: false,
          });
          other.exploded = true;
        }
        game.spawnZone(new Zone({
          kind: "radiation",
          owner: weapon.owner,
          position: { ...anchor.position },
          radius: 140,
          startRadius: 20,
          growTime: 0.12,
          life: 3,
          tickRate: 1.5,
          color: "rgba(140, 90, 255, 0.24)",
          ownerImmune: true,
          onTick: (fighter, currentGame) => {
            if (fighter !== weapon.owner) {
                fighter.takeDamage(2, {
                game: currentGame,
                type: "anchor-rad",
                hitFrom: anchor.position,
                color: "#c9b8ff",
                sourceFighter: weapon.owner,
                ignoreArmor: true,
              });
              fighter.velocity = scale(fighter.velocity, 0.76);
            }
          },
        }));
        anchor.exploded = true;
      }
      if (!anchor.exploded) {
        nextAnchors.push(anchor);
      }
    }
    weapon.anchors = nextAnchors;

    weapon.teleportCooldown = Math.max(0, weapon.teleportCooldown - getWeaponCooldownDecay(weapon, dt));
  }

  function updatePreviewPearl(weapon, game, enemy) {
    if (weapon.owner.hasStatus("frozen") || weapon.owner.hasStatus("silenced") || weapon.projectile || weapon.cooldown > 0 || !enemy) {
      return;
    }
    const aim = aimAtEnemy(weapon.owner, enemy, 0.16);
    const start = add(weapon.owner.position, scale(aim, weapon.owner.ballRadius + 18));
    weapon.projectile = new Projectile({
      kind: "pearl",
      owner: weapon.owner,
      position: start,
      velocity: add(scale(aim, 360), scale(weapon.owner.velocity, 0.34)),
      gravity: 0,
      life: 1.45,
      color: "#b88aff",
      radius: 10,
      drawStyle: "pearl",
      onHit: (target, currentGame, shot) => {
        const behind = add(target.position, scale(normalize(sub(target.position, weapon.owner.position)), 86));
        teleportPreviewWeaponOwner(weapon, currentGame, behind, {
          keepVelocity: true,
          color: "#b689ff",
        });
        spawnPearlCloud(currentGame, weapon.owner, behind);
        // owner immune to pearl recoil self-damage
        target.takeDamage(13, {
          game: currentGame,
          type: "pearl-strike",
          hitFrom: weapon.owner.position,
          knockback: 150,
          color: "#d5b4ff",
          sourceFighter: weapon.owner,
        });
        target.setStatus("marked", 2.1);
        weapon.owner.setStatus("foreseen", 0.9);
        weapon.cooldown = currentGame.zones.some((zone) => (zone.kind === "water" || zone.kind === "lava") && pointInZone(zone, weapon.owner.position, 4)) ? 1.1 : 1.8;
        weapon.projectile = null;
        return true;
      },
      onWall: (currentGame, _normal, shot) => {
        teleportPreviewWeaponOwner(weapon, currentGame, shot.position, {
          keepVelocity: true,
          color: "#be8aff",
        });
        spawnPearlCloud(currentGame, weapon.owner, shot.position);
        // owner immune to pearl recoil self-damage
        weapon.owner.setStatus("foreseen", 0.55);
        weapon.cooldown = currentGame.zones.some((zone) => (zone.kind === "water" || zone.kind === "lava") && pointInZone(zone, shot.position, 4)) ? 1.1 : 1.8;
        weapon.projectile = null;
      },
      onExpire: (currentGame, shot) => {
        if (weapon.projectile) {
          teleportPreviewWeaponOwner(weapon, currentGame, shot.position, {
            keepVelocity: true,
            color: "#be8aff",
          });
          spawnPearlCloud(currentGame, weapon.owner, shot.position);
          // owner immune to pearl recoil self-damage
          weapon.owner.setStatus("foreseen", 0.55);
          weapon.cooldown = currentGame.zones.some((zone) => (zone.kind === "water" || zone.kind === "lava") && pointInZone(zone, shot.position, 4)) ? 1.1 : 1.8;
        }
        weapon.projectile = null;
      },
    });
    game.projectiles.push(weapon.projectile);
    weapon.cooldown = 99;
    previewWeaponFlash(weapon, "firing", 0.35);
  }

  function updatePreviewCryingObsidian(weapon, dt, game) {
    const enemy = getNearestEnemyTarget(game, weapon.owner, null, weapon.owner.position);
    weapon.portals = [];
    weapon.puddles = [];
    if (weapon.owner.hasStatus("frozen") || weapon.owner.hasStatus("silenced") || weapon.cooldown > 0 || !enemy) {
      return;
    }

    const base = aimAtEnemy(weapon.owner, enemy, 0.16, game);
    const angles = [-10, 0, 10];
    for (const angle of angles) {
      const dir = rotateVector(base, (angle * Math.PI) / 180);
      const start = add(weapon.owner.position, scale(dir, weapon.owner.ballRadius + 18));
      game.projectiles.push(new Projectile({
        kind: "cry-obsidian",
        owner: weapon.owner,
        position: start,
        velocity: add(scale(dir, 330), scale(weapon.owner.velocity, 0.2)),
        life: 1.6,
        color: "#a782ff",
        radius: 9,
        onHit: (target, currentGame, shot) => {
          target.takeDamage(8, {
            game: currentGame,
            type: "cry-obsidian",
            hitFrom: shot.position,
            knockback: 120,
            color: "#be9bff",
            sourceFighter: weapon.owner,
          });
          return true;
        },
      }));
    }
    weapon.cooldown = 5.2;
    previewWeaponFlash(weapon, "firing", 0.35);
  }

function updatePreviewBlaze(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    weapon.orbs = weapon.orbs.filter((orb) => orb.life > 0);

    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && weapon.cooldown <= 0 && enemy) {
      const base = aimAtEnemy(weapon.owner, enemy, 0.06, game);
      for (let index = 0; index < 2; index += 1) {
        const dir = rotateVector(base, (-0.16 + index * 0.16));
        const start = add(weapon.owner.position, scale(dir, weapon.owner.ballRadius + 18));
        game.projectiles.push(new Projectile({
          kind: "fireball",
          drawStyle: "fireball",
          owner: weapon.owner,
          position: start,
          velocity: add(scale(dir, 310), scale(weapon.owner.velocity, 0.22)),
          life: 1.35,
          color: "#ffb567",
          radius: 12,
          onHit: (target, currentGame, shot) => {
            target.takeDamage(5, {
              game: currentGame,
              type: "blaze-fireball",
              hitFrom: shot.position,
              knockback: 140,
              color: "#ffbf6a",
              sourceFighter: weapon.owner,
            });
            target.applyBurn(2.4, 2);
            return true;
          },
        }));
      }
      for (let index = 0; index < 2; index += 1) {
        weapon.orbs.push({
          angle: (Math.PI * 2 * index) / 3,
          orbit: 88,
          life: 2.2,
          lastHitAt: -99,
          position: { ...weapon.owner.position },
        });
      }
      weapon.cooldown = randomRange(5.8, 6.8);
      previewWeaponFlash(weapon, "firing", 0.35);
    }

    for (const orb of weapon.orbs) {
      orb.life -= dt;
      orb.angle += dt * 4.2;
      const focus = enemy ? pointOnSegment(weapon.owner.position, enemy.position, 0.12) : weapon.owner.position;
      orb.position = add(focus, vec(Math.cos(orb.angle) * orb.orbit, Math.sin(orb.angle) * orb.orbit));

      if (enemy && !isCombatantDead(enemy) && distance(orb.position, enemy.position) <= enemy.ballRadius + 10 && game.time - orb.lastHitAt > 0.38) {
        enemy.takeDamage(1, {
          game,
          type: "blaze-orb",
          hitFrom: orb.position,
          knockback: 90,
          color: "#ffbf6a",
          sourceFighter: weapon.owner,
        });
        orb.lastHitAt = game.time;
      }
    }
    weapon.stateKey = weapon.orbs.length ? "firing" : "normal";
  }

  function updatePreviewRottenFlesh(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    const allMinions = game && game.minions ? game.minions : [];
    const ownedZombies = allMinions.filter((minion) => !minion.dead && minion.kind === "zombie" && minion.owner === weapon.owner);
    weapon.minionSpawnTimer -= dt;
    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && weapon.minionSpawnTimer <= 0 && ownedZombies.length < 4) {
      const angle = randomRange(0, Math.PI * 2);
      const distanceFromOwner = randomRange(30, 80);
      const spawn = keepPointInArena(add(weapon.owner.position, vec(Math.cos(angle) * distanceFromOwner, Math.sin(angle) * distanceFromOwner)), 20);
      spawnGameMinion(game, new Minion({
        kind: "zombie",
        owner: weapon.owner,
        position: spawn,
        velocity: vec(randomRange(-30, 30), randomRange(-30, 30)),
        radius: 14,
        mass: 0.5,
        hp: 1,
        speed: 110,
        friction: 0.9,
        life: 15,
      }));
      weapon.minionSpawnTimer = 3.5;
      previewWeaponFlash(weapon, "firing", 0.28);
    }
  }

  function updatePreviewJack(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && weapon.cooldown <= 0) {
      const dir = enemy ? normalize(sub(enemy.position, weapon.owner.position)) : (length(weapon.owner.velocity) > 0.01 ? normalize(weapon.owner.velocity) : vec(weapon.owner.side === "left" ? 1 : -1, 0));
      weapon.lanterns.push({
        position: keepPointInArena(add(weapon.owner.position, scale(dir, 120)), 42),
        timer: 2.4,
        triggered: false,
        damage: randomInt(18, 24),
      });
      weapon.lanterns = weapon.lanterns.slice(-5);
      weapon.cooldown = randomRange(2, 2.5);
      previewWeaponFlash(weapon, "charging", 0.3);
    }

    for (const lantern of weapon.lanterns) {
      lantern.timer -= dt;
      if (lantern.triggered || lantern.timer > 0) {
        continue;
      }
      lantern.triggered = true;
      radialBlast(game, lantern.position, weapon.owner, {
        radius: 120,
        damage: lantern.damage,
        edgeDamage: Math.max(5, Math.round(lantern.damage * 0.4)),
        knockback: 210,
        color: "#ffc06a",
        type: "lantern-flash",
        affectOwner: false,
      });
    }
    weapon.lanterns = weapon.lanterns.filter((lantern) => !lantern.triggered || lantern.timer > -0.25);
  }

  function updatePreviewBoneMeal(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    const allMinions = game && game.minions ? game.minions : [];
    const ownedSkeletons = allMinions.filter((minion) => !minion.dead && minion.kind === "skeleton" && minion.owner === weapon.owner);
    if (weapon.owner.hasStatus("frozen") || weapon.owner.hasStatus("silenced")) {
      return;
    }
    weapon.minionSpawnTimer = Math.max(0, weapon.minionSpawnTimer - dt);
    if (weapon.minionSpawnTimer > 0) {
      return;
    }
    if (ownedSkeletons.length >= 3) {
      weapon.minionSpawnTimer = 0.45;
      return;
    }
    const angle = randomRange(0, Math.PI * 2);
    const distanceFromOwner = randomRange(30, 80);
    const spawn = keepPointInArena(add(weapon.owner.position, vec(Math.cos(angle) * distanceFromOwner, Math.sin(angle) * distanceFromOwner)), 20);
    spawnGameMinion(game, new Minion({
      kind: "skeleton",
      owner: weapon.owner,
      position: spawn,
      velocity: vec(randomRange(-20, 20), randomRange(-20, 20)),
      radius: 14,
      mass: 0.55,
      hp: 4,
      speed: 105,
      friction: 0.92,
      life: 18,
      shotsLeft: 3,
      shotCooldown: randomRange(0.28, 0.65),
    }));
    const plantPoint = enemy ? pointOnSegment(weapon.owner.position, enemy.position, 0.72) : spawn;
    const plantType = enemy ? (chance(0.55) ? "bush" : (chance(0.4) ? "flower" : "mushroom")) : (chance(0.5) ? "flower" : "bush");
    createPreviewPlantZone(weapon, game, plantPoint, plantType);
    weapon.minionSpawnTimer = 1.8;
    previewWeaponFlash(weapon, "firing", 0.25);
  }

  function updatePreviewBook(weapon, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    if (weapon.owner.hasStatus("frozen") || weapon.owner.hasStatus("silenced") || weapon.cooldown > 0 || !enemy) {
      return;
    }

    const attackType = weapon.bookAttackIndex % 3;
    weapon.bookAttackIndex = (weapon.bookAttackIndex + 1) % 3;

    if (attackType === 0) {
      weapon._lastPreviewSoundAt = AUDIO.nowMs();
      AUDIO.bookEvent("laser");
      const dir = aimAtEnemy(weapon.owner, enemy, 0.05, game);
      const pulse = pulseLine(game, weapon.owner, weapon.owner.position, dir, 750, 26, {
        color: "rgba(255, 231, 162, 0.24)",
        kind: "book-laser",
      });
      for (const target of pulse.targets) {
        if (getCombatantSide(target) === getCombatantSide(weapon.owner)) {
          continue;
        }
        target.takeDamage(12, {
          game,
          type: "book-laser",
          hitFrom: weapon.owner.position,
          knockback: 120,
          color: "#ffe3a8",
          sourceFighter: weapon.owner,
        });
      }
    } else if (attackType === 1) {
      weapon._lastPreviewSoundAt = AUDIO.nowMs();
      AUDIO.bookEvent("lightning");
      const point = keepPointInArena(vec(randomRange(ARENA.x + 40, ARENA.x + ARENA.width - 40), randomRange(ARENA.y + 40, ARENA.y + ARENA.height - 40)), 42);
      game.spawnZone(new Zone({
        kind: "light",
        owner: weapon.owner,
        position: point,
        radius: 40,
        startRadius: 14,
        growTime: 0.08,
        life: 0.45,
        tickRate: 0.22,
        color: "rgba(255, 231, 162, 0.26)",
        ownerImmune: true,
        damage: 0,
      }));
      for (const target of getActiveCombatants(game)) {
        if (target === weapon.owner || getCombatantSide(target) === getCombatantSide(weapon.owner)) {
          continue;
        }
        if (distance(target.position, point) <= target.ballRadius + 40) {
          target.takeDamage(17, {
            game,
            type: "book-lightning",
            hitFrom: point,
            knockback: 180,
            color: "#ffe29f",
            sourceFighter: weapon.owner,
          });
        }
      }
    } else {
      weapon._lastPreviewSoundAt = AUDIO.nowMs();
      AUDIO.bookEvent("quake");
      game.spawnZone(new Zone({
        kind: "quake",
        owner: weapon.owner,
        position: { ...weapon.owner.position },
        radius: 90,
        startRadius: 90,
        growTime: 0.01,
        life: 3,
        tickRate: 1,
        color: "rgba(255, 222, 170, 0.18)",
        ownerImmune: true,
        damage: 0,
        onTick: (target, currentGame, zone) => {
          if (target === zone.owner || getCombatantSide(target) === getCombatantSide(zone.owner)) {
            return;
          }
          target.takeDamage(3, {
            game: currentGame,
            type: "book-quake",
            hitFrom: zone.position,
            color: "#ffd9a3",
            ignoreArmor: true,
            sourceFighter: zone.owner,
          });
        },
      }));
    }

    weapon.cooldown = 2.9;
    previewWeaponFlash(weapon, "firing", 0.32);
  }

function updatePreviewElytra(weapon, dt, enemy) {
    const baseMaxHp = weapon.owner.baseMaxHp || 100;
    if (!weapon.owner.hasStatus("gliding") && weapon.cooldown <= 0 && (length(weapon.owner.velocity) >= 130 || (enemy && distance(weapon.owner.position, enemy.position) >= 120))) {
      weapon.owner.setStatus("gliding", 7.4);
      weapon.cooldown = randomRange(1.4, 1.9);
      weapon.glideWindup = 0;
      previewWeaponFlash(weapon, "firing", 0.4);
    }
    if (weapon.owner.hasStatus("gliding")) {
      if (!weapon._elytraPrevMaxHp) {
        weapon._elytraPrevMaxHp = baseMaxHp;
      }
      weapon.owner.maxHp = Math.round(weapon._elytraPrevMaxHp * 1.32);
    } else if (weapon._elytraPrevMaxHp) {
      weapon.owner.maxHp = weapon.owner.baseMaxHp || weapon._elytraPrevMaxHp;
      delete weapon._elytraPrevMaxHp;
    }
    weapon.owner.hp = Math.min(weapon.owner.hp, weapon.owner.maxHp);
    if (!weapon.owner.hasStatus("gliding") || !enemy) {
      return;
    }
    weapon.glideWindup = Math.max(0, weapon.glideWindup - dt);
    const desired = normalize(sub(enemy.position, weapon.owner.position));
    weapon.owner.velocity = lerpVector(weapon.owner.velocity, scale(desired, 760), clamp(dt * 1.55, 0, 1));
    weapon.owner.clearStatus("submerged");
    weapon.owner.clearStatus("rooted");
  }

  function updatePreviewGoldenApple(weapon, game, enemy) {
    weapon.mass = weapon.buffTimer > 0 ? 1.22 : 1.02;
    weapon.armorMultiplier = weapon.buffTimer > 0 ? 0.92 : 1;
    weapon.stateKey = weapon.buffTimer > 0 ? "firing" : "normal";
    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && weapon.cooldown <= 0 && weapon.owner.hp <= 85) {
      weapon.buffTimer = 5.2;
      weapon.owner.applyRegen(2.4, 0.5);
      weapon.owner.addShield(8, game, "#ffd96a");
      const target = getNearestEnemyTarget(game, weapon.owner, enemy);
      if (target) {
        const dir = normalize(sub(target.position, weapon.owner.position));
        weapon.owner.velocity = scale(dir, 480);
      }
      weapon.cooldown = randomRange(10.5, 12);
      previewWeaponFlash(weapon, "firing", 0.4);
    }
  }

  function updatePreviewInvis(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    weapon.mass = weapon.owner.hasStatus("invisible") ? 0.76 : 0.9;

    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && !weapon.owner.hasStatus("invisible") && weapon.cooldown <= 0) {
      weapon.owner.setStatus("invisible", 2.3);
      weapon.owner.setStatus("invulnerable", 1.4);
      weapon.activeTimer = 3;
      weapon.cooldown = 12.6;
      weapon.invisPierceCooldown = 0;
      weapon.hasPiercedThisInvis = false;
      previewWeaponFlash(weapon, "firing", 0.35);
    }

    weapon.invisPierceCooldown = Math.max(0, weapon.invisPierceCooldown - dt);
    if (weapon.owner.hasStatus("invisible") && weapon.owner.hasStatus("invulnerable") && enemy) {
      weapon.owner.setStatus("invulnerable", 0.25);
      const desired = normalize(sub(enemy.position, weapon.owner.position));
      weapon.owner.velocity = lerpVector(weapon.owner.velocity, scale(desired, 360), clamp(dt * 2.2, 0, 1));
      if (!weapon.hasPiercedThisInvis && distance(weapon.owner.position, enemy.position) <= weapon.owner.ballRadius + enemy.ballRadius - 8 && weapon.invisPierceCooldown <= 0) {
        enemy.takeDamage(16, {
          game,
          type: "invis-pierce",
          hitFrom: weapon.owner.position,
          knockback: 220,
          color: "#dfd2ff",
          sourceFighter: weapon.owner,
        });
        weapon.invisPierceCooldown = 0.4;
        weapon.hasPiercedThisInvis = true;
      }
    }
  }

  function updatePreviewGravity(weapon, dt, game, enemy) {
    enemy = getNearestEnemyTarget(game, weapon.owner, enemy) || enemy;
    if (weapon.owner.hasStatus("frozen") || weapon.owner.hasStatus("silenced")) {
      return;
    }

    weapon.gravityTimer -= dt;
    if (weapon.gravityTimer <= 0) {
      weapon.gravityTimer = randomRange(3, 5);
      const position = keepPointInArena(vec(randomRange(ARENA.x + 90, ARENA.x + ARENA.width - 90), randomRange(ARENA.y + 90, ARENA.y + ARENA.height - 90)), 90);
      const anomaly = {
        position,
        radius: 225,
        life: 5,
        dotTick: 0,
      };
      weapon.gravityAnomalies.push(anomaly);
      game.spawnZone(new Zone({
        kind: "gravity",
        owner: weapon.owner,
        position: { ...position },
        radius: 225,
        startRadius: 45,
        growTime: 0.2,
        life: 5,
        tickRate: 0.25,
        color: "rgba(174, 202, 255, 0.24)",
        ownerImmune: true,
        damage: 0,
      }));
    }

    for (const anomaly of weapon.gravityAnomalies) {
      anomaly.life -= dt;
      anomaly.dotTick -= dt;

      for (const target of getActiveCombatants(game)) {
        if (isCombatantDead(target) || target === weapon.owner) {
          continue;
        }
        const d = distance(target.position, anomaly.position);
        if (d > anomaly.radius + target.ballRadius) {
          continue;
        }
        const pull = normalize(sub(anomaly.position, target.position));
        target.receiveVelocity(scale(pull, (1600 * dt) / Math.max(0.55, target.mass || 1)));
      }

      for (const projectile of game.projectiles) {
        if (projectile.expired) {
          continue;
        }
        const d = distance(projectile.position, anomaly.position);
        if (d <= anomaly.radius + projectile.radius) {
          const pull = normalize(sub(anomaly.position, projectile.position));
          projectile.velocity = add(projectile.velocity, scale(pull, 1600 * dt));
          projectile.travelledInsideGravity += length(projectile.velocity) * dt;
          if (projectile.travelledInsideGravity >= projectile.maxDistance) {
            projectile.expire(game);
          }
        } else {
          projectile.travelledInsideGravity = 0;
        }
      }

      for (const particle of game.particles) {
        const d = distance(particle.position, anomaly.position);
        if (d > anomaly.radius) {
          continue;
        }
        const pull = normalize(sub(anomaly.position, particle.position));
        particle.velocity = add(particle.velocity, scale(pull, 800 * dt));
      }

      if (anomaly.dotTick <= 0) {
        anomaly.dotTick = 1;
        for (const target of getActiveCombatants(game)) {
          if (target === weapon.owner || getCombatantSide(target) === getCombatantSide(weapon.owner)) {
            continue;
          }
          if (distance(target.position, anomaly.position) <= target.ballRadius + 26) {
            target.takeDamage(14, {
              game,
              type: "gravity-center",
              hitFrom: anomaly.position,
              color: "#9bb8ff",
              ignoreArmor: true,
              sourceFighter: weapon.owner,
            });
          }
        }
      }
    }

    weapon.gravityAnomalies = weapon.gravityAnomalies.filter((anomaly) => anomaly.life > 0);
  }

  function updatePreviewTurtle(weapon, dt, game, enemy) {
    weapon.mass = weapon.owner.hasStatus("tanking") ? 1.13 : 1.04;
    weapon.armorMultiplier = weapon.owner.hasStatus("tanking") ? 0.98 : 1;
    weapon.stateKey = weapon.owner.hasStatus("tanking") ? "tanking" : "normal";
    if (!weapon.owner.hasStatus("frozen") && !weapon.owner.hasStatus("silenced") && !weapon.owner.hasStatus("tanking") && weapon.cooldown <= 0) {
      weapon.owner.setStatus("tanking", 2.1);
      weapon.owner.addShield(9, game, "#8fe9be");
      weapon.cooldown = 9;
      weapon._wasTanking = true;
      previewWeaponFlash(weapon, "tanking", 0.45);
    }
    if (weapon.owner.hasStatus("tanking")) {
      weapon.owner.velocity = scale(weapon.owner.velocity, 1 - dt * 0.18);
      weapon._wasTanking = true;
    } else if (weapon._wasTanking) {
      weapon._wasTanking = false;
      if (game) {
        radialBlast(game, weapon.owner.position, weapon.owner, {
          radius: 120,
          damage: 6,
          edgeDamage: 2,
          knockback: 220,
          color: "#7be2b2",
          type: "shell-wave",
          affectOwner: false,
        });
        game.spawnBurst(weapon.owner.position, "#88e6b8", 16);
      }
    }
    if (weapon.thornsCooldown > 0) {
      weapon.thornsCooldown = Math.max(0, weapon.thornsCooldown - dt);
    }
  }

  function createWeapon(id, owner) {
    let weapon;
    if (id === "rail") {
      weapon = new RailWeapon(owner);
    } else if (id === "boat") {
      weapon = new BoatWeapon(owner);
    } else if (id === "fishingRod") {
      weapon = new FishingRodWeapon(owner);
    } else if (id === "loyaltyTrident") {
      weapon = new LoyaltyTridentWeapon(owner);
    } else if (id === "waterBucket") {
      weapon = new WaterBucketWeapon(owner);
    } else if (id === "lavaBucket") {
      weapon = new LavaBucketWeapon(owner);
    } else if (id === "snowball") {
      weapon = new SnowballWeapon(owner);
    } else if (id === "flintSteel") {
      weapon = new FlintSteelWeapon(owner);
    } else {
      weapon = new PreviewWeapon(id, owner);
    }
    return configureWeaponBalanceProfile(weapon);
  }

  class ResultState {
    constructor() {
      this.winner = null;
      this.timer = 0;
    }
  }

  class Game {
    constructor(canvas, ui) {
      this.canvas = canvas;
      this.canvas.width = WIDTH;
      this.canvas.height = HEIGHT;
      this.ctx = canvas.getContext("2d", { alpha: false });
      if (this.ctx && "imageSmoothingQuality" in this.ctx) {
        this.ctx.imageSmoothingQuality = "high";
      }
      this.ui = ui;
      this.mode = MODES.MENU;
      this.time = 0;
      this.countdown = 0;
      this.fighters = [];
      this.minions = [];
      this.particles = [];
      this.texts = [];
      this.zones = [];
      this.projectiles = [];
      this.result = new ResultState();
      this.screenShake = 0;
      this.impactFlash = 0;
      this.impactFlashColor = "#ffffff";
      this.roundTime = 0;
      this.selected = {
        left: "rail",
        right: "boat",
      };
      this.lastFrame = 0;
      this.accumulator = 0;
      this.backgroundImage = null;
      this.backgroundReady = false;
      this.backgroundDrift = vec(randomRange(-22, 22), randomRange(-16, 16));
      this.sprites = new Map();
      this.catalogSide = "left";
      this.catalogWeaponId = this.selected.left;
      this.catalogSearch = "";
      this.testReport = "";
      this.testReportName = "weapon-tournament-results.txt";
      this.testRunning = false;
      this.roundLimitSec = Math.max(1, ROUND_LIMIT_SEC);
      this.suddenDeathTick = SUDDEN_DEATH_DOT_INTERVAL_SEC;
      this.currentBattleMeta = null;
      this.tournament = null;
      this.tournamentEntrantCount = 8;
      this.tournamentDraft = [];
      this.tournamentRoundDelaySec = 2.6;
      this.tournamentIntroDelaySec = 3.2;
      this.tournamentChampionDelaySec = 3.8;
      this.recordingEnabled = false;
      this.recordingActive = false;
      this.recordingSupported = typeof MediaRecorder !== "undefined" && typeof this.canvas.captureStream === "function";
      this.recordingUseWebCodecs = typeof VideoEncoder !== "undefined";
      this.recordingStream = null;
      this.recordingCanvas = null;
      this.recordingCtx = null;
      this.recordingBufferCanvas = null;
      this.recordingBufferCtx = null;
      this.recorder = null;
      this.videoEncoder = null;
      this.audioEncoder = null;
      this.recordingStopResolve = null;
      this.recordingStopPromise = null;
      this.recordedChunks = [];
      this.recordingBlob = null;
      this.recordingUrl = "";
      this.recordingMime = "";
      this.recordingExtension = "webm";
      this.recordingVideoTrack = null;
      this.recordingCaptureMeta = null;
      this.recordingExportActive = false;
      this.recordingReplayInProgress = false;
      this.recordingPostResultMessage = "";

      this.buildSelectors();
      this.bindUi();
      this.initRecordingUi();
      this.loadCustomBackground();
      this.loadSprites();
      this.showMenu(TEXT.choose);
      fitCanvas(this.canvas);
      window.addEventListener("resize", () => fitCanvas(this.canvas));
      requestAnimationFrame((time) => this.frame(time));
    }

    buildSelectors() {
      this.buildCatalog();
      this.createTournamentDraft(this.tournamentEntrantCount, false);
      this.renderTournamentBracket();
      this.syncMenu();
    }

    getWeaponMeta(id) {
      return WEAPON_LIBRARY[id] || LEGACY_WEAPON_LIBRARY[id] || { id, title: id, badge: "??", category: "Other", color: "#dbe7ff", speedMin: 220, speedMax: 280 };
    }

    buildCatalog() {
      const container = this.ui.catalogList;
      if (!container) {
        return;
      }
      container.innerHTML = "";
      const grouped = new Map();
      for (const weapon of WEAPON_CATALOG) {
        if (this.catalogSearch) {
          const haystack = `${weapon.title} ${weapon.id} ${weapon.category}`.toLowerCase();
          if (!haystack.includes(this.catalogSearch.toLowerCase())) {
            continue;
          }
        }
        if (!grouped.has(weapon.category)) {
          grouped.set(weapon.category, []);
        }
        grouped.get(weapon.category).push(weapon);
      }

      for (const [category, weapons] of grouped.entries()) {
        const section = document.createElement("section");
        section.className = "weapon-category";

        const title = document.createElement("div");
        title.className = "weapon-category-title";
        title.textContent = category;
        section.appendChild(title);

        const list = document.createElement("div");
        list.className = "weapon-category-list";

        for (const weapon of weapons) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "weapon-option";
          button.dataset.side = this.catalogSide;
          button.dataset.weapon = weapon.id;
          button.innerHTML = `<strong>${weapon.title}</strong><span>${weapon.category}</span>`;
          button.addEventListener("click", (e) => {
            e.stopPropagation();
            this.setCatalogPreview(weapon.id);
            this.catalogWeaponId = weapon.id;
            this.selected[this.catalogSide] = weapon.id;
            this.closeCatalog();
            this.syncMenu();
          });
          list.appendChild(button);
        }

        section.appendChild(list);
        container.appendChild(section);
      }

      if (!grouped.size) {
        const empty = document.createElement("div");
        empty.className = "weapon-category-title";
        empty.textContent = "Nothing found";
        container.appendChild(empty);
      }
      this.syncMenu();
    }

    setCatalogPreview(id) {
      const meta = this.getWeaponMeta(id);
      this.catalogWeaponId = id;
      this.ui.catalogPreviewBadge.textContent = meta.badge || "??";
      this.ui.catalogPreviewBadge.style.background = `linear-gradient(180deg, ${meta.color || "#ffe899"}, #ffbf3f)`;
      this.ui.catalogPreviewTitle.textContent = meta.title;
      this.ui.catalogPreviewCategory.textContent = meta.category || "Base";
      this.ui.catalogPreviewDescription.textContent = meta.description || "";
      this.syncMenu();
    }

    openCatalog(side) {
      this.catalogSide = side;
      this.catalogSearch = "";
      this.ui.catalogSearch.value = "";
      this.ui.catalogSideTitle.textContent = side === "left" ? "Selection for green ball" : "Selection for blue ball";
      this.buildCatalog();
      this.setCatalogPreview(this.selected[side]);
      this.ui.catalogOverlay.classList.add("visible");
    }

    closeCatalog() {
      this.ui.catalogOverlay.classList.remove("visible");
    }

    pickRandomWeapon() {
      return WEAPON_CATALOG[randomInt(0, WEAPON_CATALOG.length - 1)].id;
    }

    applyCatalogSelection() {
      this.selected[this.catalogSide] = this.catalogWeaponId;
      this.closeCatalog();
      this.syncMenu();
    }

    randomizeBoth() {
      this.selected.left = this.pickRandomWeapon();
      this.selected.right = this.pickRandomWeapon();
      this.catalogWeaponId = this.selected[this.catalogSide];
      this.syncMenu();
    }

    syncMenu() {
      const left = this.getWeaponMeta(this.selected.left);
      const right = this.getWeaponMeta(this.selected.right);
      this.ui.leftWeaponBadge.textContent = left.badge || "??";
      this.ui.leftWeaponTitle.textContent = left.title;
      this.ui.leftWeaponCategory.textContent = left.category || "Base";
      this.ui.leftWeaponBadge.style.background = `linear-gradient(180deg, ${left.color || "#7af58f"}, #2bbd49)`;
      this.ui.rightWeaponBadge.textContent = right.badge || "??";
      this.ui.rightWeaponTitle.textContent = right.title;
      this.ui.rightWeaponCategory.textContent = right.category || "Base";
      this.ui.rightWeaponBadge.style.background = `linear-gradient(180deg, ${right.color || "#9ce0ff"}, #3c87ff)`;

      const buttons = document.querySelectorAll(".weapon-option");
      buttons.forEach((button) => {
        const active = this.catalogWeaponId === button.dataset.weapon;
        button.classList.toggle("active", active);
      });
    }
    roundLabel(roundIndex, totalRounds, matchesInRound) {
      if (matchesInRound === 1) {
        return "Final";
      }
      if (matchesInRound === 2) {
        return "Semifinal";
      }
      if (matchesInRound === 4) {
        return "Quarterfinal";
      }
      return `Round ${roundIndex + 1}/${totalRounds}`;
    }

    createTournamentDraft(count, randomize = false) {
      this.tournamentDraft = Array.from({ length: count }, (_, index) => {
        const weapon = randomize ? this.pickRandomWeapon() : WEAPON_CATALOG[index % WEAPON_CATALOG.length].id;
        return {
          id: `p${index + 1}`,
          label: `Participant ${index + 1}`,
          weaponId: weapon,
        };
      });
    }

    applyTournamentCount() {
      const countRaw = Number.parseInt(this.ui.tournamentCount.value, 10);
      const allowed = [4, 8, 16, 32];
      const count = allowed.includes(countRaw) ? countRaw : 8;
      this.tournamentEntrantCount = count;
      this.tournament = null;
      this.createTournamentDraft(count, false);
      this.renderTournamentParticipants();
      this.renderTournamentBracket();
      this.ui.tournamentStatus.textContent = `Configured participants: ${count}.`;
    }

    randomizeTournamentDraft() {
      if (!this.tournamentDraft.length) {
        this.createTournamentDraft(this.tournamentEntrantCount, true);
      } else {
        this.tournamentDraft = this.tournamentDraft.map((entry) => ({ ...entry, weaponId: this.pickRandomWeapon() }));
      }
      this.renderTournamentBracket();
    }

    renderTournamentParticipants() {
      // Selection is now in bracket slots (round 1), method kept for compatibility.
    }

    buildTournamentState() {
      const entrants = this.tournamentDraft.map((entry) => ({ ...entry }));
      const entrantsById = Object.fromEntries(entrants.map((entry) => [entry.id, entry]));
      const totalRounds = Math.log2(entrants.length);
      const rounds = [];
      for (let roundIndex = 0; roundIndex < totalRounds; roundIndex += 1) {
        const matches = [];
        const matchesCount = entrants.length / (2 ** (roundIndex + 1));
        for (let matchIndex = 0; matchIndex < matchesCount; matchIndex += 1) {
          matches.push({
            leftId: roundIndex === 0 ? entrants[matchIndex * 2].id : null,
            rightId: roundIndex === 0 ? entrants[matchIndex * 2 + 1].id : null,
            winnerId: null,
            loserId: null,
          });
        }
        rounds.push(matches);
      }
      return {
        active: true,
        entrants,
        entrantsById,
        rounds,
        currentBattle: null,
        breakTimer: 0,
        breakType: "intro",
        breakFocus: null,
        breakAnnouncement: null,
        breakMessage: "",
        championId: null,
        autoRestartPending: false,
      };
    }

    buildTournamentPreview() {
      if (![4, 8, 16, 32].includes(this.tournamentDraft.length)) {
        return null;
      }
      const preview = this.buildTournamentState();
      preview.active = false;
      preview.currentBattle = null;
      return preview;
    }

    updateTournamentDraftSlotWeapon(slotIndex, weaponId) {
      if (!this.tournamentDraft[slotIndex]) {
        return;
      }
      this.tournamentDraft[slotIndex].weaponId = weaponId;
      if (!this.tournament || !this.tournament.active) {
        this.renderTournamentBracket();
      }
    }

    renderTournamentMatchSlot(tournament, entrantId, winnerId, roundIndex, matchIndex, sideKey) {
      const line = document.createElement("div");
      line.className = "tournament-slot";
      if (!entrantId) {
        line.textContent = "-";
        return line;
      }
      const entrant = tournament.entrantsById[entrantId];
      const weapon = this.getWeaponMeta(entrant.weaponId);

      const label = document.createElement("span");
      label.className = "tournament-slot-label";
      label.textContent = entrant.label;
      line.appendChild(label);

      const setupMode = !this.tournament || !this.tournament.active;
      if (setupMode && roundIndex === 0) {
        const select = document.createElement("select");
        select.className = "tournament-slot-select";
        const slotIndex = matchIndex * 2 + (sideKey === "right" ? 1 : 0);
        for (const item of WEAPON_CATALOG) {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.title;
          if (item.id === entrant.weaponId) {
            option.selected = true;
          }
          select.appendChild(option);
        }
        select.addEventListener("change", (event) => {
          this.updateTournamentDraftSlotWeapon(slotIndex, event.target.value);
        });
        line.appendChild(select);
      } else {
        const weaponText = document.createElement("span");
        weaponText.className = "tournament-slot-weapon";
        weaponText.textContent = weapon.title;
        line.appendChild(weaponText);
      }

      if (winnerId && entrantId === winnerId) {
        line.classList.add("is-winner");
      }
      return line;
    }

    renderTournamentSide(tournament, side = "left") {
      const sideWrap = document.createElement("section");
      sideWrap.className = `tournament-side tournament-side-${side}`;
      const nonFinalRoundCount = Math.max(0, tournament.rounds.length - 1);

      for (let roundIndex = 0; roundIndex < nonFinalRoundCount; roundIndex += 1) {
        const matches = tournament.rounds[roundIndex];
        const split = Math.floor(matches.length / 2);
        const from = side === "left" ? 0 : split;
        const to = side === "left" ? split : matches.length;
        if (to <= from) {
          continue;
        }

        const column = document.createElement("section");
        column.className = `tournament-round tournament-round-${side}`;
        const header = document.createElement("h4");
        header.textContent = this.roundLabel(roundIndex, tournament.rounds.length, matches.length);
        column.appendChild(header);

        for (let matchIndex = from; matchIndex < to; matchIndex += 1) {
          const match = matches[matchIndex];
          const card = document.createElement("div");
          card.className = "tournament-match";
          if (match.winnerId) {
            card.classList.add("is-complete");
          }
          if (tournament.currentBattle && tournament.currentBattle.roundIndex === roundIndex && tournament.currentBattle.matchIndex === matchIndex) {
            card.classList.add("is-active");
          }
          card.appendChild(this.renderTournamentMatchSlot(tournament, match.leftId, match.winnerId, roundIndex, matchIndex, "left"));
          card.appendChild(this.renderTournamentMatchSlot(tournament, match.rightId, match.winnerId, roundIndex, matchIndex, "right"));
          column.appendChild(card);
        }

        sideWrap.appendChild(column);
      }

      return sideWrap;
    }

    renderTournamentBracket() {
      const container = this.ui.tournamentBracket;
      if (!container) {
        return;
      }
      container.innerHTML = "";
      const tournament = (this.tournament && this.tournament.rounds && this.tournament.rounds.length)
        ? this.tournament
        : this.buildTournamentPreview();
      if (!tournament || !tournament.rounds || !tournament.rounds.length) {
        return;
      }

      const layout = document.createElement("div");
      layout.className = "tournament-bracket-2s";
      layout.appendChild(this.renderTournamentSide(tournament, "left"));

      const center = document.createElement("section");
      center.className = "tournament-final";
      const finalHeader = document.createElement("h4");
      finalHeader.textContent = "Final";
      center.appendChild(finalHeader);
      const finalMatch = tournament.rounds[tournament.rounds.length - 1][0];
      const finalCard = document.createElement("div");
      finalCard.className = "tournament-match tournament-match-final";
      if (finalMatch && finalMatch.winnerId) {
        finalCard.classList.add("is-complete");
      }
      if (tournament.currentBattle && tournament.currentBattle.roundIndex === tournament.rounds.length - 1) {
        finalCard.classList.add("is-active");
      }
      if (finalMatch) {
        finalCard.appendChild(this.renderTournamentMatchSlot(tournament, finalMatch.leftId, finalMatch.winnerId, tournament.rounds.length - 1, 0, "left"));
        finalCard.appendChild(this.renderTournamentMatchSlot(tournament, finalMatch.rightId, finalMatch.winnerId, tournament.rounds.length - 1, 0, "right"));
      }
      center.appendChild(finalCard);
      layout.appendChild(center);

      layout.appendChild(this.renderTournamentSide(tournament, "right"));
      container.appendChild(layout);
    }

    getNextTournamentMatch() {
      if (!this.tournament || !this.tournament.active) {
        return null;
      }
      for (let roundIndex = 0; roundIndex < this.tournament.rounds.length; roundIndex += 1) {
        const matches = this.tournament.rounds[roundIndex];
        for (let matchIndex = 0; matchIndex < matches.length; matchIndex += 1) {
          const match = matches[matchIndex];
          if (!match.winnerId && match.leftId && match.rightId) {
            return { roundIndex, matchIndex, match };
          }
        }
      }
      return null;
    }

    openTournamentOverlay() {
      this.closeCatalog();
      if (!this.tournamentDraft.length) {
        this.createTournamentDraft(this.tournamentEntrantCount, false);
      }
      this.ui.tournamentCount.value = String(this.tournamentEntrantCount);
      this.renderTournamentParticipants();
      this.renderTournamentBracket();
      if (!this.tournament || !this.tournament.active) {
        this.ui.tournamentStatus.textContent = "Set up participants and start the tournament.";
      }
      this.ui.tournamentOverlay.classList.add("visible");
    }

    closeTournamentOverlay() {
      this.ui.tournamentOverlay.classList.remove("visible");
    }

    startNextTournamentBattle() {
      const next = this.getNextTournamentMatch();
      if (!next) {
        this.finishTournament();
        return;
      }
      const leftEntry = this.tournament.entrantsById[next.match.leftId];
      const rightEntry = this.tournament.entrantsById[next.match.rightId];
      this.tournament.currentBattle = {
        roundIndex: next.roundIndex,
        matchIndex: next.matchIndex,
        leftId: leftEntry.id,
        rightId: rightEntry.id,
      };
      this.selected.left = leftEntry.weaponId;
      this.selected.right = rightEntry.weaponId;
      this.syncMenu();
      this.renderTournamentBracket();
      this.ui.testStatus.textContent = `Tournament: ${leftEntry.label} (${this.getWeaponMeta(leftEntry.weaponId).title}) vs ${rightEntry.label} (${this.getWeaponMeta(rightEntry.weaponId).title})`;
      this.setupBattle(leftEntry.weaponId, rightEntry.weaponId, { countdown: true, hideMenu: true });
    }

    startBracketTournament() {
      if (![4, 8, 16, 32].includes(this.tournamentDraft.length)) {
        this.ui.tournamentStatus.textContent = "Number of participants must be 4, 8, 16 or 32.";
        return;
      }
      this.tournament = this.buildTournamentState();
      this.renderTournamentBracket();
      this.tournament.breakType = "intro";
      this.tournament.breakFocus = null;
      this.tournament.breakAnnouncement = null;
      this.tournament.breakTimer = this.tournamentIntroDelaySec;
      this.tournament.breakMessage = "Tournament lineup: fighters are entering the bracket.";
      this.tournament.autoRestartPending = false;
      this.ui.tournamentStatus.textContent = this.tournament.breakMessage;
      this.closeTournamentOverlay();
      this.hideMenu();
      this.mode = MODES.TOURNAMENT_BREAK;
    }

    resolveTournamentBattle() {
      if (!this.tournament || !this.tournament.currentBattle) {
        return null;
      }
      const { roundIndex, matchIndex, leftId, rightId } = this.tournament.currentBattle;
      const match = this.tournament.rounds[roundIndex][matchIndex];
      const [leftFighter, rightFighter] = this.fighters;
      let winnerSide = this.result && this.result.winner ? this.result.winner.side : null;
      if (!winnerSide) {
        winnerSide = (leftFighter && rightFighter && leftFighter.hp < rightFighter.hp) ? "right" : "left";
      }
      const winnerId = winnerSide === "right" ? rightId : leftId;
      const loserId = winnerId === leftId ? rightId : leftId;
      match.winnerId = winnerId;
      match.loserId = loserId;
      this.tournament.breakFocus = { roundIndex, matchIndex, winnerId, loserId };

      if (roundIndex + 1 < this.tournament.rounds.length) {
        const nextMatch = this.tournament.rounds[roundIndex + 1][Math.floor(matchIndex / 2)];
        if (matchIndex % 2 === 0) {
          nextMatch.leftId = winnerId;
        } else {
          nextMatch.rightId = winnerId;
        }
      } else {
        this.tournament.championId = winnerId;
      }

      const winnerEntry = this.tournament.entrantsById[winnerId];
      const loserEntry = this.tournament.entrantsById[loserId];
      const winnerWeapon = this.getWeaponMeta(winnerEntry.weaponId);
      const loserWeapon = this.getWeaponMeta(loserEntry.weaponId);
      const next = this.getNextTournamentMatch();
      const currentRoundLabel = this.roundLabel(roundIndex, this.tournament.rounds.length, this.tournament.rounds[roundIndex].length);
      let advanceLabel = "Becomes champion";
      if (roundIndex + 1 < this.tournament.rounds.length) {
        const nextRoundMatches = this.tournament.rounds[roundIndex + 1].length;
        advanceLabel = `Advances to ${this.roundLabel(roundIndex + 1, this.tournament.rounds.length, nextRoundMatches)}`;
      }
      this.tournament.breakAnnouncement = {
        winnerName: winnerEntry.label,
        loserName: loserEntry.label,
        winnerWeapon: winnerWeapon.title,
        loserWeapon: loserWeapon.title,
        currentRoundLabel,
        advanceLabel,
      };
      if (next) {
        const nextLeft = this.tournament.entrantsById[next.match.leftId];
        const nextRight = this.tournament.entrantsById[next.match.rightId];
        const nextLeftWeapon = this.getWeaponMeta(nextLeft.weaponId).title;
        const nextRightWeapon = this.getWeaponMeta(nextRight.weaponId).title;
        this.tournament.breakMessage = `${winnerWeapon.title} won. ${loserWeapon.title} is eliminated. Next: ${nextLeftWeapon} vs ${nextRightWeapon}.`;
        this.tournament.breakType = "match";
        this.tournament.breakTimer = this.tournamentRoundDelaySec;
        this.tournament.autoRestartPending = false;
      } else {
        this.tournament.breakMessage = `${winnerWeapon.title} won. ${loserWeapon.title} is eliminated.`;
        this.finishTournament();
      }
      this.ui.tournamentStatus.textContent = this.tournament.breakMessage;
      this.tournament.currentBattle = null;
      this.renderTournamentBracket();
      return {
        roundIndex,
        matchIndex,
        winnerId,
        loserId,
        finished: !next,
      };
    }

    finishTournament() {
      if (!this.tournament) {
        return;
      }
      const champion = this.tournament.championId ? this.tournament.entrantsById[this.tournament.championId] : null;
      const championTitle = champion ? this.getWeaponMeta(champion.weaponId).title : "unknown";
      this.tournament.breakType = "champion";
      this.tournament.breakTimer = this.tournamentChampionDelaySec;
      this.tournament.breakMessage = `Tournament complete. Winner: ${championTitle}.`;
      this.tournament.breakAnnouncement = champion
        ? {
          winnerName: champion.label,
          winnerWeapon: championTitle,
          currentRoundLabel: "Final",
          advanceLabel: "Champion",
        }
        : null;
      this.tournament.autoRestartPending = true;
      this.ui.tournamentStatus.textContent = `${this.tournament.breakMessage} Preparing a new random bracket...`;
      this.tournament.active = false;
      this.mode = MODES.TOURNAMENT_BREAK;
    }

    restartTournamentLoop() {
      this.randomizeTournamentDraft();
      this.tournament = this.buildTournamentState();
      this.tournament.breakType = "intro";
      this.tournament.breakFocus = null;
      this.tournament.breakAnnouncement = null;
      this.tournament.breakTimer = this.tournamentIntroDelaySec;
      this.tournament.breakMessage = "New random setup ready. Starting next bracket.";
      this.tournament.autoRestartPending = false;
      this.ui.tournamentStatus.textContent = this.tournament.breakMessage;
      this.renderTournamentBracket();
      this.mode = MODES.TOURNAMENT_BREAK;
    }

    tournamentBreakCountdownText() {
      if (!this.tournament) {
        return "";
      }
      if (this.tournament.breakType === "intro") {
        return "First battle starts in";
      }
      if (this.tournament.breakType === "champion") {
        return "Next random tournament in";
      }
      return "Next fight in";
    }

    drawTournamentBreakScene(ctx) {
      if (!this.tournament) {
        return;
      }
      const panel = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      panel.addColorStop(0, "rgba(3, 7, 16, 0.94)");
      panel.addColorStop(1, "rgba(2, 5, 12, 0.97)");
      ctx.fillStyle = panel;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const title = this.tournament.breakType === "intro"
        ? "LIVE TOURNAMENT BRACKET"
        : (this.tournament.breakType === "champion" ? "TOURNAMENT CHAMPION" : "MATCH RESULT");
      ctx.fillStyle = "#f7fbff";
      ctx.font = "bold 52px Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillText(title, WIDTH / 2, 178);

      if (this.tournament.breakAnnouncement) {
        const a = this.tournament.breakAnnouncement;
        ctx.fillStyle = "#9fd1ff";
        ctx.font = "bold 24px Consolas, monospace";
        ctx.fillText(a.currentRoundLabel || "", WIDTH / 2, 224);
        ctx.fillStyle = "#7dff9b";
        ctx.font = "bold 32px Consolas, monospace";
        ctx.fillText(`${a.winnerName || "Winner"} (${a.winnerWeapon || ""})`, WIDTH / 2, 268);
        if (a.loserName) {
          ctx.fillStyle = "#ffb59f";
          ctx.font = "bold 22px Consolas, monospace";
          ctx.fillText(`Defeated: ${a.loserName} (${a.loserWeapon || ""})`, WIDTH / 2, 304);
        }
        ctx.fillStyle = "#ffe08f";
        ctx.font = "bold 22px Consolas, monospace";
        ctx.fillText(a.advanceLabel || "", WIDTH / 2, 338);
      }
      if (this.tournament.breakType === "intro") {
        this.drawTournamentEntrantColumns(ctx, this.tournament);
      } else {
        this.drawTournamentMiniBracket(ctx, this.tournament, this.tournament.breakFocus);
      }
    }

    drawTournamentEntrantColumns(ctx, tournament) {
      const entrants = tournament.entrants || [];
      if (!entrants.length) {
        return;
      }
      const half = Math.ceil(entrants.length / 2);
      const left = entrants.slice(0, half);
      const right = entrants.slice(half);
      const top = 420;
      const rows = Math.max(left.length, right.length);
      const step = Math.max(44, Math.min(72, Math.floor(900 / Math.max(1, rows))));
      const t = performance.now() * 0.001;
      const drawColumn = (items, x, tint, sideSign) => {
        items.forEach((entry, index) => {
          const y = top + index * step;
          const slide = clamp((this.tournamentIntroDelaySec - this.tournament.breakTimer) * 2.2 - index * 0.1, 0, 1);
          const offsetX = (1 - slide) * 70 * sideSign;
          const alpha = 0.35 + slide * 0.65;
          const weapon = this.getWeaponMeta(entry.weaponId);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = tint;
          ctx.fillRect(x - 188 + offsetX, y, 376, 34);
          ctx.strokeStyle = "rgba(255,255,255,0.16)";
          ctx.strokeRect(x - 188 + offsetX, y, 376, 34);
          ctx.fillStyle = "#f4f8ff";
          ctx.font = "bold 16px Consolas, monospace";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(`${entry.label}: ${weapon.title}`, x - 174 + offsetX, y + 17);
          ctx.restore();
        });
      };
      drawColumn(left, WIDTH * 0.26 + Math.sin(t * 0.9) * 3, "rgba(52, 140, 255, 0.22)", -1);
      drawColumn(right, WIDTH * 0.74 + Math.cos(t * 0.84) * 3, "rgba(98, 225, 165, 0.22)", 1);
    }

    drawTournamentMiniBracket(ctx, tournament, focus) {
      const rounds = tournament.rounds || [];
      if (!rounds.length) {
        return;
      }
      const totalRounds = rounds.length;
      const left = 112;
      const right = WIDTH - 112;
      const top = 430;
      const bottom = HEIGHT - 220;
      const usableHeight = bottom - top;
      const columnGap = totalRounds > 1 ? (right - left) / (totalRounds - 1) : 0;
      for (let roundIndex = 0; roundIndex < totalRounds; roundIndex += 1) {
        const matches = rounds[roundIndex];
        const x = left + columnGap * roundIndex;
        ctx.fillStyle = "rgba(220, 232, 255, 0.86)";
        ctx.font = "bold 16px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText(this.roundLabel(roundIndex, totalRounds, matches.length), x, top - 22);
        const step = usableHeight / Math.max(1, matches.length);
        for (let matchIndex = 0; matchIndex < matches.length; matchIndex += 1) {
          const y = top + step * (matchIndex + 0.5);
          const match = matches[matchIndex];
          const isFocus = focus && focus.roundIndex === roundIndex && focus.matchIndex === matchIndex;
          ctx.save();
          ctx.fillStyle = match.winnerId ? "rgba(84, 220, 150, 0.24)" : "rgba(46, 70, 108, 0.42)";
          ctx.fillRect(x - 68, y - 16, 136, 32);
          ctx.strokeStyle = isFocus ? "rgba(255, 224, 113, 0.95)" : "rgba(255,255,255,0.24)";
          ctx.lineWidth = isFocus ? 2.2 : 1;
          ctx.strokeRect(x - 68, y - 16, 136, 32);
          ctx.fillStyle = "#e6f0ff";
          ctx.font = "bold 13px Consolas, monospace";
          const leftMark = match.leftId ? "L" : "-";
          const rightMark = match.rightId ? "R" : "-";
          const winnerMark = match.winnerId ? (match.winnerId === match.leftId ? "L" : "R") : "?";
          ctx.fillText(`${leftMark} vs ${rightMark} -> ${winnerMark}`, x, y + 4);
          ctx.restore();
          if (roundIndex < totalRounds - 1) {
            const nextYStep = usableHeight / Math.max(1, rounds[roundIndex + 1].length);
            const nextY = top + nextYStep * (Math.floor(matchIndex / 2) + 0.5);
            ctx.save();
            ctx.strokeStyle = "rgba(188, 212, 255, 0.26)";
            ctx.beginPath();
            ctx.moveTo(x + 68, y);
            ctx.lineTo(x + columnGap - 68, nextY);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    bindUi() {
      this.ui.startButton.addEventListener("click", () => {
        this.startBattle();
      });
      this.ui.leftSelectButton.addEventListener("click", () => this.openCatalog("left"));
      this.ui.rightSelectButton.addEventListener("click", () => this.openCatalog("right"));
      this.ui.randomizeBothButton.addEventListener("click", () => this.randomizeBoth());
      this.ui.catalogCloseButton.addEventListener("click", () => this.closeCatalog());
      this.ui.catalogRandomButton.addEventListener("click", () => {
        const id = this.pickRandomWeapon();
        this.setCatalogPreview(id);
      });
      this.ui.catalogSelectButton.addEventListener("click", () => this.applyCatalogSelection());
      this.ui.catalogSearch.addEventListener("input", (event) => {
        this.catalogSearch = event.target.value.trim();
        this.buildCatalog();
        if (!this.catalogSearch || (this.catalogWeaponId && this.getWeaponMeta(this.catalogWeaponId))) {
          this.setCatalogPreview(this.catalogWeaponId);
        }
      });
      this.ui.runTournamentButton.addEventListener("click", () => {
        if (!this.testRunning) {
          this.openTournamentOverlay();
        }
      });
      this.ui.runStressButton.addEventListener("click", () => {
        if (!this.testRunning) {
          this.runStressTest();
        }
      });
      this.ui.runSet100Button.addEventListener("click", () => {
        if (!this.testRunning) {
          this.runCurrentSet100();
        }
      });
      this.ui.tournamentApplyCountButton.addEventListener("click", () => this.applyTournamentCount());
      this.ui.tournamentCount.addEventListener("change", () => this.applyTournamentCount());
      this.ui.tournamentRandomButton.addEventListener("click", () => this.randomizeTournamentDraft());
      this.ui.tournamentCloseButton.addEventListener("click", () => this.closeTournamentOverlay());
      this.ui.tournamentStartButton.addEventListener("click", () => this.startBracketTournament());
      this.ui.downloadTournamentButton.addEventListener("click", () => this.downloadTournamentReport());
      this.ui.recordBattleButton.addEventListener("click", () => this.toggleRecordingEnabled());
      this.ui.downloadBattleButton.addEventListener("click", () => this.downloadBattleRecording());
      window.addEventListener("keydown", (event) => {
        AUDIO.init();
        if (event.key === "Escape") {
          this.closeCatalog();
          this.closeTournamentOverlay();
          AUDIO.uiClick();
        } else if (event.key === " " || event.key === "Spacebar") {
          this.tryStartGame();
          AUDIO.uiClick();
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
          AUDIO.uiSelect();
        }
      });
    }

    initRecordingUi() {
      if (!this.ui.recordBattleButton || !this.ui.downloadBattleButton) {
        return;
      }
      if (!this.recordingSupported) {
        this.ui.recordBattleButton.textContent = "Recording unavailable";
        this.ui.recordBattleButton.disabled = true;
        this.ui.downloadBattleButton.disabled = true;
        return;
      }
      // Use regular canvas for recording to ensure captureStream support
      this.recordingCanvas = document.createElement("canvas");
      this.recordingCanvas.width = RECORDING_SIZE.width;
      this.recordingCanvas.height = RECORDING_SIZE.height;
      this.recordingCanvas.style.position = "absolute";
      this.recordingCanvas.style.top = "0";
      this.recordingCanvas.style.left = "0";
      this.recordingCanvas.style.width = "1px";
      this.recordingCanvas.style.height = "1px";
      this.recordingCanvas.style.pointerEvents = "none";
      document.body.appendChild(this.recordingCanvas);
      this.recordingCtx = this.recordingCanvas.getContext("2d", { alpha: false });
      if (this.recordingCtx && "imageSmoothingQuality" in this.recordingCtx) {
        this.recordingCtx.imageSmoothingQuality = "high";
      }
      this.syncRecordingButtons();
    }

    ensureRecordingCanvas() {
      if (this.recordingCanvas && this.recordingCtx && this.recordingBufferCanvas && this.recordingBufferCtx) {
        return;
      }
      if (!this.recordingCanvas) {
        this.recordingCanvas = document.createElement("canvas");
        this.recordingCanvas.width = RECORDING_SIZE.width;
        this.recordingCanvas.height = RECORDING_SIZE.height;
        this.recordingCanvas.style.position = "absolute";
        this.recordingCanvas.style.top = "0";
        this.recordingCanvas.style.left = "0";
        this.recordingCanvas.style.width = "1px";
        this.recordingCanvas.style.height = "1px";
        this.recordingCanvas.style.pointerEvents = "none";
        this.recordingCanvas.style.opacity = "0";
        document.body.appendChild(this.recordingCanvas);
        this.recordingCtx = this.recordingCanvas.getContext("2d", { alpha: false });
        if (this.recordingCtx && "imageSmoothingQuality" in this.recordingCtx) {
          this.recordingCtx.imageSmoothingQuality = "high";
        }
      }
      if (!this.recordingBufferCanvas) {
        this.recordingBufferCanvas = document.createElement("canvas");
        this.recordingBufferCanvas.width = RECORDING_BUFFER_SIZE.width;
        this.recordingBufferCanvas.height = RECORDING_BUFFER_SIZE.height;
        this.recordingBufferCtx = this.recordingBufferCanvas.getContext("2d", { alpha: false });
        if (this.recordingBufferCtx && "imageSmoothingQuality" in this.recordingBufferCtx) {
          this.recordingBufferCtx.imageSmoothingQuality = "high";
        }
      }
    }

    createRecordingStream() {
      this.ensureRecordingCanvas();
      if (!this.recordingCanvas || typeof this.recordingCanvas.captureStream !== "function") {
        console.warn("Recording stream unavailable: captureStream not supported on this canvas.");
        return null;
      }
      if (!this.recordingCtx) {
        console.warn("Recording canvas context unavailable.");
        return null;
      }
      // Draw initial frame to ensure canvas is ready
      this.recordingCtx.fillStyle = "black";
      this.recordingCtx.fillRect(0, 0, this.recordingCanvas.width, this.recordingCanvas.height);
      const videoStream = this.recordingCanvas.captureStream(RECORDING_FPS);
      this.recordingVideoTrack = videoStream.getVideoTracks()[0] || null;
      if (!this.recordingVideoTrack) {
        console.warn("No video track from captureStream.");
        return null;
      }
      AUDIO.ensureMusicBus();
      const audioDestination = AUDIO.ensureRecordingDestination();
      if (audioDestination && audioDestination.stream) {
        const combined = new MediaStream();
        videoStream.getVideoTracks().forEach((track) => combined.addTrack(track));
        audioDestination.stream.getAudioTracks().forEach((track) => combined.addTrack(track));
        return combined;
      }
      return videoStream;
    }

    releaseRecordingStream() {
      if (this.recordingStream) {
        const recordingDestinationTracks = new Set(
          (AUDIO.recordingDestination?.stream?.getTracks() || []).filter((track) => track.kind === "audio")
        );
        this.recordingStream.getTracks().forEach((track) => {
          if (recordingDestinationTracks.has(track)) {
            return;
          }
          if (typeof track.stop === "function") {
            track.stop();
          }
        });
      }
      this.recordingStream = null;
      this.recordingVideoTrack = null;
    }

    getRecordingConfig() {
      const candidates = [
        { mimeType: "video/webm;codecs=vp8,opus", extension: "webm" },
        { mimeType: "video/webm;codecs=vp9,opus", extension: "webm" },
        { mimeType: "video/webm", extension: "webm" },
      ];
      if (typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function") {
        for (const candidate of candidates) {
          if (MediaRecorder.isTypeSupported(candidate.mimeType)) {
            return candidate;
          }
        }
      }
      return { mimeType: "", extension: "webm" };
    }

    getRecordingExtension(mimeType) {
      return "webm";
    }

    syncRecordingButtons() {
      if (!this.ui.recordBattleButton || !this.ui.downloadBattleButton) {
        return;
      }
      const formatLabel = (this.recordingExtension || "webm").toUpperCase();
      if (this.recordingExportActive) {
        this.ui.recordBattleButton.textContent = `Recording ${formatLabel}: RENDERING...`;
      } else {
        this.ui.recordBattleButton.textContent = this.recordingEnabled
          ? `Recording ${formatLabel}: ON`
          : `Recording ${formatLabel}: OFF`;
      }
      this.ui.downloadBattleButton.textContent = `Download battle (.${this.recordingExtension || "webm"})`;
      this.ui.recordBattleButton.disabled = this.recordingExportActive;
      this.ui.downloadBattleButton.disabled = !this.recordingUrl || this.recordingExportActive;
    }

    toggleRecordingEnabled() {
      if (!this.recordingSupported) {
        return;
      }
      this.recordingEnabled = !this.recordingEnabled;
      AUDIO.init();
      AUDIO.resume();
      AUDIO.ensureMusicBus();
      this.syncRecordingButtons();
    }

    getRecordingMimeType() {
      const candidates = [
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9,opus",
        "video/webm",
      ];
      for (const mimeType of candidates) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          return mimeType;
        }
      }
      return "";
    }

startBattleRecording() {
      if (!this.recordingSupported || !this.recordingEnabled || this.recordingExportActive) {
        return;
      }
      if (this.tournament && this.tournament.active) {
        return;
      }
      this.stopBattleRecording({ keepCurrent: false, suppressExport: true });
      if (!this.currentBattleMeta) {
        return;
      }
      this.recordingCaptureMeta = {
        leftWeaponId: this.currentBattleMeta.leftWeaponId,
        rightWeaponId: this.currentBattleMeta.rightWeaponId,
        seed: this.currentBattleMeta.seed,
      };
      this.recordingPostResultMessage = "";
      this.recordingActive = true;
      this.syncRecordingButtons();
    }

    stopBattleRecording(options = {}) {
      const keepCurrent = options.keepCurrent !== false;
      const suppressExport = options.suppressExport === true;
      if (typeof options.resultMessage === "string") {
        this.recordingPostResultMessage = options.resultMessage;
      }
      if (!keepCurrent && this.recordingUrl) {
        URL.revokeObjectURL(this.recordingUrl);
        this.recordingUrl = "";
      }
      if (!keepCurrent) {
        this.recordingBlob = null;
      }
      const hadCapture = this.recordingActive && this.recordingCaptureMeta;
      this.recordingActive = false;
      if (
        hadCapture &&
        !suppressExport &&
        !this.recordingExportActive &&
        this.recordingCaptureMeta
      ) {
        void this.exportCapturedBattle();
      }
      this.syncRecordingButtons();
    }

    startRecordingEncoderSession() {
      this.releaseRecordingStream();
      this.recordedChunks = [];
      this.recordingBlob = null;

      if (this.recordingUseWebCodecs) {
        // Use WebCodecs for better performance on weak PCs
        return this.startWebCodecsRecording();
      } else {
        // Fallback to MediaRecorder
        this.recordingStream = this.createRecordingStream();
        if (!this.recordingStream) {
          console.warn("Failed to create recording stream.");
          return null;
        }
        const recordingConfig = this.getRecordingConfig();
        this.recordingMime = recordingConfig.mimeType;
        this.recordingExtension = recordingConfig.extension;

        const options = {
          videoBitsPerSecond: RECORDING_VIDEO_BITRATE,
          audioBitsPerSecond: RECORDING_AUDIO_BITRATE,
        };
        if (this.recordingMime) {
          options.mimeType = this.recordingMime;
        }

        try {
          this.recorder = new MediaRecorder(this.recordingStream, options);
        } catch (error) {
          console.warn("Failed to start recording with selected mimeType, switching to browser default.", error);
          this.recordingMime = "";
          this.recordingExtension = "webm";
          this.recorder = new MediaRecorder(this.recordingStream, {
            videoBitsPerSecond: RECORDING_VIDEO_BITRATE,
            audioBitsPerSecond: RECORDING_AUDIO_BITRATE,
          });
        }

        let resolveStop = () => {};
        const stopped = new Promise((resolve) => {
          resolveStop = resolve;
        });

        this.recorder.onerror = (e) => {
          console.error("MediaRecorder error:", e);
          this.recordingActive = false;
          this.releaseRecordingStream();
          this.recorder = null;
          this.recordingExportActive = false;
          this.recordingReplayInProgress = false;
          this.syncRecordingButtons();
          resolveStop();
        };
        this.recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.recorder.onstop = () => {
          if (this.recordedChunks.length) {
            if (this.recordingUrl) {
              URL.revokeObjectURL(this.recordingUrl);
            }
            const mime = this.recordingMime || this.recordedChunks[0].type || "video/webm";
            const blob = new Blob(this.recordedChunks, { type: mime });
            this.recordingBlob = blob;
            this.recordingMime = blob.type || mime;
            this.recordingExtension = this.getRecordingExtension(this.recordingMime);
            this.recordingUrl = URL.createObjectURL(blob);
          } else {
            console.warn("No MediaRecorder data was recorded.");
          }
          this.releaseRecordingStream();
          this.recorder = null;
          this.syncRecordingButtons();
          resolveStop();
        };
        this.recorder.start(1000);
        return stopped;
      }
    }

    startWebCodecsRecording() {
      this.recordingMime = 'video/webm;codecs=vp9';
      this.recordingExtension = 'webm';

      let resolveStop = () => {};
      const stopped = new Promise((resolve) => {
        resolveStop = resolve;
      });
      this.recordingStopResolve = resolveStop;
      this.recordingStopPromise = stopped;

      // Video Encoder
      const videoConfig = {
        codec: 'vp09.00.10.08', // VP9
        width: RECORDING_SIZE.width,
        height: RECORDING_SIZE.height,
        bitrate: RECORDING_VIDEO_BITRATE,
        framerate: RECORDING_FPS,
      };

      this.videoEncoder = new VideoEncoder({
        output: (chunk, metadata) => {
          if (metadata.decoderConfig) {
            this.recordedChunks.push(metadata.decoderConfig);
          }
          this.recordedChunks.push(chunk);
        },
        error: (e) => {
          console.error('VideoEncoder error:', e);
          this.stopWebCodecsRecording();
          if (this.recordingStopResolve) {
            this.recordingStopResolve();
            this.recordingStopResolve = null;
          }
        },
      });

      this.videoEncoder.configure(videoConfig);

      // For now, skip audio to simplify
      this.audioEncoder = null;

      return stopped;
    }

    async stopWebCodecsRecording() {
      if (this.videoEncoder) {
        await this.videoEncoder.flush();
        this.videoEncoder.close();
        this.videoEncoder = null;
      }
      if (this.audioEncoder) {
        this.audioEncoder.close();
        this.audioEncoder = null;
      }
      // Create WebM blob from chunks
      if (this.recordedChunks.length) {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.recordingBlob = blob;
        this.recordingMime = 'video/webm';
        this.recordingExtension = 'webm';
        if (this.recordingUrl) {
          URL.revokeObjectURL(this.recordingUrl);
        }
        this.recordingUrl = URL.createObjectURL(blob);
      }
      this.recordedChunks = [];
      this.syncRecordingButtons();
      if (this.recordingStopResolve) {
        this.recordingStopResolve();
        this.recordingStopResolve = null;
      }
    }

    async exportCapturedBattle() {
      this.ensureRecordingCanvas();
      if (this.recordingExportActive || !this.recordingCaptureMeta || !this.recordingCtx) {
        console.log("Export skipped: exportActive=", this.recordingExportActive, "meta=", !!this.recordingCaptureMeta, "ctx=", !!this.recordingCtx);
        return;
      }
      const captureMeta = this.recordingCaptureMeta;
      this.recordingCaptureMeta = null;
      this.recordingExportActive = true;
      this.recordingReplayInProgress = true;
      this.recordingActive = true;
      this.syncRecordingButtons();

      const stoppedPromise = this.startRecordingEncoderSession();
      if (!stoppedPromise) {
        console.error("Failed to start recording encoder session.");
        this.recordingExportActive = false;
        this.recordingReplayInProgress = false;
        this.recordingActive = false;
        this.syncRecordingButtons();
        return;
      }

      const finalMessage = this.recordingPostResultMessage || TEXT.choose;
      try {
        console.log("Starting export replay");
        this.setupBattle(captureMeta.leftWeaponId, captureMeta.rightWeaponId, {
          countdown: false,
          hideMenu: false,
          skipRecording: true,
          skipAudio: false,
          seed: captureMeta.seed,
        });
        const replayDt = 1 / RECORDING_FPS;
        let frameIndex = 0;
        while (!this.result.winner && this.mode !== MODES.MENU) {
          this.update(replayDt);
          this.renderToCanvas(this.recordingBufferCtx, RECORDING_BUFFER_SIZE.width, RECORDING_BUFFER_SIZE.height);
          this.recordingCtx.clearRect(0, 0, RECORDING_SIZE.width, RECORDING_SIZE.height);
          this.recordingCtx.drawImage(
            this.recordingBufferCanvas,
            0,
            0,
            RECORDING_BUFFER_SIZE.width,
            RECORDING_BUFFER_SIZE.height,
            0,
            0,
            RECORDING_SIZE.width,
            RECORDING_SIZE.height
          );
          if (this.recordingUseWebCodecs && this.videoEncoder) {
            const frame = new VideoFrame(this.recordingCtx.canvas, { timestamp: frameIndex * RECORDING_EXPORT_FRAME_MS * 1000 });
            this.videoEncoder.encode(frame);
            frame.close();
          } else if (this.recordingVideoTrack && typeof this.recordingVideoTrack.requestFrame === "function") {
            this.recordingVideoTrack.requestFrame();
          }
          frameIndex++;
          // Allow UI to update every 100 frames
          if (frameIndex % 100 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
        console.log("Exporting hold frames");
        for (let hold = 0; hold < Math.floor(RECORDING_FPS * 0.5); hold += 1) {
          this.renderToCanvas(this.recordingBufferCtx, RECORDING_BUFFER_SIZE.width, RECORDING_BUFFER_SIZE.height);
          this.recordingCtx.clearRect(0, 0, RECORDING_SIZE.width, RECORDING_SIZE.height);
          this.recordingCtx.drawImage(
            this.recordingBufferCanvas,
            0,
            0,
            RECORDING_BUFFER_SIZE.width,
            RECORDING_BUFFER_SIZE.height,
            0,
            0,
            RECORDING_SIZE.width,
            RECORDING_SIZE.height
          );
          if (this.recordingUseWebCodecs && this.videoEncoder) {
            const frame = new VideoFrame(this.recordingCtx.canvas, { timestamp: (frameIndex + hold) * RECORDING_EXPORT_FRAME_MS * 1000 });
            this.videoEncoder.encode(frame);
            frame.close();
          } else if (this.recordingVideoTrack && typeof this.recordingVideoTrack.requestFrame === "function") {
            this.recordingVideoTrack.requestFrame();
          }
        }
        console.log("Stopping recorder");
      } catch (error) {
        console.error("Deferred recording export failed:", error);
      } finally {
        if (this.recordingUseWebCodecs) {
          await this.stopWebCodecsRecording();
        } else if (this.recorder && this.recorder.state !== "inactive") {
          this.recorder.stop();
        }
        await stoppedPromise;
        console.log("Export completed, blob size:", this.recordingBlob ? this.recordingBlob.size : "none");
        this.recordingReplayInProgress = false;
        this.recordingExportActive = false;
        this.recordingActive = false;
        this.syncMenu();
        this.syncRecordingButtons();
      }
    }

downloadBattleRecording() {
      if (!this.recordingUrl) {
        return;
      }
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const ext = this.recordingExtension || this.getRecordingExtension(this.recordingMime);
      const link = document.createElement("a");
      link.href = this.recordingUrl;
      link.download = `battle-${stamp}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    drawRecordingHeader(ctx, x, y, width, height = 160) {
      return; // no longer used; recording uses actual in-game HUD blocks instead
    }

    loadCustomBackground() {
      const queue = buildAssetCandidates("background", CUSTOM_ASSETS.backgroundCandidates);
      const tryNext = () => {
        if (!queue.length) {
          this.backgroundReady = true;
          return;
        }
        const source = queue.shift();
        const image = new Image();
        image.onload = () => {
          this.backgroundImage = image;
          this.backgroundReady = true;
        };
        image.onerror = () => tryNext();
        image.src = source;
      };
      tryNext();
    }

    loadSprites() {
      for (const [key, candidates] of Object.entries(CUSTOM_ASSETS.sprites)) {
        this.loadSprite(key, buildSpriteCandidates(key, candidates));
      }
    }

    loadSprite(key, candidates) {
      const queue = [...candidates];
      const tryNext = () => {
        if (!queue.length) {
          this.sprites.set(key, null);
          return;
        }
        const source = queue.shift();
        const image = new Image();
        image.onload = () => {
          this.sprites.set(key, image);
        };
        image.onerror = () => tryNext();
        image.src = source;
      };
      tryNext();
    }

    drawSprite(ctx, key, x, y, width, height, options = {}) {
      const image = this.sprites.get(key);
      if (!image) {
        return false;
      }
      const prevSmoothing = ctx.imageSmoothingEnabled;
      ctx.save();
      ctx.globalAlpha = options.alpha ?? 1;
      ctx.translate(x, y);
      if (options.rotation) {
        ctx.rotate(options.rotation);
      }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, -width / 2, -height / 2, width, height);
      ctx.restore();
      ctx.imageSmoothingEnabled = prevSmoothing;
      return true;
    }

    triggerFlash(color, intensity) {
      if (intensity > this.impactFlash) {
        this.impactFlash = intensity;
        this.impactFlashColor = color;
      }
    }

    createFighter(side, weaponId, baseColor) {
      const isLeft = side === "left";
      const meta = this.getWeaponMeta(weaponId);
      const speedMin = Number.isFinite(meta.speedMin) ? meta.speedMin : Math.round(220 * GLOBAL_SPEED_SCALE);
      const speedMax = Number.isFinite(meta.speedMax) ? meta.speedMax : Math.round(280 * GLOBAL_SPEED_SCALE);
      const launchSpeed = randomRange(Math.min(speedMin, speedMax), Math.max(speedMin, speedMax));
      const position = isLeft
        ? vec(ARENA.x + ARENA.width * 0.24, ARENA.y + ARENA.height * 0.5 + randomRange(-30, 30))
        : vec(ARENA.x + ARENA.width * 0.76, ARENA.y + ARENA.height * 0.5 + randomRange(-30, 30));
      const velocity = vec((isLeft ? 1 : -1) * launchSpeed, randomRange(-96, 96));
      const fighter = new Fighter({
        side,
        weaponId,
        baseColor: baseColor || (isLeft ? CUSTOM_ASSETS.palette.leftBall : CUSTOM_ASSETS.palette.rightBall),
        position,
        velocity,
      });
      const weapon = createWeapon(weaponId, fighter);
      fighter.setWeapon(weapon);
      if (weapon && typeof weapon.onEquip === "function") {
        weapon.onEquip(this);
      }
      return fighter;
    }

    startBattle() {
      if (this.recordingExportActive || this.recordingReplayInProgress) {
        return;
      }
      this.setupBattle(this.selected.left, this.selected.right, { countdown: true, hideMenu: true });
    }

    setupBattle(leftWeaponId, rightWeaponId, options = {}) {
      this.resetCollections();
      this.result = new ResultState();
      const battleSeed = Number.isFinite(options.seed) ? (options.seed >>> 0) : makeBattleSeed();
      setRandomSeed(battleSeed);
      this.currentBattleMeta = {
        leftWeaponId,
        rightWeaponId,
        seed: battleSeed,
        startedAt: Date.now(),
      };
      this.mode = options.countdown === false ? MODES.FIGHT : MODES.COUNTDOWN;
      this.countdown = options.countdown === false ? 0 : 3.6;
      this.time = 0;
      this.roundTime = 0;
      this.suddenDeathTick = SUDDEN_DEATH_DOT_INTERVAL_SEC;
      this.fighters = [
        this.createFighter("left", leftWeaponId, options.leftColor),
        this.createFighter("right", rightWeaponId, options.rightColor),
      ];
      if (options.hideMenu !== false) {
        this.hideMenu();
      }
      if (!options.skipAudio) {
        AUDIO.init();
        AUDIO.resume();
        AUDIO.roundStart();
      }
      if (!options.skipRecording) {
        this.startBattleRecording();
      }
    }

    getSuddenDeathProgress() {
      if (this.mode !== MODES.FIGHT || this.roundTime < SUDDEN_DEATH_START_SEC) {
        return 0;
      }
      const denominator = Math.max(0.0001, this.roundLimitSec - SUDDEN_DEATH_START_SEC);
      return clamp((this.roundTime - SUDDEN_DEATH_START_SEC) / denominator, 0, 1);
    }

    getSuddenDeathHealScale() {
      const progress = this.getSuddenDeathProgress();
      if (progress <= 0) {
        return 1;
      }
      return lerp(1, SUDDEN_DEATH_HEAL_SCALE, progress);
    }

    getSuddenDeathShieldScale() {
      const progress = this.getSuddenDeathProgress();
      if (progress <= 0) {
        return 1;
      }
      return lerp(1, SUDDEN_DEATH_SHIELD_SCALE, progress);
    }

    applySuddenDeath(dt) {
      const progress = this.getSuddenDeathProgress();
      if (progress <= 0 || this.mode !== MODES.FIGHT) {
        return;
      }
      this.suddenDeathTick -= dt;
      if (this.suddenDeathTick <= 0) {
        this.suddenDeathTick += SUDDEN_DEATH_DOT_INTERVAL_SEC;
        const damage = Math.max(1, Math.round(lerp(1, SUDDEN_DEATH_DOT_MAX, progress)));
        for (const fighter of this.fighters) {
          if (fighter && !fighter.dead) {
            fighter.takeDamage(damage, {
              game: this,
              type: "sudden-death",
              color: "#ffb27e",
              ignoreArmor: true,
              ignoreInvulnerable: true,
              hitFrom: fighter.position,
            });
          }
        }
      }
    }

    resolveRoundTimeout() {
      if (this.mode !== MODES.FIGHT) {
        return;
      }
      const [left, right] = this.fighters;
      if (!left || !right || left.dead || right.dead) {
        return;
      }
      const leftScore = left.hp + left.shieldHp * 0.35;
      const rightScore = right.hp + right.shieldHp * 0.35;
      let loser = null;
      if (Math.abs(leftScore - rightScore) < 0.5) {
        loser = left.rageMomentum >= right.rageMomentum ? right : left;
      } else {
        loser = leftScore < rightScore ? left : right;
      }
      loser.takeDamage(9999, {
        game: this,
        type: "timeout-execute",
        color: "#ffd9a1",
        ignoreArmor: true,
        ignoreInvulnerable: true,
        ignoreDeathPrevention: true,
        hitFrom: loser.position,
      });
    }

    inspectSimulationState(step, leftWeaponId, rightWeaponId) {
      const issues = [];
      const prefix = `[step ${step}] ${leftWeaponId} vs ${rightWeaponId}`;
      const pushIssue = (message) => {
        issues.push(`${prefix}: ${message}`);
      };
      const arenaLimitX = ARENA.x + ARENA.width;
      const arenaLimitY = ARENA.y + ARENA.height;

      if (!Number.isFinite(this.time) || !Number.isFinite(this.roundTime)) {
        pushIssue("time became non-finite");
      }

      for (const fighter of this.fighters) {
        if (!fighter) {
          pushIssue("fighter reference missing");
          continue;
        }
        if (![fighter.position.x, fighter.position.y, fighter.velocity.x, fighter.velocity.y, fighter.hp].every(Number.isFinite)) {
          pushIssue(`${fighter.side} fighter has non-finite state`);
        }
        if (fighter.position.x < ARENA.x - 12 || fighter.position.x > arenaLimitX + 12 || fighter.position.y < ARENA.y - 12 || fighter.position.y > arenaLimitY + 12) {
          pushIssue(`${fighter.side} fighter escaped arena bounds`);
        }
        if (fighter.hp < -1 || fighter.hp > 300) {
          pushIssue(`${fighter.side} fighter hp out of bounds (${fighter.hp})`);
        }
        for (const [statusKey, duration] of fighter.statusTimers.entries()) {
          if (!Number.isFinite(duration) || duration < 0) {
            pushIssue(`${fighter.side} status ${statusKey} has invalid duration`);
          }
          if (statusKey !== "dead" && duration > 60) {
            pushIssue(`${fighter.side} status ${statusKey} is stuck for too long (${duration.toFixed(2)})`);
          }
        }
      }

      if (this.projectiles.length > 180) {
        pushIssue(`too many projectiles (${this.projectiles.length})`);
      }
      if (this.zones.length > 120) {
        pushIssue(`too many zones (${this.zones.length})`);
      }
      if (this.particles.length > 5000) {
        pushIssue(`too many particles (${this.particles.length})`);
      }
      if (this.texts.length > 250) {
        pushIssue(`too many floating texts (${this.texts.length})`);
      }

      for (const projectile of this.projectiles) {
        if (![projectile.position.x, projectile.position.y, projectile.velocity.x, projectile.velocity.y, projectile.life, projectile.radius].every(Number.isFinite)) {
          pushIssue(`projectile ${projectile.kind} has non-finite state`);
          continue;
        }
        if (Math.abs(projectile.position.x) > 4000 || Math.abs(projectile.position.y) > 4000) {
          pushIssue(`projectile ${projectile.kind} flew too far away`);
        }
        if (projectile.life > 20) {
          pushIssue(`projectile ${projectile.kind} life is suspiciously high (${projectile.life.toFixed(2)})`);
        }
      }

      for (const zone of this.zones) {
        const values = [
          zone.position.x,
          zone.position.y,
          zone.life,
          zone.radius,
          zone.currentRadius,
          zone.currentRadiusX,
          zone.currentRadiusY,
        ];
        if (!values.every(Number.isFinite)) {
          pushIssue(`zone ${zone.kind} has non-finite state`);
          continue;
        }
        if (zone.life > 20) {
          pushIssue(`zone ${zone.kind} life is suspiciously high (${zone.life.toFixed(2)})`);
        }
      }

      return issues;
    }

    simulateBattle(leftWeaponId, rightWeaponId, options = {}) {
      this.setupBattle(leftWeaponId, rightWeaponId, {
        countdown: false,
        hideMenu: false,
        skipAudio: true,
        skipRecording: true,
        seed: Number.isFinite(options.seed) ? options.seed : makeBattleSeed(),
      });
      const dt = options.dt || (1 / 30);
      const maxSteps = options.maxSteps || getSimulationMaxSteps(dt);
      const issues = [];
      const issueKeys = new Set();
      const peaks = {
        projectiles: 0,
        zones: 0,
        particles: 0,
        texts: 0,
      };
      let steps = 0;
      for (; steps < maxSteps; steps += 1) {
        this.update(dt);
        peaks.projectiles = Math.max(peaks.projectiles, this.projectiles.length);
        peaks.zones = Math.max(peaks.zones, this.zones.length);
        peaks.particles = Math.max(peaks.particles, this.particles.length);
        peaks.texts = Math.max(peaks.texts, this.texts.length);
        if (options.checkIssues) {
          const found = this.inspectSimulationState(steps, leftWeaponId, rightWeaponId);
          for (const issue of found) {
            const normalizedIssue = issue.replace(/^\[step \d+\]\s*/, "");
            if (!issueKeys.has(normalizedIssue)) {
              issueKeys.add(normalizedIssue);
              issues.push(issue);
            }
          }
          if (issues.length && options.stopOnIssue !== false) {
            break;
          }
        }
        if (this.mode === MODES.RESULT) {
          break;
        }
      }
      const [left, right] = this.fighters;
      let winner = this.result.winner;
      if (!winner) {
        winner = left.hp === right.hp ? null : (left.hp > right.hp ? left : right);
      }
      const timedOut = this.mode !== MODES.RESULT;
      if (timedOut) {
        const issue = `${leftWeaponId} vs ${rightWeaponId}: battle did not finish within ${maxSteps} steps`;
        if (!issueKeys.has(issue)) {
          issueKeys.add(issue);
          issues.push(issue);
        }
      }
      return {
        leftWeaponId,
        rightWeaponId,
        winnerSide: winner ? winner.side : "draw",
        winnerWeaponId: winner ? winner.weaponId : null,
        durationSec: this.roundTime,
        leftHp: Math.round(left.hp),
        rightHp: Math.round(right.hp),
        issues,
        peaks,
        timedOut,
        steps,
      };
    }

    safeSimulateBattle(leftWeaponId, rightWeaponId, options = {}) {
      try {
        return this.simulateBattle(leftWeaponId, rightWeaponId, options);
      } catch (error) {
        return {
          leftWeaponId,
          rightWeaponId,
          winnerSide: "draw",
          winnerWeaponId: null,
          durationSec: this.roundTime || 0,
          leftHp: 0,
          rightHp: 0,
          issues: [`CRASH: ${error && error.message ? error.message : String(error)}`],
          peaks: {
            projectiles: this.projectiles.length,
            zones: this.zones.length,
            particles: this.particles.length,
            texts: this.texts.length,
          },
          timedOut: true,
          steps: 0,
        };
      }
    }

    async runTournament() {
      this.testRunning = true;
      this.ui.runTournamentButton.disabled = true;
      this.ui.runStressButton.disabled = true;
      this.ui.runSet100Button.disabled = true;
      this.ui.downloadTournamentButton.disabled = true;
      this.closeCatalog();
      this.ui.testStatus.textContent = "Tournament running...";

      const previousSelected = { ...this.selected };
      const lines = [
        `Tournament date: ${new Date().toISOString()}`,
        `Weapons: ${WEAPON_CATALOG.length}`,
        "",
      ];
      const score = new Map();
      for (const weapon of WEAPON_CATALOG) {
        score.set(weapon.id, { wins: 0, draws: 0, losses: 0, hpFor: 0, hpAgainst: 0, issues: 0 });
      }
      let issueMatches = 0;

      let completed = 0;
      const total = WEAPON_CATALOG.length * (WEAPON_CATALOG.length - 1);
      for (const leftWeapon of WEAPON_CATALOG) {
        for (const rightWeapon of WEAPON_CATALOG) {
          if (leftWeapon.id === rightWeapon.id) {
            continue;
          }
          const result = this.safeSimulateBattle(leftWeapon.id, rightWeapon.id, { checkIssues: true, stopOnIssue: false });
          const leftScore = score.get(leftWeapon.id);
          const rightScore = score.get(rightWeapon.id);
          leftScore.hpFor += result.leftHp;
          leftScore.hpAgainst += result.rightHp;
          rightScore.hpFor += result.rightHp;
          rightScore.hpAgainst += result.leftHp;
          if (result.issues.length) {
            leftScore.issues += result.issues.length;
            rightScore.issues += result.issues.length;
            issueMatches += 1;
          }

          if (result.winnerSide === "left") {
            leftScore.wins += 1;
            rightScore.losses += 1;
          } else if (result.winnerSide === "right") {
            rightScore.wins += 1;
            leftScore.losses += 1;
          } else {
            leftScore.draws += 1;
            rightScore.draws += 1;
          }

          lines.push(`${leftWeapon.title} vs ${rightWeapon.title} -> ${result.winnerSide === "draw" ? "draw" : result.winnerWeaponId} | HP ${result.leftHp}:${result.rightHp} | Peaks P:${result.peaks.projectiles} Z:${result.peaks.zones}${result.issues.length ? ` | Errors:${result.issues.length}` : ""}`);
          for (const issue of result.issues.slice(0, 4)) {
            lines.push(`  BUG: ${issue}`);
          }
          completed += 1;
          if (completed % 8 === 0) {
            this.ui.testStatus.textContent = `Tournament: ${completed}/${total}`;
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
      }

      lines.push("");
      lines.push(`Matches with issues: ${issueMatches}`);
      lines.push("");
      lines.push("Table:");
      const ranking = [...score.entries()]
        .sort((a, b) => {
          const left = a[1];
          const right = b[1];
          return (right.wins - left.wins) || ((right.hpFor - right.hpAgainst) - (left.hpFor - left.hpAgainst));
        });
      ranking.forEach(([weaponId, stats], index) => {
        const meta = this.getWeaponMeta(weaponId);
        lines.push(`${index + 1}. ${meta.title} | W:${stats.wins} D:${stats.draws} L:${stats.losses} | HP:${stats.hpFor}-${stats.hpAgainst} | Errors:${stats.issues}`);
      });

      this.testReport = lines.join("\n");
      this.testReportName = "weapon-tournament-results.txt";
      this.selected = previousSelected;
      this.mode = MODES.MENU;
      this.showMenu(TEXT.choose);
      this.syncMenu();
      this.ui.testStatus.textContent = `Tournament complete. Matches: ${completed}.`;
      this.ui.downloadTournamentButton.disabled = false;
      this.ui.runTournamentButton.disabled = false;
      this.ui.runStressButton.disabled = false;
      this.ui.runSet100Button.disabled = false;
      this.testRunning = false;
    }

    async runStressTest() {
      this.testRunning = true;
      this.ui.runTournamentButton.disabled = true;
      this.ui.runStressButton.disabled = true;
      this.ui.runSet100Button.disabled = true;
      this.ui.downloadTournamentButton.disabled = true;
      this.closeCatalog();
      this.ui.testStatus.textContent = "Stress test x1000 started...";

      const previousSelected = { ...this.selected };
      const lines = [
        `Stress test date: ${new Date().toISOString()}`,
        "Matches: 1000",
        "",
      ];
      const stats = new Map();
      for (const weapon of WEAPON_CATALOG) {
        stats.set(weapon.id, { picks: 0, wins: 0, draws: 0, losses: 0, issues: 0 });
      }

      let issueMatches = 0;
      let totalIssues = 0;
      let timeouts = 0;
      for (let index = 0; index < 1000; index += 1) {
        const leftWeaponId = this.pickRandomWeapon();
        const rightWeaponId = this.pickRandomWeapon();
        const result = this.safeSimulateBattle(leftWeaponId, rightWeaponId, {
          checkIssues: true,
          stopOnIssue: false,
          maxSteps: getSimulationMaxSteps(),
        });

        const leftStats = stats.get(leftWeaponId);
        const rightStats = stats.get(rightWeaponId);
        leftStats.picks += 1;
        rightStats.picks += 1;

        if (result.winnerSide === "left") {
          leftStats.wins += 1;
          rightStats.losses += 1;
        } else if (result.winnerSide === "right") {
          rightStats.wins += 1;
          leftStats.losses += 1;
        } else {
          leftStats.draws += 1;
          rightStats.draws += 1;
        }

        if (result.issues.length) {
          issueMatches += 1;
          totalIssues += result.issues.length;
          leftStats.issues += result.issues.length;
          rightStats.issues += result.issues.length;
        }
        if (result.timedOut) {
          timeouts += 1;
        }

        const leftMeta = this.getWeaponMeta(leftWeaponId);
        const rightMeta = this.getWeaponMeta(rightWeaponId);
        lines.push(`${index + 1}. ${leftMeta.title} vs ${rightMeta.title} -> ${result.winnerSide === "draw" ? "draw" : result.winnerWeaponId} | HP ${result.leftHp}:${result.rightHp} | Peaks P:${result.peaks.projectiles} Z:${result.peaks.zones}${result.timedOut ? " | TIMEOUT" : ""}${result.issues.length ? ` | Errors:${result.issues.length}` : ""}`);
        for (const issue of result.issues.slice(0, 6)) {
          lines.push(`  BUG: ${issue}`);
        }

        if ((index + 1) % 10 === 0) {
          this.ui.testStatus.textContent = `Stress x1000: ${index + 1}/1000`;
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      lines.push("");
      lines.push(`Matches with errors: ${issueMatches}`);
      lines.push(`Total errors: ${totalIssues}`);
      lines.push(`Timeouts: ${timeouts}`);
      lines.push("");
      lines.push("Stress test table:");

      const ranking = [...stats.entries()]
        .sort((a, b) => {
          const left = a[1];
          const right = b[1];
          const leftRate = left.picks ? left.wins / left.picks : 0;
          const rightRate = right.picks ? right.wins / right.picks : 0;
          return (rightRate - leftRate) || (right.wins - left.wins);
        });
      ranking.forEach(([weaponId, value], index) => {
        const meta = this.getWeaponMeta(weaponId);
        const winRate = value.picks ? ((value.wins / value.picks) * 100).toFixed(1) : "0.0";
        lines.push(`${index + 1}. ${meta.title} | Picks:${value.picks} W:${value.wins} D:${value.draws} L:${value.losses} | Winrate:${winRate}% | Errors:${value.issues}`);
      });

      this.testReport = lines.join("\n");
      this.testReportName = "weapon-stress-1000-report.txt";
      this.selected = previousSelected;
      this.mode = MODES.MENU;
      this.showMenu(TEXT.choose);
      this.syncMenu();
      this.ui.testStatus.textContent = `Stress x1000 completed. Errors: ${totalIssues}, timeouts: ${timeouts}.`;
      this.ui.downloadTournamentButton.disabled = false;
      this.ui.runTournamentButton.disabled = false;
      this.ui.runStressButton.disabled = false;
      this.ui.runSet100Button.disabled = false;
      this.testRunning = false;
    }

    async runCurrentSet100() {
      this.testRunning = true;
      this.ui.runTournamentButton.disabled = true;
      this.ui.runStressButton.disabled = true;
      this.ui.runSet100Button.disabled = true;
      this.ui.downloadTournamentButton.disabled = true;
      this.closeCatalog();
      this.ui.testStatus.textContent = "Current set x100 started...";

      const previousSelected = { ...this.selected };
      const leftWeaponId = previousSelected.left;
      const rightWeaponId = previousSelected.right;
      const leftMeta = this.getWeaponMeta(leftWeaponId);
      const rightMeta = this.getWeaponMeta(rightWeaponId);
      const totalRuns = 100;
      const durations = [];
      let sumDuration = 0;
      let minDuration = Number.POSITIVE_INFINITY;
      let maxDuration = 0;
      let leftWins = 0;
      let rightWins = 0;
      let draws = 0;
      let timeouts = 0;

      const lines = [
        `Current set date: ${new Date().toISOString()}`,
        `Set: ${leftMeta.title} vs ${rightMeta.title}`,
        `Matches: ${totalRuns}`,
        "",
      ];

      for (let index = 0; index < totalRuns; index += 1) {
        const result = this.safeSimulateBattle(leftWeaponId, rightWeaponId, {
          checkIssues: false,
          dt: FAST_SET_SIM_DT,
          maxSteps: getSimulationMaxSteps(FAST_SET_SIM_DT),
        });
        const durationSec = Number.isFinite(result.durationSec) ? result.durationSec : 0;
        durations.push(durationSec);
        sumDuration += durationSec;
        minDuration = Math.min(minDuration, durationSec);
        maxDuration = Math.max(maxDuration, durationSec);

        if (result.winnerSide === "left") {
          leftWins += 1;
        } else if (result.winnerSide === "right") {
          rightWins += 1;
        } else {
          draws += 1;
        }
        if (result.timedOut) {
          timeouts += 1;
        }

        lines.push(`${index + 1}. ${leftMeta.title} vs ${rightMeta.title} -> ${result.winnerSide === "draw" ? "draw" : result.winnerWeaponId} | HP ${result.leftHp}:${result.rightHp} | Duration ${durationSec.toFixed(2)}s${result.timedOut ? " | TIMEOUT" : ""}`);
        if ((index + 1) % 10 === 0) {
          this.ui.testStatus.textContent = `Current set x100: ${index + 1}/${totalRuns}`;
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      const sorted = [...durations].sort((a, b) => a - b);
      const avgDuration = sumDuration / totalRuns;
      const medianDuration = sorted[Math.floor(sorted.length / 2)];
      const p90Duration = sorted[Math.floor(sorted.length * 0.9)];

      lines.push("");
      lines.push(`Average duration: ${avgDuration.toFixed(2)}s`);
      lines.push(`Median: ${medianDuration.toFixed(2)}s`);
      lines.push(`P90: ${p90Duration.toFixed(2)}s`);
      lines.push(`Min/Max: ${minDuration.toFixed(2)}s / ${maxDuration.toFixed(2)}s`);
      lines.push(`Left wins: ${leftWins}`);
      lines.push(`Right wins: ${rightWins}`);
      lines.push(`Draws: ${draws}`);
      lines.push(`Timeouts: ${timeouts}`);

      this.testReport = lines.join("\n");
      this.testReportName = "weapon-current-set-100-report.txt";
      this.selected = previousSelected;
      this.mode = MODES.MENU;
      this.showMenu(TEXT.choose);
      this.syncMenu();
      this.ui.testStatus.textContent = `Current set x100 completed. Average duration: ${avgDuration.toFixed(2)}s (min ${minDuration.toFixed(2)}s, max ${maxDuration.toFixed(2)}s).`;
      this.ui.downloadTournamentButton.disabled = false;
      this.ui.runTournamentButton.disabled = false;
      this.ui.runStressButton.disabled = false;
      this.ui.runSet100Button.disabled = false;
      this.testRunning = false;
    }
    downloadTournamentReport() {
      if (!this.testReport) {
        return;
      }
      const blob = new Blob([this.testReport], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = this.testReportName || "weapon-test-report.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
URL.revokeObjectURL(link.href);
    }

    resetCollections() {
      this.particles = [];
      this.texts = [];
      this.zones = [];
      this.projectiles = [];
      this.screenShake = 0;
      this.impactFlash = 0;
    }

    hideMenu() {
      this.closeCatalog();
      this.ui.overlay.classList.remove("visible");
      this.ui.menuCopy.textContent = TEXT.choose;
    }

    showMenu(message) {
      this.ui.menuCopy.textContent = message;
      this.ui.overlay.classList.add("visible");
      this.syncMenu();
    }

    frame(timestamp) {
      const dt = clamp((timestamp - this.lastFrame) / 1000 || 0, 0, 0.033);
      this.lastFrame = timestamp;
      this.accumulator += dt;

      const fixedDt = 1 / 30; // Lower update rate for weaker PCs, but render at 60 FPS

      if (this.recordingReplayInProgress) {
        requestAnimationFrame((time) => this.frame(time));
        return;
      }
      if (this.testRunning) {
        this.render();
        requestAnimationFrame((time) => this.frame(time));
        return;
      }

      // Update with fixed timestep
      while (this.accumulator >= fixedDt) {
        this.update(fixedDt);
        this.accumulator -= fixedDt;
      }

      this.render();
      requestAnimationFrame((time) => this.frame(time));
    }

    update(dt) {
      AUDIO.ambientTick();
      if (this.screenShake > 0) {
        this.screenShake = Math.max(0, this.screenShake - dt * 0.95);
      }
      if (this.impactFlash > 0) {
        this.impactFlash = Math.max(0, this.impactFlash - dt * 1.9);
      }

      for (const particle of this.particles) {
        particle.update(dt);
      }
      this.particles = this.particles.filter((particle) => particle.life > 0);

      for (const text of this.texts) {
        text.update(dt);
      }
      this.texts = this.texts.filter((text) => text.life > 0);

      if (this.mode === MODES.MENU) {
        return;
      }

      if (this.mode === MODES.COUNTDOWN) {
        this.time += dt;
        this.countdown -= dt;
        if (this.countdown <= 0) {
          this.mode = MODES.FIGHT;
          this.time = 0;
        }
        return;
      }

      if (this.mode === MODES.RESULT) {
        this.result.timer -= dt;
        if (this.result.timer <= 0) {
          if (this.tournament && this.tournament.active) {
            this.stopBattleRecording({ keepCurrent: true, suppressExport: true });
            this.resolveTournamentBattle();
            this.mode = MODES.TOURNAMENT_BREAK;
          } else {
            const message = this.result.winner
              ? `${TEXT.winner}: ${this.result.winner.name}. ${TEXT.replay}`
              : `${TEXT.draw}. ${TEXT.replay}`;
            this.stopBattleRecording({ keepCurrent: true, resultMessage: message });
            this.mode = MODES.MENU;
            this.showMenu(message);
          }
        }
        return;
      }

      if (this.mode === MODES.TOURNAMENT_BREAK) {
        if (this.tournament) {
          this.tournament.breakTimer -= dt;
          const remaining = Math.max(0, this.tournament.breakTimer);
          this.ui.testStatus.textContent = `${this.tournament.breakMessage} ${this.tournamentBreakCountdownText()} ${remaining.toFixed(1)}s`;
          if (this.tournament.breakTimer <= 0) {
            if (this.tournament.autoRestartPending) {
              this.restartTournamentLoop();
            } else {
              this.startNextTournamentBattle();
            }
          }
        }
        return;
      }

      this.time += dt;
      this.roundTime += dt;
      this.applySuddenDeath(dt);

      for (const projectile of this.projectiles) {
        projectile.update(dt, this);
      }
      this.projectiles = this.projectiles.filter((projectile) => projectile.life > 0);

      for (const zone of this.zones) {
        zone.update(dt, this);
      }
      this.zones = this.zones.filter((zone) => zone.life > 0);

      for (const minion of this.minions) {
        minion.update(dt, this);
      }
      this.minions = this.minions.filter((minion) => !minion.dead);

      const [left, right] = this.fighters;
      left.update(dt, this, right);
      right.update(dt, this, left);
      this.handleFighterCollision(left, right);
      this.handleMinionCombat();
      if (this.mode === MODES.FIGHT && this.roundTime >= this.roundLimitSec) {
        this.resolveRoundTimeout();
      }
    }

    handleArenaCollision(fighter) {
      if (fighter.dead) {
        return;
      }

      let hit = false;
      let normal = null;
      const minX = ARENA.x + fighter.ballRadius;
      const maxX = ARENA.x + ARENA.width - fighter.ballRadius;
      const minY = ARENA.y + fighter.ballRadius;
      const maxY = ARENA.y + ARENA.height - fighter.ballRadius;

      if (fighter.position.x <= minX) {
        fighter.position.x = minX;
        fighter.velocity = reflect(fighter.velocity, vec(1, 0));
        normal = vec(1, 0);
        hit = true;
      } else if (fighter.position.x >= maxX) {
        fighter.position.x = maxX;
        fighter.velocity = reflect(fighter.velocity, vec(-1, 0));
        normal = vec(-1, 0);
        hit = true;
      }

      if (fighter.position.y <= minY) {
        fighter.position.y = minY;
        fighter.velocity = reflect(fighter.velocity, vec(0, 1));
        normal = vec(0, 1);
        hit = true;
      } else if (fighter.position.y >= maxY) {
        fighter.position.y = maxY;
        fighter.velocity = reflect(fighter.velocity, vec(0, -1));
        normal = vec(0, -1);
        hit = true;
      }

      if (hit) {
        if (this.time - (fighter.lastWallAt || -99) > 0.08) {
          fighter.lastWallAt = this.time;
          this.spawnBurst(fighter.position, fighter.baseColor, 12);
          this.screenShake = Math.max(this.screenShake, 0.12);
          AUDIO.wallCollision(fighter.weapon ? fighter.weapon.id : "fighter");
          if (fighter.weapon && typeof fighter.weapon.onWallHit === "function") {
            fighter.weapon.onWallHit(normal, this);
          }
        }
      }
    }

    handleFighterCollision(a, b) {
      if (a.dead || b.dead) {
        return;
      }
      if (a.hasStatus("phase") || b.hasStatus("phase")) {
        return;
      }

      const diff = sub(b.position, a.position);
      const dist = length(diff);
      const minDist = a.ballRadius + b.ballRadius;
      if (dist <= 0 || dist >= minDist) {
        return;
      }

      const normal = normalize(diff);
      const overlap = minDist - dist;
      a.position = add(a.position, scale(normal, -overlap * 0.5));
      b.position = add(b.position, scale(normal, overlap * 0.5));

      const relative = sub(b.velocity, a.velocity);
      const speedAlongNormal = dot(relative, normal);
      if (speedAlongNormal < 0) {
        const restitution = CHAOS_COLLISION_RESTITUTION;
        const impulseValue = -(1 + restitution) * speedAlongNormal / ((1 / a.mass) + (1 / b.mass));
        const impulse = scale(normal, impulseValue);
        a.velocity = add(a.velocity, scale(impulse, -1 / a.mass));
        b.velocity = add(b.velocity, scale(impulse, 1 / b.mass));
        if (-speedAlongNormal > 110 && a.hitCooldown <= 0 && b.hitCooldown <= 0) {
          const hitPoint = add(a.position, scale(normal, a.ballRadius * 0.5));
          this.spawnBurst(hitPoint, "#ffffff", 28);
          this.screenShake = Math.max(this.screenShake, 0.34);
          a.hitCooldown = 0.12;
          b.hitCooldown = 0.12;
          AUDIO.ballCollision(-speedAlongNormal);
        }
      }

      if (a.weapon && typeof a.weapon.onTouchEnemy === "function") {
        a.weapon.onTouchEnemy(b, this);
      }
      if (b.weapon && typeof b.weapon.onTouchEnemy === "function") {
        b.weapon.onTouchEnemy(a, this);
      }
    }

    handleMinionCombat() {
      for (const minion of this.minions) {
        if (minion.dead) {
          continue;
        }
        for (const fighter of this.fighters) {
          if (fighter.dead || fighter.side === minion.side) {
            continue;
          }
          const diff = sub(fighter.position, minion.position);
          const dist = length(diff);
          const minDist = fighter.ballRadius + minion.ballRadius;
          if (dist <= 0 || dist >= minDist) {
            continue;
          }

          const normal = normalize(diff);
          const overlap = minDist - dist;
          minion.position = add(minion.position, scale(normal, -overlap * 0.55));
          fighter.position = add(fighter.position, scale(normal, overlap * 0.15));
          fighter.receiveVelocity(scale(normal, 90 / Math.max(0.5, fighter.mass || 1)));

          if (minion.kind === "zombie" && minion.hitCooldown <= 0) {
            fighter.takeDamage(5, {
              game: this,
              type: "zombie-bite",
              hitFrom: minion.position,
              knockback: 120,
              color: "#9fcb71",
              sourceFighter: minion.owner,
            });
            fighter.applyPoison(2.2, 1);
            fighter.setStatus("snagged", 0.3);
            minion.hitCooldown = 0.85;
            this.spawnBurst(minion.position, "#b4dc87", 8);
          }
        }
      }
    }

    spawnBurst(position, color, count) {
      for (let index = 0; index < count; index += 1) {
        const angle = randomRange(0, Math.PI * 2);
        const speed = randomRange(36, 168);
        const size = randomRange(2, 6);
        this.particles.push(new Particle(
          position,
          vec(Math.cos(angle) * speed, Math.sin(angle) * speed),
          color,
          randomRange(0.28, 0.7),
          size,
          chance(0.35) ? "square" : "circle"
        ));
      }
    }

    spawnShardBurst(position, color, count) {
      for (let index = 0; index < count; index += 1) {
        const angle = randomRange(0, Math.PI * 2);
        const speed = randomRange(32, 124);
        this.particles.push(new Particle(
          position,
          vec(Math.cos(angle) * speed, Math.sin(angle) * speed),
          color,
          randomRange(0.32, 0.8),
          randomRange(1.5, 3.5),
          "square"
        ));
      }
    }

    addFloatingText(text, position, color) {
      this.texts.push(new FloatingText(text, position, color));
    }

    spawnZone(zone) {
      this.zones.push(zone);
    }

    spawnMinion(minion) {
      this.minions.push(minion);
    }

    onFighterKilled(fighter, info) {
      this.spawnBurst(fighter.position, info.color || "#ffffff", 56);
      this.spawnShardBurst(fighter.position, fighter.baseColor, 46);
      this.screenShake = Math.max(this.screenShake, 0.92);
      this.triggerFlash(info.color || "#ffffff", 0.24);
      const alive = this.fighters.find((item) => item !== fighter && !item.dead) || null;
      this.result.winner = alive;
      const victoryDuration = AUDIO.getSampleDuration("victory", { pitchJitter: 0.02, playbackRate: 1 }) || 2.8;
      this.result.timer = victoryDuration + 0.4;
      this.mode = MODES.RESULT;
      AUDIO.death();
      const win = this.fighters.find((f) => !f.dead);
      if (win) AUDIO.victory();
    }

    render() {
      this.renderToCanvas(this.ctx, WIDTH, HEIGHT);
    }

    renderToCanvas(targetCtx, targetWidth, targetHeight) {
      const sourceWidth = WIDTH;
      const sourceHeight = HEIGHT;
      const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
      const drawWidth = Math.round(sourceWidth * scale);
      const drawHeight = Math.round(sourceHeight * scale);
      const offsetX = Math.round((targetWidth - drawWidth) * 0.5);
      const offsetY = Math.round((targetHeight - drawHeight) * 0.5);

      const fastRecordingExport = targetCtx === this.recordingCtx && this.recordingExportActive;
      targetCtx.clearRect(0, 0, targetWidth, targetHeight);
      targetCtx.fillStyle = "#070b18";
      targetCtx.fillRect(0, 0, targetWidth, targetHeight);
      targetCtx.imageSmoothingEnabled = true;
      if ("imageSmoothingQuality" in targetCtx) {
        targetCtx.imageSmoothingQuality = fastRecordingExport ? "medium" : "high";
      }

      targetCtx.save();
      targetCtx.translate(offsetX, offsetY);
      targetCtx.scale(scale, scale);

      this.drawBackground(targetCtx);

      if (this.screenShake > 0 && this.mode !== MODES.MENU) {
        const amount = this.screenShake * 14;
        targetCtx.translate(randomRange(-amount, amount), randomRange(-amount, amount));
      }

      this.drawArena(targetCtx);
      this.drawArenaBackground(targetCtx);

      for (const zone of this.zones) {
        zone.draw(targetCtx, this);
      }
      for (const projectile of this.projectiles) {
        projectile.draw(targetCtx, this);
      }
      for (const fighter of this.fighters) {
        if (fighter.weapon && typeof fighter.weapon.drawArena === "function") {
          fighter.weapon.drawArena(targetCtx, this);
        }
      }

      this.drawFighters(targetCtx);
      if (!fastRecordingExport) {
        for (const particle of this.particles) {
          particle.draw(targetCtx);
        }
        for (const text of this.texts) {
          text.draw(targetCtx);
        }
      }

      targetCtx.restore();

      targetCtx.save();
      targetCtx.translate(offsetX, offsetY);
      targetCtx.scale(scale, scale);
      if (!fastRecordingExport) {
        this.drawHud(targetCtx);
        this.drawOverlayText(targetCtx);
      }
      if (!fastRecordingExport) {
        this.drawScreenFx(targetCtx);
      }
      targetCtx.restore();
    }

    drawBackground(ctx) {
      const t = performance.now() * 0.001;
      const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, "#081120");
      gradient.addColorStop(0.46, "#101a2f");
      gradient.addColorStop(1, "#050913");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (this.backgroundImage) {
        const image = this.backgroundImage;
        const scale = Math.max(WIDTH / image.width, HEIGHT / image.height) * 1.08;
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const driftX = Math.sin(t * 0.23) * 14 + this.backgroundDrift.x;
        const driftY = Math.cos(t * 0.18) * 10 + this.backgroundDrift.y;
        ctx.drawImage(
          image,
          WIDTH * 0.5 - drawWidth * 0.5 + driftX,
          HEIGHT * 0.5 - drawHeight * 0.5 + driftY,
          drawWidth,
          drawHeight
        );
      } else {
        this.drawColorCloud(ctx, WIDTH * 0.18 + Math.sin(t * 0.7) * 26, HEIGHT * 0.18 + Math.cos(t * 0.55) * 20, 260, "rgba(0, 255, 221, 0.18)");
        this.drawColorCloud(ctx, WIDTH * 0.81 + Math.sin(t * 0.42) * 32, HEIGHT * 0.22 + Math.cos(t * 0.37) * 24, 280, "rgba(60, 136, 255, 0.2)");
        this.drawColorCloud(ctx, WIDTH * 0.2 + Math.cos(t * 0.3) * 18, HEIGHT * 0.8 + Math.sin(t * 0.41) * 16, 300, "rgba(111, 255, 61, 0.14)");
        this.drawColorCloud(ctx, WIDTH * 0.8 + Math.cos(t * 0.63) * 20, HEIGHT * 0.78 + Math.sin(t * 0.52) * 22, 260, "rgba(255, 119, 48, 0.2)");
        this.drawHexField(ctx, t);
      }

      ctx.save();
        ctx.globalAlpha = 0.34;
        const haze = ctx.createLinearGradient(0, HEIGHT * 0.2, 0, HEIGHT);
        haze.addColorStop(0, "rgba(255, 255, 255, 0)");
        haze.addColorStop(1, "rgba(0, 0, 0, 0.5)");
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let index = 0; index < 30; index += 1) {
          const x = (index * 47 + Math.sin(t * 0.4 + index) * 22 + WIDTH) % WIDTH;
          const y = (index * 61 + Math.cos(t * 0.31 + index) * 16 + HEIGHT) % HEIGHT;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.04 + (index % 3) * 0.024})`;
          ctx.beginPath();
          ctx.arc(x, y, 2 + (index % 2), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
    }

    drawColorCloud(ctx, x, y, radius, color) {
      ctx.save();
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, radius);
      cloud.addColorStop(0, color);
      cloud.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = cloud;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawHexField(ctx, t) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.045)";
      ctx.lineWidth = 1;
      for (let row = 0; row < 8; row += 1) {
        for (let col = 0; col < 10; col += 1) {
          const x = 64 + col * 92 + (row % 2) * 46 + Math.sin(t * 0.3 + row + col) * 3;
          const y = 76 + row * 88 + Math.cos(t * 0.22 + row + col) * 3;
          ctx.beginPath();
          for (let i = 0; i < 6; i += 1) {
            const angle = Math.PI / 6 + (Math.PI * 2 * i) / 6;
            const px = x + Math.cos(angle) * 26;
            const py = y + Math.sin(angle) * 26;
            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    drawArena(ctx) {
      ctx.save();
      ctx.strokeStyle = "rgba(238, 241, 248, 0.76)";
      ctx.lineWidth = 2;
      ctx.strokeRect(ARENA.x, ARENA.y, ARENA.width, ARENA.height);
      ctx.restore();
    }

    drawArenaBackground(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ARENA.x, ARENA.y, ARENA.width, ARENA.height);
      ctx.clip();

      const bg = ctx.createLinearGradient(ARENA.x, ARENA.y, ARENA.x, ARENA.y + ARENA.height);
      bg.addColorStop(0, CUSTOM_ASSETS.palette.arenaFillTop);
      bg.addColorStop(1, CUSTOM_ASSETS.palette.arenaFillBottom);
      ctx.fillStyle = bg;
      ctx.fillRect(ARENA.x, ARENA.y, ARENA.width, ARENA.height);

      const t = performance.now() * 0.001;
      this.drawColorCloud(ctx, ARENA.x + ARENA.width * 0.2 + Math.cos(t * 0.46) * 12, ARENA.y + ARENA.height * 0.22, 132, CUSTOM_ASSETS.palette.arenaGlowA);
      this.drawColorCloud(ctx, ARENA.x + ARENA.width * 0.74 + Math.sin(t * 0.38) * 18, ARENA.y + ARENA.height * 0.72, 148, CUSTOM_ASSETS.palette.arenaGlowB);
      ctx.restore();
    }

    drawFighters(ctx) {
      for (const fighter of this.fighters) {
        this.drawBallShadow(ctx, fighter);
      }
      for (const minion of this.minions) {
        minion.draw(ctx, this);
      }
      for (const fighter of this.fighters) {
        this.drawBall(ctx, fighter);
      }
      for (const fighter of this.fighters) {
        if (fighter.weapon && typeof fighter.weapon.drawOwnerAttachment === "function") {
          fighter.weapon.drawOwnerAttachment(ctx, this);
        }
      }
    }

    drawBallShadow(ctx, fighter) {
      ctx.save();
      ctx.globalAlpha = 0.34;
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.ellipse(fighter.position.x, fighter.position.y + fighter.ballRadius * 0.94, fighter.ballRadius * 0.9, fighter.ballRadius * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawBall(ctx, fighter) {
      const radius = fighter.ballRadius;
      const color = fighter.damageFlash > 0 ? "#ffffff" : fighter.baseColor;

      ctx.save();
      ctx.globalAlpha = fighter.opacity ?? 1;
      ctx.translate(fighter.position.x, fighter.position.y);
      const spriteKey = fighter.side === "left" ? "ballLeft" : "ballRight";
      if (this.drawSprite(ctx, spriteKey, 0, 0, radius * 2.5, radius * 2.5)) {
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 38px Consolas, monospace";
        ctx.fillText(String(Math.ceil(fighter.hp)), 0, 4);
        if (fighter.hasStatus("frozen")) {
          this.drawFreezeHex(ctx, radius + 11);
        }
        ctx.restore();
        return;
      }
      const sphere = ctx.createRadialGradient(-radius * 0.38, -radius * 0.45, 6, 0, 0, radius);
      sphere.addColorStop(0, "#ffffff");
      sphere.addColorStop(0.16, color);
      sphere.addColorStop(1, fighter.side === "left" ? CUSTOM_ASSETS.palette.leftBallDark : CUSTOM_ASSETS.palette.rightBallDark);
      ctx.beginPath();
      ctx.fillStyle = sphere;
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#f7fbff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 38px Consolas, monospace";
      ctx.fillText(String(Math.ceil(fighter.hp)), 0, 4);

      if (fighter.hasStatus("frozen")) {
        this.drawFreezeHex(ctx, radius + 7);
      }
      ctx.restore();
    }

    drawFreezeHex(ctx, radius) {
      ctx.save();
      ctx.fillStyle = "rgba(176, 238, 255, 0.38)";
      ctx.strokeStyle = "rgba(220, 248, 255, 0.96)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let index = 0; index < 6; index += 1) {
        const angle = Math.PI / 6 + (Math.PI * 2 * index) / 6;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    drawHud(ctx) {
      const left = this.fighters[0];
      const right = this.fighters[1];

      ctx.save();
      if (left) {
        this.drawTopSide(ctx, left, 14, "left");
        this.drawBottomSide(ctx, left, 16, "left");
      }
      if (right) {
        this.drawTopSide(ctx, right, WIDTH - 14, "right");
        this.drawBottomSide(ctx, right, WIDTH - 16, "right");
      }
      if (this.mode === MODES.FIGHT) {
        const remaining = Math.max(0, this.roundLimitSec - this.roundTime);
        const suddenProgress = this.getSuddenDeathProgress();
        ctx.textAlign = "center";
        ctx.fillStyle = suddenProgress > 0 ? "#ffcb8e" : "#dce7ff";
        ctx.font = "bold 20px Consolas, monospace";
        ctx.fillText(`TIME ${remaining.toFixed(1)}s`, WIDTH / 2, 36);
        if (suddenProgress > 0) {
          ctx.fillStyle = "#ff9f71";
          ctx.font = "bold 16px Consolas, monospace";
          ctx.fillText(`SUDDEN DEATH x${(1 + suddenProgress * (SUDDEN_DEATH_DOT_MAX - 1)).toFixed(2)}`, WIDTH / 2, 58);
        }
      }
      ctx.restore();
    }

    drawTopSide(ctx, fighter, x, align) {
      ctx.save();
      const panelWidth = 360;
      const panelHeight = 74;
      const panelX = align === "left" ? 12 : WIDTH - panelWidth - 12;
      const panelY = 8;
      ctx.fillStyle = "rgba(8, 12, 24, 0.88)";
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
      ctx.strokeStyle = fighter.side === "left" ? "rgba(110, 255, 117, 0.24)" : "rgba(104, 200, 255, 0.24)";
      ctx.lineWidth = 2;
      ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

      const textX = align === "left" ? panelX + 20 : panelX + panelWidth - 20;
      ctx.textAlign = align;
      ctx.fillStyle = fighter.side === "left" ? CUSTOM_ASSETS.palette.hudLeft : CUSTOM_ASSETS.palette.hudRight;
      ctx.font = "bold 34px Consolas, monospace";
      ctx.textBaseline = "top";
      ctx.fillText(fighter.name.toUpperCase(), textX, panelY + 12);

      const meta = WEAPON_LIBRARY[fighter.weaponId] || LEGACY_WEAPON_LIBRARY[fighter.weaponId];
      if (meta && meta.badge) {
        ctx.font = "bold 18px Consolas, monospace";
        ctx.fillStyle = "#cfd8ff";
        ctx.fillText(meta.badge.toUpperCase(), textX, panelY + 44);
      }

      const iconX = align === "left" ? panelX + panelWidth - 52 : panelX + 52;
      this.drawMiniIcon(ctx, fighter, iconX, panelY + 38, 64);
      ctx.restore();
    }

    drawMiniIcon(ctx, fighter, x, y, size = 54) {
      const meta = WEAPON_LIBRARY[fighter.weaponId] || LEGACY_WEAPON_LIBRARY[fighter.weaponId];
      const hudSpriteMap = {
        rail: "hudRail", boat: "hudBoat", fishingRod: "hudFishingRod", loyaltyTrident: "hudTrident",
        waterBucket: "hudWaterBucket", lavaBucket: "hudLavaBucket", snowball: "hudSnowball",
        flintSteel: "hudFlintSteel", expBottle: "hudExpBottle", totem: "hudTotem",
        hopperMinecart: "hudHopperMinecart", tnt: "hudTnt", beehive: "hudBeehive",
        noteBlock: "hudNoteBlock", shulkerBox: "hudShulkerBox", respawnAnchor: "hudRespawnAnchor",
        enderPearl: "hudEnderPearl", cryingObsidian: "hudCryingObsidian", blazeRod: "hudBlazeRod",
        rottenFlesh: "hudRottenFlesh", jackOLantern: "hudJackOLantern", boneMeal: "hudBoneMeal",
        bookQuill: "hudBookQuill", elytra: "hudElytra", goldenApple: "hudGoldenApple",
        invisPotion: "hudInvisPotion", gravityPotion: "hudGravityPotion", turtlePotion: "hudTurtlePotion"
      };
      const spriteKey = hudSpriteMap[fighter.weaponId] || null;
      if (spriteKey && this.drawSprite(ctx, spriteKey, x, y, size, size)) {
        return;
      }
      if (drawProceduralWeaponSprite(ctx, fighter.weaponId, x, y, size, size)) {
        return;
      }
      ctx.save();
      ctx.translate(x, y);
      if (fighter.weaponId === "rail") {
        ctx.fillStyle = CUSTOM_ASSETS.wagon.shell;
        ctx.fillRect(-size * 0.34, -size * 0.22, size * 0.68, size * 0.4);
        ctx.fillStyle = CUSTOM_ASSETS.wagon.trim;
        ctx.fillRect(-size * 0.27, -size * 0.17, size * 0.54, size * 0.18);
      } else if (fighter.weaponId === "boat") {
        ctx.fillStyle = "#92673d";
        ctx.beginPath();
        ctx.moveTo(-size * 0.44, 0);
        ctx.quadraticCurveTo(0, -size * 0.28, size * 0.44, 0);
        ctx.quadraticCurveTo(0, size * 0.28, -size * 0.44, 0);
        ctx.fill();
        ctx.fillStyle = fighter.weapon.bucketKind === "lava" ? "#ff934d" : "#dbf7ff";
        ctx.fillRect(size * 0.42, -size * 0.28, size * 0.22, size * 0.22);
      } else {
        ctx.fillStyle = (meta && meta.color) || "#dbe7ff";
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#101821";
        ctx.font = `bold ${Math.max(12, Math.round(size * 0.22))}px Consolas, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((meta && meta.badge) || "??", 0, 1);
      }
      ctx.restore();
    }

    drawBottomSide(ctx, fighter, x, align) {
      ctx.save();
      const statusText = fighter.statusList.map((key) => TEXT.statuses[key] || key).join(" | ");
      const panelWidth = 380;
      const panelHeight = statusText ? 72 : 54;
      const panelX = align === "left" ? 12 : WIDTH - panelWidth - 12;
      const panelY = HEIGHT - panelHeight - 72;

      ctx.fillStyle = "rgba(4, 8, 16, 0.94)";
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 2;
      ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

      const textX = align === "left" ? panelX + 18 : panelX + panelWidth - 18;
      ctx.textAlign = align;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 6;
      ctx.font = "bold 24px Consolas, monospace";
      ctx.fillText(`${fighter.side === "left" ? TEXT.hpLeft : TEXT.hpRight}: ${Math.ceil(fighter.hp)}`, textX, panelY + 11);

      ctx.fillStyle = statusText ? "#c2d5f5" : "#7ec3ff";
      ctx.shadowBlur = 4;
      ctx.font = "bold 17px Consolas, monospace";
      ctx.fillText(statusText || TEXT.ready, textX, panelY + 42);
      ctx.restore();
    }

    drawOverlayText(ctx) {
      if (this.mode === MODES.COUNTDOWN) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px Consolas, monospace";
        if (this.countdown > 3) {
          ctx.fillText(TEXT.ready, WIDTH / 2, HEIGHT / 2 - 18);
        } else {
          const value = Math.ceil(this.countdown);
          const text = value > 0 ? String(value) : TEXT.fight;
          ctx.fillText(text, WIDTH / 2, HEIGHT / 2 - 18);
        }
        ctx.restore();
      }

      if (this.mode === MODES.RESULT) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffd978";
        ctx.font = "bold 36px Consolas, monospace";
        const label = this.result.winner ? `${TEXT.winner}: ${this.result.winner.name}` : TEXT.draw;
        ctx.fillText(label, WIDTH / 2, 92);
        ctx.restore();
      }

      if (this.mode === MODES.TOURNAMENT_BREAK && this.tournament) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffd978";
        ctx.font = "bold 28px Consolas, monospace";
        ctx.fillText(this.tournament.breakMessage || "Tournament break", WIDTH / 2, 84);
        this.drawTournamentBreakScene(ctx);
        ctx.fillStyle = "#dfe8ff";
        ctx.font = "bold 18px Consolas, monospace";
        ctx.fillText(`${this.tournamentBreakCountdownText()} ${Math.max(0, this.tournament.breakTimer).toFixed(1)}s`, WIDTH / 2, 126);
        ctx.restore();
      }
    }

    drawScreenFx(ctx) {
      ctx.save();
      const vignette = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 120, WIDTH / 2, HEIGHT / 2, 420);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.44)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (this.impactFlash > 0) {
        ctx.globalAlpha = this.impactFlash;
        ctx.fillStyle = this.impactFlashColor;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      ctx.globalAlpha = 0.022;
      ctx.fillStyle = "#ffffff";
      for (let index = 0; index < 120; index += 1) {
        ctx.fillRect((index * 53) % WIDTH, (index * 97) % HEIGHT, 2, 2);
      }
      ctx.restore();
    }
  }

  function boot() {
    const canvas = document.getElementById("battleCanvas");
    const ui = {
      overlay: document.getElementById("menuOverlay"),
      startButton: document.getElementById("startBattleButton"),
      menuCopy: document.getElementById("menuCopy"),
      leftSelectButton: document.getElementById("leftSelectButton"),
      rightSelectButton: document.getElementById("rightSelectButton"),
      leftWeaponBadge: document.getElementById("leftWeaponBadge"),
      leftWeaponTitle: document.getElementById("leftWeaponTitle"),
      leftWeaponCategory: document.getElementById("leftWeaponCategory"),
      rightWeaponBadge: document.getElementById("rightWeaponBadge"),
      rightWeaponTitle: document.getElementById("rightWeaponTitle"),
      rightWeaponCategory: document.getElementById("rightWeaponCategory"),
      recordBattleButton: document.getElementById("recordBattleButton"),
      downloadBattleButton: document.getElementById("downloadBattleButton"),
      randomizeBothButton: document.getElementById("randomizeBothButton"),
      runTournamentButton: document.getElementById("runTournamentButton"),
      runStressButton: document.getElementById("runStressButton"),
      runSet100Button: document.getElementById("runSet100Button"),
      downloadTournamentButton: document.getElementById("downloadTournamentButton"),
      testStatus: document.getElementById("testStatus"),
      catalogOverlay: document.getElementById("catalogOverlay"),
      catalogList: document.getElementById("catalogList"),
      catalogSideTitle: document.getElementById("catalogSideTitle"),
      catalogSearch: document.getElementById("catalogSearch"),
      catalogPreviewBadge: document.getElementById("catalogPreviewBadge"),
      catalogPreviewTitle: document.getElementById("catalogPreviewTitle"),
      catalogPreviewCategory: document.getElementById("catalogPreviewCategory"),
      catalogPreviewDescription: document.getElementById("catalogPreviewDescription"),
      catalogSelectButton: document.getElementById("catalogSelectButton"),
      catalogRandomButton: document.getElementById("catalogRandomButton"),
      catalogCloseButton: document.getElementById("catalogCloseButton"),
      tournamentOverlay: document.getElementById("tournamentOverlay"),
      tournamentCount: document.getElementById("tournamentCount"),
      tournamentApplyCountButton: document.getElementById("tournamentApplyCountButton"),
      tournamentRandomButton: document.getElementById("tournamentRandomButton"),
      tournamentCloseButton: document.getElementById("tournamentCloseButton"),
      tournamentStartButton: document.getElementById("tournamentStartButton"),
      tournamentParticipants: document.getElementById("tournamentParticipants"),
      tournamentBracket: document.getElementById("tournamentBracket"),
      tournamentStatus: document.getElementById("tournamentStatus"),
    };
    new Game(canvas, ui);
  }

  window.addEventListener("DOMContentLoaded", boot);
})();









