export type VirtualDomElement = {
  tag: "div",
  children: VirtualDomElement[] | string
}



export function interpret (virtualDomElement: VirtualDomElement): Element {
  console.log("IN INTERPRETER")
  const element = document.createElement(virtualDomElement.tag)
  console.log("element", element)

  if (typeof virtualDomElement.children === "string") {
    console.log("IN STRING ELEMENT")
    element.textContent = virtualDomElement.children

    return element
  }

  virtualDomElement.children.map(interpret).forEach(child => element.append(child))


  return element

}

