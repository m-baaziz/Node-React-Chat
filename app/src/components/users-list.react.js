import React, { Component } from 'react';
if (typeof window != 'undefined') { var ScrollArea = require('react-scrollbar') };
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
					<span className="user-name"> {user.name} </span>
					{ _.includes(this.props.usersIdSendingMessage, user.id) ? <div className='user-msg-loading'> <span></span> </div> : null }
				</li>);
		})
		const noUsers = <li className="list-group-item no-users"> No users </li>
		const ulGroup = ( <ul className="list-group">
												{ _.isEmpty(listGroup) ? noUsers : listGroup }
											</ul> );

		return (
			<div className="panel panel-default users-list" ref="usersList">
				<div className="panel-heading">
					<input type='text' className="form-control" placeholder="Search users ..." value={search} onChange={this.onSearchBarChange} />
				</div>
				<div className="panel-body">
					{ 
						typeof window == 'undefined' ? ulGroup : (
			    		<ScrollArea style={{maxHeight: '350px'}}>
			    			{ ulGroup }
			    		</ScrollArea> ) 
					}
				</div>
			</div>
		)
	}
}

export default UsersList;