Сюда можно класть свои звуки для игры.

Папки:
- `sounds/ui/`
- `sounds/weapons/`
- `sounds/effects/`
- `sounds/impact/`

Поддерживаемые форматы:
- `.ogg`
- `.wav`
- `.mp3`

Игра сначала пытается загрузить внешний файл, а если он не найден, использует встроенный процедурный звук.
Если рядом лежат варианты с суффиксами вроде `_1`, `_2`, `_3`, игра автоматически чередует их и звук меньше повторяется.

Что уже добавлено в проект:
- отдельные варианты для горения: `burn_*`, `ignite_*`
- отдельные варианты для лавы: `lava_burst_*`, `lava_sizzle_*`
- отдельные варианты для воды: `water_splash_*`
- отдельные варианты для льда: `ice_crack_*`
- отдельные варианты для эндер-эффектов: `ender_blink_*`
- отдельные варианты для магии: `magic_pop_*`
- отдельные варианты для природы: `nature_buzz_*`
- отдельные удары по металлу: `metal_clang_*`
- отдельные удары по дереву: `wood_thud_*`
- отдельные звуки слизи: `slime_splat_*`
- отдельные взрывы: `explosion_*`

Примеры имён, которые можно подменять без правок кода:

UI:
- `sounds/ui/click.ogg`
- `sounds/ui/select.ogg`
- `sounds/ui/countdown.ogg`
- `sounds/ui/round_start.ogg`
- `sounds/ui/victory.ogg`
- `sounds/ui/death.ogg`

Оружие:
- `sounds/weapons/rail.ogg`
- `sounds/weapons/hopper_minecart.ogg`
- `sounds/weapons/boat.ogg`
- `sounds/weapons/fishing_rod.ogg`
- `sounds/weapons/trident.ogg`
- `sounds/weapons/water_bucket.ogg`
- `sounds/weapons/lava_bucket.ogg`
- `sounds/weapons/snowball.ogg`
- `sounds/weapons/flint_and_steel.ogg`
- `sounds/weapons/experience_bottle.ogg`
- `sounds/weapons/totem_of_undying.ogg`
- `sounds/weapons/tnt.ogg`
- `sounds/weapons/slime.ogg`
- `sounds/weapons/observer.ogg`
- `sounds/weapons/beehive.ogg`
- `sounds/weapons/note_block.ogg`
- `sounds/weapons/shulker_box.ogg`
- `sounds/weapons/respawn_anchor.ogg`
- `sounds/weapons/ender_pearl.ogg`
- `sounds/weapons/crying_obsidian.ogg`
- `sounds/weapons/blaze_rod.ogg`
- `sounds/weapons/rotten_flesh.ogg`
- `sounds/weapons/jack_o_lantern.ogg`
- `sounds/weapons/bone_meal.ogg`
- `sounds/weapons/written_book.ogg`
- `sounds/weapons/elytra.ogg`
- `sounds/weapons/golden_apple.ogg`
- `sounds/weapons/invisibility.ogg`
- `sounds/weapons/gravity.ogg`
- `sounds/weapons/turtle_scute.ogg`

Эффекты и попадания:
- `sounds/effects/fire.ogg`
- `sounds/effects/burn_1.ogg`
- `sounds/effects/burn_2.ogg`
- `sounds/effects/ignite_1.ogg`
- `sounds/effects/ignite_2.ogg`
- `sounds/effects/lava.ogg`
- `sounds/effects/lava_burst_1.ogg`
- `sounds/effects/lava_burst_2.ogg`
- `sounds/effects/lava_sizzle_1.ogg`
- `sounds/effects/lava_sizzle_2.ogg`
- `sounds/effects/water.ogg`
- `sounds/effects/water_splash_1.ogg`
- `sounds/effects/water_splash_2.ogg`
- `sounds/effects/water_splash_3.ogg`
- `sounds/effects/ice.ogg`
- `sounds/effects/ice_crack_1.ogg`
- `sounds/effects/ice_crack_2.ogg`
- `sounds/effects/ice_crack_3.ogg`
- `sounds/effects/teleport.ogg`
- `sounds/effects/ender_blink_1.ogg`
- `sounds/effects/ender_blink_2.ogg`
- `sounds/effects/ender_blink_3.ogg`
- `sounds/effects/magic.ogg`
- `sounds/effects/magic_pop_1.ogg`
- `sounds/effects/magic_pop_2.ogg`
- `sounds/effects/magic_pop_3.ogg`
- `sounds/effects/nature.ogg`
- `sounds/effects/nature_buzz_1.ogg`
- `sounds/effects/nature_buzz_2.ogg`
- `sounds/effects/nature_buzz_3.ogg`
- `sounds/effects/metal.ogg`
- `sounds/effects/thunder_1.ogg`
- `sounds/effects/thunder_2.ogg`
- `sounds/effects/thunder_3.ogg`
- `sounds/effects/book_laser_1.ogg`
- `sounds/effects/book_lightning_1.ogg`
- `sounds/effects/book_quake_1.ogg`
- `sounds/impact/hit_1.ogg`
- `sounds/impact/metal_clang_1.ogg`
- `sounds/impact/metal_clang_2.ogg`
- `sounds/impact/metal_clang_3.ogg`
- `sounds/impact/wood_thud_1.ogg`
- `sounds/impact/wood_thud_2.ogg`
- `sounds/impact/slime_splat_1.ogg`
- `sounds/impact/slime_splat_2.ogg`
- `sounds/impact/explosion_1.ogg`
- `sounds/impact/explosion_2.ogg`
- `sounds/impact/explosion_3.ogg`

Автоматический импорт из `.minecraft`:
- если у вас есть локальная папка `%AppData%\\.minecraft`, можно запустить скрипт `scripts/import-minecraft-sounds.ps1`
- он читает `assets/indexes/<версия>.json`, находит нужные хеши и копирует файлы из `assets/objects/` сразу в папку проекта

Пример запуска:
- `powershell -ExecutionPolicy Bypass -File .\\scripts\\import-minecraft-sounds.ps1 -IndexFile 19.json`
- `powershell -ExecutionPolicy Bypass -File .\\scripts\\import-minecraft-sounds.ps1 -MinecraftDir \"$env:APPDATA\\.minecraft\" -IndexFile 1.21.json`

Ручное извлечение, если хотите всё сделать сами:
1. Нажмите `Win + R`
2. Вставьте `%AppData%\\.minecraft`
3. Откройте `assets/indexes/` и выберите `.json` нужной версии
4. Найдите путь нужного звука, например `minecraft/sounds/random/explode.ogg`
5. Скопируйте хеш из JSON
6. Откройте `assets/objects/<первые две буквы хеша>/`
7. Скопируйте файл с полным именем хеша
8. Переименуйте его в нужное имя с расширением `.ogg` и положите в одну из папок `sounds/`
