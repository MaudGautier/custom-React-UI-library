import { bootstrapApplication } from "./lib";
import { useState } from "./lib/hooks";
import { Text, VirtualDomElement } from "./lib/types";

type ListElementProps = {
  elementText: Text;
};
type ButtonProps = {
  onClick: () => void;
  label?: string;
};
type DivProps = {
  children: VirtualDomElement[] | Text;
};
type ListProps = {
  children: VirtualDomElement[] | Text[];
};

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
  return Div({ children: "Hereunder is a sample list of incrementing numbers" });
}

function addNextNumber(list: number[]): number[] {
  const lastElement = list[list.length - 1];

  return [...list, lastElement + 1];
}

function IncrementingList(): VirtualDomElement {
  const [getIncrementingList, updateIncrementingList] = useState<number[]>([1], "incrementingListSlug");

  const incrementingList = getIncrementingList();

  const onClick = () => {
    // Console logging to see that the list length evolves (i.e. the event listener uses the correct onClick function)
    console.log("The length of the current list is:", incrementingList.length);
    updateIncrementingList(addNextNumber(incrementingList));
  };

  const button = Button({ onClick, label: "Click to increment list" });
  const list = List({ children: incrementingList });

  return Div({ children: [list, button] });
}

function Application() {
  const description = Description();
  const incrementingList = IncrementingList();
  const application = Div({ children: [description, incrementingList] });

  return application;
}

bootstrapApplication(Application);
