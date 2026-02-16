// @ts-check
import {
  WOW_CLASS_COLORS,
  SPEC_COLORS,
  ROLES,
  WOW_CLASS_DATA,
} from "./vars.js";
import { CHOICES_INIT } from "./vars.js";
import { drawWheel } from "./wheel.js";
import { Filter } from "./filters.js";
import { spin } from "./spin.js";
import { genFilters } from "./filters.js";
import { DialogContext, DialogWindow } from "./dialog.js";
import { resetEliminatedList, formatClassName } from "./utils.js";

const gameStateInit = {
  mode: "class",
  choices: CHOICES_INIT,
  classWinner: null,
  specWinner: null,
};

let gameState = structuredClone(gameStateInit);

function setEliminatedList(gameState) {
  const eliminatedChoicesElement = document.getElementById(
    "choices-eliminated-container",
  );
  const eliminatedHeaderElement = document.getElementById(
    "choices-eliminated-header",
  );

  if (gameState.mode === "class") {
    const eliminatedChocies = CHOICES_INIT.filter(
      (klass) => !gameState.choices.includes(klass),
    );

    eliminatedHeaderElement.innerHTML = "Classes Eliminated:";

    eliminatedChoicesElement.innerHTML =
      eliminatedChocies.length === 0
        ? `<span id="choices-eliminated-placeholder">nothing yet</span>`
        : eliminatedChocies
            .map((value) => {
              return `<span style="color: ${WOW_CLASS_COLORS[value]}; margin-right:8px; white-space: nowrap">${formatClassName(value)}</span>`;
            })
            .join("");
  }
  if (gameState.mode === "spec") {
    const eliminatedChoices = WOW_CLASS_DATA[
      gameState.classWinner
    ].specs.filter((spec) => !gameState.choices.includes(spec));
    eliminatedHeaderElement.innerHTML = "Specs Eliminated:";
    eliminatedChoicesElement.innerHTML =
      eliminatedChoices.length === 0
        ? `<span id="choices-eliminated-placeholder">nothing yet</span>`
        : eliminatedChoices
            .map((value) => {
              return `<span style="margin-right:8px; white-space: nowrap">${formatClassName(value)}</span>`;
            })
            .join("");
  }
}

drawWheel(0, gameState.choices);

async function spinSequence() {
  const spinResult = await spin(gameState.choices).then((r) => r);
  let spinWinner = null;
  spinWinner = spinResult.determineWinner;

  // next spin

  if (gameState.choices.length > 2) {
    gameState.choices = gameState.choices.filter((e) => e !== spinWinner);
    setEliminatedList(gameState);

    const spinResultDialogContext = new DialogContext(
      "Eliminate...",

      `<span style="color: ${WOW_CLASS_COLORS[spinWinner] || "#fefade"}; margin-right:8px; white-space: nowrap">${formatClassName(spinWinner)}</span><span style="color:#E43D3D; margin-left: 4px">!</span>`,
      [
        {
          label: "continue",
          callback: drawWheel,
          callbackParams: [0, gameState.choices],
        },
      ],
    );

    const resultDialog = new DialogWindow(spinResultDialogContext);
    resultDialog.show();
    return;
  }
  // win
  if (gameState.choices.length <= 2) {
    // spec win
    if (gameState.mode === "spec") {
      if (gameState.choices.length === 2) {
        gameState.choices = gameState.choices.filter((e) => e !== spinWinner);
        setEliminatedList(gameState);
      }
      gameState.specWinner = gameState.choices[0];
      drawWheel(0, gameState.choices);
      const specWinnerDialogContext = new DialogContext(
        "Your class and spec for Midnight is:",

        `<span style="margin:0 8px">🎉</span>` +
          `<span style="color:${WOW_CLASS_COLORS[gameState.classWinner]}; margin-right: 8px">${formatClassName(gameState.classWinner)}</span><span>${formatClassName(gameState.specWinner)}</span>` +
          `<span style="color:#E43D3D; margin:0 8px">🎉</span>`,
        [
          {
            label: "GG!",
            callback: null,
            callbackParams: [],
          },
        ],
      );
      const resultDialog = new DialogWindow(specWinnerDialogContext);
      resultDialog.show();
      return;
    }
    // class win
    gameState.choices = gameState.choices.filter((e) => e !== spinWinner);
    drawWheel(0, gameState.choices);
    gameState.classWinner = gameState.choices[0];
    setEliminatedList(gameState);
    const winnerFormatted = formatClassName(gameState.classWinner);
    const classWinnerDialogContext = new DialogContext(
      "Your class for Midnight is:",

      `<span style="color:#E43D3D; margin:0 8px">🎉</span>` +
        winnerFormatted +
        `<span style="color:#E43D3D; margin:0 8px">🎉</span>`,
      [
        {
          label: "GG!",
          callback: () => {},
          callbackParams: [0, null],
        },
        {
          label: `Get ${winnerFormatted}'s spec`,

          callback: () => {
            gameState.mode = "spec";
            gameState.choices = WOW_CLASS_DATA[gameState.classWinner].specs;
            setEliminatedList(gameState);
            drawWheel(0, gameState.choices);
          },
          callbackParams: [0, gameState.choices],
        },
      ],
    );

    // change round to spec
    const classWinnerDialog = new DialogWindow(classWinnerDialogContext);
    classWinnerDialog.show();
    return;
  }
}

const spinButton = document.getElementById("spin-btn");
spinButton.addEventListener("click", () => spinSequence());

// filters

const classFilter = genClassFilter();
const roleFilter = genRoleFilter();

genFilters([classFilter, roleFilter]);

// reset
function resetChoices() {
  location.reload();
}
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => resetChoices());

function genClassFilter() {
  function inputStyleFunc(item) {
    return `color:${WOW_CLASS_COLORS[item]}; display:flex; align-items:center; cursor:pointer; background-color: #20242d90; padding-left: 0 2px`;
  }
  const items = CHOICES_INIT.map((item) => {
    return { value: item, label: formatClassName(item) };
  });
  function filterCallback(filteredValues) {
    gameState = structuredClone(gameStateInit);
    gameState.choices = filteredValues;
    setEliminatedList(gameState);
    drawWheel(0, gameState.choices);
  }
  const classFilter = new Filter(
    "checkbox",
    "Class filter",
    "class-filter",
    items,
    inputStyleFunc,
    filterCallback,
  );
  return classFilter;
}

function genRoleFilter() {
  function inputStyleFunc(item) {
    return `display:flex; align-items:center; cursor:pointer; background-color: #20242d90; padding-left: 0 2px`;
  }
  function filterCallback(filteredValues) {
    const choicesFiltered = [];
    CHOICES_INIT.forEach((e) => {
      const classRoles = WOW_CLASS_DATA[e]["roles"];
      classRoles.find((role) => {
        if (filteredValues.includes(role)) {
          choicesFiltered.push(e);
          return true;
        }
        return false;
      });
    });
    gameState = structuredClone(gameStateInit);
    gameState.choices = choicesFiltered;
    setEliminatedList(gameState);
    drawWheel(0, gameState.choices);
  }
  const items = ROLES.map((role) => {
    return { value: role, label: role };
  });
  const roleFilter = new Filter(
    "checkbox",
    "Role filter",
    "role-filter",
    items,
    inputStyleFunc,
    filterCallback,
  );
  return roleFilter;
}
