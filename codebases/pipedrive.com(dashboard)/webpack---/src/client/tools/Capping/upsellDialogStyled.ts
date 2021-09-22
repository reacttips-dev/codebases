import { Button, Icon, Dialog } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';
import { fonts, colors } from '@pipedrive/convention-ui-css/dist/js/variables';

export const StyledDialog = styled(Dialog)`
	.cui4-dialog__wrap {
		width: 752px;
		padding: 0;
	}

	.cui4-dialog__content {
		margin: 0;
	}
`;

export const LoadingOrErrorDialog = styled(Dialog)`
	.cui4-dialog__wrap {
		width: 752px;
		height: 620px;
		padding: 0;
	}

	.cui4-dialog__content {
		.cui4-button {
			margin-left: auto;
		}

		margin: 0;
		display: flex;
		flex-direction: column;
	}
`;

export const CenteredContent = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 300px;
`;

export const CloseButton = styled(Button)`
	float: right;
	margin: 22px;
	width: 24px;
	height: 24px;
	min-width: 0px;
	padding: 0;
`;

export const CloseButtonIcon = styled(Icon)`
	padding: 0;
`;

export const Title = styled.h1`
	font: ${fonts.fontTitleXl};
	color: ${colors.black};
	margin: 80px 56px 0 56px;
	line-height: 24px;
	text-align: center;
`;

export const SubTitle = styled.h2`
	font: ${fonts.fontBody};
	color: ${colors.black64};
	margin: 8px 56px 24px 56px;
	line-height: 20px;
	text-align: center;
`;

export const BenefitsSection = styled.div`
	display: flex;
	margin: 0 56px 24px 56px;
	height: 120px;
`;

export const BenefitsImage = styled.img`
	width: 120px;
	border-radius: 4px;
`;

export const BenefitsAnimation = styled.div`
	width: 120px;
	border-radius: 4px;
`;

export const BenefitsDescription = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	margin-left: 24px;
	height: inherit;
	width: 488px;
`;

export const DescriptionTitle = styled.h3`
	font: ${fonts.fontTitleL};
	color: ${colors.black};
	margin-bottom: 4px;
`;

export const DescriptionList = styled.ul`
	list-style-type: disc;
	color: ${colors.black64};
	margin-left: 17px;
`;

export const DescriptionListItem = styled.li`
	font-size: ${fonts.fontSizeM};

	strong {
		font-weight: ${fonts.fontWeightBold};
	}
`;

export const ComparePlansLink = styled.a`
	color: ${colors.blue};
	cursor: pointer;
	text-decoration: none !important;
	margin: 0 0 0 56px;
	padding-right: 26px;
	position: relative;

	.cui4-icon {
		position: absolute;
		right: 0;
		top: 2px;
		fill: ${colors.blue};
		padding: 0;
	}
`;

export const UpgradeButtonContainer = styled.div`
	text-align: center;
	margin-top: 24px;

	button {
		height: 32px;
		padding: 6px 16px;
	}

	button:not(:first-child) {
		margin-left: 16px;
	}
`;

export const FooterText = styled(SubTitle)`
	font: ${fonts.fontBodyS};
	margin: 16px auto 32px auto;
	line-height: ${fonts.lineHeightS};
	max-width: 640px;
`;

export const StyledButton = styled(Button)`
	max-width: 316px !important;
`;
