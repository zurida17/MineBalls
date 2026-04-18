Сюда можно подкидывать свои спрайты для игры.

Структура папок:
- sprites/balls/
- sprites/weapons/
- sprites/hud/
- sprites/projectiles/

Поддерживаемые файлы:

Шары:
- sprites/balls/left.png
- sprites/balls/left.webp
- sprites/balls/right.png
- sprites/balls/right.webp

Оружие:
- sprites/weapons/rail_attachment.png
- sprites/weapons/rail_attachment.webp
- sprites/weapons/boat_hull.png
- sprites/weapons/boat_hull.webp
- sprites/weapons/bucket_ice.png
- sprites/weapons/bucket_ice.webp
- sprites/weapons/bucket_lava.png
- sprites/weapons/bucket_lava.webp
- sprites/weapons/wagon.png
- sprites/weapons/wagon.webp

Иконки HUD:
- sprites/hud/rail_icon.png
- sprites/hud/rail_icon.webp
- sprites/hud/boat_icon.png
- sprites/hud/boat_icon.webp

Снаряды:
- sprites/projectiles/ice.png
- sprites/projectiles/ice.webp
- sprites/projectiles/lava.png
- sprites/projectiles/lava.webp

Как это работает:
- если файл найден, игра рисует его;
- если файла нет, игра использует встроенную форму;
- фон отдельно меняется через папку backgrounds.

Где менять палитру без спрайтов:
- открой app.js;
- найди блок CUSTOM_ASSETS в начале файла;
- palette отвечает за общие цвета;
- rail отвечает за рельсы;
- wagon отвечает за вагонетки.
