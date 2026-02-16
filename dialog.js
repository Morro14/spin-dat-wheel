// @ts-check/
export class DialogWindow {
  dialogElement = document.getElementById("dialog-container");
  dialogBg = document.getElementById("dialog-bg");
  dialogHeader = document.getElementById("dialog-header");
  dialogBody = document.getElementById("dialog-text");
  dialogButtonContainer = document.getElementById("dialog-button-container");
  /**
   * @param {DialogContext} context
   */
  constructor(context) {
    this.context = context;
  }
  buildButtons() {
    const buttons = this.context.buttons.map((buttonContext) => {
      const buttonEl = document.createElement("button");
      buttonEl.innerHTML = buttonContext.label;
      buttonEl.className = "dialog-btn";
      if (buttonContext.callback) {
        buttonEl.addEventListener("click", () =>
          buttonContext.callback(...buttonContext.callbackParams),
        );
      }
      buttonEl.addEventListener("click", () => this.hide());
      return buttonEl;
    });
    return buttons;
  }
  applyContext() {
    const buttons = this.buildButtons();
    this.dialogHeader.innerHTML = this.context.header;
    this.dialogBody.innerHTML = this.context.body;
    this.dialogButtonContainer.innerHTML = "";
    buttons.forEach((b) => this.dialogButtonContainer.append(b));
  }
  show() {
    this.applyContext();
    this.dialogBg.style.display = "flex";
    this.dialogElement.style.display = "flex";
  }
  hide() {
    this.dialogBg.style.display = "none";
    this.dialogElement.style.display = "none";
  }
}

export class DialogContext {
  /**
   * @typedef {Object} ButtonContext
   * @property {string} label
   * @property {function | null} callback
   * @property {any[]} callbackParams
   */
  /**
   * @param {string} header
   * @param {string} body
   * @param {ButtonContext[]} buttons
   */
  constructor(header, body, buttons) {
    this.header = header;
    this.body = body;
    this.buttons = buttons;
  }
}
