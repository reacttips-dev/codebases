import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import styled from 'styled-components';

export const SubMenu = styled.div`
	max-width: 360px;
	padding-top: 8px;
	padding-bottom: 8px;
	user-select: text;
`;

export const SubMenuTitle = styled.div`
	padding: 12px 24px 8px;
	font: ${fonts.fontTitleM};
	color: ${colors.black64};
	text-transform: uppercase;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

export const SubMenuFooter = styled.div`
	padding-top: 8px;
`;

export const SubMenuMainContent = styled.div`
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
	padding: 8px 0;
`;
