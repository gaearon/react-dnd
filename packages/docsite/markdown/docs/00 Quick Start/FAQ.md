---
path: '/docs/faq'
title: 'FAQ'
---

<!--alex disable hook -->

_New to React DnD? [Read the overview](/docs/overview) before jumping into the docs._

# FAQ

## Usage

### Where do I get the pre-compiled version?

```
npm install --save react-dnd
npm install --save react-dnd-html5-backend
```

### How do I test React DnD components and their interaction?

See the [testing](/docs/testing) tutorial for examples.

### How do I make the component draggable only by a small handle?

Specify the container node as the `dragPreview`, but only make the drag handle a `dragSource()`.
See the [custom drag handle example](/examples/customize/handles-and-previews).

### How do I constrain the drag preview movement?

By default, you can't constrain the drag preview movement because the drag preview is drawn by the browser. You can, however, use a [custom drag layer](/examples/drag-around/custom-drag-layer) where you're free to rendering anything, with any snapping or constraints.

### How do I register a drag source or a drop target when the type depends on props?

Both [`DragSource`](/docs/api/drag-source) and [`DropTarget`](/docs/api/drop-target) let you pass a function as the first parameter instead of a string or a symbol. If you pass a function, it will be given the current props, and it should return a string, a symbol, or (for drop targets only) an array of either.

### How do I combine several drag sources and drop targets in a single component?

Because [`DragSource`](/docs/api/drag-source) and [`DropTarget`](/docs/api/drop-target) use the partial application, you may compose them using a functional composition helper such as [`_.flow`](https://lodash.com/docs#flow). With decorators, you can stack the decorators to achieve the same effect.

### Why is the `component` parameter always `null` in the `beginDrag`/`endDrag`/`drop`/`hover` methods?

When using [function components](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions), refs cannot normally be attached. However, if you use [React.forwardRef](https://reactjs.org/docs/forwarding-refs.html), then you can access the rendered component. If your component exposes an imperative API via the [useImperativeHandle hook](https://reactjs.org/docs/hooks-reference.html#useimperativehandle), then you can expose functionality that way.

If you use a tool like [babel-react-optimize](https://github.com/jamiebuilds/babel-react-optimize#transform-react-pure-class-to-function) preset or [babel-plugin-transform-react-pure-class-to-function](https://github.com/jamiebuilds/babel-react-optimize/tree/master/packages/babel-plugin-transform-react-pure-class-to-function), then be aware that your class definition may implicitly be transformed into a function component, which may result in a null argument.

```jsx
import { DragSource } from 'react-dnd'
import flow from 'lodash/flow'

class YourComponent {
  /* ... */
}

export default flow(DragSource(/* ... */), DropTarget(/* ... */))(YourComponent)
```

### How do I register a drop target for the native files?

If you are using the [HTML5 backend](/docs/backends/html5), you can register a drop target for one of the `NativeTypes` it exports:

```jsx
import React from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { DropTarget } from 'react-dnd'

const fileTarget = {
  drop(props, monitor) {
    console.log(monitor.getItem().files)
  }
}

function FileDropZone({ connectDropTarget, isOver, canDrop }) {
  return connectDropTarget(
    <div>
      {!isOver && !canDrop && 'Drag files from the hard drive'}
      {!isOver && canDrop && 'Drag the files here'}
      {isOver && 'Drop the files'}
    </div>
  )
}

export default DropTarget(NativeTypes.FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(FileDropZone)
```

### How do I write a custom backend?

This is not currently documented, but you can take cues from the [HTML5](/docs/backends/html5) and [Test](/docs/backends/test) backend implementations. The backend contract includes `setup()` and `teardown()` methods, and `connectDragSource()`, `connectDragPreview()` and `connectDropTarget()` methods that pass the DOM nodes to the backend. Contributions to the documentation are welcome.

### I am getting a “Super expression must either be null or a function, not undefined” error

React DnD requires React 16.8. Make sure you are using at least that version.

### Why won't my static methods and properties work?

Consider this example:

```javascript
class Page {
  static willTransitionTo(transition, params) {
    /* ... */
  }

  render() {
    /* ... */
  }
}

export default DragDropContext(HTML5Backend)(Page)
```

It might surprise you that your route handler's `willTransitionTo` (or a similar method) won't get triggered in this case! React DnD doesn't proxy your components' static methods and properties. This is too fragile and full of edge cases, so you must do it yourself. To do this, put your statics onto the components returned by React DnD instead:

```javascript
class Page {
  render() {
    /* ... */
  }
}

Page = DragDropContext(HTML5Backend)(Page)
Page.willTransitionTo = function (transition, params) {
  /* ... */
}

export default Page
```

## Meta

### Is this Dungeons & Dragons?

I know, it's only drag and drop, [but I like it](http://www.youtube.com/watch?v=JGaBlygm0UY).

### How stable is it?

[Stampsy](http://stampsy.com) has been using this library, as well as its non-React predecessor that it was based on, since 2013. It's central to the Stampsy user experience, because all the content is created in a drag and drop post editor that uses React DnD.

### Who made it and why?

React DnD was created by [Dan Abramov](http://github.com/gaearon).

Its aim is to expose a powerful API that is browser-agnostic, data-centric, works great with React and Flux, and is testable and extensible. Read [The Future of the Drag and Drop API](https://medium.com/@dan_abramov/the-future-of-drag-and-drop-apis-249dfea7a15f) for some context.

It is loosely based on the pre-React code written at Stampsy by [Andrew Kuznetsov](https://github.com/cavinsmith). Later it received valuable contributions from [Alexander Kuznetsov](https://github.com/alexkuz) and [Nathan Hutchison](https://github.com/nelix).

React DnD would not have reached the 1.0 release without the generous donations from:

- [Macropod](https://macropod.com/), a company developing team productivity software;
- [Webflow](https://webflow.com/), a company creating a professional responsive website builder.

[Gadzhi Kharkharov](http://kkga.me/) styled the website, and the [fixed-data-table](https://github.com/facebook/fixed-data-table) project provided the website template.

### How Do I Contribute?

Contributing the documentation for the underlying [DnD Core](https://github.com/react-dnd/dnd-core) library would be a huge help, as it is currently not documented at all, but its concepts leak in some advanced scenarios such as [writing tests](/docs/testing).

Porting the library to other modern frameworks such as Cycle, Mercury, or Deku, is also appreciated. Such ports would be able to reuse DnD Core logic and the existing backends.

Please let me know via the [issue tracker](https://github.com/react-dnd/react-dnd/issues) if you create advanced examples such as a Kanban board application, or write a blog post or record a screencast about React DnD, so I can link to it.

While DnD Core is fully tested, React DnD does not currently have any unit tests. Writing them is a great and eagerly desired contribution.

⚛
