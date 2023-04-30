import { VirtualDomElement } from "./index";

const isALeaf = (children: VirtualDomElement[] | string): children is string => typeof children === "string";
const updateLeaf = (leafNode: HTMLElement, textContent: string): void => {
  leafNode.textContent = textContent;
};

const createElement = (
  document: Document,
  virtualDomElement: VirtualDomElement,
  currentElementIndex: number,
  parentId: string
) => {
  const element = document.createElement(virtualDomElement.tag);
  const currentElementId = parentId + "." + currentElementIndex;
  element.id = currentElementId;

  // Add event listener if onclick
  if (virtualDomElement.onClick) {
    element.addEventListener("click", virtualDomElement.onClick);
  }

  // STOP CONDITION
  if (isALeaf(virtualDomElement.children)) {
    updateLeaf(element, virtualDomElement.children);

    return element;
  }

  const grandChildren = virtualDomElement.children;
  const grandChildrenElements = grandChildren.map((grandChild, grandChildIndex) =>
    createElement(document, grandChild, grandChildIndex, currentElementId)
  );
  element.replaceChildren(...grandChildrenElements);

  return element;
};

export const createSubTree = (document: Document, children: VirtualDomElement[], rootId) => {
  const childElements = children.map((child, index) => createElement(document, child, index, rootId));

  const rootElement = document.getElementById(rootId);
  rootElement.replaceChildren(...childElements);
};
