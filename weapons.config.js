(function () {
  "use strict";

  // Конфигурация баланса и оружия.
  // Изменяй значения в секции weapons.
  // Для изменения значений id смотри в конфигурации в app.js.
  window.GAME_WEAPON_CONFIG = {
  "balance": {
    "damageScale": 1.45,
    "speedScale": 1.75,
    "adrenalineMultiplier": 1.85,
    "adrenalineDurationSec": 0.35,
    "cooldownScale": 0.55,
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
      "wagonDamageMin": 8,
      "wagonDamageMax": 9,
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
      "title": "Рельсы",
      "description": "Прокладывает путь после ударов о стены и выпускает вагонетки."
    },
    "boat": {
      "id": "boat",
      "title": "Лодка + Вёдра",
      "description": "Бронированный корпус с чередованием ледяных и лавовых вёдер."
    }
  },
  "weapons": [
    {
      "id": "rail",
      "title": "Рельсы",
      "description": "Прокладывает путь после ударов о стены и выпускает вагонетки.",
      "badge": "RL",
      "color": "#f7d98d",
      "category": "Наследие",
      "speedMin": 320.0,
      "speedMax": 380.0
    },
    {
      "id": "boat",
      "title": "Лодка",
      "description": "Бронированный корпус с чередованием ледяных и лавовых вёдер.",
      "badge": "BT",
      "color": "#8fd6ff",
      "category": "Наследие",
      "speedMin": 280.0,
      "speedMax": 340.0
    },
    {
      "id": "pacifist",
      "title": "Без оружия",
      "description": "Пассивный шар: не атакует и не наносит урон.",
      "badge": "NW",
      "color": "#b9c2d9",
      "category": "Ребаланс",
      "speedMin": 300.0,
      "speedMax": 360.0
    },
    {
      "id": "fishingRod",
      "title": "Удочка",
      "description": "Цепляет врага леской или подтягивает владельца к стене.",
      "badge": "FR",
      "color": "#9fd0ff",
      "category": "Инструменты"
    },
    {
      "id": "loyaltyTrident",
      "title": "Трезубец Лояльности",
      "description": "Тяжёлый бросок, который всегда возвращается к владельцу.",
      "badge": "TR",
      "color": "#6de4ff",
      "category": "Инструменты"
    },
    {
      "id": "waterBucket",
      "title": "Ведро воды",
      "description": "Заливает арену, тормозит врагов и тушит огонь.",
      "badge": "WB",
      "color": "#6fb8ff",
      "category": "Инструменты"
    },
    {
      "id": "lavaBucket",
      "title": "Ведро лавы",
      "description": "Создаёт раскалённую зону и карает за ближнее давление.",
      "badge": "LB",
      "color": "#ff8b54",
      "category": "Инструменты"
    },
    {
      "id": "snowball",
      "title": "Снежки",
      "description": "Очереди замораживающих выстрелов, которые сбивают комбо.",
      "badge": "SN",
      "color": "#dff8ff",
      "category": "Инструменты"
    },
    {
      "id": "flintSteel",
      "title": "Огниво",
      "description": "Расползание огня по полу и выжигание маршрутов.",
      "badge": "FS",
      "color": "#ffb46e",
      "category": "Инструменты"
    },
    {
      "id": "expBottle",
      "title": "Пузырёк опыта",
      "description": "Разбрасывает сферы опыта для зарядки зачарования.",
      "badge": "XP",
      "color": "#9c86ff",
      "category": "Алхимия"
    },
    {
      "id": "totem",
      "title": "Тотем",
      "description": "Одна экстренная вторая жизнь с окном контратаки.",
      "badge": "TT",
      "color": "#9ff39f",
      "category": "Магия"
    },
    {
      "id": "hopperMinecart",
      "title": "Вагонетка с воронкой",
      "description": "Крадёт здоровье, баффы и заряд у врага рядом.",
      "badge": "HC",
      "color": "#c9c2a9",
      "category": "Механизмы"
    },
    {
      "id": "tnt",
      "title": "ТНТ",
      "description": "Ставит взрывчатку с таймером и чистит арену.",
      "badge": "TN",
      "color": "#ff7878",
      "category": "Механизмы"
    },
    {
      "id": "slimePiston",
      "title": "Слизневый поршень",
      "description": "Толкает врага липким поршнем или даёт отскок владельцу.",
      "badge": "SP",
      "color": "#7cff99",
      "category": "Механизмы"
    },
    {
      "id": "observer",
      "title": "Наблюдатель",
      "description": "Считывает действия врага и бьёт импульсами срыва.",
      "badge": "OB",
      "color": "#b7c7ff",
      "category": "Механизмы"
    },
    {
      "id": "beehive",
      "title": "Улей",
      "description": "Призывает пчёл, медовые зоны и паникующий рой.",
      "badge": "BH",
      "color": "#ffd45c",
      "category": "Механизмы"
    },
    {
      "id": "noteBlock",
      "title": "Нотный блок",
      "description": "Удары о стены рождают волны музыки и ломают контроль.",
      "badge": "NB",
      "color": "#ffc18a",
      "category": "Механизмы"
    },
    {
      "id": "shulkerBox",
      "title": "Шалкеровый ящик",
      "description": "Собирает снаряды и телепортирует владельца от тяжёлых ударов.",
      "badge": "SB",
      "color": "#d3a7ff",
      "category": "Механизмы"
    },
    {
      "id": "respawnAnchor",
      "title": "Якорь возрождения",
      "description": "Ставит точку возврата и спасает резким скачком.",
      "badge": "RA",
      "color": "#b978ff",
      "category": "Механизмы"
    },
    {
      "id": "enderPearl",
      "title": "Жемчуг Края",
      "description": "Телепортирует сквозь опасность и за спину врага.",
      "badge": "EP",
      "color": "#9f7cff",
      "category": "Измерения"
    },
    {
      "id": "cryingObsidian",
      "title": "Плачущий обсидиан",
      "description": "Стелет лужи против рычков и искривляет арену порталами.",
      "badge": "CO",
      "color": "#7e5dff",
      "category": "Измерения"
    },
    {
      "id": "blazeRod",
      "title": "Огненный стержень",
      "description": "Тройные файерболлы и возвращающееся огненное кольцо.",
      "badge": "BR",
      "color": "#ffbd66",
      "category": "Измерения"
    },
    {
      "id": "rottenFlesh",
      "title": "Гнилая плоть",
      "description": "Приводит зомби на арену и заражает поле боя.",
      "badge": "RF",
      "color": "#9dba76",
      "category": "Магия"
    },
    {
      "id": "jackOLantern",
      "title": "Светильник Джека",
      "description": "Ставит световые ловушки и пугает врага вспышками.",
      "badge": "JL",
      "color": "#ffb657",
      "category": "Магия"
    },
    {
      "id": "boneMeal",
      "title": "Костная мука",
      "description": "Выращивает случайный рельеф и опутывает цель.",
      "badge": "BM",
      "color": "#f3f0df",
      "category": "Магия"
    },
    {
      "id": "bookQuill",
      "title": "Книга с пером",
      "description": "Запоминает вражеские умения и отвечает эхом.",
      "badge": "BQ",
      "color": "#ffdca8",
      "category": "Магия"
    },
    {
      "id": "elytra",
      "title": "Элитры",
      "description": "Преобразуют скорость в планирование и пикирующие тараны.",
      "badge": "EL",
      "color": "#dbe7f9",
      "category": "Измерения"
    },
    {
      "id": "goldenApple",
      "title": "Золотое яблоко",
      "description": "Даёт регенерацию в момент давления.",
      "badge": "GA",
      "color": "#ffd757",
      "category": "Алхимия"
    },
    {
      "id": "invisPotion",
      "title": "Невидимость",
      "description": "Позволяет скрываться, пройти сквозь врага и сменить позицию.",
      "badge": "IV",
      "color": "#d6c9ff",
      "category": "Алхимия"
    },
    {
      "id": "gravityPotion",
      "title": "Зелье гравитации",
      "description": "Поднимает врага в воздух или облегчает владельца.",
      "badge": "GP",
      "color": "#b8d5ff",
      "category": "Алхимия"
    },
    {
      "id": "turtlePotion",
      "title": "Черепашье зелье",
      "description": "Сильно режет входящий урон и даёт панцирный рычок.",
      "badge": "TP",
      "color": "#7be2b2",
      "category": "Алхимия"
    }
  ]
};
})();
