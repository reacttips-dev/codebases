import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import striptags from 'striptags';
import SVG from 'react-inlinesvg';
import getTranslator from '@pipedrive/translator-client/fe';
import { Button } from '@pipedrive/convention-ui-react';
import { fonts, colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import errorIcon from './error.svg';

const Wrapper = styled.div<{ position: string; marginBottom: string }>`
	position: ${(props) => props.position};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	width: 100%;
	height: 100%;
	line-height: 24px;
	margin-bottom: ${(props) => props.marginBottom};
`;

const StyledSVG = styled(SVG)`
	height: 160px;
	width: 240px;
`;

const Title = styled.h2`
	font: ${fonts.fontTitleXl};
	margin-top: 24px;
`;

const Content = styled.div`
	font: ${fonts.fontBodyL};
	color: ${colors.black64};
	margin-top: 8px;

	.link {
		color: ${colors.blue};
		text-decoration: none;
		cursor: pointer;

		:hover {
			text-decoration: underline;
		}
	}
`;

const StyledButton = styled(Button)`
	margin-top: 24px;
`;

export default async function (componentLoader) {
	const user = await componentLoader.load('webapp:user');
	const translator = await getTranslator('froot', user.getLanguage());

	const ErrorPage = (props) => {
		let content;

		const type = props?.type || 'error';
		const variation = props?.variation || 'normal';
		const position = variation === 'normal' ? 'absolute' : 'relative';
		const marginBottom = variation === 'normal' ? '0' : '30px';

		switch (type) {
			case 'error':
				{
					const onContentClick = () => (window.Intercom ? window.Intercom('show') : null);
					const onButtonClick = () => window.location.reload(true);
					const getContactSupportText = () => {
						const formatter = window.Intercom
							? ['<span class="link">', '</span>']
							: ['<a href="mailto:support@pipedrive.com" class="link">', '</a>'];
						const tag = window.Intercom ? ['span'] : ['a'];

						return striptags(
							translator.gettext(
								'Please try again. If this keeps happening, %sreach out to support%s.',
								formatter,
							),
							tag,
						);
					};

					content = (
						<>
							<StyledSVG src={errorIcon} />
							<Title>{translator.gettext('Something went wrong')}</Title>
							<Content
								onClick={onContentClick}
								dangerouslySetInnerHTML={{ __html: getContactSupportText() }}
							/>
							<StyledButton onClick={onButtonClick}>{translator.gettext('Retry')}</StyledButton>
						</>
					);
				}
				break;
			case 'forbidden':
				content = (
					<>
						<StyledSVG src={errorIcon} />
						<Title>{translator.gettext('Forbidden')}</Title>
						<Content>{translator.gettext('You are not allowed to see this page')}</Content>
					</>
				);
				break;
			case 'notFound':
				content = (
					<>
						<StyledSVG src={errorIcon} />
						<Title>{translator.gettext('Not Found')}</Title>
						<Content>{translator.gettext('The url you are trying to access does not exist')}</Content>
					</>
				);
				break;
		}

		return (
			<Wrapper marginBottom={marginBottom} position={position} data-test="error-page">
				{content}
			</Wrapper>
		);
	};

	ErrorPage.propTypes = {
		type: PropTypes.oneOf(['error', 'forbidden', 'notFound']),
		variation: PropTypes.oneOf(['normal', 'contained']),
	};

	ErrorPage.defaultProps = {
		type: 'error',
	};

	return ErrorPage;
}
