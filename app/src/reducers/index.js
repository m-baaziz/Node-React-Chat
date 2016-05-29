import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import currentUser from './current-user';
import users from './users';

module.exports = combineReducers({
	currentUser,
	users,
	routing: routerReducer
});
	