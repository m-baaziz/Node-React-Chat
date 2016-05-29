import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'


import Routes from './utils/routes.react';
import reducer from './reducers/index';

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk)
  )
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			{Routes}
		</Router>
	</Provider>,
	document.getElementById('react')
);
	