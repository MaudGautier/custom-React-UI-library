import { VirtualDomElement } from "./index";

const isALeaf = (children: VirtualDomElement[] | string): children is string => typeof children === "string";

const createElement = (document: Document, virtualDomElement: VirtualDomElement) => {
  const element = document.createElement(virtualDomElement.tag);
  element.id = virtualDomElement.id;

  // STOP CONDITION
  if (isALeaf(virtualDomElement.children)) {
    element.textContent = virtualDomElement.children;

    return element;
  }

  const grandChildren = virtualDomElement.children;
  const grandChildrenElements = grandChildren.map((grandChild) => createElement(document, grandChild));
  element.replaceChildren(...grandChildrenElements);

  return element;
};

export const createSubTree = (document: Document, children: VirtualDomElement[], rootId) => {
  const childElements = children.map((child) => createElement(document, child));

  const rootElement = document.getElementById(rootId);
  rootElement.replaceChildren(...childElements);
};
