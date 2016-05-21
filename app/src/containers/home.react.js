import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sendMessage } from '../actions/socket';
import { setCurrentUser } from '../actions/users';

import Chat from '../components/chat.react';

class Home extends Component {
	constructor(props) {
		super(props);
		this.receiveMessage = this.receiveMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.onNameSubmit = this.onNameSubmit.bind(this);
		this.state = {newMessage: null, externalMessageLoading: false, showChat: false, }
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
	}

	render() {
		const { newMessage, externalMessageLoading } = this.state;

		return (
			<div style={typeof window != 'undefined' ? {height: window.innerHeight, width: window.innerWidth} : null}>
				{ _.isEmpty(currentUser) ? 
					<SubmitableTextInput placeholder='Enter your name ...' onSubmit={this.onNameSubmit} />
					: <Chat sendMessage={this.sendMessage} newMessage={newMessage} externalMessageLoading={externalMessageLoading} /> }
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