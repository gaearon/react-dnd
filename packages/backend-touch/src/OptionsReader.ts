import {
	TouchBackendOptions,
	AngleRange,
	TouchBackendContext,
} from './interfaces'

export class OptionsReader implements TouchBackendOptions {
	public enableTouchEvents = true
	public enableMouseEvents = false
	public enableKeyboardEvents = false
	public ignoreContextMenu = false
	public enableHoverOutsideTarget = false
	public touchSlop = 0
	public scrollAngleRanges: AngleRange[] | undefined = undefined
	public delayTouchStart: number
	public delayMouseStart: number
	public delayedStartBeginsDrag: boolean
	public getDropTargetElementsAtPoint?: (
		x: number,
		y: number,
		elements: HTMLElement[],
	) => HTMLElement[]
	private context: TouchBackendContext

	public constructor(
		incoming: TouchBackendOptions,
		context: TouchBackendContext,
	) {
		this.context = context
		this.delayTouchStart = incoming.delayTouchStart || incoming.delay || 0
		this.delayMouseStart = incoming.delayMouseStart || incoming.delay || 0
		this.delayedStartBeginsDrag = incoming.delayedStartBeginsDrag || false

		Object.keys(incoming).forEach((key) => {
			if ((incoming as any)[key] != null) {
				;(this as any)[key] = (incoming as any)[key]
			}
		})
	}

	public get window(): Window | undefined {
		if (this.context && this.context.window) {
			return this.context.window
		} else if (typeof window !== 'undefined') {
			return window
		}
		return undefined
	}

	public get document(): Document | undefined {
		if (this.window) {
			return this.window.document
		}
		return undefined
	}
}
