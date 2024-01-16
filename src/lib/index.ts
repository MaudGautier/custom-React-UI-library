import { diff } from "./diff";
import { patch } from "./patch";

export type Text = string | number;

export type VirtualDomElement = {
  tag: "div" | "button";
  children: VirtualDomElement[] | Text;
  className?: string;
  onClick?: () => void;
};

export let render = undefined;

let PREVIOUS_VIRTUAL_DOM: VirtualDomElement = {
  tag: "div",
  children: "",
};

export function bootstrapApplication(application: () => VirtualDomElement): void {
  function renderDom() {
    let NEW_VIRTUAL_DOM = application();

    const modifications = diff(PREVIOUS_VIRTUAL_DOM, NEW_VIRTUAL_DOM);
    patch(document, modifications);

    PREVIOUS_VIRTUAL_DOM = NEW_VIRTUAL_DOM;
  }

  render = renderDom;

  render();
}
