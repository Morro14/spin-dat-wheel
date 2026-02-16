import { WOW_CLASS_DATA, CHOICES_INIT, ROLES } from "../vars.js";
import { formatClassName, resetEliminatedList } from "../utils.js";
import { Filter } from "../filters.js";
import { drawWheel } from "../wheel.js";

export function genRoleFilter(choicesCurrent) {
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
    resetEliminatedList();
    drawWheel(0, choicesFiltered);
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
