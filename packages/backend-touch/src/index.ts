import { DragDropManager, BackendFactory } from 'dnd-core'
import { TouchBackendOptions, TouchBackendContext } from './interfaces'
import { TouchBackendImpl } from './TouchBackendImpl'
export * from './TouchBackendImpl'

export const TouchBackend: BackendFactory = function createBackend(
	manager: DragDropManager,
	context: TouchBackendContext = {},
	options: Partial<TouchBackendOptions> = {},
): TouchBackendImpl {
	return new TouchBackendImpl(manager, context, options)
}
