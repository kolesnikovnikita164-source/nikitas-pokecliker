/* =========================================================
   POKECLICKER
   ========================================================= */

const SAVE_KEY = "pokeClickerSave";


/* =========================================================
   POKEMON
   ========================================================= */

const pokemon = [
  { id: 1, name: "Bisasam" },
  { id: 4, name: "Glumanda" },
  { id: 7, name: "Schiggy" },
  { id: 25, name: "Pikachu" },
  { id: 37, name: "Vulpix" },
  { id: 52, name: "Mauzi" },
  { id: 59, name: "Arkani" },
  { id: 94, name: "Gengar" },
  { id: 130, name: "Garados" },
  { id: 131, name: "Lapras" },
  { id: 133, name: "Evoli" },
  { id: 143, name: "Relaxo" },
  { id: 147, name: "Dratini" },
  { id: 149, name: "Dragoran" },
  { id: 151, name: "Mew" },
  { id: 196, name: "Psiana" },
  { id: 197, name: "Nachtara" },
  { id: 384, name: "Rayquaza" },
  { id: 448, name: "Lucario" }
];


/* =========================================================
   SPIELSTAND
   ========================================================= */

let game = {
  coins: 0,
  balls: 10,
  greatBalls: 3,
  potions: 5,
  wins: 0,
  caught: [],
  totalCaught: 0
};


/* =========================================================
   KAMPF
   ========================================================= */

let currentPokemon = null;
let currentHP = 100;
let maxHP = 100;


/* =========================================================
   BILD-URL
   ========================================================= */

function pokemonImage(id) {

  return (
    "https://raw.githubusercontent.com/" +
    "PokeAPI/sprites/master/sprites/pokemon/" +
    "other/official-artwork/" +
    id +
    ".png"
  );

}


/* =========================================================
   SPEICHERN
   ========================================================= */

function saveGame() {

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(game)
  );

}


/* =========================================================
   LADEN
   ========================================================= */

function loadGame() {

  const saved =
    localStorage.getItem(SAVE_KEY);

  if (!saved) {
    return;
  }

  try {

    const data = JSON.parse(saved);

    game = {
      ...game,
      ...data
    };

  } catch (error) {

    console.log(
      "Spielstand konnte nicht geladen werden."
    );

  }

}


/* =========================================================
   ANZEIGE
   ========================================================= */

function updateUI() {

  document.getElementById("coins").textContent =
    Math.floor(game.coins);

  document.getElementById("balls").textContent =
    game.balls;

  document.getElementById("caught").textContent =
    game.caught.length;

  document.getElementById("wins").textContent =
    game.wins;

  document.getElementById("pokedexCount").textContent =
    game.caught.length;


  /* QUEST 1 */

  const caughtProgress =
    Math.min(
      game.caught.length / 5 * 100,
      100
    );

  document.getElementById("catchProgress").style.width =
    caughtProgress + "%";

  document.getElementById("catchQuestText").textContent =
    game.caught.length + " / 5";


  /* QUEST 2 */

  const winProgress =
    Math.min(
      game.wins / 10 * 100,
      100
    );

  document.getElementById("winProgress").style.width =
    winProgress + "%";

  document.getElementById("winQuestText").textContent =
    game.wins + " / 10";


  /* QUEST 3 */

  const coinProgress =
    Math.min(
      game.coins / 1000 * 100,
      100
    );

  document.getElementById("coinProgress").style.width =
    coinProgress + "%";

  document.getElementById("coinQuestText").textContent =
    Math.floor(game.coins) + " / 1000";


  renderPokedex();

  saveGame();

}


/* =========================================================
   POKEDEX
   ========================================================= */

function renderPokedex() {

  const grid =
    document.getElementById(
      "pokedexGrid"
    );

  grid.innerHTML = "";


  pokemon.forEach(p => {

    const card =
      document.createElement("div");

    const isCaught =
      game.caught.includes(p.id);


    card.className =
      "pokemon-card" +
      (isCaught ? "" : " locked");


    if (isCaught) {

      card.innerHTML = `
        <img
          src="${pokemonImage(p.id)}"
          alt="${p.name}">

        <strong>
          ${p.name}
        </strong>

        <br>

        <small>
          ✓ Gefangen
        </small>
      `;

    } else {

      card.innerHTML = `
        <div class="question">?</div>

        <strong>
          Unbekannt
        </strong>

        <br>

        <small>
          Noch nicht gefangen
        </small>
      `;

    }


    grid.appendChild(card);

  });

}


/* =========================================================
   NEUES WILDES POKEMON
   ========================================================= */

function spawnPokemon() {

  currentPokemon =
    pokemon[
      Math.floor(
        Math.random() * pokemon.length
      )
    ];


  const wild =
    document.getElementById(
      "wildPokemon"
    );


  wild.src =
    pokemonImage(
      currentPokemon.id
    );


  wild.alt =
    currentPokemon.name;


  wild.style.left =
    (8 + Math.random() * 78) + "%";


  wild.style.top =
    (36 + Math.random() * 45) + "%";


  wild.style.display =
    "block";

}


/* =========================================================
   WILDES POKEMON KLICK
   ========================================================= */

document
  .getElementById("wildPokemon")
  .addEventListener(
    "click",
    function(event) {

      event.preventDefault();

      startBattle();

    }
  );


/* =========================================================
   KAMPF START
   ========================================================= */

function startBattle() {

  currentHP = 100;
  maxHP = 100;


  document.getElementById(
    "battleTitle"
  ).textContent =
    "⚔️ Wildes " +
    currentPokemon.name;


  document.getElementById(
    "battlePokemon"
  ).src =
    pokemonImage(
      currentPokemon.id
    );


  document.getElementById(
    "battleMessage"
  ).textContent =
    "Schwäche " +
    currentPokemon.name +
    " und fange es!";


  updateHP();


  document.getElementById(
    "battleOverlay"
  ).style.display =
    "flex";

}


/* =========================================================
   HP
   ========================================================= */

function updateHP() {

  document.getElementById(
    "hpText"
  ).textContent =
    currentHP +
    " / " +
    maxHP;


  document.getElementById(
    "hpBar"
  ).style.width =
    (currentHP / maxHP * 100) +
    "%";

}


/* =========================================================
   ANGRIFF
   ========================================================= */

function battleAttack(damage) {

  if (!currentPokemon) {
    return;
  }


  currentHP -= damage;


  if (currentHP < 0) {
    currentHP = 0;
  }


  game.coins += damage;


  document.getElementById(
    "battleMessage"
  ).textContent =
    "💥 " +
    damage +
    " Schaden!";


  updateHP();


  if (currentHP === 0) {

    game.wins++;

    game.coins += 100;


    document.getElementById(
      "battleMessage"
    ).textContent =
      "🎉 Pokémon besiegt! +100 Coins";


    setTimeout(
      function() {

        closeBattle();

        spawnPokemon();

        updateUI();

      },
      800
    );

  } else {

    updateUI();

  }

}


/* =========================================================
   ATTACKE VON AUSSEN
   ========================================================= */

function useOutsideAttack(damage) {

  if (
    document.getElementById(
      "battleOverlay"
    ).style.display !== "flex"
  ) {

    alert(
      "Starte zuerst einen Kampf!"
    );

    return;

  }


  battleAttack(damage);

}


/* =========================================================
   POKEBALL
   ========================================================= */

function throwBall() {

  if (game.balls <= 0) {

    setBattleMessage(
      "❌ Du hast keine Pokébälle!"
    );

    return;

  }


  game.balls--;


  const hpBonus =
    (100 - currentHP) * 0.004;


  const chance =
    0.30 + hpBonus;


  if (Math.random() < chance) {

    catchCurrentPokemon();

  } else {

    setBattleMessage(
      "😮 " +
      currentPokemon.name +
      " ist ausgebrochen!"
    );

  }


  updateUI();

}


/* =========================================================
   SUPERBALL
   ========================================================= */

function throwGreatBall() {

  if (game.greatBalls <= 0) {

    setBattleMessage(
      "❌ Keine Superbälle!"
    );

    return;

  }


  game.greatBalls--;


  const hpBonus =
    (100 - currentHP) * 0.005;


  const chance =
    0.55 + hpBonus;


  if (Math.random() < chance) {

    catchCurrentPokemon();

  } else {

    setBattleMessage(
      "😮 " +
      currentPokemon.name +
      " ist ausgebrochen!"
    );

  }


  updateUI();

}


/* =========================================================
   FANGEN
   ========================================================= */

function catchCurrentPokemon() {

  if (
    !game.caught.includes(
      currentPokemon.id
    )
  ) {

    game.caught.push(
      currentPokemon.id
    );

    game.totalCaught++;

    game.coins += 250;


    setBattleMessage(
      "🎉 Gefangen! " +
      currentPokemon.name +
      " ist jetzt in deinem Pokédex!"
    );


    updateUI();


    setTimeout(
      function() {

        closeBattle();

        spawnPokemon();

      },
      1000
    );

  } else {

    game.coins += 100;


    setBattleMessage(
      "🐾 Du hast " +
      currentPokemon.name +
      " bereits. +100 Coins!"
    );


    updateUI();

  }

}


/* =========================================================
   TRANK
   ========================================================= */

function usePotion() {

  if (game.potions <= 0) {

    setBattleMessage(
      "❌ Du hast keine Tränke!"
    );

    return;

  }


  if (currentHP >= maxHP) {

    setBattleMessage(
      "❤️ Deine Pokémon-HP sind bereits voll!"
    );

    return;

  }


  game.potions--;

  currentHP += 30;


  if (currentHP > maxHP) {
    currentHP = maxHP;
  }


  setBattleMessage(
    "🧪 Pokémon geheilt!"
  );


  updateHP();

  updateUI();

}


/* =========================================================
   FLIEHEN
   ========================================================= */

function runAway() {

  closeBattle();

  spawnPokemon();

}


/* =========================================================
   KAMPF SCHLIESSEN
   ========================================================= */

function closeBattle() {

  document.getElementById(
    "battleOverlay"
  ).style.display =
    "none";

}


/* =========================================================
   KAMPF-NACHRICHT
   ========================================================= */

function setBattleMessage(message) {

  document.getElementById(
    "battleMessage"
  ).textContent =
    message;

}


/* =========================================================
   SHOP: POKEBALL
   ========================================================= */

function buyBall() {

  if (game.coins < 50) {

    alert(
      "❌ Du brauchst 50 Coins!"
    );

    return;

  }


  game.coins -= 50;

  game.balls++;


  updateUI();

}


/* =========================================================
   SHOP: SUPERBALL
   ========================================================= */

function buyGreatBall() {

  if (game.coins < 150) {

    alert(
      "❌ Du brauchst 150 Coins!"
    );

    return;

  }


  game.coins -= 150;

  game.greatBalls++;


  updateUI();

}


/* =========================================================
   SHOP: TRANK
   ========================================================= */

function buyPotion() {

  if (game.coins < 75) {

    alert(
      "❌ Du brauchst 75 Coins!"
    );

    return;

  }


  game.coins -= 75;

  game.potions++;


  updateUI();

}


/* =========================================================
   ADMIN ÖFFNEN
   ========================================================= */

function openAdmin() {

  const panel =
    document.getElementById(
      "adminPanel"
    );


  panel.style.display =
    panel.style.display === "block"
      ? "none"
      : "block";


  panel.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

function loginAdmin() {

  const code =
    document.getElementById(
      "adminCode"
    ).value;


  if (code === "342013") {

    document.getElementById(
      "adminTools"
    ).style.display =
      "flex";


    alert(
      "👑 Admin-Modus aktiviert!"
    );

  } else {

    alert(
      "❌ Falscher Admin-Code!"
    );

  }

}


/* =========================================================
   ADMIN COINS
   ========================================================= */

function adminCoins() {

  game.coins += 10000;

  updateUI();


  alert(
    "🪙 +10.000 Coins!"
  );

}


/* =========================================================
   ADMIN BALLS
   ========================================================= */

function adminBalls() {

  game.balls += 100;

  game.greatBalls += 50;

  updateUI();


  alert(
    "🔴 +100 Pokébälle\n🔵 +50 Superbälle!"
  );

}


/* =========================================================
   ADMIN ALLE POKEMON
   ========================================================= */

function adminAllPokemon() {

  game.caught =
    pokemon.map(
      p => p.id
    );


  updateUI();


  alert(
    "🐾 Alle Pokémon wurden freigeschaltet!"
  );

}


/* =========================================================
   RESET
   ========================================================= */

function resetGame() {

  const yes =
    confirm(
      "Wirklich deinen gesamten Spielstand löschen?"
    );


  if (!yes) {
    return;
  }


  localStorage.removeItem(
    SAVE_KEY
  );


  location.reload();

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function scrollToSection(id) {

  const element =
    document.getElementById(id);


  if (!element) {
    return;
  }


  element.scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================================================
   POKEMON BEWEGEN
   ========================================================= */

setInterval(
  function() {

    const wild =
      document.getElementById(
        "wildPokemon"
      );


    if (
      document.getElementById(
        "battleOverlay"
      ).style.display !== "flex"
    ) {

      wild.style.left =
        (8 + Math.random() * 78) +
        "%";

      wild.style.top =
        (36 + Math.random() * 45) +
        "%";

    }

  },
  3500
);


/* =========================================================
   KLEINES PASSIVES COIN-EINKOMMEN
   ========================================================= */

setInterval(
  function() {

    if (game.caught.length > 0) {

      game.coins +=
        game.caught.length;

      updateUI();

    }

  },
  5000
);


/* =========================================================
   START
   ========================================================= */

loadGame();

spawnPokemon();

updateUI();
