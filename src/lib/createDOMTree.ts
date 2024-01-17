import { isText } from "./diff";
import { OnClick, Path, StringPath, Text, VirtualDomElement, WithEventListened } from "./types";

const isALeaf = isText;

export const pathToDOMId = (path: Path | StringPath) => path.join(".");

export const updateDOMElementOnClick = (element: WithEventListened<HTMLElement>, onClick: OnClick): void => {
  // Remove the previous event listener to avoid having multiple events firing when clicking once on an element
  // (i.e. avoid performing the "onClick" action multiple times)
  element.removeEventListener("click", element.eventListened);
  element.addEventListener("click", onClick);
  element.eventListened = onClick;
};

export const updateDOMElementText = (element: WithEventListened<HTMLElement>, text: Text): void => {
  element.textContent = text.toString();
};

const createDOMElement = (document: Document, virtualDomElement: VirtualDomElement, elementDomId: string) => {
  const element = document.createElement(virtualDomElement.tag);
  element.id = elementDomId;

  // Update onClick property
  if (virtualDomElement.onClick) {
    updateDOMElementOnClick(element, virtualDomElement.onClick);
  }

  // Update text property
  if (isText(virtualDomElement.children)) {
    updateDOMElementText(element, virtualDomElement.children);
  }

  return element;
};

export const createDOMTree = (document: Document, virtualDomElement: VirtualDomElement, element: HTMLElement) => {
  const children = virtualDomElement.children;

  // STOP CONDITION: If is a leaf, then return this element
  if (isALeaf(children)) {
    return element;
  }

  const childrenElements = children.map((child, childIndex) =>
    createDOMTree(document, child, createDOMElement(document, child, pathToDOMId([element.id, childIndex])))
  );

  element.replaceChildren(...childrenElements);

  return element;
};
