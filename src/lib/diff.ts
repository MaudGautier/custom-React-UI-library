import { ModificationToApply, OnClick, Path, Text, VirtualDomElement } from "./types";

export const isText = (child: Text | VirtualDomElement[]): child is Text => {
  return typeof child === "string" || typeof child === "number";
};
const isChildAnArray = (child: Text | VirtualDomElement[]): child is VirtualDomElement[] => {
  return typeof child === "object";
};

const compareTexts = (oldText: Text, newText: Text, differences: ModificationToApply[], currentPath: Path) => {
  if (oldText !== newText) {
    differences.push({
      path: currentPath,
      type: "setText",
      text: newText,
    });
  }
};

const compareOnClickProps = (
  oldNodeOnClickProp: OnClick,
  newNodeOnClickProp: OnClick,
  differences: ModificationToApply[],
  currentPath: Path
) => {
  if (oldNodeOnClickProp !== newNodeOnClickProp) {
    differences.push({
      path: currentPath,
      type: "setOnClick",
      onClick: newNodeOnClickProp,
    });
  }
};

const compareArrayChildren = (
  oldNode: VirtualDomElement,
  newNode: VirtualDomElement,
  differences: ModificationToApply[],
  currentPath: Path
) => {
  if (isChildAnArray(oldNode.children) && isText(newNode.children)) {
    differences.push({
      path: currentPath,
      type: "setText",
      text: newNode.children,
    });

    return;
  }

  if (isText(oldNode.children) && isChildAnArray(newNode.children)) {
    differences.push({
      path: currentPath,
      type: "setChildren",
      children: newNode.children,
    });
    return;
  }

  if (isText(oldNode.children) || isText(newNode.children)) {
    throw new Error("All cases of old or new node with Text should already have been handled at this stage!");
  }

  const childrenArraySizesDiffer = oldNode.children.length !== newNode.children.length;

  if (isChildAnArray(oldNode.children) && isChildAnArray(newNode.children) && childrenArraySizesDiffer) {
    differences.push({
      path: currentPath,
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
  // CASE both are texts
  if (isText(oldNode.children) && isText(newNode.children)) {
    compareTexts(oldNode.children, newNode.children, differences, currentPath);
    compareOnClickProps(oldNode.onClick, newNode.onClick, differences, currentPath);

    return;
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
  // Compare current nodes
  compareNodes(oldNode, newNode, differences, currentPath);

  // Compare children
  const oldNodeChildren = oldNode.children;
  const newNodeChildren = newNode.children;

  // STOP CONDITION: If one node has children string (i.e. one is leaf node) => return
  if (isText(oldNodeChildren) || isText(newNodeChildren)) {
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
