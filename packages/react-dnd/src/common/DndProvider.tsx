import { FC, useEffect, memo } from 'react'
import { BackendFactory, DragDropManager } from 'dnd-core'
import { DndContext, createDndContext } from './DndContext'

export type DndProviderProps<BackendContext, BackendOptions> =
	| {
			manager: DragDropManager
	  }
	| {
			backend: BackendFactory
			context?: BackendContext
			options?: BackendOptions
			debugMode?: boolean
	  }

let refCount = 0
const INSTANCE_SYM = Symbol.for('__REACT_DND_CONTEXT_INSTANCE__')

/**
 * A React component that provides the React-DnD context
 */
export const DndProvider: FC<DndProviderProps<any, any>> = memo(
	function DndProvider({ children, ...props }) {
		const [manager, isGlobalInstance] = getDndContextValue(props) // memoized from props

		/**
		 * If the global context was used to store the DND context
		 * then where theres no more references to it we should
		 * clean it up to avoid memory leaks
		 */
		useEffect(() => {
			if (isGlobalInstance) {
				const context = getGlobalContext()
				++refCount

				return () => {
					if (--refCount === 0) {
						context[INSTANCE_SYM] = null
					}
				}
			}
		}, [])

		return <DndContext.Provider value={manager}>{children}</DndContext.Provider>
	},
)

function getDndContextValue(props: DndProviderProps<any, any>) {
	if ('manager' in props) {
		const manager = { dragDropManager: props.manager }
		return [manager, false]
	}

	const manager = createSingletonDndContext(
		props.backend,
		props.context,
		props.options,
		props.debugMode,
	)
	const isGlobalInstance = !props.context

	return [manager, isGlobalInstance]
}

function createSingletonDndContext<BackendContext, BackendOptions>(
	backend: BackendFactory,
	context: BackendContext = getGlobalContext(),
	options: BackendOptions,
	debugMode?: boolean,
) {
	const ctx = context as any
	if (!ctx[INSTANCE_SYM]) {
		ctx[INSTANCE_SYM] = createDndContext(backend, context, options, debugMode)
	}
	return ctx[INSTANCE_SYM]
}

declare const global: any
function getGlobalContext() {
	return typeof global !== 'undefined' ? global : (window as any)
}
