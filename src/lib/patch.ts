import { createSubTree } from "./createSubtree";
import { ModificationToApply, Path } from "./types";

export const pathToDomId = (path: Path) => path.join(".");

export const patch = (document: Document, modificationsToApply: ModificationToApply[]): void => {
  modificationsToApply.forEach((modifToApply) => {
    const elementToUpdate = document.getElementById(pathToDomId(modifToApply.path));

    if (modifToApply.type === "setChildren") {
      createSubTree(document, modifToApply.children, elementToUpdate.id);

      return;
    }

    if (modifToApply.type === "setOnClick") {
      elementToUpdate.addEventListener("click", modifToApply.onClick);

      return;
    }

    if (modifToApply.type === "setText") {
      elementToUpdate.textContent = modifToApply.children.toString();

      return;
    }
  });
};
