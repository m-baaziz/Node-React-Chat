import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

class Chat extends Component {

	constructor(props) {
		super(props);
		this.sendMessage = this.sendMessage.bind(this);
		this.onMsgChange = this.onMsgChange.bind(this);
		this.onMsgKeyDown = this.onMsgKeyDown.bind(this);
		this.addLocalMessage = this.addLocalMessage.bind(this);
		this.removeLocalMessage = this.removeLocalMessage.bind(this);
		this.state = {msgBuffer: null, messages: []};   // message : {state: "local"/"external"/"loading" content: "azerty"/null, moment: "hh:mm"}
	}

	componentWillReceiveProps(nextProps) {
		const { newMessage, externalMessageLoading } = nextProps;
		if (this.props.newMessage != newMessage) {
			this.addLocalMessage({type: "external", content: newMessage.content, moment: newMessage.moment});
		}
		if (!this.props.externalMessageLoading && externalMessageLoading) {
			this.addLocalMessage({type: "loading", content: null});
		}
		if (this.props.externalMessageLoading && !externalMessageLoading) {
			this.removeLocalMessage((msg) => {return msg.type != "loading"});
		}
	}

	addLocalMessage(msg) {
		let { messages } = this.state;
		messages.push(msg);
		this.setState({messages});
	}

	removeLocalMessage(conditionCb) {
		let { messages } = this.state;
		messages = _.filter(messages, msg => {return conditionCb(msg)});
		this.setState({messages});
	}

	onMsgChange(e) {
		const { messages } = this.state;
		const { value } = e.target;
		if (!_.find(messages, msg => {return msg.type == "loading"})) {
			this.props.sendMessage({type: "loading", content: null});
		} else if (_.isEmpty(value)) {
			this.removeLocalMessage((msg) => {return msg.type != "loading"});
			this.props.sendMessage({type: "unloading", content: null});
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
			this.addLocalMessage({type: "local", content: msgBuffer, moment: moment().format('hh:mm')});
			this.props.sendMessage({type: "ready", content: msgBuffer, moment: moment().format('hh:mm')});
			this.setState({msgBuffer: ""});
		}
		e.preventDefault();
	}

	render() {

		const { messages, msgBuffer } = this.state;

		const messageGroup = _.map(messages, (msg, index) => {
			switch (msg.type) {
				case "local" :
					return <div key={index} className='message message-personal'> { msg.content } <div className="timestamp"> { msg.moment } </div> </div>;
				case "external" :
					return (
						<div key={index} className='message new'>
							<figure className="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure>
							{ msg.content }
							<div className="timestamp"> { msg.moment } </div>
						</div>
						);
				case "loading" :
					return (
						<div key={index} className="message loading new">
							<figure className="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure>
							<span></span>
						</div>
					);
				default :
					return null;
			}
		});

		return (
			<div>
				<div className="chat">
				  <div className="chat-title">
				    <h1>Fabio Ottaviani</h1>
				    <h2>Supah</h2>
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
				<div className="bg"></div>
			</div>
		)
	}
}

export default Chat;