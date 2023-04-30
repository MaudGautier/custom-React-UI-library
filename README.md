# Custom React library

This is a custom TS library allowing to create interactive user interfaces for web applications.
It is similar in essence to the broadly known [React](https://react.dev/) library.

The goal of re-implementing React fom scratch was to be able to capture the essence of its underlying principles.

This project was based on Mathieu Eveillard's idea.

## Getting started
```
# Install dependencies
npm install

# Run the application
npm run start

# Go to http://localhost:1234 in your web browser

# Run tests
npm run test
```

## Organization of the repository

The library is fully contained in the`src/lib/` folder.
The entry point of the library is the `src/lib/index.ts` file.

A sample application using this library is in the `src/application.ts` file, which adds the application into the `src/htmlSample.html` start web page.


## Main ideas

The library works by creating a virtual dom based on the application's content.

Every time a component is updated, the difference between the previous virtual dom and the new virtual dom is recomputed.
The differences are then applied to re-render (= the real dom is recreated).
However, *only* the modified components are re-rendered in the real dom.

The differences between the previous and new virtual doms are identified by traversing the two component trees 
(previous & new) and comparing each node (= component) one on one.


## Features list

- [x] Create virtual dom elements (button, list)
- [x] Add interpret function to build DOM from virtual dom
- [x] Add useState hook re-rendering on change
- [x] Compute differences between previous and new virtual dom
- [x] Allow to patch only differences to recreate only relevant subtrees of the real dom
- [x] Re-render only necessary sub-parts of the DOM 
- [x] Add onClick props to differences identified to re-render on button click
- [ ] Fix unit test on onClick re-render
- [ ] Clean unnecessary libraries (serve) and files/functions
- [ ] Separate sample application into Design System elements and real application
- [ ] Add new virtual dom elements
- [ ] Improve the sample application
- [ ] Allow JSX
- [ ] Add an equivalent of `create-react-app` to start the app without writing the htmlSample file
- [ ] Add other hooks
