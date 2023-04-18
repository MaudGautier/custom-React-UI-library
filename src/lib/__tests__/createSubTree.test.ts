import { JSDOM } from "jsdom";
import { createSubTree } from "../createSubtree";
import { VirtualDomElement } from "../index";

describe("createSubTree", () => {
  test("1 child", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        // id: "child2",
        children: "child2Text",
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`<div id="root"><div id="root.0">child2Text</div></div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(1);
    expect(dom.window.document.getElementById("root.0").textContent).toEqual("child2Text");
  });

  test("2 children", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        // id: "child1",
        children: "child1Text",
      },
      {
        tag: "div",
        // id: "child2",
        children: "child2Text",
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="root">
    <div id="root.0">child1Text</div>
    <div id="root.1">child2Text</div>
</div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(2);
    expect(dom.window.document.getElementById("root.0").textContent).toEqual("child1Text");
    expect(dom.window.document.getElementById("root.1").textContent).toEqual("child2Text");
  });

  test("1 child with 1 grandchild", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        // id: "child1",
        children: [
          {
            tag: "div",
            // id: "child1.1",
            children: "grandChild",
          },
        ],
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="root">
    <div id="root.0">
        <div id="root.0.0">grandChild</div>
    </div>
</div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(1);
    expect(dom.window.document.getElementById("root.0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("root.0.0").textContent).toEqual("grandChild");
  });

  test("3 levels of grandchildren (1 each level)", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        // id: "child1",
        children: [
          {
            tag: "div",
            // id: "child1.1",
            children: [
              {
                tag: "div",
                // id: "child1.1.1",
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
    <div id="root.0">
        <div id="root.0.0">
            <div id="root.0.0.0">Great-grand-child</div>
        </div>
    </div>
</div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(1);
    expect(dom.window.document.getElementById("root.0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("root.0.0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("root.0.0.0").textContent).toEqual("Great-grand-child");
  });

  test("3 levels of grandchildren (with several at each level)", () => {
    // GIVEN
    const children: VirtualDomElement[] = [
      {
        tag: "div",
        // id: "child1",
        children: [
          {
            tag: "div",
            // id: "child1.1",
            children: [
              {
                tag: "div",
                // id: "child1.1.1",
                children: "Great-grand-child1.1.1",
              },
            ],
          },
          {
            tag: "div",
            // id: "child1.2",
            children: [
              {
                tag: "div",
                // id: "child1.2.1",
                children: "Great-grand-child1.2.1",
              },
              {
                tag: "div",
                // id: "child1.2.2",
                children: "Great-grand-child1.2.2",
              },
            ],
          },
        ],
      },
      {
        tag: "div",
        // id: "child2",
        children: [
          {
            tag: "div",
            // id: "child2.1",
            children: "Grand-child2.1",
          },
        ],
      },
    ];
    const dom = new JSDOM(`<div id="root">Old text</div>`);
    const expectedDom = new JSDOM(`
<div id="root">
    <div id="root.0">
        <div id="root.0.0">
            <div id="root.0.0.0">Great-grand-child1.1.1</div>
        </div>
        <div id="root.0.1">
            <div id="root.0.1.0">Great-grand-child1.2.1</div>
            <div id="root.0.1.1">Great-grand-child1.2.2</div>
        </div>
    </div>
    <div id="root.1">
        <div id="root.1.0">Grand-child2.1</div>
    </div>
</div>`);

    // WHEN
    createSubTree(dom.window.document, children, "root");

    // THEN
    expect(dom.window.document.getElementById("root").children.length).toEqual(2);
    expect(dom.window.document.getElementById("root.0").children.length).toEqual(2);
    expect(dom.window.document.getElementById("root.0.0").children.length).toEqual(1);
    expect(dom.window.document.getElementById("root.0.0.0").textContent).toEqual("Great-grand-child1.1.1");
    expect(dom.window.document.getElementById("root.0.1").children.length).toEqual(2);
    expect(dom.window.document.getElementById("root.0.1.0").textContent).toEqual("Great-grand-child1.2.1");
    expect(dom.window.document.getElementById("root.0.1.1").textContent).toEqual("Great-grand-child1.2.2");
    expect(dom.window.document.getElementById("root.1").children.length).toEqual(1);
    expect(dom.window.document.getElementById("root.1.0").textContent).toEqual("Grand-child2.1");
  });
});
