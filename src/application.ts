import { bootstrapApplication, useState, VirtualDomElement } from "./lib";

type ListElementProps = {
  elementText: string;
};

function ListElement({ elementText }: ListElementProps): VirtualDomElement {
  return {
    tag: "div",
    children: elementText,
    className: "item",
  };
}

function List({ children = [] }): VirtualDomElement {
  return {
    tag: "div",
    children: children.map((child) => ListElement({ elementText: child })),
  };
}

function Button({ onClick }): VirtualDomElement {
  return {
    tag: "button",
    children: "Click on button",
    onClick,
  };
}

function Div({ children }): VirtualDomElement {
  return {
    tag: "div",
    children,
  };
}

function Application() {
  const [getTodoList, updateTodoList] = useState<string[]>(["aa"], "todoList1");
  const onClick = () => {
    updateTodoList([...getTodoList(), "NEW ELEMENT"]);
  };

  const lst = List({ children: getTodoList() });
  const button = Button({ onClick });
  const application = Div({ children: [lst, button] });

  return application;
}

bootstrapApplication("root", Application);
// renderDom()
