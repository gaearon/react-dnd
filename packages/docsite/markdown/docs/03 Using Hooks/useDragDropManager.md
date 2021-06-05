---
path: '/docs/api/use-drag-drop-manager'
title: 'useDragDropManager'
---

_New to React DnD? [Read the overview](/docs/overview) before jumping into the docs._

# useDragDropManager

This hook provides a user with access into the DnD system. The DragDropManager instance
is a singleton created by React DnD that contains access to state, monitors, the backend, etc..

```jsx
import { useDragDropManager } from 'react-dnd'

function Example() {
  // The manager provides access to all of React DnD's internals
  const dragDropManager = useDragDropManager()

  return <div>Example</div>
}
```
