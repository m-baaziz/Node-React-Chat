import { ActionTypes } from '../constants/constants'

export default store => next => action => {

	if (typeof action == 'function' || action.type != ActionTypes.SOCKET) {
		next(action);
		return;
	}
	const { key, body } = action;
	const socket = io();
	socket.emit(action.key, body);
}