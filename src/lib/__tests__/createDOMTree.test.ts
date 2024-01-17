// noinspection JSConstantReassignment

import { JSDOM } from "jsdom";
import { createDOMTree } from "../createDOMTree";

import { VirtualDomElement } from "../types";

describe("createDOMTree", () => {
  test("1 child", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        children: "child2Text",
      },
    ];
    const newNode: VirtualDomElement = { tag: "div", children };
    const dom = new JSDOM(`<div id="0">Old text</div>`);
    const expectedDom = new JSDOM(`<div id="0"><div id="0.0">child2Text</div></div>`);

    // WHEN
    global.document = dom.window.document;
    const element = document.getElementById("0");
    createDOMTree(newNode, element);

    // THEN
    expect(dom.window.document.getElementById("0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("0.0").textContent).toEqual("child2Text");
  });

  test("2 children", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        children: "child1Text",
      },
      {
        tag: "div",
        children: "child2Text",
      },
    ];
    const newNode: VirtualDomElement = { tag: "div", children };

    const dom = new JSDOM(`<div id="0">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="0">
    <div id="0.0">child1Text</div>
    <div id="0.1">child2Text</div>
</div>`);

    // WHEN
    global.document = dom.window.document;
    const element = document.getElementById("0");
    createDOMTree(newNode, element);

    // THEN
    expect(dom.window.document.getElementById("0").children.length).toEqual(2);
    expect(dom.window.document.getElementById("0.0").textContent).toEqual("child1Text");
    expect(dom.window.document.getElementById("0.1").textContent).toEqual("child2Text");
  });

  test("1 child with 1 grandchild", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        children: [
          {
            tag: "div",
            children: "grandChild",
          },
        ],
      },
    ];
    const newNode: VirtualDomElement = { tag: "div", children };

    const dom = new JSDOM(`<div id="0">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="0">
    <div id="0.0">
        <div id="0.0.0">grandChild</div>
    </div>
</div>`);

    // WHEN
    global.document = dom.window.document;
    const element = document.getElementById("0");
    createDOMTree(newNode, element);

    // THEN
    expect(dom.window.document.getElementById("0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("0.0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("0.0.0").textContent).toEqual("grandChild");
  });

  test("3 levels of grandchildren (1 each level)", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        children: [
          {
            tag: "div",
            children: [
              {
                tag: "div",
                children: "Great-grand-child",
              },
            ],
          },
        ],
      },
    ];
    const newNode: VirtualDomElement = { tag: "div", children };

    const dom = new JSDOM(`<div id="0">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="0">
    <div id="0.0">
        <div id="0.0.0">
            <div id="0.0.0.0">Great-grand-child</div>
        </div>
    </div>
</div>`);

    // WHEN
    global.document = dom.window.document;
    const element = document.getElementById("0");
    createDOMTree(newNode, element);

    // THEN
    expect(dom.window.document.getElementById("0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("0.0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("0.0.0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("0.0.0.0").textContent).toEqual("Great-grand-child");
  });

  test("3 levels of grandchildren (with several at each level)", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        children: [
          {
            tag: "div",
            children: [
              {
                tag: "div",
                children: "Great-grand-child1.1.1",
              },
            ],
          },
          {
            tag: "div",
            children: [
              {
                tag: "div",
                children: "Great-grand-child1.2.1",
              },
              {
                tag: "div",
                children: "Great-grand-child1.2.2",
              },
            ],
          },
        ],
      },
      {
        tag: "div",
        children: [
          {
            tag: "div",
            children: "Grand-child2.1",
          },
        ],
      },
    ];
    const newNode: VirtualDomElement = { tag: "div", children };

    const dom = new JSDOM(`<div id="0">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="0">
    <div id="0.0">
        <div id="0.0.0">
            <div id="0.0.0.0">Great-grand-child1.1.1</div>
        </div>
        <div id="0.0.1">
            <div id="0.0.1.0">Great-grand-child1.2.1</div>
            <div id="0.0.1.1">Great-grand-child1.2.2</div>
        </div>
    </div>
    <div id="0.1">
        <div id="0.1.0">Grand-child2.1</div>
    </div>
</div>`);

    // WHEN
    global.document = dom.window.document;
    const element = document.getElementById("0");
    createDOMTree(newNode, element);

    // THEN
    expect(dom.window.document.getElementById("0").children.length).toEqual(2);
    expect(dom.window.document.getElementById("0.0").children.length).toEqual(2);
    expect(dom.window.document.getElementById("0.0.0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("0.0.0.0").textContent).toEqual("Great-grand-child1.1.1");
    expect(dom.window.document.getElementById("0.0.1").children.length).toEqual(2);
    expect(dom.window.document.getElementById("0.0.1.0").textContent).toEqual("Great-grand-child1.2.1");
    expect(dom.window.document.getElementById("0.0.1.1").textContent).toEqual("Great-grand-child1.2.2");
    expect(dom.window.document.getElementById("0.1").children.length).toEqual(1);
    expect(dom.window.document.getElementById("0.1.0").textContent).toEqual("Grand-child2.1");
  });
});
