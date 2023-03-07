export type VirtualDomElement = {
  tag: "div",
  children: VirtualDomElement[] | string,
  className?: string;
}



export function interpret (virtualDomElement: VirtualDomElement): Element {
  const element = document.createElement(virtualDomElement.tag)
  element.className = virtualDomElement.className

  if (typeof virtualDomElement.children === "string") {
    element.textContent = virtualDomElement.children

    return element
  }

  virtualDomElement.children.map(interpret).forEach(child => element.append(child))


  return element

}

export function bootstrapApplication (rootId: string, application: VirtualDomElement): void {
  const root = document.getElementById(rootId)

  root.append(interpret(application))

}

