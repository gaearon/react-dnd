'use strict';

import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import { configureDragDropContext, HTML5Backend } from 'react-dnd';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [{
        id: 1,
        text: 'Write a cool JS library'
      }, {
        id: 2,
        text: 'Make it generic enough'
      }, {
        id: 3,
        text: 'Write README'
      }, {
        id: 4,
        text: 'Create some examples'
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it'
      }, {
        id: 6,
        text: '???'
      }, {
        id: 7,
        text: 'PROFIT'
      }]
    };
  }

  moveCard(id, afterId) {
    const { cards } = this.state;

    const card = cards.filter(c => c.id === id)[0];
    const afterCard = cards.filter(c => c.id === afterId)[0];
    const cardIndex = cards.indexOf(card);
    const afterIndex = cards.indexOf(afterCard);

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [cardIndex, 1],
          [afterIndex, 0, card]
        ]
      }
    }));
  }

  render() {
    const { cards } = this.state;

    return (
      <div>
        {cards.map(card => {
          return (
            <Card key={card.id}
                  id={card.id}
                  text={card.text}
                  moveCard={(id, afterId) => this.moveCard(id, afterId)} />
          );
        })}
      </div>
    );
  }
}

export default configureDragDropContext(Container, {
  backend: HTML5Backend
});