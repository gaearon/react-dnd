import React from 'react'
import {
	DragSource,
	DragSourceMonitor,
	ConnectDragSource,
	DragSourceConnector,
} from 'react-dnd'
import ItemTypes from './ItemTypes'

const style: React.CSSProperties = {
	border: '1px dashed gray',
	backgroundColor: 'white',
	padding: '0.5rem 1rem',
	marginRight: '1.5rem',
	marginBottom: '1.5rem',
	cursor: 'move',
	float: 'left',
}

interface BoxProps {
	name: string

	// Collected Props
	isDragging: boolean
	connectDragSource: ConnectDragSource
}

class Box extends React.Component<BoxProps> {
	private dragSource: React.RefObject<HTMLDivElement> = React.createRef()

	public render() {
		const { name, isDragging, connectDragSource } = this.props
		const opacity = isDragging ? 0.4 : 1
		connectDragSource(this.dragSource)

		return (
			<div ref={this.dragSource} style={{ ...style, opacity }}>
				{name}
			</div>
		)
	}
}

export default DragSource(
	ItemTypes.BOX,
	{
		beginDrag: (props: BoxProps) => ({ name: props.name }),
		endDrag(props: BoxProps, monitor: DragSourceMonitor) {
			const item = monitor.getItem()
			const dropResult = monitor.getDropResult()

			if (dropResult) {
				alert(`You dropped ${item.name} into ${dropResult.name}!`)
			}
		},
	},
	(connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}),
)(Box)
