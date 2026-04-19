param(
  [string]$MinecraftDir = "$env:APPDATA\.minecraft",
  [string]$IndexFile = "19.json",
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$indexPath = Join-Path $MinecraftDir "assets\indexes\$IndexFile"
$objectsRoot = Join-Path $MinecraftDir "assets\objects"

if (-not (Test-Path -LiteralPath $indexPath)) {
  throw "Не найден индекс Minecraft: $indexPath"
}

if (-not (Test-Path -LiteralPath $objectsRoot)) {
  throw "Не найдена папка объектов Minecraft: $objectsRoot"
}

$indexJson = Get-Content -LiteralPath $indexPath -Raw | ConvertFrom-Json
if (-not $indexJson.objects) {
  throw "В индексе нет секции objects: $indexPath"
}

$targets = @(
  @{ Source = "minecraft/sounds/item/flintandsteel/use1.ogg"; Destination = "sounds/effects/ignite_1.ogg" },
  @{ Source = "minecraft/sounds/item/flintandsteel/use1.ogg"; Destination = "sounds/weapons/flint_and_steel.ogg" },
  @{ Source = "minecraft/sounds/item/flintandsteel/use2.ogg"; Destination = "sounds/effects/ignite_2.ogg" },
  @{ Source = "minecraft/sounds/item/flintandsteel/use3.ogg"; Destination = "sounds/effects/ignite_3.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/empty_lava1.ogg"; Destination = "sounds/effects/lava_burst_1.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/empty_lava1.ogg"; Destination = "sounds/weapons/lava_bucket.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/empty_lava2.ogg"; Destination = "sounds/effects/lava_burst_2.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/empty_lava3.ogg"; Destination = "sounds/effects/lava_burst_3.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/fill_water1.ogg"; Destination = "sounds/effects/water_splash_1.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/fill_water1.ogg"; Destination = "sounds/weapons/water_bucket.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/fill_water2.ogg"; Destination = "sounds/effects/water_splash_2.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/fill_water3.ogg"; Destination = "sounds/effects/water_splash_3.ogg" },
  @{ Source = "minecraft/sounds/entity/snowball/throw1.ogg"; Destination = "sounds/weapons/snowball.ogg" },
  @{ Source = "minecraft/sounds/entity/snowball/throw2.ogg"; Destination = "sounds/weapons/snowball_1.ogg" },
  @{ Source = "minecraft/sounds/entity/snowball/throw3.ogg"; Destination = "sounds/weapons/snowball_2.ogg" },
  @{ Source = "minecraft/sounds/entity/snowball/throw4.ogg"; Destination = "sounds/weapons/snowball_3.ogg" },
  @{ Source = "minecraft/sounds/block/glass/break1.ogg"; Destination = "sounds/effects/ice_crack_1.ogg" },
  @{ Source = "minecraft/sounds/block/glass/break2.ogg"; Destination = "sounds/effects/ice_crack_2.ogg" },
  @{ Source = "minecraft/sounds/block/glass/break3.ogg"; Destination = "sounds/effects/ice_crack_3.ogg" },
  @{ Source = "minecraft/sounds/entity/enderman/teleport1.ogg"; Destination = "sounds/effects/ender_blink_1.ogg" },
  @{ Source = "minecraft/sounds/entity/enderman/teleport2.ogg"; Destination = "sounds/effects/ender_blink_2.ogg" },
  @{ Source = "minecraft/sounds/entity/enderman/teleport3.ogg"; Destination = "sounds/effects/ender_blink_3.ogg" },
  @{ Source = "minecraft/sounds/entity/enderman/teleport4.ogg"; Destination = "sounds/effects/ender_blink_4.ogg" },
  @{ Source = "minecraft/sounds/entity/ender_pearl/throw.ogg"; Destination = "sounds/weapons/ender_pearl.ogg" },
  @{ Source = "minecraft/sounds/entity/generic/explode1.ogg"; Destination = "sounds/impact/explosion_1.ogg" },
  @{ Source = "minecraft/sounds/entity/generic/explode1.ogg"; Destination = "sounds/weapons/tnt.ogg" },
  @{ Source = "minecraft/sounds/entity/generic/explode2.ogg"; Destination = "sounds/impact/explosion_2.ogg" },
  @{ Source = "minecraft/sounds/entity/generic/explode3.ogg"; Destination = "sounds/impact/explosion_3.ogg" },
  @{ Source = "minecraft/sounds/entity/generic/explode4.ogg"; Destination = "sounds/impact/explosion_4.ogg" },
  @{ Source = "minecraft/sounds/block/respawn_anchor/set_spawn.ogg"; Destination = "sounds/weapons/respawn_anchor.ogg" },
  @{ Source = "minecraft/sounds/item/trident/throw1.ogg"; Destination = "sounds/weapons/trident.ogg" },
  @{ Source = "minecraft/sounds/item/trident/throw2.ogg"; Destination = "sounds/weapons/trident_1.ogg" },
  @{ Source = "minecraft/sounds/item/trident/throw3.ogg"; Destination = "sounds/weapons/trident_2.ogg" },
  @{ Source = "minecraft/sounds/entity/fishing_bobber/throw1.ogg"; Destination = "sounds/weapons/fishing_rod.ogg" },
  @{ Source = "minecraft/sounds/entity/fishing_bobber/throw2.ogg"; Destination = "sounds/weapons/fishing_rod_1.ogg" },
  @{ Source = "minecraft/sounds/entity/fishing_bobber/throw3.ogg"; Destination = "sounds/weapons/fishing_rod_2.ogg" },
  @{ Source = "minecraft/sounds/entity/fishing_bobber/throw4.ogg"; Destination = "sounds/weapons/fishing_rod_3.ogg" },
  @{ Source = "minecraft/sounds/entity/fishing_bobber/throw5.ogg"; Destination = "sounds/weapons/fishing_rod_4.ogg" },
  @{ Source = "minecraft/sounds/entity/experience_bottle/throw.ogg"; Destination = "sounds/weapons/experience_bottle.ogg" },
  @{ Source = "minecraft/sounds/item/bone_meal/use.ogg"; Destination = "sounds/weapons/bone_meal.ogg" },
  @{ Source = "minecraft/sounds/item/bone_meal/use1.ogg"; Destination = "sounds/weapons/bone_meal_1.ogg" },
  @{ Source = "minecraft/sounds/item/bone_meal/use2.ogg"; Destination = "sounds/weapons/bone_meal_2.ogg" },
  @{ Source = "minecraft/sounds/item/bone_meal/use3.ogg"; Destination = "sounds/weapons/bone_meal_3.ogg" },
  @{ Source = "minecraft/sounds/item/bone_meal/use4.ogg"; Destination = "sounds/weapons/bone_meal_4.ogg" },
  @{ Source = "minecraft/sounds/item/totem/use.ogg"; Destination = "sounds/weapons/totem_of_undying.ogg" },
  @{ Source = "minecraft/sounds/item/armor/equip_elytra1.ogg"; Destination = "sounds/weapons/elytra.ogg" },
  @{ Source = "minecraft/sounds/block/rail/place4.ogg"; Destination = "sounds/weapons/rail_3.ogg" },
  @{ Source = "minecraft/sounds/block/note_block/harp.ogg"; Destination = "sounds/weapons/note_block.ogg" },
  @{ Source = "minecraft/sounds/entity/bee/loop.ogg"; Destination = "sounds/effects/nature_buzz_1.ogg" },
  @{ Source = "minecraft/sounds/entity/boat/paddle_land1.ogg"; Destination = "sounds/weapons/boat.ogg" },
  @{ Source = "minecraft/sounds/entity/boat/paddle_land2.ogg"; Destination = "sounds/weapons/boat_1.ogg" },
  @{ Source = "minecraft/sounds/entity/boat/paddle_land3.ogg"; Destination = "sounds/weapons/boat_2.ogg" },
  @{ Source = "minecraft/sounds/entity/boat/paddle_land4.ogg"; Destination = "sounds/weapons/boat_3.ogg" },
  @{ Source = "minecraft/sounds/entity/boat/paddle_land5.ogg"; Destination = "sounds/weapons/boat_4.ogg" },
  @{ Source = "minecraft/sounds/block/rail/place1.ogg"; Destination = "sounds/weapons/rail.ogg" },
  @{ Source = "minecraft/sounds/block/rail/place2.ogg"; Destination = "sounds/weapons/rail_1.ogg" },
  @{ Source = "minecraft/sounds/block/rail/place3.ogg"; Destination = "sounds/weapons/rail_2.ogg" },
  @{ Source = "minecraft/sounds/block/rail/place4.ogg"; Destination = "sounds/weapons/rail_3.ogg" },
  @{ Source = "minecraft/sounds/entity/blaze/shoot.ogg"; Destination = "sounds/weapons/blaze_shoot.ogg" },
  @{ Source = "minecraft/sounds/item/firecharge/use.ogg"; Destination = "sounds/weapons/fire_charge.ogg" },
  @{ Source = "minecraft/sounds/entity/ghast/shoot.ogg"; Destination = "sounds/weapons/ghast_shoot.ogg" },
  @{ Source = "minecraft/sounds/entity/magma_cube/jump1.ogg"; Destination = "sounds/weapons/magma_jump_1.ogg" },
  @{ Source = "minecraft/sounds/entity/magma_cube/jump2.ogg"; Destination = "sounds/weapons/magma_jump_2.ogg" },
  @{ Source = "minecraft/sounds/entity/guardian/attack.ogg"; Destination = "sounds/weapons/guardian_attack.ogg" },
  @{ Source = "minecraft/sounds/entity/guardian/hurt.ogg"; Destination = "sounds/weapons/guardian_hurt.ogg" },
  @{ Source = "minecraft/sounds/block/snow/break1.ogg"; Destination = "sounds/effects/snow_break_1.ogg" },
  @{ Source = "minecraft/sounds/block/snow/break2.ogg"; Destination = "sounds/effects/snow_break_2.ogg" },
  @{ Source = "minecraft/sounds/entity/arrow/shoot.ogg"; Destination = "sounds/weapons/arrow_shoot.ogg" },
  @{ Source = "minecraft/sounds/item/crossbow/shoot1.ogg"; Destination = "sounds/weapons/crossbow_shoot_1.ogg" },
  @{ Source = "minecraft/sounds/item/crossbow/shoot2.ogg"; Destination = "sounds/weapons/crossbow_shoot_2.ogg" },
  @{ Source = "minecraft/sounds/entity/egg/throw.ogg"; Destination = "sounds/weapons/egg_throw.ogg" },
  @{ Source = "minecraft/sounds/entity/potion/throw.ogg"; Destination = "sounds/weapons/potion_throw.ogg" },
  @{ Source = "minecraft/sounds/entity/shulker/shoot.ogg"; Destination = "sounds/weapons/shulker_shoot.ogg" },
  @{ Source = "minecraft/sounds/entity/shulker_bullet/hit.ogg"; Destination = "sounds/impact/shulker_hit.ogg" },
  @{ Source = "minecraft/sounds/block/enchantment_table/use.ogg"; Destination = "sounds/weapons/enchantment.ogg" },
  @{ Source = "minecraft/sounds/block/beacon/activate.ogg"; Destination = "sounds/weapons/beacon_activate.ogg" },
  @{ Source = "minecraft/sounds/entity/ender_dragon/growl1.ogg"; Destination = "sounds/weapons/dragon_growl_1.ogg" },
  @{ Source = "minecraft/sounds/entity/ender_dragon/growl2.ogg"; Destination = "sounds/weapons/dragon_growl_2.ogg" },
  @{ Source = "minecraft/sounds/entity/wither/ambient.ogg"; Destination = "sounds/weapons/wither_ambient.ogg" },
  @{ Source = "minecraft/sounds/entity/evoker/prepare_attack.ogg"; Destination = "sounds/weapons/evoker_attack.ogg" },
  @{ Source = "minecraft/sounds/entity/evoker/prepare_summon.ogg"; Destination = "sounds/weapons/evoker_summon.ogg" },
  @{ Source = "minecraft/sounds/entity/creeper/primed.ogg"; Destination = "sounds/weapons/creeper_primed.ogg" },
  @{ Source = "minecraft/sounds/entity/tnt/primed.ogg"; Destination = "sounds/weapons/tnt_primed.ogg" },
  @{ Source = "minecraft/sounds/block/anvil/break.ogg"; Destination = "sounds/impact/anvil_break.ogg" },
  @{ Source = "minecraft/sounds/entity/lightning_bolt/thunder1.ogg"; Destination = "sounds/effects/thunder_extra_1.ogg" },
  @{ Source = "minecraft/sounds/entity/lightning_bolt/thunder2.ogg"; Destination = "sounds/effects/thunder_extra_2.ogg" },
  @{ Source = "minecraft/sounds/entity/lightning_bolt/impact1.ogg"; Destination = "sounds/impact/lightning_impact_1.ogg" },
  @{ Source = "minecraft/sounds/entity/lightning_bolt/impact2.ogg"; Destination = "sounds/impact/lightning_impact_2.ogg" },
  @{ Source = "minecraft/sounds/entity/iron_golem/attack1.ogg"; Destination = "sounds/weapons/iron_golem_attack_1.ogg" },
  @{ Source = "minecraft/sounds/entity/iron_golem/attack2.ogg"; Destination = "sounds/weapons/iron_golem_attack_2.ogg" },
  @{ Source = "minecraft/sounds/entity/player/attack/crit1.ogg"; Destination = "sounds/impact/crit_1.ogg" },
  @{ Source = "minecraft/sounds/entity/player/attack/crit2.ogg"; Destination = "sounds/impact/crit_2.ogg" },
  @{ Source = "minecraft/sounds/entity/player/attack/knockback1.ogg"; Destination = "sounds/impact/knockback_1.ogg" },
  @{ Source = "minecraft/sounds/entity/player/attack/knockback2.ogg"; Destination = "sounds/impact/knockback_2.ogg" },
  @{ Source = "minecraft/sounds/entity/slime/jump1.ogg"; Destination = "sounds/weapons/slime_jump_1.ogg" },
  @{ Source = "minecraft/sounds/entity/slime/jump2.ogg"; Destination = "sounds/weapons/slime_jump_2.ogg" },
  @{ Source = "minecraft/sounds/entity/spider/ambient.ogg"; Destination = "sounds/weapons/spider_ambient.ogg" }
)

foreach ($target in $targets) {
  $entry = $indexJson.objects.PSObject.Properties[$target.Source]
  if (-not $entry) {
    Write-Warning "Не найден звук в индексе: $($target.Source)"
    continue
  }

  $hash = $entry.Value.hash
  if (-not $hash) {
    Write-Warning "У записи нет hash: $($target.Source)"
    continue
  }

  $subdir = $hash.Substring(0, 2)
  $sourceFile = Join-Path $objectsRoot (Join-Path $subdir $hash)
  if (-not (Test-Path -LiteralPath $sourceFile)) {
    Write-Warning "Не найден объект по хешу: $sourceFile"
    continue
  }

  $destinationFile = Join-Path $ProjectRoot $target.Destination
  $destinationDir = Split-Path -Parent $destinationFile
  if (-not (Test-Path -LiteralPath $destinationDir)) {
    New-Item -ItemType Directory -Path $destinationDir | Out-Null
  }

  Copy-Item -LiteralPath $sourceFile -Destination $destinationFile -Force
  Write-Host "Импортирован $($target.Source) -> $($target.Destination)"
}
