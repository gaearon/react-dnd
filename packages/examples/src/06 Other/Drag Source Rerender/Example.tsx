import React from 'react'
import { DragSource, ConnectDragSource } from 'react-dnd'

interface ParentProps {
	isDragging: boolean
	connectDragSource: ConnectDragSource
}
const Parent: React.FC<ParentProps> = ({ isDragging, connectDragSource }) => {
	return (
		<Child connect={connectDragSource}>
			{isDragging ? 'Dragging' : 'Drag me'}
		</Child>
	)
}

export default DragSource(
	'KNIGHT',
	{
		beginDrag: () => ({}),
	},
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}),
)(Parent)

interface ChildProps {
	connect: ConnectDragSource
}

const Child: React.FC<ChildProps> = ({ connect, children }) => {
	const [open, setOpen] = React.useState(true)
	const toggle = React.useCallback(() => setOpen(!open), [open])

	return (
		<div
			style={{
				padding: 16,
				width: 400,
			}}
		>
			<button onClick={toggle}>{open ? 'Hide' : 'Show'}</button>
			{open ? (
				<div
					ref={node => connect(node)}
					style={{
						padding: 32,
						marginTop: 16,
						background: '#eee',
					}}
				>
					{children}
				</div>
			) : null}
		</div>
	)
}
