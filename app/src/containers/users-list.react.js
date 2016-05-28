import React, { Component } from 'react';
import _ from 'lodash';

class UsersList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { users } = this.props;
		return (
			<div className='users-list'>
				{users.length} user{users.length > 1 ? 's' : null} connected
			</div>
			)
	}
}

export default UsersList;