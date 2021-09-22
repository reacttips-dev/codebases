import Logger from '@pipedrive/logger-fe';
import React from 'react';

import ErrorMessage from '../../molecules/ErrorMessage';
import { LOGGER_FACILITY } from '../../utils/constants';

export interface ErrorBoundaryProps {
	errorData?: Object;
}

export interface ErrorBoundaryState {
	error: Error;
}

export default class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = {
			error: null,
		};

		this.getChildProps = this.getChildProps.bind(this);
	}

	getChildProps() {
		const childrenProps = React.Children.map(
			this.props.children,
			(child: React.ReactElement<any, any>) => {
				const { children, ...restChildProps } = child.props;

				return JSON.stringify({
					[child.type.name]: restChildProps,
				});
			},
		);

		if (childrenProps && childrenProps.length > 0) {
			return childrenProps.join('\n');
		}

		return null;
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		const { errorData = {} } = this.props;
		const logger = new Logger(LOGGER_FACILITY);

		this.setState({
			error,
		});

		if (!logger) {
			return null;
		}

		const { message, stack } = error;

		return logger.remote(
			'error',
			message,
			{
				...info,
				...error,
				...errorData,
				stack,
				childProps: this.getChildProps(),
			},
			LOGGER_FACILITY,
		);
	}

	render() {
		const { children } = this.props;
		const { error } = this.state;

		if (error) {
			return <ErrorMessage allowed />;
		}

		return children;
	}
}
