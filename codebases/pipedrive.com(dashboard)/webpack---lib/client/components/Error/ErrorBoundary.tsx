import React from 'react';
import { InternetConnectionError } from 'Components/Error/InternetConnectionError';
import Logger from '@pipedrive/logger-fe';
import { NetworkError } from '@pipedrive/relay';
import { logError } from 'Utils/logger/logError';

type Props = {
	readonly logger: Logger;
	readonly facility: string;
	readonly ErrorPage: React.ReactNode;
};

type State = {
	readonly hasError: boolean;
	readonly isNetworkError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			isNetworkError: false,
		};
	}

	public static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			isNetworkError: error instanceof NetworkError,
		};
	}

	public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		if (!this.state.isNetworkError) {
			logError({
				logger: this.props.logger,
				error,
				facility: this.props.facility,
				additionalData: {
					component_stack: errorInfo.componentStack,
				},
			});
		}
	}

	public render() {
		if (this.state.hasError) {
			if (this.state.isNetworkError) {
				// This should be eventually moved back to the Query Renderer error handling.
				return <InternetConnectionError />;
			}

			return <>{this.props.ErrorPage}</>;
		}

		return this.props.children;
	}
}
