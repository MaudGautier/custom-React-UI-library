function addElementToList(textElement, parentId) {
  const parent = document.getElementById(parentId);

  const element = ListElement(textElement);

  parent.append(element);
}

function ListElement(text) {
  const element = document.createElement("li");
  element.textContent = text;

  return element;
}

function handleAddInput(elementId, parentId) {
  const value = document.getElementById(elementId).value;

  addElementToList(value, parentId);
}
