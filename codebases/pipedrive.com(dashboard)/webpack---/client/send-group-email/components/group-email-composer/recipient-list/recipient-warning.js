import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';
import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';

const Text = styled.div`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`;
const WarningText = styled(Text)`
	display: flex;
	font: ${fonts['$font-caption-s']};
	color: ${({ color }) => `${colors[`$color-${color}-hex`]}`};
	align-items: center;
`;
const InfoIcon = styled(Icon).attrs(() => ({
	size: 's',
	icon: 'info-outline'
}))`
	width: 12px;
	height: 12px;
	margin-left: 4px;
`;
const TooltipContent = styled.div`
	width: 224px;
`;

const RecipientWarning = ({ tooltipText, color, warningText, uiTestId }) => (
	<Tooltip
		placement="bottom-start"
		innerRefProp={'ref'}
		content={<TooltipContent>{tooltipText}</TooltipContent>}
	>
		<WarningText data-ui-test-id={uiTestId} color={color}>
			{warningText}
			<InfoIcon color={color} />
		</WarningText>
	</Tooltip>
);

RecipientWarning.propTypes = {
	tooltipText: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	warningText: PropTypes.string.isRequired,
	uiTestId: PropTypes.string
};

export default RecipientWarning;
