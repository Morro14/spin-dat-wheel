// @ts-check
import { formatClassName, resetEliminatedList } from "../utils.js";
import { Filter } from "../filters.js";

export function genClassFilter(chociesCurrent) {
  function inputStyleFunc(item) {
    return `color:${WOW_CLASS_COLORS[item]}; display:flex; align-items:center; cursor:pointer; background-color: #20242d90; padding-left: 0 2px`;
  }
  const items = CHOICES_INIT.map((item) => {
    return { value: item, label: formatClassName(item) };
  });
  function filterCallback(filteredValues) {
    console.log("filter callback", filteredValues);
    resetEliminatedList();
    drawWheel(0, filteredValues);
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
