import { diff } from "./diff";
import { patch } from "./patch";

export type Text = string | number;

export type VirtualDomElement = {
  tag: "div" | "button";
  children: VirtualDomElement[] | Text;
  className?: string;
  onClick?: () => void;
};

let state = {};

export function useState<State>(initialValue, slug): [getState: () => State, updateState: (t: State) => void] {
  const getState = <State>(): State => {
    return state[slug];
  };
  if (!getState()) {
    state[slug] = initialValue;
  }

  const updateState = <State>(updatedState: State): void => {
    state[slug] = updatedState;
    render();
  };

  return [getState, updateState];
}

let render = undefined;

let PREVIOUS_VIRTUAL_DOM: VirtualDomElement = {
  tag: "div",
  children: ""
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
