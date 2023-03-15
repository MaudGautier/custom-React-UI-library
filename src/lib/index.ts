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

export function bootstrapApplication (rootId: string, application: VirtualDomElement): void {
  const root = document.getElementById(rootId)

  root.replaceChildren(interpret(application))



}

