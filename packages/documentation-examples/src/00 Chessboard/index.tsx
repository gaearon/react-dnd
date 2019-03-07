// tslint:disable member-ordering
import * as React from 'react'
import Board from './Board'
import { observe } from './Game'

export interface ChessboardTutorialAppState {
	knightPosition: [number, number]
}

/**
 * Unlike the tutorial, export a component so it can be used on the website.
 */
const ChessboardTutorialApp: React.FC = () => {
	const [knightPos, setKnightPos] = React.useState<[number, number]>([1, 7])

	React.useEffect(() =>
		observe((newPos: [number, number]) => setKnightPos(newPos)),
	)
	return (
		<div
			style={{
				width: 500,
				height: 500,
				border: '1px solid gray',
			}}
		>
			<Board knightPosition={knightPos} />
		</div>
	)
}

export default ChessboardTutorialApp
