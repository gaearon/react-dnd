import { DragDropManager, DropTarget, Unsubscribe } from 'dnd-core'

export default function registerTarget(
	type: string,
	target: DropTarget,
	manager: DragDropManager<any>,
): { handlerId: string; unregister: Unsubscribe } {
	const registry = manager.getRegistry()
	const targetId = registry.addTarget(type, target)

	function unregisterTarget() {
		registry.removeTarget(targetId)
	}

	return {
		handlerId: targetId,
		unregister: unregisterTarget,
	}
}
