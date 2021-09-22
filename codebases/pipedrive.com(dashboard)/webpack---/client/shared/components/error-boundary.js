import { Component } from 'react';
import PropTypes from 'prop-types';
import Logger from '@pipedrive/logger-fe';

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);

		this.logger = new Logger('email-components', props.componentName);
	}

	componentDidCatch(error, info) {
		this.logger.remote('error', error.message, {
			caughtErrorStack: error.stack,
			componentStack: info.componentStack,
			path: window.location.pathname
		});
	}

	render() {
		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node,
	componentName: PropTypes.string.isRequired
};
