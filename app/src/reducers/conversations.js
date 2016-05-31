import { ActionTypes, MOMENT_SERIALIZATION } from '../constants/constants';
import moment from 'moment';
import _ from 'lodash';

function conversations(state = [], action) {
	switch (action.type) {
		case ActionTypes.CREATE_CONVERSATION : {
			const { emitter, receiver } = action;
			const conversation = { emitter, receiver, messages: [] };
			let newState = state.slice();
			newState.push(conversation);
			return newState;
		}
		case ActionTypes.UPDATE_CONVERSATION : {
			const { emitter, receiver } = action;
			let { msg } = action;
			msg['moment'] =  moment(msg.moment, MOMENT_SERIALIZATION);
			const conversationIndex = _.findIndex(state, conver => {
				return conver.emitter.id == emitter.id && conver.receiver.id == receiver.id;
			});
			let newState = state.slice();
			let conversation = { emitter, receiver, messages: [msg] };
			if (conversationIndex < 0) {
				newState.push(conversation);
			} else {
				conversation = newState[conversationIndex];
				let { messages } = conversation;
				if (!_.isEmpty(messages) && _.last(messages).state == 'loading')
					if (messages.length )
					messages = messages.slice(0,-1);
				if (msg.state != 'canceled')
					messages.push(msg);
				conversation['messages'] = messages;
			}
			return newState;
		}
		default :
			return state;
	}
}

export default conversations;