// ------------------------------------------------ Real DOM Elements ----------------------------------------------- //

export type WithEventListened<T extends HTMLElement> = T & { eventListened?: OnClick };

// ---------------------------------------------- Virtual DOM Elements --------------------------------------------- //

export type Text = string | number;

export type VirtualDomElement = {
  tag: "div" | "button";
  children: VirtualDomElement[] | Text;
  className?: string;
  onClick?: () => void;
};

export type Path = [0, ...number[]];

export type OnClick = () => void;

// ------------------------------------------- Virtual DOM Modifications ------------------------------------------- //

export type SetChildrenModification = {
  path: Path;
  children: VirtualDomElement[];
  type: "setChildren";
};

export type SetTextModification = {
  path: Path;
  children: Text;
  type: "setText";
};

export type SetOnClickModification = {
  path: Path;
  onClick: OnClick;
  type: "setOnClick";
};

export type ModificationToApply = SetChildrenModification | SetTextModification | SetOnClickModification;
