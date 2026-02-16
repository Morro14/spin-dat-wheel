// @ts-check/
import { CHOICES_INIT, WOW_CLASS_COLORS, SPEC_COLORS } from "./vars.js";
import { formatClassName } from "./utils.js";
const canvas = document.getElementById("wheel");
const choicesFormattedEntries = CHOICES_INIT.map((e) => {
  return [e, formatClassName(e)];
});
const choicesFormatted = Object.fromEntries(choicesFormattedEntries);
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 270;

export function drawWheel(rotation = 0, choices) {
  const segments = choices.length;
  const sliceAngle = (2 * Math.PI) / segments;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.translate(-centerX, -centerY);
  if (segments === 0) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#414c6a";
    ctx.fill();
    ctx.textAlign = "center";
    ctx.fillStyle = "#20242d";
    ctx.font = `24px "Sniglet font-sans"`;
    ctx.fillText("No classes", centerX, centerY);
    return;
  }

  let startAngle = 0;
  choices.forEach((element, i) => {
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = WOW_CLASS_COLORS[element] || SPEC_COLORS[i];
    ctx.fill();
    // ctx.stroke();
    // ctx.strokeStyle = "#20242D";

    startAngle = endAngle;
  });

  startAngle = 0;

  choices.forEach((e) => {
    const endAngle = startAngle + sliceAngle;
    const textAngle = startAngle + sliceAngle / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    ctx.fillStyle = "#20242d";
    ctx.font = `24px "Sniglet"`;
    ctx.textAlign = "right";
    ctx.rotate(textAngle);
    ctx.fillText(choicesFormatted[e] || e, radius - 10, 5);

    ctx.restore();

    startAngle = endAngle;
  });
  ctx.restore();
}
