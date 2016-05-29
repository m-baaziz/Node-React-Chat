import React, { Component } from 'react';
import { connect } from 'react-redux';

import Chat from '../components/chat.react';

class Home extends Component {
	constructor(props) {
		super(props);
		this.receiveMessage = this.receiveMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.state = { newMessage: null, externalMessageLoading: false, showChat: true };
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
		this.props.socket.emit('message', msg);
	}

	render() {
		const { newMessage, externalMessageLoading, showChat } = this.state;
		console.log(this.props.users);
		return (
			<div>
				{showChat ? <Chat sendMessage={this.sendMessage} newMessage={newMessage} externalMessageLoading={externalMessageLoading} /> : null}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
  	users: state.users
  }
}

export default connect(mapStateToProps)(Home);