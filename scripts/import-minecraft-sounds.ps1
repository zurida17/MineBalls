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
  @{ Source = "minecraft/sounds/item/bucket/empty_lava1.ogg"; Destination = "sounds/effects/lava_burst_1.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/empty_lava1.ogg"; Destination = "sounds/weapons/lava_bucket.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/fill_water1.ogg"; Destination = "sounds/effects/water_splash_1.ogg" },
  @{ Source = "minecraft/sounds/item/bucket/fill_water1.ogg"; Destination = "sounds/weapons/water_bucket.ogg" },
  @{ Source = "minecraft/sounds/entity/snowball/throw.ogg"; Destination = "sounds/weapons/snowball.ogg" },
  @{ Source = "minecraft/sounds/block/glass/break1.ogg"; Destination = "sounds/effects/ice_crack_1.ogg" },
  @{ Source = "minecraft/sounds/entity/enderman/teleport1.ogg"; Destination = "sounds/effects/ender_blink_1.ogg" },
  @{ Source = "minecraft/sounds/entity/ender_pearl/throw.ogg"; Destination = "sounds/weapons/ender_pearl.ogg" },
  @{ Source = "minecraft/sounds/entity/generic/explode1.ogg"; Destination = "sounds/impact/explosion_1.ogg" },
  @{ Source = "minecraft/sounds/entity/generic/explode1.ogg"; Destination = "sounds/weapons/tnt.ogg" },
  @{ Source = "minecraft/sounds/block/respawn_anchor/set_spawn.ogg"; Destination = "sounds/weapons/respawn_anchor.ogg" },
  @{ Source = "minecraft/sounds/item/trident/throw1.ogg"; Destination = "sounds/weapons/trident.ogg" },
  @{ Source = "minecraft/sounds/entity/fishing_bobber/throw1.ogg"; Destination = "sounds/weapons/fishing_rod.ogg" },
  @{ Source = "minecraft/sounds/entity/experience_bottle/throw.ogg"; Destination = "sounds/weapons/experience_bottle.ogg" },
  @{ Source = "minecraft/sounds/item/totem/use.ogg"; Destination = "sounds/weapons/totem_of_undying.ogg" },
  @{ Source = "minecraft/sounds/item/armor/equip_elytra1.ogg"; Destination = "sounds/weapons/elytra.ogg" },
  @{ Source = "minecraft/sounds/block/note_block/harp.ogg"; Destination = "sounds/weapons/note_block.ogg" },
  @{ Source = "minecraft/sounds/entity/bee/loop.ogg"; Destination = "sounds/effects/nature_buzz_1.ogg" }
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
