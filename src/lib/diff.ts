import { VirtualDomElement } from "./index";

type ModificationToApply = {
  id: string;
  children: VirtualDomElement[] | string;
  type: "setText";
};

const compareStringChildren = (
  oldNode: VirtualDomElement,
  newNode: VirtualDomElement,
  differences: ModificationToApply[]
) => {
  if (oldNode.children !== newNode.children) {
    differences.push({
      id: oldNode.id,
      type: "setText",
      children: newNode.children,
    });
  }
};

const compareArrayChildren = (
  oldNode: VirtualDomElement,
  newNode: VirtualDomElement,
  differences: ModificationToApply[]
) => {
  const arrayToString = typeof oldNode.children === "object" && typeof newNode.children === "string";
  const stringToArray = typeof oldNode.children === "string" && typeof newNode.children === "object";
  const childrenTypesDiffer = arrayToString || stringToArray;
  const bothArrays = typeof oldNode.children === "object" && typeof newNode.children === "object";
  const childrenArraySizesDiffer = bothArrays && oldNode.children.length !== newNode.children.length;

  if (childrenTypesDiffer || childrenArraySizesDiffer) {
    differences.push({
      id: oldNode.id,
      // @ts-ignore
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
  if (typeof oldNode.children === "string" && typeof newNode.children === "string") {
    compareStringChildren(oldNode, newNode, differences);
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
