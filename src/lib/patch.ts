import { createSubTree } from "./createSubtree";
import { ModificationToApply, OnClick, Path, WithEventListened, Text, StringPath } from "./types";

export const pathToDomId = (path: Path | StringPath) => path.join(".");

export const updateOnClick = (element: WithEventListened<HTMLElement>, onClick: OnClick): void => {
  // Remove the previous event listener to avoid having multiple events firing when clicking once on an element
  // (i.e. avoid performing the "onClick" action multiple times)
  element.removeEventListener("click", element.eventListened);
  element.addEventListener("click", onClick);
  element.eventListened = onClick;
};

export const updateText = (element: WithEventListened<HTMLElement>, text: Text): void => {
  element.textContent = text.toString();
};

export const patch = (document: Document, modificationsToApply: ModificationToApply[]): void => {
  modificationsToApply.forEach((modificationToApply) => {
    const elementPath = pathToDomId(modificationToApply.path);
    const elementToUpdate: WithEventListened<HTMLElement> = document.getElementById(elementPath);

    if (modificationToApply.type === "setChildren") {
      createSubTree(document, modificationToApply.children, elementToUpdate.id);
    }

    if (modificationToApply.type === "setOnClick") {
      updateOnClick(elementToUpdate, modificationToApply.onClick);
    }

    if (modificationToApply.type === "setText") {
      updateText(elementToUpdate, modificationToApply.children);
    }
  });
};
