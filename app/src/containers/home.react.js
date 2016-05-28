import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sendMessage } from '../actions/socket-actions';
import { setCurrentUser } from '../actions/users-actions';

import Chat from '../components/chat.react';
import TextInput from '../components/text-input.react';

const NAME_REGEXP = /^[A-Za-z\-\_0-9]+[A-Za-z \-\_0-9]*[A-Za-z\-\_0-9]+$/ ;

class Home extends Component {
	constructor(props) {
		super(props);
		this.receiveMessage = this.receiveMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.onNameSubmit = this.onNameSubmit.bind(this);
		this.onNameError = this.onNameError.bind(this);
		this.state = {newMessage: null, externalMessageLoading: false, showChat: false, nameErrors: []}
	}

	componentDidMount() {
		this.props.socket.on('message', (msg) => {
			this.receiveMessage(msg);
		});
	}

	receiveMessage(msg) {
		const { type, content, moment } = msg;
		switch(msg.type) {
			case "ready" :
				this.setState({newMessage: {type: "external", content, moment}, externalMessageLoading: false});
				break;
			case "loading" :
				this.setState({externalMessageLoading: true});
				break;
			case "unloading" :
				this.setState({externalMessageLoading: false});
			 	break;
			default :
				return;
		}
	}

	sendMessage(msg) {
		this.props.dispatch(sendMessage(msg));
	}

	onNameSubmit(name) {
		this.props.dispatch(setCurrentUser(name));
		this.setState({showChat: true});
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

	render() {
		const { newMessage, externalMessageLoading, nameErrors, showChat } = this.state;

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

		const chatScreen = (
			<div>
				
				{showChat ? <Chat sendMessage={this.sendMessage} newMessage={newMessage} externalMessageLoading={externalMessageLoading} /> : null}
			</div>)

		return (
			<div>
				{ _.isEmpty(this.props.currentUser) ? 
					buildNewUserForm()
					: chatScreen }
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
  	currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(Home);