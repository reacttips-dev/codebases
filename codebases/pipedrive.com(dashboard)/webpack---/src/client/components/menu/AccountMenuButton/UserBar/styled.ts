import styled from 'styled-components';

import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';
import { Avatar as CUIAvatar } from '@pipedrive/convention-ui-react';

import { HeaderItem } from '../../../Header/styled';

export const Wrapper = styled(HeaderItem).attrs({
	lastItem: true,
})<{ hasMultipleCompanies: boolean }>`
	box-sizing: border-box;

	display: flex;

	max-width: 200px;
	margin-left: 6px;

	padding: 4px;
	padding-right: ${(props) => props.hasMultipleCompanies && 0};

	@media (min-width: 1280px) {
		max-width: 240px;
	}
`;

export const Avatar = styled(CUIAvatar)`
	cursor: pointer;
`;

export const UserInfo = styled.div`
	padding-right: 12px;
	margin-left: 8px;

	overflow: hidden;
`;

export const TruncatedText = styled.p`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	text-align: left;
`;

export const Name = styled(TruncatedText)`
	font: ${fonts['$font-button-s']};
`;

export const Company = styled(TruncatedText)`
	font: ${fonts['$font-body-s']};
`;
