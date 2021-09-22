import React from 'react';
import Logger from '@pipedrive/logger-fe';

type ErrorBoundaryProps = {
	componentName: string;
};

/* eslint-disable @typescript-eslint/explicit-member-accessibility */
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
	componentDidCatch(error, errorInfo) {
		const logger = new Logger(this.props.componentName, 'error-boundary');

		logger.logError(error, errorInfo);
	}

	render() {
		return this.props.children;
	}
}
/* eslint-enable */

export default ErrorBoundary;
