import { ModificationToApply } from "./diff";
import { VirtualDomElement } from "./index";

const updateLeaf = (leafNode: HTMLElement, textContent: string): void => {
  leafNode.textContent = textContent;
};

const isLeaf = (children: string | VirtualDomElement[]): children is string => {
  return typeof children === "string";
};

const createLeafNode = (document: Document, virtualDomElement: VirtualDomElement): HTMLElement => {
  const childToAdd = document.createElement(virtualDomElement.tag);
  childToAdd.id = virtualDomElement.id;

  // @ts-ignore
  childToAdd.textContent = virtualDomElement.children;

  return childToAdd;
};

const applySetChildrenModification = (
  document: Document,
  parentHtmlElement: HTMLElement,
  modifToApply: ModificationToApply
): void => {
  // STOP CONDITION
  if (isLeaf(modifToApply.children)) {
    updateLeaf(parentHtmlElement, modifToApply.children);
    return;
  }

  const firstChild = modifToApply.children[0];

  const childToAdd = createLeafNode(document, firstChild);
  parentHtmlElement.replaceChildren(childToAdd);
};

export const updateDomFromDiff = (document: Document, modificationsToApply: ModificationToApply[]): void => {
  modificationsToApply.forEach((modifToApply) => {
    const elementToUpdate = document.getElementById(modifToApply.id);

    if (modifToApply.type === "setChildren") {
      applySetChildrenModification(document, elementToUpdate, modifToApply);

      return;
    }

    elementToUpdate.textContent = modifToApply.children;
  });
};
