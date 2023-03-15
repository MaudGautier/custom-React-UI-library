import { bootstrapApplication, useState, VirtualDomElement } from "./lib";

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





function Application () {
  console.log("In application")
  const [todoList, updateTodoList] = useState<string[]>([])
  const onClick = () => {
    console.log("CL")
    updateTodoList([...todoList, "NEW ELEMENT"])
    console.log("CLICKED", todoList)
  }

  const lst = List({children: todoList})
  const button = Button({onClick})
  const application = Div({children: [lst, button]})

  return application


}

const application = Application()
bootstrapApplication("root", application)
// renderDom()
