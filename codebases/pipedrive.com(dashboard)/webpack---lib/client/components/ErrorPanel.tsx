import React, { useState } from 'react';
import { Panel, Icon, Button } from '@pipedrive/convention-ui-react';
import { fonts, colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { useTranslator } from '@pipedrive/react-utils';
import styled from 'styled-components';

const Wrapper = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 8px 16px 0;
	.cui4-panel {
		margin-bottom: 0;
	}
`;

const Title = styled.p`
	font-weight: ${fonts.fontWeightBold};
	font-size: ${fonts.fontSizeM};
	margin-bottom: 4px;
`;
const Text = styled.p`
	font-size: ${fonts.fontSizeS};
`;

export const ErrorLink = styled.span`
	a {
		color: ${colors.blue};
		cursor: pointer;
	}
`;

export const Container = styled.div`
	display: flex;
	padding-right: 12px;
	position: relative;
`;

export const TextContent = styled.div`
	margin-left: 16px;
`;

export const CrossContainer = styled(Button)`
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
`;

interface Props {
	messageTitle: string;
	dismissHandler: () => void;
}

export const ErrorPanel: React.FC<Props> = ({ messageTitle, dismissHandler }) => {
	const t = useTranslator();
	const [isVisible, setIsVisible] = useState(true);

	const openIntercom = (e: React.MouseEvent) => {
		e.preventDefault();

		const intercom = window.Intercom;
		intercom('show');
	};

	const dismissError = () => {
		setIsVisible(false);
		dismissHandler();
	};

	if (!isVisible) {
		return null;
	}

	return (
		<Wrapper>
			<Panel color="red">
				<Container>
					<Icon icon="warning" size="s" color="red" />
					<TextContent>
						<Title>{messageTitle}</Title>
						<Text>
							{t.gettext('Please try again. If the problem persists, ')}
							<ErrorLink>
								<a onClick={openIntercom} href="#">
									{t.gettext('contact our customer support.')}
								</a>
							</ErrorLink>
						</Text>
					</TextContent>
					<CrossContainer onClick={dismissError} color="ghost">
						<Icon icon="cross" size="s" color="black-64"></Icon>
					</CrossContainer>
				</Container>
			</Panel>
		</Wrapper>
	);
};
