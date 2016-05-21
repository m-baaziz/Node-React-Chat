import { ActionTypes } from '../constants/Constants';

module.exports = {
	sendMessage: (msg) => {
		return {
			type: ActionTypes.SOCKET,
			key: "message",
			body: msg
		}
	}
}