import { ActionTypes } from '../constants/Constants'

export default store => next => action => {

	const { type, key, body} = action;

	if (action.type != ActionTypes.SOCKET) {
		return next(action);
	}

	const socket = io();
	socket.emit(key, body);
}