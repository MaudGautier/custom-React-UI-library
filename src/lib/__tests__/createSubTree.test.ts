import { JSDOM } from "jsdom";
import { createSubTree } from "../createSubtree";
import { VirtualDomElement } from "../index";

describe("createSubTree", () => {
  test("1 child", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        id: "child2",
        children: "child2Text",
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`<div id="root"><div id="child2">child2Text</div></div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(1);
    expect(dom.window.document.getElementById("child2").textContent).toEqual("child2Text");
  });

  test("2 children", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        id: "child1",
        children: "child1Text",
      },
      {
        tag: "div",
        id: "child2",
        children: "child2Text",
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="root">
    <div id="child1">child1Text</div>
    <div id="child2">child2Text</div>
</div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(2);
    expect(dom.window.document.getElementById("child1").textContent).toEqual("child1Text");
    expect(dom.window.document.getElementById("child2").textContent).toEqual("child2Text");
  });

  test("1 child with 1 grandchild", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        id: "child1",
        children: [
          {
            tag: "div",
            id: "child1.1",
            children: "grandChild",
          },
        ],
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="root">
    <div id="child1">
        <div id="child1.1">grandChild</div>
    </div>
</div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(1);
    expect(dom.window.document.getElementById("child1").children.length).toEqual(1);
    expect(dom.window.document.getElementById("child1.1").textContent).toEqual("grandChild");
  });

  test("3 levels of grandchildren (1 each level)", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        id: "child1",
        children: [
          {
            tag: "div",
            id: "child1.1",
            children: [
              {
                tag: "div",
                id: "child1.1.1",
                children: "Great-grand-child",
              },
            ],
          },
        ],
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="root">
    <div id="child1">
        <div id="child1.1">
            <div id="child1.1.1">Great-grand-child</div>
        </div>
    </div>
</div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(1);
    expect(dom.window.document.getElementById("child1").children.length).toEqual(1);
    expect(dom.window.document.getElementById("child1.1").children.length).toEqual(1);
    expect(dom.window.document.getElementById("child1.1.1").textContent).toEqual("Great-grand-child");
  });

  test("3 levels of grandchildren (with several at each level)", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        id: "child1",
        children: [
          {
            tag: "div",
            id: "child1.1",
            children: [
              {
                tag: "div",
                id: "child1.1.1",
                children: "Great-grand-child1.1.1",
              },
            ],
          },
          {
            tag: "div",
            id: "child1.2",
            children: [
              {
                tag: "div",
                id: "child1.2.1",
                children: "Great-grand-child1.2.1",
              },
              {
                tag: "div",
                id: "child1.2.2",
                children: "Great-grand-child1.2.2",
              },
            ],
          },
        ],
      },
      {
        tag: "div",
        id: "child2",
        children: [
          {
            tag: "div",
            id: "child2.1",
            children: "Grand-child2.1",
          },
        ],
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="root">
    <div id="child1">
        <div id="child1.1">
            <div id="child1.1.1">Great-grand-child1.1.1</div>
        </div>
        <div id="child1.2">
            <div id="child1.2.1">Great-grand-child1.2.1</div>
            <div id="child1.2.2">Great-grand-child1.2.2</div>
        </div>
    </div>
    <div id="child2">
        <div id="child2.1">Grand-child2.1</div>
    </div>
</div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(2);
    expect(dom.window.document.getElementById("child1").children.length).toEqual(2);
    expect(dom.window.document.getElementById("child1.1").children.length).toEqual(1);
    expect(dom.window.document.getElementById("child1.1.1").textContent).toEqual("Great-grand-child1.1.1");
    expect(dom.window.document.getElementById("child1.2").children.length).toEqual(2);
    expect(dom.window.document.getElementById("child1.2.1").textContent).toEqual("Great-grand-child1.2.1");
    expect(dom.window.document.getElementById("child1.2.2").textContent).toEqual("Great-grand-child1.2.2");
    expect(dom.window.document.getElementById("child2").children.length).toEqual(1);
    expect(dom.window.document.getElementById("child2.1").textContent).toEqual("Grand-child2.1");
  });
});
