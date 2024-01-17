import { createDOMTree, pathToDOMId, updateDOMElementOnClick, updateDOMElementText } from "./createDOMTree";
import { ModificationToApply, WithEventListened } from "./types";

export const patch = (modificationsToApply: ModificationToApply[]): void => {
  modificationsToApply.forEach((modificationToApply) => {
    const elementDOMId = pathToDOMId(modificationToApply.path);
    const elementToUpdate: WithEventListened<HTMLElement> = document.getElementById(elementDOMId);

    if (modificationToApply.type === "setChildren") {
      createDOMTree(modificationToApply.node, elementToUpdate);
    }

    if (modificationToApply.type === "setOnClick") {
      updateDOMElementOnClick(elementToUpdate, modificationToApply.onClick);
    }

    if (modificationToApply.type === "setText") {
      updateDOMElementText(elementToUpdate, modificationToApply.text);
    }
  });
};
