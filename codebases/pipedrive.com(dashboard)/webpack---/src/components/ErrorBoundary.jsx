import React from 'react';
import PropTypes from 'prop-types';

import logger from 'utils/logger';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error) {
		logger.remote('error', 'Error while rendering search-fe', {
			error_message: error.message,
			stack: error.stack,
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				<div id="froot-global-search">
					<input type="text" disabled placeholder="Oops! Something went wrong." />
				</div>
			);
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
