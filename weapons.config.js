(function () {
  "use strict";

  // Конфигурация баланса и оружия.
  // Изменяй значения в секции weapons.
  // Для изменения значений id смотри в конфигурации в app.js.
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
      "balanceBias": 0.18,
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
      "balanceBias": 0.00,
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
      "balanceBias": 0.07,
      "category": "Инструменты"
    },
    {
      "id": "loyaltyTrident",
      "title": "Трезубец Лояльности",
      "description": "Тяжёлый бросок, который всегда возвращается к владельцу.",
      "badge": "TR",
      "color": "#6de4ff",
      "balanceBias": 0.02,
      "category": "Инструменты"
    },
    {
      "id": "waterBucket",
      "title": "Ведро воды",
      "description": "Заливает арену, тормозит врагов и тушит огонь.",
      "badge": "WB",
      "color": "#6fb8ff",
      "balanceBias": -0.05,
      "category": "Инструменты"
    },
    {
      "id": "lavaBucket",
      "title": "Ведро лавы",
      "description": "Создаёт раскалённую зону и карает за ближнее давление.",
      "badge": "LB",
      "color": "#ff8b54",
      "balanceBias": 0.08,
      "category": "Инструменты"
    },
    {
      "id": "snowball",
      "title": "Снежки",
      "description": "Очереди замораживающих выстрелов, которые сбивают комбо.",
      "badge": "SN",
      "color": "#dff8ff",
      "balanceBias": 0.10,
      "category": "Инструменты"
    },
    {
      "id": "flintSteel",
      "title": "Огниво",
      "description": "Расползание огня по полу и выжигание маршрутов.",
      "badge": "FS",
      "color": "#ffb46e",
      "balanceBias": -0.60,
      "category": "Инструменты",
      "damageMultiplier": 8.0
    },
    {
      "id": "expBottle",
      "title": "Пузырёк опыта",
      "description": "Разбрасывает сферы опыта для зарядки зачарования.",
      "badge": "XP",
      "color": "#9c86ff",
      "balanceBias": -0.08,
      "category": "Алхимия",
      "damageMultiplier": 0.35
    },
    {
      "id": "totem",
      "title": "Тотем",
      "description": "Одна экстренная вторая жизнь с окном контратаки.",
      "badge": "TT",
      "color": "#9ff39f",
      "balanceBias": 0.01,
      "category": "Магия"
    },
    {
      "id": "hopperMinecart",
      "title": "Вагонетка с воронкой",
      "description": "Крадёт здоровье, баффы и заряд у врага рядом.",
      "badge": "HC",
      "color": "#c9c2a9",
      "balanceBias": -0.02,
      "category": "Механизмы"
    },
    {
      "id": "tnt",
      "title": "ТНТ",
      "description": "Ставит взрывчатку с таймером и чистит арену.",
      "badge": "TN",
      "color": "#ff7878",
      "balanceBias": -0.08,
      "category": "Механизмы"
    },
    {
      "id": "slimePiston",
      "title": "Слизневый поршень",
      "description": "Толкает врага липким поршнем или даёт отскок владельцу.",
      "badge": "SP",
      "color": "#7cff99",
      "balanceBias": 0.00,
      "category": "Механизмы"
    },
    {
      "id": "observer",
      "title": "Наблюдатель",
      "description": "Считывает действия врага и бьёт импульсами срыва.",
      "badge": "OB",
      "color": "#b7c7ff",
      "balanceBias": 0.08,
      "category": "Механизмы"
    },
    {
      "id": "beehive",
      "title": "Улей",
      "description": "Призывает пчёл, медовые зоны и паникующий рой.",
      "badge": "BH",
      "color": "#ffd45c",
      "balanceBias": 0.00,
      "category": "Механизмы"
    },
    {
      "id": "noteBlock",
      "title": "Нотный блок",
      "description": "Удары о стены рождают волны музыки и ломают контроль.",
      "badge": "NB",
      "color": "#ffc18a",
      "balanceBias": 0.12,
      "category": "Механизмы"
    },
    {
      "id": "shulkerBox",
      "title": "Шалкеровый ящик",
      "description": "Собирает снаряды и телепортирует владельца от тяжёлых ударов.",
      "badge": "SB",
      "color": "#d3a7ff",
      "balanceBias": -0.50,
      "category": "Механизмы",
      "damageMultiplier": 0.3
    },
    {
      "id": "respawnAnchor",
      "title": "Якорь возрождения",
      "description": "Ставит точку возврата и спасает резким скачком.",
      "badge": "RA",
      "color": "#b978ff",
      "balanceBias": 0.14,
      "category": "Механизмы"
    },
    {
      "id": "enderPearl",
      "title": "Жемчуг Края",
      "description": "Телепортирует сквозь опасность и за спину врага.",
      "badge": "EP",
      "color": "#9f7cff",
      "balanceBias": -0.03,
      "category": "Измерения"
    },
    {
      "id": "cryingObsidian",
      "title": "Плачущий обсидиан",
      "description": "Стелет лужи против рычков и искривляет арену порталами.",
      "badge": "CO",
      "color": "#7e5dff",
      "balanceBias": -0.18,
      "category": "Измерения",
      "damageMultiplier": 0.35
    },
    {
      "id": "blazeRod",
      "title": "Огненный стержень",
      "description": "Тройные файерболлы и возвращающееся огненное кольцо.",
      "badge": "BR",
      "color": "#ffbd66",
      "balanceBias": -0.38,
      "category": "Измерения",
      "damageMultiplier": 0.15
    },
    {
      "id": "rottenFlesh",
      "title": "Гнилая плоть",
      "description": "Приводит зомби на арену и заражает поле боя.",
      "badge": "RF",
      "color": "#9dba76",
      "balanceBias": 0.35,
      "category": "Магия",
      "damageMultiplier": 1.8
    },
    {
      "id": "jackOLantern",
      "title": "Светильник Джека",
      "description": "Ставит световые ловушки и пугает врага вспышками.",
      "badge": "JL",
      "color": "#ffb657",
      "balanceBias": 0.40,
      "category": "Магия"
    },
    {
      "id": "boneMeal",
      "title": "Костная мука",
      "description": "Выращивает случайный рельеф и опутывает цель.",
      "badge": "BM",
      "color": "#f3f0df",
      "balanceBias": -0.10,
      "category": "Магия",
      "damageMultiplier": 5.0
    },
    {
      "id": "bookQuill",
      "title": "Книга с пером",
      "description": "Запоминает вражеские умения и отвечает эхом.",
      "badge": "BQ",
      "color": "#ffdca8",
      "balanceBias": -0.10,
      "category": "Магия"
    },
    {
      "id": "elytra",
      "title": "Элитры",
      "description": "Преобразуют скорость в планирование и пикирующие тараны.",
      "badge": "EL",
      "color": "#dbe7f9",
      "balanceBias": 0.10,
      "category": "Измерения",
      "damageMultiplier": 1.5
    },
    {
      "id": "goldenApple",
      "title": "Золотое яблоко",
      "description": "Даёт регенерацию в момент давления.",
      "badge": "GA",
      "color": "#ffd757",
      "balanceBias": -0.06,
      "category": "Алхимия"
    },
    {
      "id": "invisPotion",
      "title": "Невидимость",
      "description": "Позволяет скрываться, пройти сквозь врага и сменить позицию.",
      "badge": "IV",
      "color": "#d6c9ff",
      "balanceBias": 0.03,
      "category": "Алхимия",
      "damageMultiplier": 1.5
    },
    {
      "id": "gravityPotion",
      "title": "Зелье гравитации",
      "description": "Поднимает врага в воздух или облегчает владельца.",
      "badge": "GP",
      "color": "#b8d5ff",
      "balanceBias": 0.09,
      "category": "Алхимия",
      "damageMultiplier": 2.5
    },
    {
      "id": "turtlePotion",
      "title": "Черепашье зелье",
      "description": "Сильно режет входящий урон и даёт панцирный рычок.",
      "badge": "TP",
      "color": "#7be2b2",
      "balanceBias": 0.12,
      "category": "Алхимия"
    }
  ]
};
})();
