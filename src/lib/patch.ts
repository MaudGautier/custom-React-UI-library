import { createSubTree } from "./createSubtree";
import { ModificationToApply, Path, WithEventListened } from "./types";

export const pathToDomId = (path: Path) => path.join(".");

export const patch = (document: Document, modificationsToApply: ModificationToApply[]): void => {
  modificationsToApply.forEach((modifToApply) => {
    const elementToUpdate: WithEventListened<HTMLElement> = document.getElementById(pathToDomId(modifToApply.path));

    if (modifToApply.type === "setChildren") {
      createSubTree(document, modifToApply.children, elementToUpdate.id);
    }

    if (modifToApply.type === "setOnClick") {
      // Remove the previous event listener to avoid having multiple events firing when clicking once on an element
      // (i.e. avoid performing the "onClick" action multiple times)
      elementToUpdate.removeEventListener("click", elementToUpdate.eventListened);
      elementToUpdate.addEventListener("click", modifToApply.onClick);
      elementToUpdate.eventListened = modifToApply.onClick;
    }

    if (modifToApply.type === "setText") {
      elementToUpdate.textContent = modifToApply.children.toString();
    }
  });
};
