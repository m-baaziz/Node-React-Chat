import {ActionTypes} from '../constants/constants';

function users(state = [], action) {
	switch (action.type) {
		case ActionTypes.ADD_USER :
			const { id, name, color } = action;
			const user = {id, name, color};
			let newState = state.slice();
			newState.push(user);
			return newState;
		default :
			return state;
	}
}

export default users;