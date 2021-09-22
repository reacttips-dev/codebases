import { Icon, Button, Progressbar, Popover, Text } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';
import { fonts, colors } from '@pipedrive/convention-ui-css/dist/js/variables.js';

export const StyledPopover = styled(Popover)`
	.cui4-popover__inner {
		min-width: 336px !important;
		min-height: 188px;
		max-width: 480px !important;
		background: ${colors.white};
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.24), 0px 8px 10px 1px rgba(0, 0, 0, 0.05),
			0px 3px 14px 2px rgba(0, 0, 0, 0.06), 0px 5px 5px -3px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		text-align: left !important;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;

export const CenteredContent = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;

	.cui4-button {
		margin-top: 16px;
	}
`;

export const Title = styled.h1`
	font: ${fonts.fontTitleM};
	color: ${colors.black};
	line-height: ${fonts.lineHeightL};
	text-align: left;
	font-weight: ${fonts.fontWeightBold};
`;

export const ReportsUsedContainer = styled.div`
	display: flex;
	margin: 12px 0 8px 0;
	line-height: ${fonts.lineHeightS};
	justify-content: space-between;
`;

export const SubTitle = styled(Text)`
	font: ${fonts.fontBody};
	font-size: ${fonts.fontSizeS};
`;

export const PercentageRead = styled(Text)`
	font: ${fonts.fontBody};
	color: ${colors.black64};
	font-size: ${fonts.fontSizeS};
`;

export const StyledProgressbar = styled(Progressbar)`
	max-width: 480px;
`;

export const SubText = styled(Text)`
	font: ${fonts.fontBody};
	font-size: ${fonts.fontSizeS};
	color: ${colors.black64};
	margin: 8px 0 11px 0;
	white-space: normal;
	max-width: 336px !important;
`;

export const UpgradeButtonContainer = styled.div`
	display: inline-flex;

	button:not(:first-child) {
		margin-left: 8px !important;
	}
`;

export const UpgradeButtonIcon = styled(Icon)`
	height: 16px;
	width: 16px;
	fill: ${colors.white};
	padding-left: 4px;
`;

export const RedirectIcon = styled(Icon)`
	margin-left: 4px;
`;

export const InfoIcon = styled(Icon)`
	fill: ${colors.black64} !important;

	&:hover {
		fill: ${colors.purple} !important;
	}
`;

export const ActiveInfoIcon = styled(Icon)`
	fill: ${colors.purple} !important;
`;

export const InfoButton = styled(Button)`
	border-radius: 50%;

	&:hover {
		background: transparent !important;
	}
`;

export const LearnMore = styled.a`
	color: ${colors['$color-blue-hex']};
	display: inline-flex;
	margin-left: 16px;
	font-size: ${fonts.fontSizeS};
	line-height: ${fonts.lineHeightS};
`;

export const StyledLink = styled.a`
	display: inline-flex;
	align-items: center;
	font-size: ${fonts.fontSizeS};
	font-weight: ${fonts.fontWeightBold};
	line-height: ${fonts.lineHeightL};
	color: ${colors['$color-blue-hex']};
	margin-left: 16px;
`;

export const PrimaryButton = styled(Button)`
	max-width: 320px !important;
`;

export const SecondaryButton = styled(Button)`
	max-width: 120px !important;
`;
