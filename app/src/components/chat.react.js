import React, { Component } from 'react';
if (typeof window != 'undefined') { var ScrollArea = require('react-scrollbar') }; // conditional import because of the server-side rendering
import _ from 'lodash';

import LetterIcon from './letter-icon.react';

class Chat extends Component {

	constructor(props) {
		super(props);
		this.sendMessage = this.sendMessage.bind(this);
		this.onMsgChange = this.onMsgChange.bind(this);
		this.onMsgKeyDown = this.onMsgKeyDown.bind(this);
		this.state = {msgBuffer: null};
	}

	componentDidUpdate(prevProps) {
		if (this.refs.scrollBar)
			setTimeout(() => {
				this.refs.scrollBar.scrollBottom();
			}, 0);
	}

	componentWillReceiveProps(nextProps) {
		if (_.xor(nextProps.interlocutors, this.props.interlocutors).length > 0 && this.refs.chatTextArea)
			this.refs.chatTextArea.focus();
	}

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
			this.props.sendMessage({state: "ready", body: msgBuffer});
			this.setState({msgBuffer: ""});
		}
		e.preventDefault();
	}

	render() {
		const { msgBuffer } = this.state;
		const { messages, emitterId, interlocutors } = this.props;

		const time = msg => {return msg.moment.format("hh:mm")};

		const messageGroup = _.map(messages, (msg, index) => {
			if (msg.emitter.id != emitterId)
				if (msg.state == 'loading') {
					return (
						<div key={index} className="message loading new">
							<LetterIcon className="pull-left" color={msg.emitter.color} letter={msg.emitter.name[0]} />
							<span></span>
						</div>)
				} else {
					return (
						<div key={index} className='message new'>
							<LetterIcon className="pull-left" color={msg.emitter.color} letter={msg.emitter.name[0]} />
							{ msg.body }
							<div className="left-timestamp"> {time(msg)} </div>
						</div>);
				}

			if (msg.emitter.id == emitterId && msg.state != "loading")
				return (
					<div key={index} className='message message-personal'> { msg.body } 
						<div className="right-timestamp">
							{time(msg)}
						</div>
					</div>)
		});

		const head = _.map(interlocutors, (interlocutor, index) => {
			return (
				<div key={index}>
					<LetterIcon className="pull-left" color={interlocutor.color} letter={interlocutor.name[0]} />
					<h1> { interlocutor.name } </h1>
				</div>)
		})
		return (
			<div className="chat">
			  <div className="chat-title">
			  	{ head }
			  </div>
			  <div className="messages" ref='messages'>
			    <div className="messages-content">
			    	{ typeof window == 'undefined' ? messageGroup : (
			    		<ScrollArea ref='scrollBar' style={{height: this.refs.messages ? this.refs.messages.offsetHeight : '100%'}}>
			    			{messageGroup}
			    		</ScrollArea> ) }
			    </div>
			  </div>
			  <form className="message-box" onSubmit={this.sendMessage}>
			    <textarea type="text" className="message-input" placeholder="Type message..." ref="chatTextArea" autoFocus value={msgBuffer} onChange={this.onMsgChange} onKeyDown={this.onMsgKeyDown} />
			    <button type="submit" className="message-submit">Send</button>
			  </form>
			</div>
		)
	}
}

export default Chat;