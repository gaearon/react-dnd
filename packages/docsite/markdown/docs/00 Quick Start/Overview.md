---
path: '/docs/overview'
title: 'Overview'
---

# Overview

React DnD is unlike most of the drag and drop libraries out there, and it can be intimidating if you've never used it before. However, once you get a taste of a few concepts at the heart of its design, it starts to make sense. I suggest you read about these concepts before the rest of the docs.

Some of these concepts resemble the [Flux](http://facebook.github.io/flux/) and [Redux](https://github.com/reactjs/react-redux) architectures.  
This is not a coincidence, as React DnD uses Redux internally.

### Items and Types

Like Flux (or Redux), React DnD uses data, and not the views, as the source of truth. When you drag something across the screen, we don't say that a component, or a DOM node is being dragged. Instead, we say that an _item_ of a certain _type_ is being dragged.

What is an item? An _item_ is a plain JavaScript object _describing_ what's being dragged. For example, in a Kanban board application, when you drag a card, an item might look like `{ cardId: 42 }`. In a Chess game, when you pick up a piece, the item might look like `{ fromCell: 'C5', piece: 'queen' }`. **Describing the dragged data as a plain object helps you keep the components decoupled and unaware of each other.**

What is a type, then? A _type_ is a string (or a [symbol](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol)) uniquely identifying _a whole class of items_ in your application. In a Kanban board app, you might have a `'card'` type representing the draggable cards and a `'list'` type for the draggable lists of those cards. In Chess, you might only have a single `'piece'` type.

Types are useful because, as your app grows, you might want to make more things draggable, but you don't necessarily want all the existing drop targets to suddenly start reacting to the new items. **The types let you specify which drag sources and drop targets are compatible.** You're probably going to have an enumeration of the type constants in your application, similar to how you may have an enumeration of the Redux action types.

### Monitors

Drag and drop is inherently stateful. Either a drag operation is in progress, or it isn't. Either there is a current type and a current item, or there isn't. This state has to live somewhere.

React DnD exposes this state to your components via a few tiny wrappers over the internal state storage called the _monitors_. **The monitors let you update the props of your components in response to the drag and drop state changes.**

For each component that needs to track the drag and drop state, you can define a _collecting function_ that retrieves the relevant bits of it from the monitors. React DnD then takes care of timely calling your collecting function and merging its return value into your components' props.

Let's say you want to highlight the Chess cells when a piece is being dragged. A collecting function for the `Cell` component might look like this:

```jsx
function collect(monitor) {
  return {
    highlighted: monitor.canDrop(),
    hovered: monitor.isOver()
  }
}
```

It instructs React DnD to pass the up-to-date values of `highlighted` and `hovered` to all the `Cell` instances as props.

### Connectors

If the backend handles the DOM events, but the components use React to describe the DOM, how does the backend know which DOM nodes to listen to? Enter the _connectors_. **The connectors let you assign one of the predefined roles (a drag source, a drag preview, or a drop target) to the DOM nodes** in your `render` function.

In fact, a connector is passed as the first argument to the _collecting function_ we described above. Let's see how we can use it to specify the drop target:

```jsx
function collect(connect, monitor) {
  return {
    highlighted: monitor.canDrop(),
    hovered: monitor.isOver(),
    connectDropTarget: connect.dropTarget()
  }
}
```

In the component's `render` method, we are then able to access both the data obtained from the monitor, and the function obtained from the connector:

```jsx
render() {
  const { highlighted, hovered, connectDropTarget } = this.props;

  return connectDropTarget(
    <div className={classSet({
      'Cell': true,
      'Cell--highlighted': highlighted,
      'Cell--hovered': hovered
    })}>
      {this.props.children}
    </div>
  );
}
```

The `connectDropTarget` call tells React DnD that the root DOM node of our component is a valid drop target, and that its hover and drop events should be handled by the backend. Internally it works by attaching a [callback ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) to the React element you gave it. The function returned by the connector is memoized, so it doesn't break the `shouldComponentUpdate` optimizations.

### Drag Sources and Drop Targets

So far we have covered the backends which work with the DOM, the data, as represented by the items and types, and the collecting functions that, thanks to the monitors and the connectors, let you describe what props React DnD should inject into your components.

But how do we configure our components to actually have those props injected? How do we perform the side effects in response to the drag and drop events? Meet the _drag sources_ and the _drop targets_, the primary abstraction units of React DnD. **They really tie the types, the items, the side effects, and the collecting functions together with your components.**

Whenever you want to make a component or some part of it draggable, you need to wrap that component into a _drag source_ declaration. Every drag source is registered for a certain _type_, and has to implement a method producing an _item_ from the component's props. It can also optionally specify a few other methods for handling the drag and drop events. The drag source declaration also lets you specify the _collecting function_ for the given component.

The _drop targets_ are very similar to the drag sources. The only difference is that a single drop target may register for several item types at once, and instead of producing an item, it may handle its hover or drop.

### Backends

React DnD uses the [HTML5 drag and drop API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop). It is a reasonable default because it screenshots the dragged DOM node and uses it as a “drag preview” out of the box. It's handy that you don't have to do any drawing as the cursor moves. This API is also the only way to handle the file drop events.

Unfortunately, the HTML5 drag and drop API also has some downsides. It does not work on touch screens, and it provides less customization opportunities on IE than in other browsers.

This is why **the HTML5 drag and drop support is implemented in a pluggable way** in React DnD. You don't have to use it. You can write a different implementation, based on touch events, mouse events, or something else entirely. Such pluggable implementations are called the _backends_ in React DnD.

The library currently ships with the [HTML backend](docs/backends/html5), which should be sufficient for most web applications. There is also a [Touch backend](/docs/backend/touch) that can be used for mobile web applications.

The backends perform a similar role to that of React's synthetic event system: **they abstract away the browser differences and process the native DOM events.** Despite the similarities, React DnD backends do not have a dependency on React or its synthetic event system. Under the hood, all the backends do is translate the DOM events into the internal Redux actions that React DnD can process.

### Hooks vs Higher-Order Components

Now you should have an understanding of the various moving pieces of React DnD:

- Item objects and types
- DnD state via flux
- Monitors for observing DnD state
- Collector functions for turning monitor output into consumable props
- Connectors for attaching the DnD state machine to view nodes (e.g. DOM elements)

Now let's talk about how these pieces come together in your components. You have two options: a modern hooks-based API and the classic Decorators-based API.

### Hooks

Modern React applications have replaced the Higher-Order-Component pattern with hooks. Hooks are a feature of React, introduced in 16.8, that allow for developers to write stateful function components. They are also fantastic for managing stateful components, and also for interacting with external stateful systems (\***cough**\* like a Drag-and-Drop engine \***cough**\*).

If you are unfamiliar with React hooks, refer to the React blog post, [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html).

React-DnD provides hooks that connect your components to the DnD engine, and allow you to collect monitor state for rendering.

For an overview of the hooks-based API, refer to the [Hooks Overview](/docs/api/hooks-overview) page.

### Higher-Order Components and Decorators

### Conclusion

Now you know enough about React DnD to explore the rest of the documentation!  
The [hooks overview](/docs/api/hooks-overview) and [decorators overview](/docs/api/decorators-overview) documentation pages are great places to start. Or jump straight into the [tutorial app](/docs/tutorial) and build a chess game!
