import {ActionTypes} from '../constants/constants';
import { sendUser } from './socket-actions';

module.exports = {
	setCurrentUser: (name) => {
		return (dispatch) => {
			dispatch(sendUser(name));
			const payload = {
				type: ActionTypes.SET_CURRENT_USER,
				name
			};
			dispatch(payload);
		}
	}
}