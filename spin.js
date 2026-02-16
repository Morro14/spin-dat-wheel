// @ts-check
import { drawWheel } from "./wheel.js";

export function spin(choices) {
  let rotation = 0;
  const spinDuration = (1 + 0.3 * Math.random()) * 4000;
  const start = performance.now();
  const startRotation = rotation;
  const extraSpins = 4;
  const randomOffset = Math.random() * 2 * Math.PI;

  const targetRotation =
    startRotation + extraSpins * 2 * Math.PI + randomOffset;
  let result = null;
  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / spinDuration, 1);

    const easeOut = 1 - Math.pow(1 - progress, 4);
    rotation = startRotation + (targetRotation - startRotation) * easeOut;

    drawWheel(rotation, choices);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      result = {
        determineWinner: determineSpinWinner(choices, rotation),
      };
    }
  }

  requestAnimationFrame(animate);
  const promise = new Promise((resolve, reject) => {
    setInterval(() => {
      if (result) resolve(result);
    }, 200);
  });
  return promise;
}

function determineSpinWinner(choices, rotation) {
  console.log("determineSpinWinner");
  const normalizedRotation =
    (2 * Math.PI - (rotation % (2 * Math.PI))) % (2 * Math.PI);
  const segments = choices.length;
  const sliceAngle = (2 * Math.PI) / segments;
  const winningIndex = Math.floor(normalizedRotation / sliceAngle);
  const winner = choices[winningIndex];
  return winner;
}
