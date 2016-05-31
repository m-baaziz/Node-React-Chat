import {ActionTypes} from '../constants/constants';

module.exports = {
	setCurrentUser: (id, name, color) => {
		return {
			type: ActionTypes.SET_CURRENT_USER,
			id,
			name,
			color
		};
	},
	addUser: (id, name, color) => {
		return {
			type: ActionTypes.ADD_USER,
			id,
			name,
			color
		}
	},
	removeUser: (id) => {
		return {
			type: ActionTypes.REMOVE_USER,
			id
		}
	}
}