import React, { Component } from 'react';

class submitableTextInput extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.state = {value: null, isValid: false, errors: []};
	}

	onChange(e) {
		const { checkOnChange } = this.props;
		const { value } = e.target;
		const isValid = !checkOnChange || checkOnChange(value);
		this.setState({value, isValid});
	}

	onSubmit(e) {
		const { isValid, value } = this.state;
		if (isValid) {
			this.props.onSubmit(value);
		} else {
			// if errorsMatch ... set errors to print ...
		}
		e.preventDefault();
	}
}