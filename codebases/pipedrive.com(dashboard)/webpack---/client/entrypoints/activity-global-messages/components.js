import styled from 'styled-components';
import { Dialog as D, Text } from '@pipedrive/convention-ui-react';

export const Dialog = styled(D)`
	.cui4-dialog__wrap {
		width: 550px;
	}

	.cui4-dialog__actions {
		display: flex;
		width: 100%;
		justify-content: center;
	}
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	align-items: center;
`;

export const CloseButton = styled.div`
	position: absolute;
	width: 24px;
	height: 23.62px;
	background: #eeeeee;
	border-radius: 2px;
	cursor: pointer;

	top: 20px;
	right: 20px;

	.cui4-icon {
		&:hover {
			fill: #404346;
		}
	}
`;

export const Title = styled(Text)`
	font-weight: 600;
	font-size: 18px;
	line-height: 24px;
	color: #202225;
	margin-bottom: 8px;
`;

export const Subtitle = styled(Text)`
	text-align: center;
	color: #747678;
	font-size: 13px;
	line-height: 16px;
	margin-bottom: 16px;
`;

export const Explanation = styled(Text)`
	text-align: center;
	color: #404346;
	font-size: 15px;
	line-height: 20px;
`;
