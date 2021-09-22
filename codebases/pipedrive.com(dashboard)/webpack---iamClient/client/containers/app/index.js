import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import ErrorBoundary from 'containers/errorBoundary';

export default class App extends Component {
	render() {
		return (
			<ErrorBoundary>
				<Provider store={this.props.store}>
					<div className={`cui4-text`}>
						{this.props.children}
					</div>
				</Provider>
			</ErrorBoundary>
		);
	}
}

App.propTypes = {
	children: PropTypes.node.isRequired,
	store: PropTypes.object.isRequired,
};
