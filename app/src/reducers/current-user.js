import {ActionTypes} from '../constants/Constants';

function currentUser(state = {}, action) {
	switch (action.type) {
		case ActionTypes.SET_CURRENT_USER :
			const { name } = action;
			const user = {name};
			return user;
		default :
			return state;
	}
}

export default currentUser;