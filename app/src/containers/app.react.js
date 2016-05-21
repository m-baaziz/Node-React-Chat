import React, {Component} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class App extends Component {

	constructor(props, context) {
		super(props);
		this.socket = undefined;
		this.renderChildren = this.renderChildren.bind(this);
	}

	static fetchData({ store, query }) {}

	renderChildren() {
		if (typeof io != "undefined") {
			this.socket = io();
			return _.map(_.compact(_.flatten([this.props.children])), (child, key) => {
				const newProps = Object.assign({}, child.props, {socket: this.socket});
				return Object.assign({}, child, {key, props: newProps});
			});
		}
	}

	render() {
		return (
			<div className="container-fluid">
				{this.renderChildren()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(App);
	