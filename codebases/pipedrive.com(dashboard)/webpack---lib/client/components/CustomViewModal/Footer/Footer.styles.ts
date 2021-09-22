import styled from 'styled-components';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';

export const Footer = styled.div`
	padding: 6px 20px;
	height: auto;
	display: flex;
	justify-content: space-between;
	padding: 8px 20px;
	background-color: ${colors.black4};
	flex: 0 1 auto;
`;

export const Actions = styled.div`
	> :not(:first-child) {
		margin-left: 8px;
	}
`;
