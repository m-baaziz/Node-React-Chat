import React, { Component } from 'react';
import _ from 'lodash';

class Chat extends Component {

	constructor(props) {
		super(props);
		this.sendMessage = this.sendMessage.bind(this);
		this.onMsgChange = this.onMsgChange.bind(this);
		this.onMsgKeyDown = this.onMsgKeyDown.bind(this);
		//this.addLocalMessage = this.addLocalMessage.bind(this);
		this.state = {msgBuffer: null};   // message : {state: "local"/"external"/"loading", sender: "senderID", content: "azerty"/null, moment: "hh:mm"}
	}

	// componentWillReceiveProps(nextProps) {
	// 	const { newMessage, externalMessageLoading } = nextProps;
	// 	if (this.props.newMessage != newMessage) {
	// 		this.addLocalMessage({type: "external", content: newMessage.content, moment: newMessage.moment});
	// 	}
	// 	if (!this.props.externalMessageLoading && externalMessageLoading) {
	// 		this.addLocalMessage({type: "loading", content: null});
	// 	}
	// 	if (this.props.externalMessageLoading && !externalMessageLoading) {
	// 		this.removeLocalMessage((msg) => {return msg.type != "loading"});
	// 	}
	// }

	// addLocalMessage(msg) {
	// 	let { messages } = this.state;
	// 	messages.push(msg);
	// 	this.setState({messages});
	// }

	// removeLocalMessage(conditionCb) {
	// 	let { messages } = this.state;
	// 	messages = _.filter(messages, msg => {return conditionCb(msg)});
	// 	this.setState({messages});
	// }

	onMsgChange(e) {
		const { messages } = this.state;
		const { value } = e.target;
		const { sendMessage } = this.props;
		if (_.isEmpty(value)) {
			sendMessage({state: "canceled", body: null});
		} else {
			sendMessage({state: "loading", body: null});
		}
		this.setState({msgBuffer: value});
	}

	onMsgKeyDown(e) {
		if (e.which == 13) {
			this.sendMessage(e);
		}
	}

	sendMessage(e) {
		const { msgBuffer } = this.state;
		if (!_.isEmpty(msgBuffer)) {
			//this.addLocalMessage({type: "local", content: msgBuffer, moment: moment().format('hh:mm')});
			this.props.sendMessage({state: "ready", body: msgBuffer});
			this.setState({msgBuffer: ""});
		}
		e.preventDefault();
	}

	render() {

		const { msgBuffer } = this.state;
		const { messages, emitterId, interlocutors } = this.props;
		const time = msg => {return `${msg.hour}:${msg.minute}`} ;
		const messageGroup = _.map(messages, (msg, index) => {
			if (msg.emitter.id != emitterId)
				if (msg.state == 'loading') {
					return (
						<div key={index} className="message loading new">
							<figure className="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure>
							<span></span>
						</div>)
				} else {
					return (
						<div key={index} className='message new'>
							<figure className="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure>
							{ msg.body }
							<div className="timestamp"> {time(msg)} </div>
						</div>);
				}

			if (msg.emitter.id == emitterId && msg.state != "loading")
				return (
					<div key={index} className='message message-personal'> { msg.body } 
						<div className="timestamp">
							{time(msg)}
						</div>
					</div>)
		});

		return (
			<div className="chat">
			  <div className="chat-title">
			    <h1>{ _.map(interlocutors, interlocutor => {return interlocutor.name}) }</h1>
			    <h2>{ _.map(interlocutors, interlocutor => {return interlocutor.color}) }</h2>
			    <figure className="avatar">
			      <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure>
			  </div>
			  <div className="messages">
			    <div className="messages-content">
			    	{messageGroup}
			    </div>
			  </div>
			  <form className="message-box" onSubmit={this.sendMessage}>
			    <textarea type="text" className="message-input" placeholder="Type message..." value={msgBuffer} onChange={this.onMsgChange} onKeyDown={this.onMsgKeyDown} />
			    <button type="submit" className="message-submit">Send</button>
			  </form>
			</div>
		)
	}
}

export default Chat;