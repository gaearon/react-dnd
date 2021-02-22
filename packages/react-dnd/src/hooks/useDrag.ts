import { useMemo } from 'react'
import { invariant } from '@react-dnd/invariant'
import { DragDropMonitor, DragSource } from 'dnd-core'
import {
	ConnectDragSource,
	ConnectDragPreview,
	DragSourceMonitor,
} from '../types'
import { DragSourceHookSpec, DragObjectWithType } from './types'
import {
	registerSource,
	DragSourceMonitorImpl,
	SourceConnector,
} from '../internals'
import { useMonitorOutput } from './useMonitorOutput'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { useDragDropManager } from './useDragDropManager'

/**
 * useDragSource hook
 * @param sourceSpec The drag source specification (object or function, function preferred)
 * @param deps The memoization deps array to use when evaluating spec changes
 */
export function useDrag<
	DragObject extends DragObjectWithType,
	DropResult,
	CollectedProps
>(
	specFn: () => DragSourceHookSpec<DragObject, DropResult, CollectedProps>,
	deps?: unknown[],
): [CollectedProps, ConnectDragSource, ConnectDragPreview] {
	const spec = useMemo(specFn, deps || [])
	// TODO: wire options into createSourceConnector
	invariant(spec.item != null, 'item must be defined')
	invariant(spec.item.type != null, 'item type must be defined')

	const [monitor, connector] = useDragSourceMonitor()
	useDragHandler(spec, monitor, connector)

	const result: CollectedProps = useMonitorOutput(
		monitor,
		spec.collect || (() => ({} as CollectedProps)),
		() => connector.reconnect(),
	)

	const connectDragSource = useMemo(() => connector.hooks.dragSource(), [
		connector,
	])
	const connectDragPreview = useMemo(() => connector.hooks.dragPreview(), [
		connector,
	])
	useIsomorphicLayoutEffect(() => {
		connector.dragSourceOptions = spec.options || null
		connector.reconnect()
		return () => connector.disconnectDragSource()
	}, [connector, spec.options])
	useIsomorphicLayoutEffect(() => {
		connector.dragPreviewOptions = spec.previewOptions || null
		connector.reconnect()
		return () => connector.disconnectDragPreview()
	}, [connector, spec.previewOptions])
	return [result, connectDragSource, connectDragPreview]
}

function useDragSourceMonitor(): [DragSourceMonitor, SourceConnector] {
	const manager = useDragDropManager()
	const monitor = useMemo(() => new DragSourceMonitorImpl(manager), [manager])
	const connector = useMemo(() => new SourceConnector(manager.getBackend()), [
		manager,
	])
	return [monitor, connector]
}

function useDragHandler<
	DragObject extends DragObjectWithType,
	DropResult,
	CustomProps
>(
	spec: DragSourceHookSpec<DragObject, DropResult, CustomProps>,
	monitor: DragSourceMonitor,
	connector: any,
) {
	const manager = useDragDropManager()
	const handler = useMemo(() => {
		return {
			beginDrag() {
				const { begin, item } = spec
				if (begin) {
					const beginResult = begin(monitor)
					invariant(
						beginResult == null || typeof beginResult === 'object',
						'dragSpec.begin() must either return an object, undefined, or null',
					)
					return beginResult || item || {}
				}
				return item || {}
			},
			canDrag() {
				if (typeof spec.canDrag === 'boolean') {
					return spec.canDrag
				} else if (typeof spec.canDrag === 'function') {
					return spec.canDrag(monitor)
				} else {
					return true
				}
			},
			isDragging(globalMonitor: DragDropMonitor, target) {
				const { isDragging } = spec
				return isDragging
					? isDragging(monitor)
					: target === globalMonitor.getSourceId()
			},
			endDrag() {
				const { end } = spec
				if (end) {
					end(monitor.getItem(), monitor)
				}
				connector.reconnect()
			},
		} as DragSource
	}, [monitor, connector, spec])

	useIsomorphicLayoutEffect(
		function registerHandler() {
			const [handlerId, unregister] = registerSource(
				spec.item.type,
				handler,
				manager,
			)
			monitor.receiveHandlerId(handlerId)
			connector.receiveHandlerId(handlerId)
			return unregister
		},
		[manager, monitor, connector, handler],
	)
}
