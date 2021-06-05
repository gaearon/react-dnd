---
path: '/docs/api/hooks-overview'
title: 'Overview'
---

_New to React DnD? [Read the overview](/docs/overview) before jumping into the docs._

# Using the Hooks API

The hooks-based React DnD API leverages one of the significant newer features of React. Hooks have dramatically impacted how most people write their React components, and are the recommended approach for writing stateful and effectful code within React. Prior to hooks, the React community poured a lot of effort into Higher Order Components and Decorator-based libraries. After hooks were introduced to the React community, there has been a dramatic shift in switching towards approaches and libraries that utilize hooks over decorator-based techniques.

In the overview page, it is pointed out that Drag-and-drop interactions are inherently _stateful_. Because of this React DnD has been designed to take advantage of the Flux data pattern and model drag-and-drop state using actions and reducers (independent of React). Hooks are the perfect way to utilize a stateful data source in React. In fact, this is the approach taken by many state-management libraries in React!

There are three primary hooks that are provided to wire your components into React DnD, and a fourth is provided to give you a seam into React DnD (for testing or development purposes)

- [`useDrag`](/docs/api/use-drag)
- [`useDrop`](/docs/api/use-drop)
- [`useDragLayer`](/docs/api/use-drag-layer)
- [`useDragDropManager`](/docs/api/use-drag-drop-manager) (_dev/test hook_)

## Basic Example

To start using hooks, let's make a box draggable.

```jsx
import { useDrag } from 'react-dnd'

function Box() {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
		// "type" is required. It is used by the "accept" specification of drop targets.
    type: 'BOX',
		// The collect function utilizes a "monitor" instance (see the Overview for what this is)
		// to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    {/* This is optional. The dragPreview will be attached to the dragSource by default */}
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1}}>
        {/* The drag ref marks this node as being the "pick-up" node */}
        <div role="Handle" ref={drag}>
    </div>
  )
}
```

Now, let's make something for this to drag into.

```jsx
function Bucket() {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'BOX',
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  return (
    <div
      ref={drop}
      role={'Dustbin'}
      style={{ backgroundColor: isOver ? 'red' : 'white' }}
    >
      {canDrop ? 'Release to drop' : 'Drag a box here'}
    </div>
  )
}
```

To explore further, read the individual hook API documentation, or check out the [hook-based examples](https://github.com/react-dnd/react-dnd/tree/main/packages/examples-hooks) on GitHub.
