import React, { Component } from 'react';
import _ from 'lodash';

import LetterIcon from './letter-icon.react';

class UsersList extends Component {

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.onSearchBarChange = this.onSearchBarChange.bind(this);
		this.updateUsersList = this.updateUsersList.bind(this);
		this.state = { search: null, users: props.users }
	}

	componentWillReceiveProps(nextProps) {
		this.updateUsersList(nextProps);
	}

	onClick(e) {
		const user = this.state.users[e.currentTarget.value];
		this.props.onClick(user);
	}

	updateUsersList(props = this.props) {
		const { search } = this.state;
		const matchingUsers = _.isEmpty(search) ? props.users : _.filter(props.users, user => {
			return _.includes(_.toLower(user.name), search);
		});
		this.setState({ users: matchingUsers });
	}

	onSearchBarChange(e) {
		this.setState({ search: e.target.value }, () => {
			this.updateUsersList();
		});
	}

	render() {
		const { search, users } = this.state;
		const listGroup = _.map(users, (user, index) => {
			return (
				<li key={index} value={index} onClick={this.onClick} className="list-group-item users-item">
					<LetterIcon className="pull-left" color={user.color} letter={user.name[0]} />
					{user.name} 
				</li>);
		})
		const noUsers = <li className="list-group-item no-users"> No users </li>
		return (
			<div className="panel panel-default users-list">
				<div className="panel-heading">
					<input type='text' className="form-control" placeholder="Search users ..." value={search} onChange={this.onSearchBarChange} />
				</div>
				<div className="panel-body">
					<ul className="list-group">
						{ _.isEmpty(listGroup) ? noUsers : listGroup }
					</ul>
				</div>
			</div>
		)
	}
}

export default UsersList;