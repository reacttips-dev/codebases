import React from 'react';
import { Button, Icon, Panel, Progressbar, Tooltip } from '@pipedrive/convention-ui-react';
import { fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import styled from 'styled-components';
import { useTranslator } from '@pipedrive/react-utils';

const Wrapper = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 8px 16px 0;
`;

const PanelTitle = styled.p`
	font-weight: ${fonts.fontWeightBold};
	font-size: ${fonts.fontSizeM};
	margin-bottom: 4px;
	position: relative;
`;

const PanelText = styled.p`
	font-size: ${fonts.fontSizeS};
	margin-bottom: 12px;
`;

const ClosingButton = styled(Button)`
	position: absolute;
	top: 0;
	right: 0;
`;

interface Props {
	heading: string;
	subHeading: string;
	percentage: number;
	onClose?: () => void;
}

export const ProgressPanel: React.FC<Props> = (props) => {
	const translator = useTranslator();
	const { heading, subHeading, percentage, onClose } = props;

	return (
		<Wrapper>
			<Panel color="blue">
				<PanelTitle>
					{heading}
					{onClose && (
						<Tooltip placement="left" content={translator.gettext('Hide panel')}>
							<ClosingButton color="ghost" size="s" onClick={onClose}>
								<Icon icon="cross" size="s" />
							</ClosingButton>
						</Tooltip>
					)}
				</PanelTitle>
				<PanelText>{subHeading}</PanelText>
				<Progressbar percent={percentage} color="green" size="s" />
			</Panel>
		</Wrapper>
	);
};
