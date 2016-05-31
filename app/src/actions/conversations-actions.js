import {ActionTypes} from '../constants/constants';

module.exports = {
	createConversation: (emitter, receiver) => {
		return {
			type: ActionTypes.CREATE_CONVERSATION,
			emitter,
			receiver
		}
	},
	updateConversation: (emitter, receiver, msg) => {
		return {
			type: ActionTypes.UPDATE_CONVERSATION,
			emitter,
			receiver,
			msg
		}
	}
}