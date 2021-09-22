import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import styled from 'styled-components';

export const NoResultsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 105px;
`;

export const NoResultsHeading = styled.p`
	font-size: ${fonts.fontSizeM};
	margin-bottom: 5px;
`;

export const NoResultsBody = styled.p`
	font-size: ${fonts.fontSizeS};
	color: ${colors.black64};
`;
