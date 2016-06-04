import React, { Component } from 'react';
import _ from 'lodash';

class TextInput extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.state = {value: null, isValid: false, errors: []};
	}

	onChange(e) {
		const { check, onErrorOnChange } = this.props;
		const { value } = e.target;
		const errors = check ? check(value) : [];
		const isValid = _.isEmpty(errors);
		this.setState({value, isValid, errors});
		if (onErrorOnChange) onErrorOnChange(errors);
	}

	onSubmit(e) {
		e.preventDefault();
		const { isValid, value, errors } = this.state;
		const { onErrorOnSubmit } = this.props;
		if (isValid) {
			this.props.onSubmit(value);
		} else {
			if (onErrorOnSubmit) onErrorOnSubmit(errors);
		}
	}

	render() {
		const { value, isValid } = this.state;
		const { className, onSubmit, placeholder, ref, autoFocus } = this.props;
		const getFeedbackClass = () => {
			if (_.isEmpty(value)) return "glyphicon glyphicon-pencil form-control-feedback";
			return isValid ? "glyphicon glyphicon-ok form-control-feedback" : "glyphicon glyphicon-warning-sign form-control-feedback";
		}

		return (
			<form className="form-group has-feedback" onSubmit={onSubmit ? this.onSubmit : null}>
				<input className={className ? className : null} ref={ref} autoFocus={autoFocus} type='text' placeholder={placeholder} value={value} onChange={this.onChange} />
				<span className={getFeedbackClass()} ariaHidden="true"></span>
			</form>)
	}
}

export default TextInput;