import { VirtualDomElement } from "./index";

export type Path = [0, ...number[]];

type OnClick = () => void;

export type SetChildrenModification = {
  path: Path;
  children: VirtualDomElement[];
  type: "setChildren";
};
export type SetTextModification = {
  path: Path;
  children: string;
  type: "setText";
};
export type SetOnClickModification = {
  path: Path;
  onClick: OnClick;
  type: "setOnClick";
};
export type ModificationToApply = SetChildrenModification | SetTextModification | SetOnClickModification;

const isChildAString = (child: string | VirtualDomElement[]): child is string => {
  return typeof child === "string";
};
const isChildAnArray = (child: string | VirtualDomElement[]): child is VirtualDomElement[] => {
  return typeof child === "object";
};

const compareStringChildren = (
  // oldNodeId: string,
  oldNodeChildren: string,
  newNodeChildren: string,
  differences: ModificationToApply[],
  currentPath: Path
) => {
  if (oldNodeChildren !== newNodeChildren) {
    differences.push({
      path: currentPath,
      // id: oldNodeId,
      type: "setText",
      children: newNodeChildren,
    });
  }
};

const compareOnClickProps = (
  // oldNodeId: string,
  oldNodeOnClickProp: OnClick,
  newNodeOnClickProp: OnClick,
  differences: ModificationToApply[],
  currentPath: Path
) => {
  // TODO: references comparées alors que devrait pas
  if (JSON.stringify(oldNodeOnClickProp) !== JSON.stringify(newNodeOnClickProp)) {
    differences.push({
      path: currentPath,
      // id: oldNodeId,
      type: "setOnClick",
      onClick: newNodeOnClickProp,
      // children: newNodeChildren,
    });
  }
};

const compareArrayChildren = (
  oldNode: VirtualDomElement,
  newNode: VirtualDomElement,
  differences: ModificationToApply[],
  currentPath: Path
) => {
  if (isChildAnArray(oldNode.children) && isChildAString(newNode.children)) {
    differences.push({
      // id: oldNodeId,
      path: currentPath,
      type: "setText",
      children: newNode.children,
    });

    return;
  }

  if (isChildAString(oldNode.children) && isChildAnArray(newNode.children)) {
    differences.push({
      path: currentPath,
      // id: oldNode.id,
      type: "setChildren",
      children: newNode.children,
    });
    return;
  }

  const childrenArraySizesDiffer = oldNode.children.length !== newNode.children.length;

  if (isChildAnArray(oldNode.children) && isChildAnArray(newNode.children) && childrenArraySizesDiffer) {
    differences.push({
      path: currentPath,
      // id: oldNode.id,
      type: "setChildren",
      children: newNode.children,
    });
  }
};

const compareNodes = (
  oldNode: VirtualDomElement,
  newNode: VirtualDomElement,
  differences: ModificationToApply[],
  currentPath: Path
) => {
  // // TODO/ this not tested - voir si on veut comparer les ID, et si oui que mettre ?
  // if (oldNode.id != newNode.id) {
  //   differences.push({
  //     id: oldNode.id,
  //     type: "setText",
  //     children: newNode.children,
  //   });
  // }

  // CASE both are string
  if (isChildAString(oldNode.children) && isChildAString(newNode.children)) {
    // TODO: deal with case where both children and onClick change (later)
    compareStringChildren(oldNode.children, newNode.children, differences, currentPath);
    compareOnClickProps(oldNode.onClick, newNode.onClick, differences, currentPath);
  }

  // CASE both are arrays of different length OR one is array, one is string
  compareArrayChildren(oldNode, newNode, differences, currentPath);
};

export const compareTrees = (
  oldNode: VirtualDomElement,
  newNode: VirtualDomElement,
  differences: ModificationToApply[],
  currentPath: Path
): ModificationToApply[] => {
  compareNodes(oldNode, newNode, differences, currentPath);
  const oldNodeChildren = oldNode.children;
  const newNodeChildren = newNode.children;

  // STOP CONDITION: If one node has children string (i.e. one is leaf node) => return
  if (typeof oldNodeChildren === "string" || typeof newNodeChildren === "string") {
    return differences;
  }

  // STOP CONDITION: Nodes have a different number of children => no need to compare further, return
  if (newNodeChildren.length !== oldNodeChildren.length) {
    return differences;
  }

  // Compare all children nodes one to one
  for (let i = 0; i < newNodeChildren.length; i++) {
    compareTrees(oldNodeChildren[i], newNodeChildren[i], differences, [...currentPath, i]);
  }

  return differences;
};

export const diff = (oldNode: VirtualDomElement, newNode: VirtualDomElement): ModificationToApply[] => {
  let differences: ModificationToApply[] = [];

  return compareTrees(oldNode, newNode, differences, [0]);
};
