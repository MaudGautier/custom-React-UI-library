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


function Button ({onClick}): VirtualDomElement {
  return {
    tag: "button",
    children: "Click on button",
    onClick,
  }

}

function Div ({children}): VirtualDomElement {
  return {
    tag: "div",
    children
  }
}

const STATE = {
  todoList: []
}

function renderDom () {
  const onClick = () => {
    console.log("todoList BEFORE UPDATE", STATE.todoList)
    STATE.todoList.push("NEW EL");
    console.log("todoList AFTER UPDATE", STATE.todoList)
    renderDom()
  }
  const lst = List({children: STATE.todoList})
  const button = Button({onClick})
  const application = Div({children: [lst, button]})

  bootstrapApplication("root", application)
}

renderDom()
