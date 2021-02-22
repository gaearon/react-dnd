import { useMemo } from 'react'
import { invariant } from '@react-dnd/invariant'
import { DropTarget } from 'dnd-core'
import { ConnectDropTarget, DropTargetMonitor } from '../types'
import { useMonitorOutput } from './useMonitorOutput'
import { DropTargetHookSpec, DragObjectWithType } from './types'
import {
	registerTarget,
	DropTargetMonitorImpl,
	TargetConnector,
} from '../internals'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { useDragDropManager } from './useDragDropManager'

/**
 * useDropTarget Hook
 * @param spec The drop target specification (object or function, function preferred)
 * @param deps The memoization deps array to use when evaluating spec changes
 */
export function useDrop<
	DragObject extends DragObjectWithType,
	DropResult,
	CollectedProps
>(
	specFn: () => DropTargetHookSpec<DragObject, DropResult, CollectedProps>,
	deps?: unknown[],
): [CollectedProps, ConnectDropTarget] {
	const spec = useMemo(specFn, deps || [])
	invariant(spec.accept != null, 'accept must be defined')

	const [monitor, connector] = useDropTargetMonitor()
	useDropHandler(spec, monitor, connector)

	const result: CollectedProps = useMonitorOutput(
		monitor,
		spec.collect || (() => ({} as CollectedProps)),
		() => connector.reconnect(),
	)

	const connectDropTarget = useMemo(() => connector.hooks.dropTarget(), [
		connector,
	])

	useIsomorphicLayoutEffect(() => {
		connector.dropTargetOptions = spec.options || null
		connector.reconnect()
		return () => connector.disconnectDropTarget()
	}, [spec.options])
	return [result, connectDropTarget]
}

function useDropTargetMonitor(): [DropTargetMonitor, TargetConnector] {
	const manager = useDragDropManager()
	const monitor = useMemo(() => new DropTargetMonitorImpl(manager), [manager])
	const connector = useMemo(() => new TargetConnector(manager.getBackend()), [
		manager,
	])
	return [monitor, connector]
}

function useDropHandler<
	DragObject extends DragObjectWithType,
	DropResult,
	CustomProps
>(
	spec: DropTargetHookSpec<DragObject, DropResult, CustomProps>,
	monitor: DropTargetMonitor,
	connector: any,
) {
	const manager = useDragDropManager()
	const handler = useMemo(() => {
		return {
			canDrop() {
				const { canDrop } = spec
				return canDrop ? canDrop(monitor.getItem(), monitor) : true
			},
			hover() {
				const { hover } = spec
				if (hover) {
					hover(monitor.getItem(), monitor)
				}
			},
			drop() {
				const { drop } = spec
				if (drop) {
					return drop(monitor.getItem(), monitor)
				}
			},
		} as DropTarget
	}, [monitor, spec])

	useIsomorphicLayoutEffect(
		function registerHandler() {
			const [handlerId, unregister] = registerTarget(
				spec.accept,
				handler,
				manager,
			)
			monitor.receiveHandlerId(handlerId)
			connector.receiveHandlerId(handlerId)
			return unregister
		},
		[manager, monitor, handler, connector],
	)
}
