import styled from 'styled-components';
import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';

export const InfoMessage = styled.div`
	height: auto;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	background-color: ${colors.blue8};
	border-bottom: 1px solid ${colors.black12};
`;

export const Text = styled.p`
	font-size: ${fonts.fontSizeM};
	margin-left: 16px;
`;
