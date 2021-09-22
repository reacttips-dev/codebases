import React from 'react';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import elevations from '@pipedrive/convention-ui-css/dist/amd/elevations.js';
import styled from 'styled-components';

import config from '../../config/styles';

import { stackOrder } from './stackOrder';
import classNames from 'classnames';

const MoreMenuContent = styled.div`
	--transition-duration-out: 0.2s;

	width: ${config.subNavigationWidth}px;
	visibility: hidden;
	transition: visibility ease-in-out var(--transition-duration-out);

	&.visible {
		visibility: visible;
	}
`;

const MoreMenu = styled.div`
	--transition-duration-in: 0.25s;
	--transition-duration-out: 0.2s;

	position: absolute;
	top: 0;
	bottom: 0;
	left: ${config.navBarWidth - config.subNavigationWidth}px;
	background-color: ${colors['$color-white-hex']};
	display: flex;
	flex-direction: column;
	padding-top: 8px;
	user-select: text;
	z-index: ${stackOrder.navMoreMenu};
	width: ${config.subNavigationWidth}px;
	overflow-y: auto;

	transition: left ease-in-out var(--transition-duration-out);

	&.visible {
		transition-duration: var(--transition-duration-in);
		left: ${config.navBarWidth}px;
		box-shadow: ${elevations['$elevation-08']};
	}
`;

interface Props {
	children?: React.ReactNode;
	isVisible?: boolean;
}

function NavMoreMenuForwardRef({ isVisible, children }: Props, ref) {
	return (
		<MoreMenu className={classNames({ visible: isVisible })} ref={ref} data-test="more-menu">
			<MoreMenuContent className={classNames({ visible: isVisible })}>{children}</MoreMenuContent>
		</MoreMenu>
	);
}

export const NavMoreMenu = React.forwardRef(NavMoreMenuForwardRef);
