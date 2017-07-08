'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _user = require('./app/model/user');

var _user2 = _interopRequireDefault(_user);

var _routesReact = require('./app/src/utils/routes.react.js');

var _routesReact2 = _interopRequireDefault(_routesReact);

var _index = require('./app/src/reducers/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use((0, _morgan2.default)('combined'));
app.use(_express2.default.static(__dirname + "/app/dist")).use(_express2.default.static(__dirname + "/app/assets")).use((0, _serveFavicon2.default)(__dirname + '/app/assets/images/favicon.ico')).get('/*', function (req, res) {

	var history = (0, _reactRouter.createMemoryHistory)();
	var store = (0, _redux.createStore)(_index2.default, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default)));
	var routes = (0, _reactRouter.createRoutes)(_routesReact2.default);
	var location = history.createLocation(req.url);

	(0, _reactRouter.match)({ routes: routes, location: location }, function (error, redirectLocation, renderProps) {
		if (redirectLocation) {
			res.redirect(301, redirectLocation.pathname + redirectLocation.search);
		} else if (error) {
			res.status(500).send(error.message);
		} else if (renderProps == null) {
			res.status(404).send('Not found');
		} else {

			var html = (0, _server.renderToString)(_react2.default.createElement(
				_reactRedux.Provider,
				{ store: store },
				_react2.default.createElement(_reactRouter.RouterContext, renderProps)
			));
			res.render('index', { html: html });
		}
	});
});

var server = app.listen(8080);
var io = require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function (socket) {
	socket.on('userHandshake', function (name) {
		var newUser = new _user2.default(name, socket.id);
		users.push(newUser);
		var onlineUsers = _lodash2.default.filter(users, function (user) {
			return user.id != socket.id;
		});
		var onlineUsersJsons = _lodash2.default.map(onlineUsers, function (user) {
			return user.toJson();
		});
		socket.emit('serverHandshake', { id: newUser.id, name: newUser.name, color: newUser.color, onlineUsers: onlineUsersJsons });
		socket.broadcast.emit('userConnection', newUser.toJson());
	});
	socket.on('message', function (msg) {
		try {
			var receiver = msg.receiver;

			io.sockets.to(receiver.id).emit('message', msg);
		} catch (e) {
			console.log(e);
		}
	});
	socket.on('disconnect', function () {
		socket.broadcast.emit('userDisconnection', socket.id);
		_lodash2.default.remove(users, function (u) {
			return u.id == socket.id;
		});
	});
});
