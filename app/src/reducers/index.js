import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import currentUser from './current-user';
import users from './users';
import conversations from './conversations';

module.exports = combineReducers({
	currentUser,
	users,
	conversations,
	routing: routerReducer
});
	