import React, {Component} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { setCurrentUser, addUser } from '../actions/users-actions';

import TextInput from '../components/text-input.react';

const NAME_REGEXP = /^[A-Za-z\-\_0-9]+[A-Za-z \-\_0-9]*[A-Za-z\-\_0-9]+$/ ;

class App extends Component {

	constructor(props, context) {
		super(props);
		this.socket = undefined;
		this.renderChildren = this.renderChildren.bind(this);
		this.onNameSubmit = this.onNameSubmit.bind(this);
		this.onNameError = this.onNameError.bind(this);
		this.state = { nameErrors: []} ;
	}

	static fetchData({ store, query }) {}

	componentDidMount() {
		const { dispatch } = this.props;
		this.socket = io();
		this.socket.on('serverHandshake', myInfos => {
			const { id, name, color, onlineUsers } = myInfos;
			dispatch(setCurrentUser(id, name, color));
			if (!_.isEmpty(onlineUsers)) {
				_.forEach(onlineUsers, user => {
					const { id, name, color} = user;
					dispatch(addUser(id, name, color));
				})
			}
		});
		this.socket.on('newUserConnection', user => {
			const { id, name, color} = user;
			dispatch(addUser(id, name, color));
		});
	}

	onNameSubmit(name) {
		this.socket.emit('userHandshake', name);
	}

	checkName(name) {
		let errors = [];
		if (name.length < 5) {
			errors.push("Your name should have at least 5 characters");
			return errors;
		}
		if (name.length > 12) errors.push("Your name can't have more than 12 characters");
		if (!name.match(NAME_REGEXP)) errors.push("Invalid character sequence");
		return errors;
	}

	onNameError(errors) {
		this.setState({nameErrors: errors});
	}

	renderChildren() {
		if (typeof io != "undefined") {
			return _.map(_.compact(_.flatten([this.props.children])), (child, key) => {
				const newProps = Object.assign({}, child.props, {socket: this.socket});
				return Object.assign({}, child, {key, props: newProps});
			});
		}
	}

	render() {
		const { nameErrors } = this.state;

		const buildNewUserForm = () => {
			const liGroup = _.map(nameErrors, (error, index) => {
				return <li key={index}> {error} </li>
			});
			const errosDiv = (<div className='alert alert-danger'> <ul> {liGroup} </ul> </div>);
			return (
				<div className='userNameForm'>
					{_.isEmpty(nameErrors) ? null : errosDiv}
					<TextInput className='form-control' placeholder='Enter your name ...' onSubmit={this.onNameSubmit} check={this.checkName} onErrorOnSubmit={this.onNameError} />
				</div>)
		}

		return (
			<div>
				{ _.isEmpty(this.props.currentUser) ? buildNewUserForm() : this.renderChildren() }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
  return {
  	currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(App);
	