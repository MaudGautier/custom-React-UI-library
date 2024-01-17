import { createSubTree } from "./createSubtree";
import { ModificationToApply, WithEventListened } from "./types";
import { pathToDomId, updateOnClick, updateText } from "./utils";

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
