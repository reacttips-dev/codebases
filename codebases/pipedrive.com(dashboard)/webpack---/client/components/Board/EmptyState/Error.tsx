import React, { useContext } from 'react';
import striptags from 'striptags';
import { NoDealsContainer, Middle, Title, Content } from './StyledComponents';
import { TranslatorContext } from '@pipedrive/react-utils';

const Error: React.FunctionComponent = (props) => {
	const { children } = props;
	const translate = useContext<any>(TranslatorContext);

	const intercomIsReady = () => {
		// @ts-ignore
		return !!window.Intercom;
	};

	const showIntercom = () => {
		// eslint-disable-next-line new-cap
		intercomIsReady() && window.Intercom('show');
	};

	const getContactSupportText = () => {
		const formatter = intercomIsReady()
			? [`<span>`, '</span>']
			: [`<a href='mailto:support@pipedrive.com'>`, '</a>'];
		const tag = intercomIsReady() ? ['span'] : ['a'];

		return striptags(
			translate.gettext(
				'Please try again. If the problem persists, %scontact our customer support%s.',
				formatter,
			),
			tag,
		);
	};

	return (
		<NoDealsContainer data-test="deals-loading-error">
			{children}
			<Middle>
				<Title>{translate.gettext('Something went wrong.')}</Title>
				<Content
					onClick={intercomIsReady() ? () => showIntercom() : null}
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: getContactSupportText(),
					}}
				/>
			</Middle>
		</NoDealsContainer>
	);
};

export default Error;
