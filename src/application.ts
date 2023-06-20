import { bootstrapApplication, useState, VirtualDomElement, Text } from "./lib";

type ListElementProps = {
  elementText: Text;
};
type ButtonProps = {
  onClick: () => void;
  label?: string;
}
type DivProps = {
  children: VirtualDomElement[] | Text;
}
type ListProps = {
  children: VirtualDomElement[] | Text[];
}

function ListElement({ elementText }: ListElementProps): VirtualDomElement {
  return {
    tag: "div",
    children: elementText,
    className: "item",
  };
}

function List({ children = [] }: ListProps): VirtualDomElement {
  return {
    tag: "div",
    children: children.map((child) => ListElement({ elementText: child })),
  };
}

function Button({ onClick, label = "Click on button" }: ButtonProps): VirtualDomElement {
  return {
    tag: "button",
    children: label,
    onClick,
  };
}

function Div({ children }: DivProps): VirtualDomElement {
  return {
    tag: "div",
    children,
  };
}

function Description(): VirtualDomElement {
  return Div({children: "Hereunder is a sample list of incrementing numbers"})
}

function addNextNumber(list: number[]): number[] {
  const lastElement = list[list.length-1]

  return [...list, lastElement + 1]
}

function IncrementingList(): VirtualDomElement {
  const [getIncrementingList, updateIncrementingList] = useState<number[]>([1], "incrementingListSlug");
  const onClick = () => {
    updateIncrementingList(addNextNumber(getIncrementingList()));
  };
  const button = Button({ onClick, label: "Click to increment list" });
  const list = List({ children: getIncrementingList() });

  return Div({ children: [list, button] });
}

function Application() {
  const description = Description();
  const incrementingList = IncrementingList();
  const application = Div({ children: [description, incrementingList] });

  return application;
}

bootstrapApplication("0", Application);
