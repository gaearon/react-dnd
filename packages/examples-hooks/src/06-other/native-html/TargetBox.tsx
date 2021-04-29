import { CSSProperties, FC, DragEvent } from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { useDrop } from 'react-dnd'

const style: CSSProperties = {
	border: '1px solid gray',
	height: '15rem',
	width: '15rem',
	padding: '2rem',
	textAlign: 'center',
}
const preventDefault = (e: DragEvent) => e.preventDefault();
export interface TargetBoxProps {
	onDrop: (arg: { html: any }) => void
}

export const TargetBox: FC<TargetBoxProps> = (props) => {
	const { onDrop } = props
	const [{ canDrop, isOver }, drop] = useDrop(
		() => ({
			accept: [NativeTypes.HTML],
			drop(item: { html: any }) {
				if (onDrop) {
					onDrop(item)
				}
			},
			collect: (monitor) => ({
				isOver: monitor.isOver(),
				canDrop: monitor.canDrop(),
			}),
		}),
		[props],
	)

	const isActive = canDrop && isOver
	return (
		<div ref={drop} style={style} onDrop={preventDefault}>
			{isActive ? 'Release to drop' : 'Drag HTML here'}
		</div>
	)
}
