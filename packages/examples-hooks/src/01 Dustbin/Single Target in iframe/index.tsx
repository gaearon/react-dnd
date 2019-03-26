declare var require: any

import React from 'react'
import {
	__EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__,
	DragDropContextProvider,
} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Dustbin from '../Single Target/Dustbin'
import Box from '../Single Target/Box'
import { isDebugMode } from '../../isDebugMode'

const {
	default: Frame,
	FrameContextConsumer,
} = require('react-frame-component')

const FrameBindingContext: React.FC = ({ children }) => (
	<FrameContextConsumer>
		{({ window }: any) => (
			<DragDropContextProvider
				backend={HTML5Backend}
				context={window}
				debugMode={isDebugMode()}
			>
				{children}
			</DragDropContextProvider>
		)}
	</FrameContextConsumer>
)

// Don't use the decorator, embed the DnD context within the iframe
// tslint:disable-next-line max-classes-per-file
export default function Container() {
	// The react-frame-component will pass the iframe's 'window' global as a context value
	// to the DragDropContext provider. You could also directly inject it in via a prop.
	// If neither the prop or the context value for 'window' are present, the DragDropContextProvider
	// will just use the global window.
	return (
		<>
			<h1>EXPERIMENTAL API</h1>
			<Frame style={{ width: '100%', height: 400 }}>
				<FrameBindingContext>
					<div>
						<div style={{ overflow: 'hidden', clear: 'both' }}>
							<Dustbin />
						</div>
						<div style={{ overflow: 'hidden', clear: 'both' }}>
							<Box name="Glass" />
							<Box name="Banana" />
							<Box name="Paper" />
						</div>
					</div>
				</FrameBindingContext>
			</Frame>
		</>
	)
}
