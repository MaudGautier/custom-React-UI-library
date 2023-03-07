import {interpret, VirtualDomElement} from "./lib"

type ListElementProps = {
  elementText: string;
}

function ListElement ({elementText}: ListElementProps): VirtualDomElement {
  return {
    tag: "div",
    children: elementText
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
  console.log("test")
  const application = interpret(List())
  console.log({application})
  const root = document.getElementById("root")
  console.log({root})

  root.append(application)

}

renderDom()

console.log("DONE")
