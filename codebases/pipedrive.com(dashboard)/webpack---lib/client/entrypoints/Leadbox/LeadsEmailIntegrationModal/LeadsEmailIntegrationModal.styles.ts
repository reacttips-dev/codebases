import styled from 'styled-components';
import { Dialog, Text } from '@pipedrive/convention-ui-react';
import { fonts } from '@pipedrive/convention-ui-css/dist/js/variables';

export const DialogCUI = styled(Dialog)`
	> div.cui4-dialog__wrap {
		width: 735px;
		padding: 64px 78px 32px 78px;

		.cui4-dialog__title {
			font-size: ${fonts.fontSizeXl};
			font-weight: ${fonts.fontWeightNormal};
			margin: 0 0 32px;
			text-align: center;
			line-height: ${fonts.lineHeightXl};
		}

		.cui4-dialog__actions {
			justify-content: center;
		}

		.cui4-dialog__content {
			margin: 0;
		}
	}
`;

export const ContentWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const Item = styled.div`
	display: flex;
	flex-direction: column;
`;

export const Description = styled(Text)`
	text-align: center;
	width: 160px;
	font-size: ${fonts.fontSizeM};
	font-weight: ${fonts.fontWeightBold};
	margin: 16px 0 58px 0;
	line-height: 1.5;
`;

export const ButtonsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const Link = styled.a`
	margin-top: 12px;
`;
