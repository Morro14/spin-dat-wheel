// @ts-check
import { formatClassName } from "./utils.js";

export function genFilters(filters) {
  const filtersContainer = document.getElementById("filter-container");

  function genFilterSet(filter) {
    filter.genInputElements();
    const form = document.createElement("form");
    form.id = `${filter.name}-form`;
    form.className = "filter-form";
    const header = document.createElement("div");
    header.innerHTML = filter.label;
    header.id = `${name}-filter-header`;
    header.className = "filter-set-header";
    form.appendChild(header);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const filteredValues = filter.filter();
      console.log("filteredValues", filteredValues);
      filter.filterCallback(filteredValues);
    });
    const inputsContainer = document.createElement("div");
    inputsContainer.id = `${filter.name}-inputs-container`;
    inputsContainer.className = `filter-inputs-container`;
    console.log("input elements", filter.inputElements);
    filter.inputElements.forEach((input) => inputsContainer.appendChild(input));
    const button = document.createElement("button");
    button.innerHTML = "Apply filter";
    form.appendChild(inputsContainer);
    form.appendChild(button);
    filtersContainer?.appendChild(form);
  }
  filters.forEach((filter) => genFilterSet(filter));
}

export class Filter {
  /**
   * @param {"checkbox" | "radio"} type
   * @param {string} label
   * @param {string} name
   * @param {{value:string, label:string }[]} items
   * @param {function} filterCallback
   * @param {function} inputStyleFunc
   */
  constructor(type, label, name, items, inputStyleFunc, filterCallback) {
    this.type = type;
    this.name = name;
    this.label = label;
    this.items = items;
    this.inputStyleFunc = inputStyleFunc;
    this.filterCallback = filterCallback;
    this.inputElements = [];
  }
  genInputElements() {
    this.items.forEach((item) => {
      const label = document.createElement("label");
      label.htmlFor = `${this.name}-filter-input-${item.value}`;
      label.innerHTML = formatClassName(item.value);
      const input = document.createElement("input");
      input.id = `${this.name}-filter-input-${item.value}`;
      input.type = this.type;
      input.value = item.value;
      input.checked = true;
      const div = document.createElement("div");
      div.appendChild(label);
      div.appendChild(input);
      div.className = "input-label-container";
      div.style = this.inputStyleFunc(item.value);
      this.inputElements.push(div);
    });
  }
  filter() {
    let filteredValues = [];
    switch (this.type) {
      case "checkbox":
        this.inputElements.forEach((el) => {
          if (el.lastChild.checked) {
            filteredValues.push(el.lastChild.value);
          }
        });
        return filteredValues;
      case "radio":
        // TODO
        return this.inputElements.find((el) => el.lastChild.checked);
    }
  }
}
