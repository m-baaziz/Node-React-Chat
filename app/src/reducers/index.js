import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { currentUser } from './current-user';

module.exports = combineReducers({
	routing: routerReducer,
	currentUser
});
	