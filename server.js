import express from 'express';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match, createRoutes, createMemoryHistory } from 'react-router';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Promise from 'bluebird';
import _ from 'lodash';

import Routes from './app/src/utils/routes.react.js';
import reducer from './app/src/reducers/index';


const app = express();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(morgan('combined'))
app.use(express.static(__dirname + "/app/dist"))
	.use(express.static( __dirname + "/app/assets"))
	.use(favicon(__dirname + '/app/assets/images/favicon.ico'))
	.get('/*', (req, res) => {

		const history = createMemoryHistory();
	  const store = createStore(
		  reducer,
		  compose(
		    applyMiddleware(thunk)
		  )
		);
		const routes = createRoutes(Routes);
	  const location = history.createLocation(req.url);

	  match({ routes, location }, (error, redirectLocation, renderProps) => {
	    if (redirectLocation) {
	      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
	    } else if (error) {
	      res.status(500).send(error.message);
	    } else if (renderProps == null) {
	      res.status(404).send('Not found');
	    } else {

	    	

	      const html = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps}/>
          </Provider>
      	);
      	res.render('index', { html });
	    }
	  });
	});
 
const server = app.listen(8080);
const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
	socket.on('message', (msg) => {
		socket.broadcast.emit('message', msg);
	});
});
		