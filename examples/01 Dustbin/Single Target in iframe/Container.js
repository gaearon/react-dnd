import React, { Component } from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Dustbin from './Dustbin';
import Box from './Box';
import Frame from 'react-frame-component';

export default class Container extends Component {
  render() {
    return (
      <Frame style={{ width: '100%', height: '100%' }}>
        <DragDropContextProvider backend={HTML5Backend}>
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
        </DragDropContextProvider>
      </Frame>
    );
  }
}
