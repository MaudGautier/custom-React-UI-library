export type VirtualDomElement = {
  tag: "div" | "button",
  children: VirtualDomElement[] | string,
  className?: string;
  onClick?: () => void;
}

export function interpret (virtualDomElement: VirtualDomElement): Element {
  const element = document.createElement(virtualDomElement.tag)
  element.className = virtualDomElement.className;
  if (virtualDomElement.onClick) {
    element.onclick = virtualDomElement.onClick
  }

  if (typeof virtualDomElement.children === "string") {
    element.textContent = virtualDomElement.children

    return element
  }

  virtualDomElement.children.map(interpret).forEach(child => element.append(child))


  return element

}

let state;

export function useState <State>(initialValue): [getState: () => State, updateState: (t: State) => void] {
  const getState = <State>(): State => {
    return state;
  }
  if (!getState()) {
    state = initialValue;
  }


  const updateState = <State>(updatedState: State): void => {
    state = updatedState
    render()
  }


  return [
    getState,
    updateState,
  ]
}

let render = undefined;

let LIBRARY_STATE = {}

export function bootstrapApplication (rootId: string, application: () => VirtualDomElement): void {

  function renderDom () {
    const root = document.getElementById(rootId)
    // console.log("LIBRARY_STATE", LIBRARY_STATE)
    // root.replaceChildren(interpret(application))

    root.replaceChildren(interpret(application()))
    // renderDom()

  }

  render = renderDom

  render()


}

