import { render } from "./index";

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