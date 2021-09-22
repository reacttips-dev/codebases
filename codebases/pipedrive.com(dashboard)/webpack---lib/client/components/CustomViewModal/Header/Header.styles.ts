import { fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
	height: auto;
	padding: 20px 16px 16px 16px;
	flex: 0 1 auto;
`;

export const Heading = styled.h3`
	font-size: ${fonts.fontSizeL};
	font-weight: 600;
	margin-bottom: 16px;
`;
