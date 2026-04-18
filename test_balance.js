// Простой баланс-тест
// Запусти в консоли: node test_balance.js

const fs = require('fs');
const vm = require('vm');

const appCode = fs.readFileSync('app.js', 'utf8');

// Проверяю ключевые изменения
const checks = [
  { pattern: 'weapon\\.mass = 1\\.10', weapon: 'turtlePotion', desc: 'mass 1.10' },
  { pattern: 'weapon\\.mass = 0\\.94.*?case "elytra"', weapon: 'elytra', desc: 'mass 0.94' },
  { pattern: 'weapon\\.owner\\.maxHp = 120', weapon: 'elytra', desc: 'maxHp 120' },
  { pattern: 'damage \\* 1\\.5', weapon: 'elytra', desc: 'уязвимость x1.5' },
  { pattern: 'mass = weapon\\.buffTimer > 0 \\? 1\\.22', weapon: 'goldenApple', desc: 'mass 1.22 с баффом' },
  { pattern: 'damage\\: 30,.*?edgeDamage\\: 10', weapon: 'totem', desc: 'взрыв тотема 30' },
  { pattern: 'weapon\\.owner\\.takeDamage\\(4,', weapon: 'rottenFlesh', desc: 'зомби урон 4' },
  { pattern: 'damage: randomInt\\(16, 22\\)', weapon: 'jackOLantern', desc: 'фонарь 16-22' },
  { pattern: 'ownedSkeletons\\.length >= 3', weapon: 'boneMeal', desc: 'скелетов max 3' },
  { pattern: 'target\\.takeDamage\\(10,', weapon: 'bookQuill', desc: 'лазер 10' },
  { pattern: 'target\\.takeDamage\\(12,', weapon: 'hopperMinecart', desc: 'воронка 12' },
  { pattern: 'radius: 230,.*?damage: 18', weapon: 'tnt', desc: 'ТНТ урон 18' },
  { pattern: 'target\\.takeDamage\\(7,', weapon: 'slimePiston', desc: 'поршень урон 7' },
  { pattern: 'target\\.takeDamage\\(16,', weapon: 'observer', desc: 'контр-урон 16' },
];

console.log('=== ПРОВЕРКА БАЛАНСА ===\\n');

let passed = 0;
let failed = 0;

for (const check of checks) {
  const found = appCode.includes(check.pattern.replace(/\\\\/g, ''));
  const status = found ? '✅' : '❌';
  if (found) passed++;
  else failed++;
  console.log(`${status} ${check.weapon}: ${check.desc}`);
}

console.log(`\\nРезультат: ${passed}/${checks.length} найдено`);
console.log(failed > 0 ? '\\nВНИМАНИЕ: Some changes may be missing!' : '\\nOk!');