import {
	Action,
	DragDropManager,
	HoverPayload,
	HoverOptions,
	DragDropMonitor,
	HandlerRegistry,
} from '../../interfaces'
import matchesType from '../../utils/matchesType'
import { HOVER } from './types'
// @ts-ignore
import invariant from 'invariant'

export default function createHover<Context>(
	manager: DragDropManager<Context>,
) {
	return function hover(
		targetIdsArg: string[],
		{ clientOffset }: HoverOptions = {},
	): Action<HoverPayload> {
		verifyTargetIdsIsArray(targetIdsArg)
		const targetIds = targetIdsArg.slice(0)
		const monitor = manager.getMonitor()
		const registry = manager.getRegistry()
		checkInvariants(targetIds, monitor, registry)
		const draggedItemType = monitor.getItemType()
		removeNonMatchingTargetIds(targetIds, registry, draggedItemType)
		hoverAllTargets(targetIds, monitor, registry)

		return {
			type: HOVER,
			payload: {
				targetIds,
				clientOffset: clientOffset || null,
			},
		}
	}
}

function verifyTargetIdsIsArray(targetIdsArg: string[]) {
	invariant(Array.isArray(targetIdsArg), 'Expected targetIds to be an array.')
}

function checkInvariants(
	targetIds: string[],
	monitor: DragDropMonitor,
	registry: HandlerRegistry,
) {
	invariant(monitor.isDragging(), 'Cannot call hover while not dragging.')
	invariant(!monitor.didDrop(), 'Cannot call hover after drop.')
	for (let i = 0; i < targetIds.length; i++) {
		const targetId = targetIds[i]
		invariant(
			targetIds.lastIndexOf(targetId) === i,
			'Expected targetIds to be unique in the passed array.',
		)

		const target = registry.getTarget(targetId)
		invariant(target, 'Expected targetIds to be registered.')
	}
}

function removeNonMatchingTargetIds(
	targetIds: string[],
	registry: HandlerRegistry,
	draggedItemType: string | symbol | null,
) {
	// Remove those targetIds that don't match the targetType.  This
	// fixes shallow isOver which would only be non-shallow because of
	// non-matching targets.
	for (let i = targetIds.length - 1; i >= 0; i--) {
		const targetId = targetIds[i]
		const targetType = registry.getTargetType(targetId)
		if (!matchesType(targetType, draggedItemType)) {
			targetIds.splice(i, 1)
		}
	}
}

function hoverAllTargets(
	targetIds: string[],
	monitor: DragDropMonitor,
	registry: HandlerRegistry,
) {
	// Finally call hover on all matching targets.
	for (const targetId of targetIds) {
		const target = registry.getTarget(targetId)
		target.hover(monitor, targetId)
	}
}
