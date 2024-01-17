import { isText } from "./diff";
import { VirtualDomElement } from "./types";
import { pathToDomId, updateOnClick, updateText } from "./utils";

const isALeaf = isText;

const createHTMLElement = (document: Document, virtualDomElement: VirtualDomElement, elementDomId: string) => {
  // Create HTML element
  const element = document.createElement(virtualDomElement.tag);
  element.id = elementDomId;

  // Update onClick
  if (virtualDomElement.onClick) {
    updateOnClick(element, virtualDomElement.onClick);
  }

  // Update text
  if (isText(virtualDomElement.children)) {
    updateText(element, virtualDomElement.children);
  }

  return element;
};

export const createSubTree = (document: Document, virtualDomElement: VirtualDomElement, element: HTMLElement) => {
  const children = virtualDomElement.children;

  // STOP CONDITION: If is a leaf, then return this element
  if (isALeaf(children)) {
    return element;
  }

  const childrenElements = children.map((child, childIndex) =>
    createSubTree(document, child, createHTMLElement(document, child, pathToDomId([element.id, childIndex])))
  );

  element.replaceChildren(...childrenElements);

  return element;
};
