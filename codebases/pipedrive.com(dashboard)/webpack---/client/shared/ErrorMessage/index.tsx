import React from 'react';
import striptags from 'striptags';
import { Message, Title, Content } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';

export type ErrorMessageProps = {
	hasFixedWidth?: boolean;
};

const ErrorMessage: React.FunctionComponent<ErrorMessageProps> = (props) => {
	const { hasFixedWidth } = props;
	const translator = useTranslator();

	return (
		<Message hasFixedWidth={hasFixedWidth} data-test="error-message">
			<Title>{translator.gettext('Something went wrong.')}</Title>
			<Content
				dangerouslySetInnerHTML={{
					__html: striptags(
						translator.gettext(
							'Please try again. If the problem persists, %scontact our customer support.%s',
							['<a href="https://support.pipedrive.com/hc/requests/new" target="_blank">', '</a>'],
						),
						['a'],
					),
				}}
			/>
		</Message>
	);
};

export default ErrorMessage;
