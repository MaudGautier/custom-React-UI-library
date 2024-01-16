import { isText } from "./diff";
import { Text, VirtualDomElement, WithEventListened } from "./types";

const isALeaf = isText;
const updateLeaf = (leafNode: HTMLElement, text: Text): void => {
  leafNode.textContent = text.toString();
};

const createElement = (
  document: Document,
  virtualDomElement: VirtualDomElement,
  currentElementIndex: number,
  parentId: string
) => {
  const element: WithEventListened<HTMLDivElement | HTMLButtonElement> = document.createElement(virtualDomElement.tag);
  const currentElementId = parentId + "." + currentElementIndex;
  element.id = currentElementId;

  // Add event listener if onclick
  if (virtualDomElement.onClick) {
    // Remove the previous event listener to avoid having multiple events firing when clicking once on an element
    // (i.e. avoid performing the "onClick" action multiple times)
    element.removeEventListener("click", element.eventListened);
    element.addEventListener("click", virtualDomElement.onClick);
    element.eventListened = virtualDomElement.onClick;
  }

  // STOP CONDITION
  if (isALeaf(virtualDomElement.children)) {
    updateLeaf(element, virtualDomElement.children);

    return element;
  }

  const children = virtualDomElement.children;
  const childrenElements = children.map((child, childIndex) =>
    createElement(document, child, childIndex, currentElementId)
  );
  element.replaceChildren(...childrenElements);

  return element;
};

export const createSubTree = (document: Document, children: VirtualDomElement[], rootId: string) => {
  const childrenElements = children.map((child, index) => createElement(document, child, index, rootId));

  const rootElement = document.getElementById(rootId);
  rootElement.replaceChildren(...childrenElements);
};
