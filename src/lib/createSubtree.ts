import { isText } from "./diff";
import { VirtualDomElement, Text } from "./index";

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

export const createSubTree = (document: Document, children: VirtualDomElement[], rootId: string) => {
  const childElements = children.map((child, index) => createElement(document, child, index, rootId));

  const rootElement = document.getElementById(rootId);
  rootElement.replaceChildren(...childElements);
};
