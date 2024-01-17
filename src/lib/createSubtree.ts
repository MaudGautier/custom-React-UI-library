import { isText } from "./diff";
import { Text, VirtualDomElement, WithEventListened } from "./types";
import { pathToDomId, updateOnClick, updateText } from "./patch";

const isALeaf = isText;

const createHTMLElement = (
  document: Document,
  virtualDomElement: VirtualDomElement,
  elementDomId: string
): WithEventListened<HTMLDivElement | HTMLButtonElement> => {
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

const _createSubTree = (document: Document, virtualDomElement: VirtualDomElement, elementDomId: string) => {
  const element = createHTMLElement(document, virtualDomElement, elementDomId);

  // STOP CONDITION: If is a leaf, then return this element
  if (isALeaf(virtualDomElement.children)) {
    return element;
  }

  // Otherwise, recursively create all children elements
  const children = virtualDomElement.children;
  const childrenElements = children.map((child, childIndex) =>
    _createSubTree(document, child, pathToDomId([elementDomId, childIndex]))
  );
  element.replaceChildren(...childrenElements);

  return element;
};

// TODO: createSubTree and _createSubTree can be refactored together once I pass the parent virtualDomElement (instead of children)
export const createSubTree = (document: Document, virtualDomElementChildren: VirtualDomElement[], rootId: string) => {
  const rootElement = document.getElementById(rootId);

  const childrenElements = virtualDomElementChildren.map((child, childIndex) =>
    _createSubTree(document, child, pathToDomId([rootId, childIndex]))
  );

  rootElement.replaceChildren(...childrenElements);
};
