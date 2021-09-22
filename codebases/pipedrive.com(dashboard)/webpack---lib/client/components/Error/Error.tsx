import React from 'react';
import styled from 'styled-components';
import { Button, Spacing, Text } from '@pipedrive/convention-ui-react';
import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import { useTranslator } from '@pipedrive/react-utils';

export const ErrorWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	background-color: ${colors.white};
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const Headings = styled(Text)<{ readonly $smaller?: boolean }>`
	text-align: center;

	& > h1 {
		margin-bottom: 8px;
	}

	& > h2 {
		font-size: ${(props) => (props.$smaller ? '15px' : '18px')};
		margin-bottom: ${(props) => (props.$smaller ? '16px' : '24px')};
		color: ${colors.black64Opaque};

		& > a {
			color: ${colors.blue};
			cursor: pointer;
			font-weight: ${fonts.fontWeightNormal};
		}
	}
`;

const RetryButton = styled(Button)<{
	readonly $smaller?: boolean;
}>`
	min-width: ${(props) => (props.$smaller ? '67px' : '100px')};
`;

type Props = {
	readonly iconComponent: React.ReactNode;
	readonly title: React.ReactNode;
	readonly subtitle: React.ReactNode;
	readonly smaller?: boolean;
	readonly onReload?: () => void;
};

export const Error: React.FC<Props> = (props) => {
	const translator = useTranslator();

	const handleOnReload = () => {
		props.onReload ? props.onReload() : window.location.reload();
	};

	return (
		<ErrorWrapper>
			<Spacing bottom="xl">{props.iconComponent}</Spacing>
			<Headings $smaller={props.smaller}>
				<h1 data-testid="ErrorHeading">{props.title}</h1>
				<h2>{props.subtitle}</h2>
				<RetryButton $smaller={props.smaller} onClick={handleOnReload}>
					{translator.gettext('Retry')}
				</RetryButton>
			</Headings>
		</ErrorWrapper>
	);
};
