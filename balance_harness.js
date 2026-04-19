const fs = require("fs");
const vm = require("vm");

class FakeElement {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.style = {};
    this.dataset = {};
    this.className = "";
    this.textContent = "";
    this.innerHTML = "";
    this.value = "";
    this.disabled = false;
    this.width = 900;
    this.height = 900;
    this.clientWidth = 900;
    this.clientHeight = 900;
    this.classList = {
      add() {},
      remove() {},
      toggle() {},
      contains() {
        return false;
      },
    };
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  addEventListener() {}
  removeEventListener() {}
  setAttribute() {}
  click() {}

  getContext() {
    return fakeCtx;
  }
}

const fakeCtx = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === "createLinearGradient" || prop === "createRadialGradient") {
        return () => ({ addColorStop() {} });
      }
      if (prop === "measureText") {
        return () => ({ width: 0 });
      }
      return () => {};
    },
  }
);

function createHarness() {
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) {
        const element = new FakeElement(id === "battleCanvas" ? "canvas" : "div");
        element.id = id;
        elements.set(id, element);
      }
      return elements.get(id);
    },
    createElement(tag) {
      return new FakeElement(tag);
    },
    querySelectorAll() {
      return [];
    },
    body: new FakeElement("body"),
    baseURI: "file://" + process.cwd() + "/",
  };

  const windowObject = {
    innerWidth: 900,
    innerHeight: 900,
    addEventListener(type, callback) {
      if (type === "DOMContentLoaded") {
        this.__boot = callback;
      }
    },
    removeEventListener() {},
  };

  const context = {
    window: windowObject,
    document,
    console,
    Math,
    Date,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Number,
    String,
    Boolean,
    Array,
    Object,
    JSON,
    RegExp,
    Promise,
    URL,
    performance: { now: () => 0 },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    setTimeout,
    clearTimeout,
    Image: class {
      set src(_value) {
        if (typeof this.onerror === "function") {
          this.onerror(new Error("Asset loading skipped in headless mode."));
        }
      }
    },
  };

  context.window.window = context.window;
  context.window.document = document;
  context.window.requestAnimationFrame = context.requestAnimationFrame;
  context.window.cancelAnimationFrame = context.cancelAnimationFrame;
  context.window.performance = context.performance;
  context.globalThis = context;

  vm.createContext(context);

  const configCode = fs.readFileSync("weapons.config.js", "utf8");
  vm.runInContext(configCode, context);

  let appCode = fs.readFileSync("app.js", "utf8");
  appCode = appCode.replace(
    'new Game(canvas, ui);',
    "window.__game = new Game(canvas, ui); window.__Game = Game;"
  );
  appCode = appCode.replace(
    'window.addEventListener("DOMContentLoaded", boot);',
    'window.__WEAPON_CATALOG = WEAPON_CATALOG; window.__WEAPON_LIBRARY = WEAPON_LIBRARY; window.addEventListener("DOMContentLoaded", boot);'
  );
  vm.runInContext(appCode, context);

  if (typeof context.window.__boot === "function") {
    context.window.__boot();
  }

  return {
    context,
    game: context.window.__game,
    weapons: context.window.__WEAPON_CATALOG,
  };
}

function runMatch(leftWeaponId, rightWeaponId) {
  const { game } = createHarness();
  return game.safeSimulateBattle(leftWeaponId, rightWeaponId, {
    checkIssues: true,
    stopOnIssue: false,
  });
}

function runTournament() {
  const { game, weapons } = createHarness();
  const score = new Map();
  for (const weapon of weapons) {
    score.set(weapon.id, {
      title: weapon.title,
      wins: 0,
      draws: 0,
      losses: 0,
      hpFor: 0,
      hpAgainst: 0,
      issues: 0,
    });
  }

  const matches = [];
  for (const leftWeapon of weapons) {
    for (const rightWeapon of weapons) {
      if (leftWeapon.id === rightWeapon.id) {
        continue;
      }
      const result = game.safeSimulateBattle(leftWeapon.id, rightWeapon.id, {
        checkIssues: true,
        stopOnIssue: false,
      });
      const leftScore = score.get(leftWeapon.id);
      const rightScore = score.get(rightWeapon.id);
      leftScore.hpFor += result.leftHp;
      leftScore.hpAgainst += result.rightHp;
      rightScore.hpFor += result.rightHp;
      rightScore.hpAgainst += result.leftHp;
      leftScore.issues += result.issues.length;
      rightScore.issues += result.issues.length;

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

      matches.push({
        left: leftWeapon.id,
        right: rightWeapon.id,
        winner: result.winnerWeaponId,
        issues: result.issues,
        leftHp: result.leftHp,
        rightHp: result.rightHp,
      });
    }
  }

  const ranking = [...score.values()].sort((a, b) => {
    return (
      (b.wins - a.wins) ||
      (b.draws - a.draws) ||
      ((b.hpFor - b.hpAgainst) - (a.hpFor - a.hpAgainst))
    );
  });

  return { ranking, matches };
}

function printTournament() {
  const { ranking, matches } = runTournament();
  const issueMatches = matches.filter((match) => match.issues.length);
  console.log(`Matches with issues: ${issueMatches.length}`);
  for (const entry of ranking) {
    console.log(
      [
        entry.title,
        `W:${entry.wins}`,
        `D:${entry.draws}`,
        `L:${entry.losses}`,
        `HP:${entry.hpFor}-${entry.hpAgainst}`,
        `Issues:${entry.issues}`,
      ].join(" | ")
    );
  }
}

function printIssueMatches() {
  const { matches } = runTournament();
  const issueMatches = matches.filter((match) => match.issues.length);
  for (const match of issueMatches) {
    console.log(
      [
        `${match.left} vs ${match.right}`,
        `winner:${match.winner || "draw"}`,
        `hp:${match.leftHp}:${match.rightHp}`,
        `issues:${match.issues.join(" || ")}`,
      ].join(" | ")
    );
  }
}

function main() {
  const [, , command = "tournament", ...args] = process.argv;

  if (command === "match") {
    const [leftWeaponId, rightWeaponId] = args;
    if (!leftWeaponId || !rightWeaponId) {
      throw new Error("Usage: node balance_harness.js match <leftWeaponId> <rightWeaponId>");
    }
    console.log(JSON.stringify(runMatch(leftWeaponId, rightWeaponId), null, 2));
    return;
  }

  if (command === "tournament") {
    printTournament();
    return;
  }

  if (command === "issues") {
    printIssueMatches();
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  createHarness,
  runMatch,
  runTournament,
};
