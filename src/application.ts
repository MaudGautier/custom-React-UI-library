import { bootstrapApplication, VirtualDomElement } from "./lib";

type ListElementProps = {
  elementText: string;
}

function ListElement ({elementText}: ListElementProps): VirtualDomElement {
  return {
    tag: "div",
    children: elementText,
    className: "item",
  }
}


function List ({children = []}): VirtualDomElement {

  // const CHILDREN = ["element1", "element2"]

  return {
    tag: "div",
    children: children.map(child => ListElement({elementText: child}))
  }
}


function Button (): VirtualDomElement {

  return {
    tag: "button",
    children: "Click on button",
    onClick: () => console.log("Clicked on button")
  }

}

function Div ({children}): VirtualDomElement {
  return {
    tag: "div",
    children
  }
}


function renderDom () {
  const children = ["elemnt1"]
  const lst = List({children})
  const button = Button()
  const application = Div({children: [lst, button]})

  bootstrapApplication("root", application)
}

renderDom()
