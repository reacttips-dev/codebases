import React, { useRef } from 'react';
import useMenuCoachmark from '../../hooks/useMenuCoachmark';
import { MenuDivider } from './types';

import { Separator } from '@pipedrive/convention-ui-react';
import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import styled from 'styled-components';

import config from '../../config/styles';
import { stackOrder } from './stackOrder';

export const NavBar = styled.nav`
	background-color: ${colors.black88Opaque};
	width: ${config.navBarWidth}px;
	max-width: ${config.navBarWidth}px;
	user-select: none;
	z-index: ${stackOrder.navBar};
	display: flex;
	flex-direction: column;
`;

export const NavBarDividerComponent = styled.div`
	margin: 8px 12px;
	border: 1px solid ${colors.black64};
	border-radius: 1px;
`;

export const NavMenuDivider = styled(Separator)`
	padding: 8px 8px 0 24px;
`;

export const NavMenuTitle = styled.div`
	font: ${fonts.fontTitleM};
	color: ${colors.black64};
	text-transform: uppercase;
	padding: 8px 24px 8px 24px;
	margin-top: 14px;

	&:first-child {
		margin-top: 6px;
	}
`;

export const NavBarDivider = ({ item }: { item?: MenuDivider }) => {
	const element = useRef();

	useMenuCoachmark(item, element, {
		appearance: {
			placement: 'right',
			zIndex: {
				min: 100,
			},
			align: {
				points: ['cl', 'cr'],
				offset: [24, 0],
			},
		},
	});

	return <NavBarDividerComponent ref={element} />;
};

export * from './NavBarMoreMenuItem';
export * from './NavBarLink';
