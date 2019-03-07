import * as React from 'react'
import { useDropTarget, DropTargetMonitor } from 'react-dnd'
import ItemTypes from './ItemTypes'
import DraggableBox from './DraggableBox'
import snapToGrid from './snapToGrid'
import update from 'immutability-helper'

const styles: React.CSSProperties = {
	width: 300,
	height: 300,
	border: '1px solid black',
	position: 'relative',
}

export interface ContainerProps {
	snapToGrid: boolean
}

interface BoxMap {
	[key: string]: { top: number; left: number; title: string }
}

function renderBox(item: any, key: any) {
	return <DraggableBox key={key} id={key} {...item} />
}

const Container: React.FC<ContainerProps> = props => {
	const [boxes, setBoxes] = React.useState<BoxMap>({
		a: { top: 20, left: 80, title: 'Drag me around' },
		b: { top: 180, left: 20, title: 'Drag me too' },
	})

	function moveBox(id: string, left: number, top: number) {
		setBoxes(
			update(boxes, {
				[id]: {
					$merge: { left, top },
				},
			}),
		)
	}

	const ref = React.useRef(null)
	useDropTarget(ref, ItemTypes.BOX, {
		drop(monitor: DropTargetMonitor) {
			const delta = monitor.getDifferenceFromInitialOffset() as {
				x: number
				y: number
			}
			const item = monitor.getItem()

			let left = Math.round(item.left + delta.x)
			let top = Math.round(item.top + delta.y)
			if (props.snapToGrid) {
				;[left, top] = snapToGrid(left, top)
			}

			moveBox(item.id, left, top)
		},
	})

	return (
		<div ref={ref} style={styles}>
			{Object.keys(boxes).map(key => renderBox(boxes[key], key))}
		</div>
	)
}

export default Container
