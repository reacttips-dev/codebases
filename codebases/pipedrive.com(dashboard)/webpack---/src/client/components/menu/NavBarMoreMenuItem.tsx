import React from 'react';
import styled from 'styled-components';
import { Icon } from '@pipedrive/convention-ui-react';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import { useTranslator } from '@pipedrive/react-utils';
import classNames from 'classnames';

import useToolsContext from '../../hooks/useToolsContext';
import useMenuCoachmark from '../../hooks/useMenuCoachmark';
import useHotkeys from '../../hooks/useHotkeys';
import { stackOrder } from './stackOrder';
import NavTooltip from './NavTooltip';
import { MenuLink } from './types';
import { TooltipContentWithKeyboardShortcut } from '../KeyboardShortcut';
import { NavBarItem } from './NavBarItem';

const black16 = '$color-black-hex-shade-16';

const NavItem = styled(NavBarItem)<{ isVisible: boolean }>`
	background-color: ${(props) => (props.isVisible ? colors['$color-white-hex'] : 'inherit')};
	cursor: pointer;
	z-index: ${stackOrder.navBarMoreMenuItem};

	&:hover {
		background-color: ${(props) => (props.isVisible ? colors['$color-white-hex'] : colors[black16])};

		.cui4-icon,
		.cui4-icon:active:first-child {
			fill: ${(props) => (props.isVisible ? colors[black16] : colors['$color-white-hex'])};
		}
	}
`;

const keyboardShortcut = '9';

interface Props {
	children?: React.ReactNode;
	item: MenuLink;
	isActive?: boolean;
	isVisible?: boolean;
	onClick?(item: MenuLink, ev: React.SyntheticEvent | KeyboardEvent): void;
}

function NavBarMoreMenuItemForwardRef({ item, isVisible, isActive, onClick, children }: Props, ref) {
	const translator = useTranslator();
	const { metrics } = useToolsContext();

	const { coachmark, visible: coachmarkVisible } = useMenuCoachmark(item, ref, {
		appearance: {
			placement: 'right',
			zIndex: {
				min: 100,
			},
			align: {
				points: ['cl', 'cr'],
				offset: [12, 0],
			},
		},
	});

	function handleClick(ev: React.SyntheticEvent | KeyboardEvent) {
		!isVisible && metrics?.trackUsage(null, 'navigation_more_menu', 'opened');

		coachmarkVisible && coachmark?.close();

		onClick && onClick(item, ev);
	}

	useHotkeys(keyboardShortcut, handleClick);

	function getIconColor() {
		if (isVisible) {
			return 'black-88';
		} else if (isActive) {
			return 'white';
		}

		return 'black-16';
	}

	return (
		<>
			<NavTooltip
				content={
					<TooltipContentWithKeyboardShortcut keyboardShortcut={keyboardShortcut}>
						{item.title}
					</TooltipContentWithKeyboardShortcut>
				}
			>
				<NavItem
					className={classNames({ active: isActive && !isVisible })}
					isVisible={isVisible}
					onClick={handleClick}
					ref={ref}
					data-test="navbar-item-more-menu"
					aria-label={translator.gettext('More menu items')}
					href="#"
				>
					<Icon icon={item.icon} color={getIconColor()} />
				</NavItem>
			</NavTooltip>
			{children}
		</>
	);
}

export const NavBarMoreMenuItem = React.forwardRef(NavBarMoreMenuItemForwardRef);
