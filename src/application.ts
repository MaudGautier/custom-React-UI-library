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


function List (): VirtualDomElement {

  const CHILDREN = ["element1", "element2"]

  return {
    tag: "div",
    children: CHILDREN.map(child => ListElement({elementText: child}))
  }
}

function renderDom () {
  const application = List()

  bootstrapApplication("root", application)
}

renderDom()
