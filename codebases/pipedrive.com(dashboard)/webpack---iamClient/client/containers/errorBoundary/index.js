import { Component } from 'react';
import PropTypes  from 'prop-types';
import logger from 'utils/logger';

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		logger.remote('error', error, info);
		this.setState({ hasError: true });
	}

	render() {
		if (this.state.hasError) {
			return null;
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
};
