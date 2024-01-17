import { diff } from "../diff";

import { VirtualDomElement } from "../types";

describe("Diff algo between two virtual dom", () => {
  describe("Children are Text (string)", () => {
    test("Two identical nodes without children are not different", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "element",
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "element",
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
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "element2",
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          path: [0],
          text: "element2",
          type: "setText",
        },
      ]);
    });
  });

  describe("Children are Text (number)", () => {
    test("Two identical nodes without children are not different", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: 1,
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: 1,
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
        children: 1,
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: 2,
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          path: [0],
          text: 2,
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
        children: [
          {
            tag: "div",
            children: "oldText",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "div",
            children: "newText",
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          path: [0, 0],
          type: "setText",
          text: "newText",
        },
      ]);
    });

    test("2 nodes with 2 children, one of which has different text should change", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "div",
            children: "child1Text",
          },
          {
            tag: "div",
            children: "child2oldText",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "div",
            children: "child1Text",
          },
          {
            tag: "div",
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
          text: "child2newText",
        },
      ]);
    });

    test("newNode has more children than old one", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "div",
            children: "child1Text",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "div",
            children: "child1Text",
          },
          {
            tag: "div",
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
          children: [
            {
              tag: "div",
              children: "child1Text",
            },
            {
              tag: "div",
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
        children: [
          {
            tag: "div",
            children: "child1Text",
          },
          {
            tag: "div",
            children: "child2oldText",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "div",
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
          path: [0],
          children: [
            {
              tag: "div",
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
        children: [
          {
            tag: "div",
            children: "child1Text",
          },
          {
            tag: "div",
            children: "child2oldText",
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "new children",
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(elementsToUpdate).toEqual([
        {
          type: "setText",
          path: [0],
          text: "new children",
        },
      ]);
    });

    test("Old node has string while new has array", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "new children",
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "div",
            children: "child1Text",
          },
          {
            tag: "div",
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
          path: [0],
          children: [
            {
              tag: "div",
              children: "child1Text",
            },
            {
              tag: "div",
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
        children: [
          {
            tag: "div",
            children: [
              {
                tag: "div",
                children: "1.1.1",
              },
            ],
          },
          {
            tag: "div",
            children: [
              {
                tag: "div",
                children: [
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        children: "2.1.1.1.1",
                      },
                      {
                        tag: "div",
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
            children: [
              {
                tag: "div",
                children: [
                  {
                    tag: "div",
                    children: "3.1.1.1",
                  },
                  {
                    tag: "div",
                    children: "3.1.2.1",
                  },
                  {
                    tag: "div",
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
                    children: "3.2.1.1",
                  },
                  {
                    tag: "div",
                    children: "3.2.2.1",
                  },
                  {
                    tag: "div",
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
        children: [
          {
            tag: "div",
            children: [
              {
                tag: "div",
                children: "1.1.1-MODIFIED",
              },
            ],
          },
          {
            tag: "div",
            children: [
              {
                tag: "div",
                children: [
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        children: "2.1.1.1.1",
                      },
                      {
                        tag: "div",
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
            children: [
              {
                tag: "div",
                children: [
                  {
                    tag: "div",
                    children: "3.1.1.1",
                  },
                  {
                    tag: "div",
                    children: "3.1.2.1-MODIFIED",
                  },
                  {
                    tag: "div",
                    children: "3.1.3.1",
                  },
                ],
              },
              {
                tag: "div",
                children: [
                  {
                    tag: "div",
                    children: "3.2.2.1",
                  },
                  {
                    tag: "div",
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
          path: [0, 0, 0],
          text: "1.1.1-MODIFIED",
        },

        {
          type: "setText",
          path: [0, 2, 0, 1],
          text: "3.1.2.1-MODIFIED",
        },
        {
          type: "setChildren",
          path: [0, 2, 1],
          children: [
            {
              tag: "div",
              children: "3.2.2.1",
            },
            {
              tag: "div",
              children: "3.2.3.1",
            },
          ],
        },
      ]);
    });
  });

  describe("Children have clickable buttons", () => {
    test("A node with a button is different than a node without a button", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: "element without button",
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "button",
            children: "Click on button",
            onClick: () => {},
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(JSON.stringify(elementsToUpdate)).toEqual(
        JSON.stringify([
          {
            path: [0],
            type: "setChildren",
            children: [
              {
                tag: "button",
                children: "Click on button",
                onClick: () => {},
              },
            ],
          },
        ])
      );
    });

    test("2 button nodes with different `onClick` properties are different", () => {
      // GIVEN
      const oldVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "button",
            children: "Click on button",
            onClick: () => {
              console.log("Previous button");
            },
          },
        ],
      };
      const newVirtualDomElement: VirtualDomElement = {
        tag: "div",
        children: [
          {
            tag: "button",
            children: "Click on button",
            onClick: () => {
              console.log("New button");
            },
          },
        ],
      };

      // WHEN
      const elementsToUpdate = diff(oldVirtualDomElement, newVirtualDomElement);

      // THEN
      expect(JSON.stringify(elementsToUpdate)).toEqual(
        JSON.stringify([
          {
            path: [0, 0],
            type: "setOnClick",
            onClick: () => {
              console.log("New button");
            },
          },
        ])
      );
    });
  });
});
