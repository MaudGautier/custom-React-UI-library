// noinspection JSConstantReassignment

import { JSDOM } from "jsdom";
import { patch } from "../patch";

import { ModificationToApply } from "../types";

describe("patch", () => {
  describe("CASE setText", () => {
    test("If we have one setText for one child => this child should be updated", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          path: [0],
          text: "Hello World",
          type: "setText",
        },
      ];
      const dom = new JSDOM(`<div id="0">foo</div>`);
      const expectedDom = new JSDOM(`<div id="1">Hello World</div>`);

      // WHEN
      global.document = dom.window.document;
      patch(differences);

      // THEN
      expect(document.getElementById("0").textContent).toEqual("Hello World");
    });

    test("If we have two setText for two parts of the dom => both parts should be updated", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          path: [0, 0],
          text: "Hello World",
          type: "setText",
        },
        {
          path: [0, 1],
          text: "New text",
          type: "setText",
        },
      ];
      const dom = new JSDOM(`
    <div id="0">
      <div id="0.0">foo</div>
      <div id="0.1">bar</div>
      <div id="0.2">Do not change this</div>
    </div>`);
      const expectedDom = new JSDOM(`
          <div id="0">
            <div id="0.0">Hello World</div>
            <div id="0.1">New text</div>
            <div id="0.2">Do not change this</div>
          </div>\`);
          `);

      // WHEN
      global.document = dom.window.document;
      patch(differences);

      // THEN
      expect(dom.window.document.getElementById("0.0").textContent).toEqual("Hello World");
      expect(dom.window.document.getElementById("0.1").textContent).toEqual("New text");
      expect(dom.window.document.getElementById("0.2").textContent).toEqual("Do not change this");
    });
  });

  describe("CASE setChildren", () => {
    test("If children of one node are modified => they should be updated", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          path: [0],
          text: "New child is a string",
          type: "setText",
        },
      ];
      const dom = new JSDOM(`
    <div id="0">
      <div id="0.0">foo</div>
      <div id="0.1">bar</div>
      <div id="0.2">Do not change this</div>
    </div>`);
      // const expectedDom = new JSDOM(`<div id="0">New child is a string</div>`);

      // WHEN
      global.document = dom.window.document;
      patch(differences);

      // THEN
      expect(dom.window.document.getElementById("0").textContent).toEqual("New child is a string");
      expect(dom.window.document.getElementById("0.0")).toEqual(null);
      expect(dom.window.document.getElementById("0.1")).toEqual(null);
      expect(dom.window.document.getElementById("0.2")).toEqual(null);
    });

    test("If children of one node is added => it should be added to the parent", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          path: [0],
          node: {
            tag: "div",
            children: [
              {
                tag: "div",
                children: "child1Text",
              },
            ],
          },
          type: "setChildren",
        },
      ];
      const dom = new JSDOM(`<div id="0">Old text</div>`);

      const expectedDom = new JSDOM(`
          <div id="0">
              <div id="0.0">child1Text</div>
          </div>`);

      // WHEN
      global.document = dom.window.document;
      patch(differences);

      // THEN
      expect(dom.window.document.getElementById("0").children.length).toEqual(1);
      expect(dom.window.document.getElementById("0.0").textContent).toEqual("child1Text");
    });

    test("If two children of one node are added => they should be added to the parent", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          path: [0],
          node: {
            tag: "div",
            children: [
              {
                tag: "div",
                children: "child1Text",
              },
              {
                tag: "div",
                children: "child2Text",
              },
            ],
          },
          type: "setChildren",
        },
      ];
      const dom = new JSDOM(`<div id="0">Old text</div>`);

      const expectedDom = new JSDOM(`
          <div id="0">
              <div id="0.0">child1Text</div>
              <div id="0.1">child2Text</div>
          </div>`);

      // WHEN
      global.document = dom.window.document;
      patch(differences);

      // THEN
      expect(dom.window.document.getElementById("0").children.length).toEqual(2);
      expect(dom.window.document.getElementById("0.0").textContent).toEqual("child1Text");
      expect(dom.window.document.getElementById("0.1").textContent).toEqual("child2Text");
    });

    test("If two children of one node are added => they should be added to the parent BIS", () => {
      // GIVEN
      const differences: ModificationToApply[] = [
        {
          path: [0],
          node: {
            tag: "div",
            children: [
              {
                tag: "div",
                children: [
                  {
                    tag: "div",
                    children: "child1.1Text",
                  },
                  {
                    tag: "div",
                    children: "child1.2Text",
                  },
                ],
              },
              {
                tag: "div",
                children: "child2Text",
              },
            ],
          },
          type: "setChildren",
        },
      ];
      const dom = new JSDOM(`<div id="0">Old text</div>`);

      const expectedDom = new JSDOM(`
          <div id="0">
              <div id="0.0">
                  <div id="0.0.0">child1.1Text</div>
                  <div id="0.0.1">child1.2Text</div>
              </div>
              <div id="0.1">child2Text</div>
          </div>`);

      // WHEN
      global.document = dom.window.document;
      patch(differences);

      // THEN
      expect(dom.window.document.getElementById("0").children.length).toEqual(2);
      expect(dom.window.document.getElementById("0.1").textContent).toEqual("child2Text");
      expect(dom.window.document.getElementById("0.0").children.length).toEqual(2);
      expect(dom.window.document.getElementById("0.0.0").textContent).toEqual("child1.1Text");
      expect(dom.window.document.getElementById("0.0.1").textContent).toEqual("child1.2Text");
    });
  });

  describe("CASE setOnClick", () => {
    test("change onclick property", () => {
      // GIVEN
      console.log = jest.fn();

      const previousOnClick = () => {
        console.log("previousOnClick");
      };
      const newOnClick = () => {
        console.log("newOnClick");
      };
      const differences: ModificationToApply[] = [
        {
          path: [0],
          type: "setOnClick",
          onClick: newOnClick,
        },
      ];
      const dom = new JSDOM(`<button id="0" onclick={previousOnClick}}>Click on button</button>`);
      const expectedDom = new JSDOM(`<button id="0" onclick={newOnClick}}>Click on button</button>`);

      // WHEN
      global.document = dom.window.document;
      patch(differences);

      // THEN
      document.getElementById("0").click();
      // Ensures that the event listener corresponds to the new onClick function (and not the previous one)
      expect(console.log).toHaveBeenCalledWith("newOnClick");
      expect(console.log).not.toHaveBeenCalledWith("previousOnClick");
      // Ensures that the previous event listener has been removed (only called once not twice)
      expect(console.log).toHaveBeenCalledTimes(1);
    });
    test("change onclick property twice in a row", () => {
      /**
       * As compared to the test above, this one does _NOT_ add manually the 'addEventListener' nor the 'eventListened'
       * properties onto the second change => this test ensures that we go through all the stages for the onClick (i.e.
       * remove previous event listener corresponding to `eventListened` prop, add new event listener corresponding to
       * the onClick function passed, and input the correct `eventListened` prop).
       * */

      // GIVEN
      console.log = jest.fn();

      const previousOnClick = () => {
        console.log("previousOnClick");
      };
      const newOnClick = () => {
        console.log("newOnClick");
      };
      const yetAnotherOnClick = () => {
        console.log("yetAnotherOnClick");
      };

      const differences1: ModificationToApply[] = [
        {
          path: [0],
          type: "setOnClick",
          onClick: newOnClick,
        },
      ];
      const differences2: ModificationToApply[] = [
        {
          path: [0],
          type: "setOnClick",
          onClick: yetAnotherOnClick,
        },
      ];

      const dom = new JSDOM(`<button id="0" onclick={previousOnClick}}>Click on button</button>`);
      const expectedDom1 = new JSDOM(`<button id="0" onclick={newOnClick}}>Click on button</button>`);
      const expectedDom2 = new JSDOM(`<button id="0" onclick={yetAnotherOnClick}}>Click on button</button>`);

      // WHEN
      global.document = dom.window.document;
      patch(differences1); // Expect to have expectedDom1 at this stage
      patch(differences2); // Expect to have expectedDom2 at this stage

      // THEN
      document.getElementById("0").click();
      // Ensures that the event listener corresponds to the new onClick function (and not any of the previous ones)
      expect(console.log).toHaveBeenCalledWith("yetAnotherOnClick");
      expect(console.log).not.toHaveBeenCalledWith("previousOnClick");
      expect(console.log).not.toHaveBeenCalledWith("newOnClick");
      // Ensures that the previous event listener has been removed (only called once not twice)
      expect(console.log).toHaveBeenCalledTimes(1);
    });
  });
});
