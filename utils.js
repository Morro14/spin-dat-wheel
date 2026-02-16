export function formatClassName(className) {
  const split = className.split("_");
  const capitalized = split.map((e) => {
    return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase();
  });
  return capitalized.join(" ");
}

export function resetEliminatedList() {
  const eliminatedChoicesElement = document.getElementById(
    "choices-eliminated-container",
  );
  eliminatedChoicesElement.innerHTML = `<span id="choices-eliminated-placeholder">nothing yet</span>`;
  const eliminatedHeader = document.getElementById("choices-eliminated-header");
  eliminatedHeader.innerHTML = "Classes Eliminated:";
}
