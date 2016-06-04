import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { createConversation, updateConversation } from '../actions/conversations-actions';

import { MOMENT_SERIALIZATION } from '../constants/constants';

import Chat from '../components/chat.react';
import UsersList from '../components/users-list.react';

class Home extends Component {
	constructor(props) {
		super(props);
		this.receiveMessage = this.receiveMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.onUserClick = this.onUserClick.bind(this);
		this.state = { currentInterlocutors: [] };
	}

	componentDidMount() {
		this.props.socket.on('message', (msg) => {
			this.receiveMessage(msg);
		});
	}

	receiveMessage(msg) {
		const { emitter, receiver, content } = msg;
		this.props.dispatch(updateConversation(emitter, receiver, content))
	}

	sendMessage(content) {
		const { currentUser, socket, dispatch } = this.props;
		content['moment'] = moment().format(MOMENT_SERIALIZATION);
		_.forEach(this.state.currentInterlocutors, interlocutor => {
			const msg = { emitter: currentUser, receiver: interlocutor, content };
			socket.emit('message', msg);
			dispatch(updateConversation(currentUser, interlocutor, content))
		});
	}

	onUserClick(user) {
		const interlocutors = [user];
		this.setState({ currentInterlocutors: interlocutors });
	}

	render() {
		const { currentInterlocutors } = this.state;
		const { conversations, currentUser } = this.props;
		const matchingConversations = _.filter(conversations, conversation => {
			const receiverInInterlocutors = _.find(currentInterlocutors, interlocutor => {return interlocutor.id == conversation.receiver.id});
			const emitterInInterlocutors = _.find(currentInterlocutors, interlocutor => {return interlocutor.id == conversation.emitter.id});
			return (conversation.emitter.id == currentUser.id && receiverInInterlocutors) ||
				(conversation.receiver.id == currentUser.id && emitterInInterlocutors);
		});

		let messages = _.reduce(matchingConversations, (current, conversation) => {
			const tmpMessages = _.map(conversation.messages, msg => {
				msg['emitter'] = conversation.emitter;
				msg['receiver'] = conversation.receiver;
				msg['year'] = parseInt(msg.moment.format('YYYY'));
				msg['month'] = parseInt(msg.moment.format('MM'));
				msg['day'] = parseInt(msg.moment.format('DD'));
				msg['hour'] = parseInt(msg.moment.format('hh'));
				msg['minute'] = parseInt(msg.moment.format('mm'));
				msg['second'] = parseInt(msg.moment.format('ss'));
				return msg;
			});
			current = _.concat(current, tmpMessages);
			return current;
		}, []);
		messages = _.orderBy(messages, ['year', 'month', 'day', 'hour', 'minute', 'second'], ['asc', 'asc', 'asc', 'asc', 'asc', 'asc']);

		const usersIdSendingMessage = _.map(_.filter(conversations, conver => {
			return conver.receiver.id == currentUser.id && _.last(conver.messages).state == 'loading';
		}), conversation => {return conversation.emitter.id});

		return (
			<div>
				<UsersList users={this.props.users} usersIdSendingMessage={usersIdSendingMessage} onClick={this.onUserClick} />
				{!_.isEmpty(currentInterlocutors) ? <Chat sendMessage={this.sendMessage} messages={messages} emitterId={currentUser.id} interlocutors={currentInterlocutors} /> : null}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
  	currentUser: state.currentUser,
  	users: state.users,
  	conversations: state.conversations,
  }
}

export default connect(mapStateToProps)(Home);