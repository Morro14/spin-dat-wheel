const WOW_CLASS_COLORS = {
  DEATH_KNIGHT: "#C41E3A",
  DEMON_HUNTER: "#A330C9",
  DRUID: "#FF7C0A",
  EVOKER: "#33937F",
  HUNTER: "#AAD372",
  MAGE: "#3FC7EB",
  MONK: "#00FF98",
  PALADIN: "#F48CBA",
  PRIEST: "#FFFFFF",
  ROGUE: "#FFF468",
  SHAMAN: "#0070DD",
  WARLOCK: "#8788EE",
  WARRIOR: "#C69B6D",
};

const WOW_CLASS_DATA = {
  DEATH_KNIGHT: { roles: ["tank", "dps", "melee"] },
  DEMON_HUNTER: { roles: ["tank", "dps", "melee", "ranged"] },
  DRUID: {
    roles: ["tank", "dps", "healer", "melee", "ranged"],
  },
  EVOKER: {
    roles: ["dps", "healer", "ranged", "support"],
  },
  HUNTER: { roles: ["dps", "melee", "ranged"] },
  MAGE: { roles: ["dps", "ranged"] },
  MONK: { roles: ["tank", "dps", "melee", "healer"] },
  PALADIN: { roles: ["tank", "dps", "melee", "healer"] },
  PRIEST: { roles: ["dps", "ranged", "healer"] },
  ROGUE: { roles: ["dps", "melee"] },
  SHAMAN: { roles: ["dps", "melee", "ranged", "healer"] },
  WARLOCK: { roles: ["dps", "ranged"] },
  WARRIOR: { roles: ["tank", "dps", "melee"] },
};
const choicesInit = Object.keys(WOW_CLASS_COLORS);

let choicesCurrent = Object.keys(WOW_CLASS_COLORS);

const choicesFormattedEntries = choicesInit.map((e) => {
  return [e, formatClassName(e)];
});
const choicesFormatted = Object.fromEntries(choicesFormattedEntries);
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawWheel(rotation = 0) {
  const segments = choicesCurrent.length;
  const sliceAngle = (2 * Math.PI) / segments;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.translate(-centerX, -centerY);
  const radius = 270;
  if (segments === 0) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#414c6a";
    ctx.fill();
    ctx.textAlign = "center";
    ctx.fillStyle = "#20242d";
    ctx.font = "24px sans";
    ctx.fillText("No classes", centerX, centerY);
    return;
  }

  let startAngle = 0;
  choicesCurrent.forEach((element) => {
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = WOW_CLASS_COLORS[element];
    ctx.fill();
    // ctx.stroke();
    // ctx.strokeStyle = "#20242D";

    startAngle = endAngle;
  });

  startAngle = 0;

  choicesCurrent.forEach((e, i) => {
    const endAngle = startAngle + sliceAngle;
    const textAngle = startAngle + sliceAngle / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(textAngle);

    ctx.textAlign = "right";
    ctx.fillStyle = "#20242d";
    ctx.font = "20px sans-serif";
    ctx.fillText(choicesFormatted[e], radius - 10, 5);

    ctx.restore();

    startAngle = endAngle;
  });
  ctx.restore();
}

let rotation = 0;
function spin() {
  const spinDuration = 4000;
  const start = performance.now();
  const startRotation = rotation;
  const extraSpins = 5;
  const randomOffset = Math.random() * 2 * Math.PI;

  const targetRotation =
    startRotation + extraSpins * 2 * Math.PI + randomOffset;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / spinDuration, 1);

    const easeOut = 1 - Math.pow(1 - progress, 3);
    rotation = startRotation + (targetRotation - startRotation) * easeOut;

    drawWheel(rotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      determineSpinWinner();
    }
  }

  requestAnimationFrame(animate);
}
function determineSpinWinner() {
  const normalizedRotation =
    (2 * Math.PI - (rotation % (2 * Math.PI))) % (2 * Math.PI);
  const segments = choicesCurrent.length;
  const sliceAngle = (2 * Math.PI) / segments;
  const winningIndex = Math.floor(normalizedRotation / sliceAngle);
  const winner = choicesCurrent[winningIndex];
  if (segments <= 2) {
    showSpinResult(winner, true);
    return;
  }
  choicesCurrent = choicesCurrent.filter((e) => e !== winner);
  showSpinResult(winner);
  addToEliminatedList(winner);

  function addToEliminatedList(result) {
    const eliminatedChoicesElement = document.getElementById(
      "choices-eliminated-container",
    );
    if (
      eliminatedChoicesElement.firstElementChild.innerHTML === "nothing yet"
    ) {
      eliminatedChoicesElement.innerHTML = `<span style="color: ${WOW_CLASS_COLORS[result]}; margin-right:8px; white-space: nowrap">${formatClassName(result)}</span>`;
    } else {
      const eliminatedSpans = eliminatedChoicesElement.childNodes;
      const includesResult = Array.from(eliminatedSpans).find((e) => {
        return e.innerHTML === formatClassName(result);
      });
      if (!includesResult) {
        eliminatedChoicesElement.innerHTML += `<span style="color: ${WOW_CLASS_COLORS[result]};margin-right:8px; white-space: nowrap">${formatClassName(result)}</span>`;
      }
    }
  }
}
function showSpinResult(result, finalWinner = false) {
  const resultElement = document.getElementById("result-container");
  const resultBg = document.getElementById("result-bg");
  const continueButton = document.getElementById("result-continue-btn");
  const resultText = document.getElementById("result-text");
  const resultHeader = document.getElementById("result-header");
  resultText.style.display = "flex";
  continueButton.style.display = "flex";
  resultText.style.color = WOW_CLASS_COLORS[result];
  resultBg.style.display = "flex";
  resultElement.style.display = "flex";
  if (finalWinner) {
    resultHeader.innerHTML = "Your class for Midnight is:";
    continueButton.innerHTML = "GG!";

    resultText.innerHTML =
      `<span style="color:#E43D3D; margin:0 8px">🎉</span>` +
      formatClassName(result) +
      `<span style="color:#E43D3D; margin:0 8px">🎉</span>`;
  } else {
    resultText.innerHTML =
      formatClassName(result) +
      `<span style="color:#E43D3D; margin-left: 4px">!</span>`;
    resultHeader.innerHTML = "Eliminate...";
    continueButton.innerHTML = "continue";
  }

  function hideSpinResult() {
    resultElement.style.display = "none";
    resultBg.style.display = "none";
    resultText.style.display = "none";
    drawWheel();
  }

  continueButton.addEventListener("click", () => hideSpinResult());
}

drawWheel();
const spinButton = document.getElementById("spin-btn");
spinButton.addEventListener("click", () => spin());

// filter classes
function genClassFilterForm() {
  const removeClassForm = document.getElementById("remove-class-form");
  const classInputs = [];
  choicesInit.forEach((e) => {
    const label = document.createElement("label");
    label.htmlFor = `remove-class-${e}`;
    label.innerHTML = formatClassName(e);

    const input = document.createElement("input");
    input.id = `remove-class-${e}`;
    input.type = "checkbox";
    input.innerHTML = e;
    input.value = e;
    input.checked = true;
    const div = document.createElement("div");
    div.appendChild(label);
    div.appendChild(input);
    div.className = "input-label-container";
    div.style = `color:${WOW_CLASS_COLORS[e]}; display:flex; align-items:center; cursor:pointer; background-color: #20242d90; padding-left: 0 2px`;
    classInputs.push(div);
  });
  const inputContainer = removeClassForm.firstElementChild;
  classInputs.forEach((e) => inputContainer.appendChild(e));

  function updateClasses(activeClasses) {
    const filteredChoices = choicesInit.filter(
      (e) => !activeClasses.includes(e),
    );
    choicesCurrent = filteredChoices;
    drawWheel();
  }
  removeClassForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = inputContainer.childNodes;
    const bannedClasses = [];
    inputs.forEach((el) => {
      const input = el.childNodes[1];
      if (input.nodeName === "INPUT" && !input.checked) {
        bannedClasses.push(input.value);
      }
    });
    updateClasses(bannedClasses);
  });
}
genClassFilterForm();

// filter roles
const WOW_ROLES = ["tank", "healer", "melee", "ranged", "support"];
let rolesCurrent = Array.from(WOW_ROLES);

function genRoleFilterForm() {
  const removeRoleForm = document.getElementById("remove-role-form");
  const roleInputs = [];
  WOW_ROLES.forEach((e) => {
    const label = document.createElement("label");
    label.htmlFor = `remove-role-${e}`;
    label.innerHTML = formatClassName(e);

    const input = document.createElement("input");
    input.id = `remove-role-${e}`;
    input.type = "checkbox";
    input.innerHTML = e;
    input.value = e;
    input.checked = true;
    const div = document.createElement("div");
    div.appendChild(label);
    div.appendChild(input);
    div.className = "input-label-container";
    div.style = `display:flex; align-items:center; cursor:pointer; background-color: #20242d90; padding-left: 0 2px`;
    roleInputs.push(div);
  });
  const roleInputContainer = removeRoleForm.firstElementChild;
  roleInputs.forEach((e) => roleInputContainer.appendChild(e));

  function updateRoles(activeRoles) {
    choicesFiltered = [];
    choicesInit.forEach((e) => {
      choiceRoles = WOW_CLASS_DATA[e]["roles"];
      choiceRoles.find((role) => {
        if (activeRoles.includes(role)) {
          choicesFiltered.push(e);
          return true;
        }
        return false;
      });
    });
    choicesCurrent = choicesFiltered;
    drawWheel();
  }
  removeRoleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = roleInputContainer.childNodes;
    const activeRoles = [];
    inputs.forEach((el) => {
      const input = el.childNodes[1];
      if (input.nodeName === "INPUT" && input.checked) {
        activeRoles.push(input.value);
      }
    });
    updateRoles(activeRoles);
  });
}
genRoleFilterForm();

// reset
function resetChoices() {
  location.reload();
}
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => resetChoices());

function formatClassName(className) {
  const split = className.split("_");
  const capitalized = split.map((e) => {
    return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase();
  });
  return capitalized.join(" ");
}
