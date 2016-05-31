import keyMirror from 'keymirror';

module.exports = {
	ActionTypes: keyMirror({
		SET_CURRENT_USER: null,
		ADD_USER: null,
		REMOVE_USER: null,
		CREATE_CONVERSATION: null,
		UPDATE_CONVERSATION: null
	}),
	MOMENT_SERIALIZATION: "YYYY/MM/DD hh:mm:ss"
}
	