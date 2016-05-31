import React, { Component } from 'react';
import _ from 'lodash';

class UsersList extends Component {

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick(e) {
		const user = this.props.users[e.currentTarget.value];
		this.props.onClick(user);
	}

	render() {
		const { users } = this.props;
		const listGroup = _.map(users, (user, index) => {
			return (
				<div key={index} className="users-item">
					<button className="btn btn-default" value={index} onClick={this.onClick} > {user.name} </button>
				</div>)
		})

		return (
			<div className='users-list'>
				{ listGroup }
			</div>
		)
	}
}

export default UsersList;