import {ActionTypes} from '../constants/constants';

module.exports = {
	setCurrentUser: (name) => {
		return {
			type: ActionTypes.SET_CURRENT_USER,
			name
		}
	}
}