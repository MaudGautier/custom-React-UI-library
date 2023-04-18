import { diff } from "../diff";
import { VirtualDomElement } from "../index";

describe("Diff algo between two virtual dom", () => {
  describe("Children are strings", () => {
    test("Two identical nodes without children are not different", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "element",
        // id: "1",
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "element",
        // id: "1",
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([]);
    });

    test("Two identical nodes with different children are different", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "element1",
        // id: "1",
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "element2",
        // id: "1",
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          // id: "1",
          path: [0],
          children: "element2",
          type: "setText",
        },
      ]);
    });
  });

  describe("Children are arrays", () => {
    test("2 nodes with 1 child with different text should change", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "oldText",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "newText",
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          // id: "child1",
          path: [0, 0],
          type: "setText",
          children: "newText",
        },
      ]);
    });

    test("2 nodes with 2 children, one of which has different text should change", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "child1Text",
          },
          {
            tag: "div",
            // id: "child2",
            children: "child2oldText",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "child1Text",
          },
          {
            tag: "div",
            // id: "child2",
            children: "child2newText",
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          type: "setText",
          path: [0, 1],
          // id: "child2",
          children: "child2newText",
        },
      ]);
    });

    test("newNode has more children than old one", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "child1Text",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "child1Text",
          },
          {
            tag: "div",
            // id: "child2",
            children: "child2newText",
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          type: "setChildren",
          path: [0],
          // id: "root",
          children: [
            {
              tag: "div",
              // id: "child1",
              children: "child1Text",
            },
            {
              tag: "div",
              // id: "child2",
              children: "child2newText",
            },
          ],
        },
      ]);
    });

    test("newNode has fewer children than old one", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "child1Text",
          },
          {
            tag: "div",
            // id: "child2",
            children: "child2oldText",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "child1Text",
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          type: "setChildren",
          // id: "root",
          path: [0],
          children: [
            {
              tag: "div",
              // id: "child1",
              children: "child1Text",
            },
          ],
        },
      ]);
    });
  });

  describe("2 nodes with children of different types (one string, one array)", () => {
    test("Old node has array while new has string", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "child1Text",
          },
          {
            tag: "div",
            // id: "child2",
            children: "child2oldText",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: "new children",
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          type: "setText",
          // id: "root",
          path: [0],
          children: "new children",
        },
      ]);
    });

    test("Old node has string while new has array", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: "new children",
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "child1",
            children: "child1Text",
          },
          {
            tag: "div",
            // id: "child2",
            children: "child2oldText",
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          type: "setChildren",
          // id: "root",
          path: [0],
          children: [
            {
              tag: "div",
              // id: "child1",
              children: "child1Text",
            },
            {
              tag: "div",
              // id: "child2",
              children: "child2oldText",
            },
          ],
        },
      ]);
    });
  });

  describe("Case with several branches with differences", () => {
    test("If 3 branches differ => all 3 should appear", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "1",
            children: [
              {
                tag: "div",
                // id: "1.1",
                children: "1.1.1",
              },
            ],
          },
          {
            tag: "div",
            // id: "2",
            children: [
              {
                tag: "div",
                // id: "2.1",
                children: [
                  {
                    tag: "div",
                    // id: "2.1.1",
                    children: [
                      {
                        tag: "div",
                        // id: "2.1.1.1",
                        children: "2.1.1.1.1",
                      },
                      {
                        tag: "div",
                        // id: "2.1.1.2",
                        children: "2.1.1.2.1",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            // id: "3",
            children: [
              {
                tag: "div",
                // id: "3.1",
                children: [
                  {
                    tag: "div",
                    // id: "3.1.1",
                    children: "3.1.1.1",
                  },
                  {
                    tag: "div",
                    // id: "3.1.2",
                    children: "3.1.2.1",
                  },
                  {
                    tag: "div",
                    // id: "3.1.3",
                    children: "3.1.3.1",
                  },
                ],
              },
              {
                tag: "div",
                // id: "3.2",
                children: [
                  {
                    tag: "div",
                    // id: "3.2.1",
                    children: "3.2.1.1",
                  },
                  {
                    tag: "div",
                    // id: "3.2.2",
                    children: "3.2.2.1",
                  },
                  {
                    tag: "div",
                    // id: "3.2.3",
                    children: "3.2.3.1",
                  },
                ],
              },
            ],
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        // id: "root",
        children: [
          {
            tag: "div",
            // id: "1",
            children: [
              {
                tag: "div",
                // id: "1.1",
                children: "1.1.1-MODIFIED",
              },
            ],
          },
          {
            tag: "div",
            // id: "2",
            children: [
              {
                tag: "div",
                // id: "2.1",
                children: [
                  {
                    tag: "div",
                    // id: "2.1.1",
                    children: [
                      {
                        tag: "div",
                        // id: "2.1.1.1",
                        children: "2.1.1.1.1",
                      },
                      {
                        tag: "div",
                        // id: "2.1.1.2",
                        children: "2.1.1.2.1",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            // id: "3",
            children: [
              {
                tag: "div",
                // id: "3.1",
                children: [
                  {
                    tag: "div",
                    // id: "3.1.1",
                    children: "3.1.1.1",
                  },
                  {
                    tag: "div",
                    // id: "3.1.2",
                    children: "3.1.2.1-MODIFIED",
                  },
                  {
                    tag: "div",
                    // id: "3.1.3",
                    children: "3.1.3.1",
                  },
                ],
              },
              {
                tag: "div",
                // id: "3.2",
                children: [
                  {
                    tag: "div",
                    // id: "3.2.2",
                    children: "3.2.2.1",
                  },
                  {
                    tag: "div",
                    // id: "3.2.3",
                    children: "3.2.3.1",
                  },
                ],
              },
            ],
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          type: "setText",
          // id: "1.1",
          path: [0, 0, 0],
          children: "1.1.1-MODIFIED",
        },

        {
          type: "setText",
          // id: "3.1.2",
          path: [0, 2, 0, 1],
          children: "3.1.2.1-MODIFIED",
        },
        {
          type: "setChildren",
          // id: "3.2",
          path: [0, 2, 1],
          children: [
            {
              tag: "div",
              // id: "3.2.2",
              children: "3.2.2.1",
            },
            {
              tag: "div",
              // id: "3.2.3",
              children: "3.2.3.1",
            },
          ],
        },
      ]);
    });
  });
});
