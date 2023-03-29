import { VirtualDomElement } from "./index";

export type SetChildrenModification = {
  id: string;
  children: VirtualDomElement[];
  type: "setChildren";
};
export type SetTextModification = {
  id: string;
  children: string;
  type: "setText";
};
export type ModificationToApply = SetChildrenModification | SetTextModification;

const isChildAString = (child: string | VirtualDomElement[]): child is string => {
  return typeof child === "string";
};
const isChildAnArray = (child: string | VirtualDomElement[]): child is VirtualDomElement[] => {
  return typeof child === "object";
};

const compareStringChildren = (
  oldNodeId: string,
  oldNodeChildren: string,
  newNodeChildren: string,
  differences: ModificationToApply[]
) => {
  if (oldNodeChildren !== newNodeChildren) {
    differences.push({
      id: oldNodeId,
      type: "setText",
      children: newNodeChildren,
    });
  }
};

const compareArrayChildren = (
  oldNode: VirtualDomElement,
  newNode: VirtualDomElement,
  differences: ModificationToApply[]
) => {
  if (isChildAnArray(oldNode.children) && isChildAString(newNode.children)) {
    differences.push({
      id: oldNode.id,
      type: "setText",
      children: newNode.children,
    });

    return;
  }

  if (isChildAString(oldNode.children) && isChildAnArray(newNode.children)) {
    differences.push({
      id: oldNode.id,
      type: "setChildren",
      children: newNode.children,
    });
    return;
  }

  const childrenArraySizesDiffer = oldNode.children.length !== newNode.children.length;

  if (isChildAnArray(oldNode.children) && isChildAnArray(newNode.children) && childrenArraySizesDiffer) {
    differences.push({
      id: oldNode.id,
      type: "setChildren",
      children: newNode.children,
    });
  }
};

const compareNodes = (oldNode: VirtualDomElement, newNode: VirtualDomElement, differences: ModificationToApply[]) => {
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
    compareStringChildren(oldNode.id, oldNode.children, newNode.children, differences);
  }

  // CASE both are arrays of different length OR one is array, one is string
  compareArrayChildren(oldNode, newNode, differences);
};

export const compareTrees = (
  oldNode: VirtualDomElement,
  newNode: VirtualDomElement,
  differences: ModificationToApply[]
): ModificationToApply[] => {
  compareNodes(oldNode, newNode, differences);
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
    compareTrees(oldNodeChildren[i], newNodeChildren[i], differences);
  }

  return differences;
};

export const diff = (oldNode: VirtualDomElement, newNode: VirtualDomElement): ModificationToApply[] => {
  let differences: ModificationToApply[] = [];

  return compareTrees(oldNode, newNode, differences);
};
