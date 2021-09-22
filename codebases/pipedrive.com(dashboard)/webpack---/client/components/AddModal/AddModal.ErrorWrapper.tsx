import { Snackbar } from '@pipedrive/convention-ui-react';
import TranslatorClient from '@pipedrive/translator-client';
import React from 'react';
import getLogger from 'utils/logger';
import { UserSelf } from 'Types/@pipedrive/webapp';
import { ModalType } from 'Types/types';

interface ErrorWrapperProps {
	translator: TranslatorClient;
	userSelf: UserSelf;
	modalType: ModalType;
}

interface ErrorWrapperState {
	error: boolean;
}

// Simple class that wraps AddModal to deal with error handling
// Unfortunately there is no react-hook alternative to componentDidCatch yet
export default class ErrorWrapper extends React.Component<ErrorWrapperProps, ErrorWrapperState> {
	public constructor(props: ErrorWrapperProps) {
		super(props);

		this.state = {
			error: false,
		};
	}

	public componentDidCatch(error: Error) {
		const { userSelf, modalType } = this.props;

		getLogger(userSelf, modalType).error(error.message, error);
		this.setState({ error: true });
	}

	public render() {
		if (this.state.error) {
			return (
				<Snackbar
					key={Math.random()}
					message={this.props.translator.gettext('An error has occurred. Please try again later.')}
				/>
			);
		}

		return this.props.children;
	}
}
