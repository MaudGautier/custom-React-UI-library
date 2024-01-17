import { OnClick, Path, StringPath, Text, WithEventListened } from "./types";

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
