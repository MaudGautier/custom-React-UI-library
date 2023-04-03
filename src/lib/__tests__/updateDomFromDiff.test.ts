import { JSDOM } from "jsdom";
import { updateDomFromDiff } from "../updateDomFromDiff";
import { ModificationToApply } from "../diff";

describe("UPdateDomFromDiff", () => {
  describe("CASE setText", () => {
    test("If we have one setText for one child => this child should be updated", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          id: "1",
          children: "Hello World",
          type: "setText",
        },
      ];
      const dom = new JSDOM(`<div id="1">foo</div>`);
      // const expectedDom = new JSDOM(`<div id="1">Hello World</div>`);

      // WHEN
      updateDomFromDiff(dom.window.document, differences);

      // THEN
      expect(dom.window.document.getElementById("1").textContent).toEqual("Hello World");
    });

    test("If we have two setText for two parts of the dom => both parts should be updated", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          id: "1",
          children: "Hello World",
          type: "setText",
        },
        {
          id: "2",
          children: "New text",
          type: "setText",
        },
      ];
      const dom = new JSDOM(`
<div id="root">
  <div id="1">foo</div>
  <div id="2">bar</div>
  <div id="3">Do not change this</div>
</div>`);
      //       const expectedDom = new JSDOM(`
      // <div id="root">
      //   <div id="1">Hello World</div>
      //   <div id="2">New text</div>
      //   <div id="3">Do not change this</div>
      // </div>\`);
      // `);

      // WHEN
      updateDomFromDiff(dom.window.document, differences);

      // THEN
      expect(dom.window.document.getElementById("1").textContent).toEqual("Hello World");
      expect(dom.window.document.getElementById("2").textContent).toEqual("New text");
      expect(dom.window.document.getElementById("3").textContent).toEqual("Do not change this");
    });
  });

  describe("CASE setChildren", () => {
    test("If children of one node are modified => they should be updated", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          id: "root",
          children: "New child is a string",
          type: "setText",
        },
      ];
      const dom = new JSDOM(`
<div id="root">
  <div id="1">foo</div>
  <div id="2">bar</div>
  <div id="3">Do not change this</div>
</div>`);
      // const expectedDom = new JSDOM(`<div id="root">New child is a string</div>`);

      // WHEN
      updateDomFromDiff(dom.window.document, differences);

      // THEN
      expect(dom.window.document.getElementById("root").textContent).toEqual("New child is a string");
      expect(dom.window.document.getElementById("1")).toEqual(null);
      expect(dom.window.document.getElementById("2")).toEqual(null);
      expect(dom.window.document.getElementById("3")).toEqual(null);
    });

    test("If children of one node is added => it should be added to the parent", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          id: "root",
          children: [
            {
              tag: "div",
              id: "child1",
              children: "child1Text",
            },
          ],
          type: "setChildren",
        },
      ];
      const dom = new JSDOM(`<div id="root">Old text</div>`);

      const expectedDom = new JSDOM(`
      <div id="root">
          <div id="child1">child1Text</div>
      </div>`);

      // WHEN
      updateDomFromDiff(dom.window.document, differences);

      // THEN
      expect(dom.window.document.getElementById("child1").textContent).toEqual("child1Text");
      expect(dom.window.document.getElementById("root").children.length).toEqual(1);
    });

    test("If two children of one node are added => they should be added to the parent", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          id: "root",
          children: [
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
          ],
          type: "setChildren",
        },
      ];
      const dom = new JSDOM(`<div id="root">Old text</div>`);

      const expectedDom = new JSDOM(`
      <div id="root">
          <div id="child1">child1Text</div>
          <div id="child2">child2Text</div>
      </div>`);

      // WHEN
      updateDomFromDiff(dom.window.document, differences);

      // THEN
      expect(dom.window.document.getElementById("root").children.length).toEqual(2);
      expect(dom.window.document.getElementById("child1").textContent).toEqual("child1Text");
      expect(dom.window.document.getElementById("child2").textContent).toEqual("child2Text");
    });

    test("If two children of one node are added => they should be added to the parent", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          id: "root",
          children: [
            {
              tag: "div",
              id: "child1",
              children: [
                {
                  tag: "div",
                  id: "child1.1",
                  children: "child1.1Text",
                },
                {
                  tag: "div",
                  id: "child1.2",
                  children: "child1.2Text",
                },
              ],
            },
            {
              tag: "div",
              id: "child2",
              children: "child2Text",
            },
          ],
          type: "setChildren",
        },
      ];
      const dom = new JSDOM(`<div id="root">Old text</div>`);

      const expectedDom = new JSDOM(`
      <div id="root">
          <div id="child1">
              <div id="child1.1">child1.1Text</div>
              <div id="child1.2">child1.2Text</div>
          </div>
          <div id="child2">child2Text</div>
      </div>`);

      // WHEN
      updateDomFromDiff(dom.window.document, differences);

      // THEN
      expect(dom.window.document.getElementById("root").children.length).toEqual(2);
      expect(dom.window.document.getElementById("child2").textContent).toEqual("child2Text");
      expect(dom.window.document.getElementById("child1").children.length).toEqual(2);
      expect(dom.window.document.getElementById("child1.1").textContent).toEqual("child1.1Text");
      expect(dom.window.document.getElementById("child1.2").textContent).toEqual("child1.2Text");
    });
    //
    // test("If children of one node are modified => they should be updated", () => {
    //   // GIVEN
    //   const differences: ModificationToApply[] = [
    //     {
    //       id: "root",
    //       children: [
    //         {
    //           tag: "div",
    //           id: "child1",
    //           children: "child1Text",
    //         },
    //         {
    //           tag: "div",
    //           id: "child2",
    //           children: "child2Text",
    //         },
    //       ],
    //       type: "setChildren",
    //     },
    //   ];
    //   const dom = new JSDOM(`<div id="root">Old text</div>`);
    //   //       const expectedDom = new JSDOM(`
    //   // <div id="root">
    //   //     <div id="child1">child1Text</div>
    //   //     <div id="child2">child2Text</div>
    //   // </div>`);
    //
    //   // WHEN
    //   updateDomFromDiff(dom.window.document, differences);
    //
    //   // THEN
    //   expect(dom.window.document.getElementById("root").textContent).toEqual(null);
    //   expect(dom.window.document.getElementById("root").length).toEqual(2);
    //   expect(dom.window.document.getElementById("child1")).toEqual("child1Text");
    //   expect(dom.window.document.getElementById("child2")).toEqual("child2Text");
    // });
  });
});
