import { ActionTypes } from '../constants/constants';

module.exports = {
	sendMessage: (msg) => {
		return {
			type: ActionTypes.SOCKET,
			key: "message",
			body: msg
		}
	},
	sendUser: (name) => {
		return {
			type: ActionTypes.SOCKET,
			key: "user",
			body: name
		}
	}
}