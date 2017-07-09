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

import User from './app/model/user';

import Routes from './app/src/utils/routes.react.js';
import reducer from './app/src/reducers/index';


const app = express();

app.set('views', process.env['APP_PATH'] + '/app/views');
app.set('view engine', 'ejs');
app.use(morgan('combined'))
app.use(express.static(process.env['APP_PATH'] + "/app/dist"))
	.use(express.static( process.env['APP_PATH'] + "/app/assets"))
	.use(favicon(process.env['APP_PATH'] + '/app/assets/images/favicon.ico'))
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

let users = [];

io.sockets.on('connection', (socket) => {
	socket.on('userHandshake', name => {
		const newUser = new User(name, socket.id);
		users.push(newUser);
		const onlineUsers = _.filter(users, user => {return user.id != socket.id});
		const onlineUsersJsons = _.map(onlineUsers, user => {return user.toJson()});
		socket.emit('serverHandshake', { id: newUser.id, name: newUser.name, color: newUser.color, onlineUsers: onlineUsersJsons });
		socket.broadcast.emit('userConnection', newUser.toJson());
	});
	socket.on('message', msg => {
		try {
			const { receiver } = msg;
			io.sockets.to(receiver.id).emit('message', msg);
		} catch (e) {
			console.log(e);
		}
	});
	socket.on('disconnect', () => {
		socket.broadcast.emit('userDisconnection', socket.id);
		_.remove(users, u => {return u.id == socket.id});
	});
});
		