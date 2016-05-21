import React, {Component} from 'react';
import { Route, IndexRoute } from 'react-router'

import App from '../containers/app.react';
import Home from '../containers/home.react';

module.exports = (
	<Route path="/" component={App}>
		<IndexRoute component={Home} />
	</Route>
);
	