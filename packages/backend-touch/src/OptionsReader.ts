import {
	TouchBackendOptions,
	AngleRange,
	TouchBackendContext,
} from './interfaces'

export class OptionsReader implements TouchBackendOptions {
	public constructor(
		private args: Partial<TouchBackendOptions>,
		private context: TouchBackendContext,
	) {}

	public get delay(): number {
		return this.args.delay ?? 0
	}

	public get scrollAngleRanges(): AngleRange[] | undefined {
		return this.args.scrollAngleRanges
	}

	public get getDropTargetElementsAtPoint():
		| ((x: number, y: number, elements: HTMLElement[]) => HTMLElement[])
		| undefined {
		return this.args.getDropTargetElementsAtPoint
	}

	public get ignoreContextMenu(): boolean {
		return this.args.ignoreContextMenu ?? false
	}

	public get enableHoverOutsideTarget(): boolean {
		return this.args.enableHoverOutsideTarget ?? false
	}

	public get enableKeyboardEvents(): boolean {
		return this.args.enableKeyboardEvents ?? false
	}

	public get enableMouseEvents(): boolean {
		return this.args.enableMouseEvents ?? false
	}

	public get enableTouchEvents(): boolean {
		return this.args.enableTouchEvents ?? true
	}

	public get touchSlop(): number {
		return this.args.touchSlop || 0
	}

	public get delayTouchStart(): number {
		return this.args?.delayTouchStart ?? this.args?.delay ?? 0
	}

	public get delayMouseStart(): number {
		return this.args?.delayMouseStart ?? this.args?.delay ?? 0
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
		if (this.context?.document) {
			return this.context.document
		}

		if (this.window) {
			return this.window.document
		}

		return undefined
	}

	public get rootElement(): Node | undefined {
		return this.args?.rootElement || ((this.window as any) as Node)
	}
}
