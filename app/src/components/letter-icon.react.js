import React, { Component } from 'react';

class LetterIcon extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span className={`letter-icon ${this.props.className}`} style={{backgroundColor: this.props.color}} >
				{this.props.letter}
			</span>);
	}
}

export default LetterIcon;