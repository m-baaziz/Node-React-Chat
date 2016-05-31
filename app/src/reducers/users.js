import {ActionTypes} from '../constants/constants';

function users(state = [], action) {
	switch (action.type) {
		case ActionTypes.ADD_USER : {
			let newState = state.slice();
			const { id, name, color } = action;
			const existingIndex = _.findIndex(state, u => {return u.id == id});
			let user = {id, name, color};
			if (existingIndex != -1) {
				newState[existingIndex] = user;
			} else {
				newState.push(user);
			}
			return newState;
		}
		case ActionTypes.REMOVE_USER : {
			let newState = state.slice();
			_.remove(newState, user => {return user.id == action.id});
			return newState;
		}
		default :
			return state;
	}
}

export default users;