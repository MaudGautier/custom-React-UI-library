import { createSubTree } from "./createSubtree";
import { ModificationToApply } from "./diff";

export const patch = (document: Document, modificationsToApply: ModificationToApply[]): void => {
  modificationsToApply.forEach((modifToApply) => {
    const elementToUpdate = document.getElementById(modifToApply.id);

    if (modifToApply.type === "setChildren") {
      createSubTree(document, modifToApply.children, elementToUpdate.id);

      return;
    }

    elementToUpdate.textContent = modifToApply.children;
  });
};
