import { createSubTree } from "./createSubtree";
import { ModificationToApply, Path } from "./diff";

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
    }

    // @ts-ignore
    elementToUpdate.textContent = modifToApply.children;
  });
};
