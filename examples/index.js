'use strict';

var React = require('react'),
    { Routes, Route, Redirect, Link } = require('react-router'),
    DragAroundNaive = require('./_drag-around-naive/index'),
    DragAroundCustom = require('./_drag-around-custom/index'),
    DragAroundExperimental = require('./_drag-around-experimental/index'),
    DustbinSimple = require('./_dustbin-simple'),
    DustbinInteresting = require('./_dustbin-interesting'),
    SortableSimple = require('./_sortable-simple'),
    SortableMouse = require('./_sortable-mouse'),
    SortableTouch = require('./_sortable-touch');

var App = React.createClass({
  render() {
    var RouteHandler = this.props.activeRouteHandler;

    return (
      <div>
        <h1>react-dnd examples (<a target='_href' href='https://github.com/gaearon/react-dnd/blob/master/examples'>source</a>)</h1>
        <ul>
          <li>Dustbin (<Link to='dustbin-simple'>simple</Link>, <Link to='dustbin-interesting'>interesting</Link>)</li>
          <li>Drag Around (<Link to='drag-around-naive'>naive</Link>, <Link to='drag-around-custom'>custom</Link>, <Link to='drag-around-experimental'>experimental</Link>)</li>
          <li>Sortable (<Link to='sortable-simple'>simple</Link>, <Link to='sortable-mouse'>mouse</Link>, <Link to='sortable-touch'>touch</Link>)</li>
        </ul>
        <hr />
        <RouteHandler />
      </div>
    );
  }
});

var routes = (
  <Routes location={process.env.NODE_ENV === 'production' ? 'hash' : 'history'}>
    <Route handler={App}>
      <Route name='drag-around-naive' path='drag-around-naive' handler={DragAroundNaive} />
      <Route name='drag-around-custom' path='drag-around-custom' handler={DragAroundCustom} />
      <Route name='drag-around-experimental' path='drag-around-experimental' handler={DragAroundExperimental} />
      <Route name='dustbin-simple' path='dustbin-simple' handler={DustbinSimple} />
      <Route name='dustbin-interesting' path='dustbin-interesting' handler={DustbinInteresting} />
      <Route name='sortable-simple' path='sortable-simple' handler={SortableSimple} />
      <Route name='sortable-mouse' path='sortable-mouse' handler={SortableMouse} />
      <Route name='sortable-touch' path='sortable-touch' handler={SortableTouch} />
      <Redirect from='/' to='dustbin-simple' />
    </Route>
  </Routes>
);

React.render(routes, document.body);
