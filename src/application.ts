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

function Child1(): VirtualDomElement {
  return {
    tag: "div",
    children: [
      {
        tag: "div",
        children: "text1.1",
      },
      {
        tag: "div",
        children: "text1.2",
      },
    ],
  };
}

function Child2(): VirtualDomElement {
  const [getTodoList, updateTodoList] = useState<string[]>(["child2.1"], "todoList2");
  const onClick = () => {
    updateTodoList([...getTodoList(), "NEW ELEMENT"]);
  };
  const button = Button({ onClick });
  const listChild2 = List({ children: getTodoList() });

  return Div({ children: [listChild2, button] });
}

function Application() {
  const child1 = Child1();
  const child2 = Child2();
  const application = Div({ children: [child1, child2] });

  return application;
}

bootstrapApplication("root", Application);
