import {ActionTypes} from '../constants/constants';

function currentUser(state = {}, action) {
	switch (action.type) {
		case ActionTypes.SET_CURRENT_USER :
			const { id, name, color } = action;
			const user = {id, name, color};
			return user;
		default :
			return state;
	}
}

export default currentUser;