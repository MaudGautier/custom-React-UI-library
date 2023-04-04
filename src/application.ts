import { bootstrapApplication, useState, VirtualDomElement } from "./lib";

type ListElementProps = {
  elementText: string;
};

// let LIST_ELEMENT_COUNTER = 0

function ListElement({ elementText, id }: ListElementProps): VirtualDomElement {
  return {
    id,
    tag: "div",
    children: elementText,
    className: "item",
  };
}

function List({ children = [] }): VirtualDomElement {
  return {
    id: "list",
    tag: "div",
    children: children.map((child) => ListElement({ elementText: child, id:  })),
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
  const [getTodoList, updateTodoList] = useState<string[]>([], "todoList1");
  const [getTodoList2, updateTodoList2] = useState<string[]>([], "todoList2");
  const onClick = () => {
    updateTodoList([...getTodoList(), "NEW ELEMENT"]);
  };
  const onClick2 = () => {
    updateTodoList2([...getTodoList2(), "NEW ELEMENT 2"]);
  };

  const lst = List({ children: getTodoList() });
  const lst2 = List({ children: getTodoList2() });
  const button = Button({ onClick });
  const button2 = Button({ onClick: onClick2 });
  const application = Div({ children: [lst, button, lst2, button2] });

  return application;
}

bootstrapApplication("root", Application);
// renderDom()



